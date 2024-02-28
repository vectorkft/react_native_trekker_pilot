import {RouterProps} from "../../interfaces/navigation-props";
import React, {JSX, useEffect, useState} from "react";
import {View, Text, TextInput, Button, Alert, Keyboard, StyleSheet} from "react-native";
import {ProductsService} from '../../services/products.service';
import {articleStyles, camera} from "../../styles/article.stylesheet";
import {parseResponseMessages} from "../../../../shared/services/zod-dto.service";
import {useStore} from "../../states/states";
import {ZArticleDTOOutput2} from "../../../../shared/dto/article.dto";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';


// import Sound from 'react-native-sound';

const Product = ({ navigation }: RouterProps): JSX.Element => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchQueryState, setSearchQueryState] = React.useState(0);
    const [value, setValue] = React.useState(0);
    const timeout = React.useRef(null);
    const [result, setResult] = React.useState<ZArticleDTOOutput2|undefined|Response>();
    const { globalFlagSuccess, globalFlagHelperFailed, globalFlagHelperNotFound } = useStore.getState();
    const [scanned, setScanned] = useState(true);
    const [text, setText] = useState('Not yet scanned')
    const [hasPermission, setHasPermission] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);



    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getBarCodeScannerPermissions().catch(error => console.log(error));
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        onChangeHandler(data)
        setIsCameraActive(false);

    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }




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

                } catch (error: any) {
                    console.log('Hiba történt', error);
                }
            }
        }, 100);
    }


    return (
        <View style={articleStyles.container}>

                {isCameraActive && (
                    <View style={camera.container}>
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={StyleSheet.absoluteFillObject} />
                    </View>
                )}

            <TextInput
                style={articleStyles.input}
                onChangeText={ (value: any) => {onChangeHandler(value)
                    setSearchQuery(searchQuery)
                } }
                value={searchQuery}
                placeholder="Keresés..."
                keyboardType="numeric"
                autoFocus
                onFocus = {()=> Keyboard.dismiss()}
            />
            {scanned && <Button title={'Camera'} onPress={() => { setScanned(false); setIsCameraActive(true); }} />}
            {/*<Ionicons name="md-camera" size={32} onPress={() => setScanned(false)} />*/}
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
            <View >






            </View>

        </View>
    );
}

export default Product;

