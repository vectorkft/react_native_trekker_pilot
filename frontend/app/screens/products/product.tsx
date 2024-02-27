import {RouterProps} from "../../interfaces/navigation-props";
import React, {JSX} from "react";
import {View, Text, TextInput, Button, Alert, Keyboard} from "react-native";
import {ProductsService} from '../../services/products.service';
import {articleStyles} from "../../styles/article.stylesheet";
import {parseResponseMessages} from "../../../../shared/services/zod-dto.service";
import {useStore} from "../../states/states";
import {ZArticleDTOOutput2} from "../../../../shared/dto/article.dto";
// import Sound from 'react-native-sound';

const Product = ({ navigation }: RouterProps): JSX.Element => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchQueryState, setSearchQueryState] = React.useState(0);
    const [value, setValue] = React.useState(0);
    const timeout = React.useRef(null);
    const [result, setResult] = React.useState<ZArticleDTOOutput2|undefined|Response>();
    const { globalFlagSuccess, globalFlagHelperFailed, globalFlagHelperNotFound } = useStore.getState();

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

                    if (globalFlagHelperFailed && response && 'status' in response) {
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
                onFocus = {()=> Keyboard.dismiss()}
            />
            <Button title="Keresés" onPress={()=>onChangeHandler}></Button>
            {globalFlagSuccess && result && 'cikkszam' in result && (
                <View style={articleStyles.card}>

                    <Text>Cikkszám: {result.cikkszam}</Text>
                    <Text>Cikk neve: {result.cikknev}</Text>
                    <Text>EAN kód: {result.eankod}</Text>
                </View>
            )}
            {globalFlagHelperNotFound && (
                <View style={articleStyles.card} >
                    <Text style={{color: 'red'}}>Not Found</Text>
                    <Text style={{color: 'red'}}>EAN kód: {searchQueryState}</Text>
                </View>
            )}
        </View>
    );
}

export default Product;