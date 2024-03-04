import React, {JSX} from 'react';
import {View, TextInput, Alert, Keyboard} from 'react-native';
import {ProductsService} from '../services/products.service';
import {articleStyles} from '../styles/products.stylesheet';
import {parseResponseMessages} from '../../../shared/services/zod-dto.service';
import {ZArticleDTOOutput2} from '../../../shared/dto/article.dto';

import CardComponentNotFound from '../components/card-component-not-found';
import ButtonComponent from '../components/button-component';
import DataTable from '../components//data-table';

const Product = (): JSX.Element => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchQueryState, setSearchQueryState] = React.useState(0);
  const [_value, setValue] = React.useState(0);
  const timeout = React.useRef(0);
  const [result, setResult] = React.useState<
    ZArticleDTOOutput2 | false | Response
  >();

  const onChangeHandler = (value: number) => {
    clearTimeout(timeout.current);
    setValue(value);
    timeout.current = setTimeout(async () => {
      const eanNumber = Number(value);

      if (isNaN(eanNumber)) {
        Alert.alert('Hiba', 'Kérjük, adjon meg egy érvényes számot.');
      } else {
        try {
          const response = await ProductsService.getArticlesByEAN({
            eankod: eanNumber,
          });
          setResult(response);
          setSearchQueryState(value);

          if (response && 'status' in response) {
            const msg = await parseResponseMessages(response);
            Alert.alert('Hiba!', msg);
          }

          Keyboard.dismiss();
        } catch (error: any) {
          console.log('Hiba történt', error);
        }
      }
    }, 100);
  };

  return (
    <View style={articleStyles.container}>
      <TextInput
        style={articleStyles.input}
        onChangeText={(value: any) => {
          onChangeHandler(value);
          setSearchQuery(searchQuery);
        }}
        value={searchQuery}
        placeholder="Keresés..."
        keyboardType="numeric"
        autoFocus
        onFocus={() => Keyboard.dismiss()}
      />
      <ButtonComponent
        label={'Keresés'}
        enabled={true}
        onClick={() => onChangeHandler}
      />
      {result && 'cikkszam' in result && (
        <View>
          {/*<CardComponentSuccess title={"Találat"} content={result}/>*/}
          <DataTable data={result} />
        </View>
      )}
      {result === false && (
        <View>
          <CardComponentNotFound title={'Not Found'} ean={searchQueryState} />
        </View>
      )}
    </View>
  );
};

export default Product;
