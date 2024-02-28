import React, {JSX, useEffect, useState} from "react";
import {View, TextInput, Alert, Keyboard, Text, StyleSheet, Button} from "react-native";
import {ProductsService} from '../../services/products.service';
import {articleStyles, camera} from "../../styles/products.stylesheet";
import {parseResponseMessages} from "../../../../shared/services/zod-dto.service";
import {ZArticleDTOOutput2} from "../../../../shared/dto/article.dto";
import { BarCodeScanner } from 'expo-barcode-scanner';
import CardComponentNotFound from "../../components/card/card-component-not-found";
import ButtonComponent from "../../components/button/button-component";
import DataTable from "../../components/table/data-table";
import {Ionicons} from "@expo/vector-icons";
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const Product = (): JSX.Element => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchQueryState, setSearchQueryState] = React.useState(0);
    const [value, setValue] = React.useState(0);
    const timeout = React.useRef(null);
    const [result, setResult] = React.useState<ZArticleDTOOutput2|false|Response>();
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
    }


    return (
        <View style={articleStyles.container}>
            {/*<FontAwesome name="rocket" size={30} color="#900" />*/}
            {isCameraActive && (
                <View style={camera.container}>
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={StyleSheet.absoluteFillObject} />
                    <View style={{ position: 'absolute', top: 0, right: 0, padding: 20 }}>
                        <Ionicons name="md-close" size={50} color="white" onPress={() => {setIsCameraActive(false);setScanned(true)}} />
                    </View>
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
            {scanned && <ButtonComponent label={'Camera'} enabled={true} onClick={() => { setScanned(false); setIsCameraActive(true); }} />}
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