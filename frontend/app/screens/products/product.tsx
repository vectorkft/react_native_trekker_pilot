import React, {JSX} from "react";
import {View, TextInput, Alert, Keyboard} from "react-native";
import {ProductsService} from '../../services/products.service';
import {articleStyles} from "../../styles/products.stylesheet";
import {parseResponseMessages} from "../../../../shared/services/zod-dto.service";
import {ZArticleDTOOutput2} from "../../../../shared/dto/article.dto";
import CardComponentSuccess from "../../components/card/card-component";
import CardComponentNotFound from "../../components/card/card-component-not-found";
import ButtonComponent from "../../components/button/button-component";
import DataTable from "../../components/table/data-table";
// import Sound from 'react-native-sound';

const Product = (): JSX.Element => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchQueryState, setSearchQueryState] = React.useState(0);
    const [value, setValue] = React.useState(0);
    const timeout = React.useRef(null);
    const [result, setResult] = React.useState<ZArticleDTOOutput2|false|Response>();

    // const sound = new Sound('frontend/app/assets/beep-07a.mp3', Sound.MAIN_BUNDLE, (error) => {
    //     if (error) {
    //         console.log('Failed to load the sound', error);
    //         return;
    //     }
    // });
    // async function handleFormSubmit() {
    //     const eanNumber = Number(searchQuery);
    //
    //     if (isNaN(eanNumber)) {
    //         Alert.alert('Hiba', 'Kérjük, adjon meg egy érvényes számot.');
    //     } else {
    //         try {
    //             const response = await ProductsService.getArticlesByEAN({ eankod: eanNumber });
    //             setResult(response);
    //             setSearchQueryState(searchQuery);
    //
    //             if (globalFlagHelperFailed && response && 'status' in response) {
    //                 const msg = await parseResponseMessages(response);
    //                 Alert.alert('Hiba!', msg);
    //             }
    //
    //
    //             Keyboard.dismiss();
    //             // sound.play((success) => {
    //             //     if (!success) {
    //             //         console.log('Sound did not play successfully');
    //             //     }
    //             // });
    //
    //         } catch (error: any) {
    //             console.log('Hiba történt', error);
    //         }
    //     }
    // }
    const onChangeHandler = (value: number) => {
        clearTimeout(timeout.current);
        setValue(value);
        timeout.current = setTimeout(async () => {

            const eanNumber = Number(value);

            if (isNaN(eanNumber)) {
                Alert.alert('Hiba', 'Kérjük, adjon meg egy érvényes számot.');
            } else {
                try {
                    const response = await ProductsService.getArticlesByEAN({ eankod: eanNumber });
                    setResult(response);
                    setSearchQueryState(value);

                    if (response && 'status' in response) {
                        const msg = await parseResponseMessages(response);
                        Alert.alert('Hiba!', msg);
                    }


                    Keyboard.dismiss();
                    // sound.play((success) => {
                    //     if (!success) {
                    //         console.log('Sound did not play successfully');
                    //     }
                    // });

                } catch (error: any) {
                    console.log('Hiba történt', error);
                }
            }
        }, 100);
    }


    return (
        <View style={articleStyles.container}>
            <TextInput
                style={articleStyles.input}
                onChangeText={ (value: any) => {onChangeHandler(value)
                    setSearchQuery(searchQuery)
                } }
                // onChangeText={async (text) => {
                //     setSearchQuery(text);
                //
                //
                // }}
                value={searchQuery}
                placeholder="Keresés..."
                keyboardType="numeric"
                autoFocus
                // onFocus = {()=> Keyboard.dismiss()}
            />
            <ButtonComponent label={"Keresés"} enabled={true} onClick={()=>onChangeHandler}/>
            {result && 'cikkszam' in result && (
                <View>
                    {/*<CardComponentSuccess title={"Találat"} content={result}/>*/}
                    <DataTable data={result}/>
                </View>
            )}
            {result === false && (
                <View>
                    <CardComponentNotFound title={"Not Found"} ean={searchQueryState}/>
                </View>
            )}
        </View>
    );
}

export default Product;