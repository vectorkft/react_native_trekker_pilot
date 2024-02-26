import {RouterProps} from "../../interfaces/navigation-props";
import React, {JSX, useRef, useState} from "react";
import {View, Text, TextInput, StyleSheet, Button, Alert, Keyboard} from "react-native";
import {ArticlesService} from '../../services/articles.service';
import {useStore} from "../../states/states";
// import Sound from 'react-native-sound';

const Articles = ({ navigation }: RouterProps): JSX.Element => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [result, setResult] = React.useState(null);
    const [value, setValue] = React.useState('');
    const timeout = React.useRef(null);
    const articleS = ArticlesService();
    const {results, setResults} = useStore.getState();
    const {flag, setFlag} = useStore.getState();

    // const sound = new Sound('frontend/app/assets/beep-07a.mp3', Sound.MAIN_BUNDLE, (error) => {
    //     if (error) {
    //         console.log('Failed to load the sound', error);
    //         return;
    //     }
    // });
    async function handleFormSubmit() {

        const eanNumber = Number(searchQuery);
        if (isNaN(eanNumber)) {
            Alert.alert('Hiba', 'Kérjük, adjon meg egy érvényes számot.');
        } else {
            try {
                const response = await articleS.getArticlesByEAN(eanNumber);
                setResult(response);
                Keyboard.dismiss(); // Elrejti a billentyűzetet
                // sound.play((success) => {
                //     if (!success) {
                //         console.log('Sound did not play successfully');
                //     }
                // });
                if(response.status===400){
                    setResults(false);
                    setFlag(false);
                    Alert.alert('Hiba', response[0].message);
                }
            } catch (error: any) {
                console.log('Hiba történt', error);
            }
        }
    }
    const onChangeHandler = (value) => {
        clearTimeout(timeout.current);
        setValue(value);
        timeout.current = setTimeout(async () => {
            const response = await articleS.getArticlesByEAN(Number(value));

            setResult(response);
        }, 10);
    }


    return (
        <View style={styles.container}>

            <TextInput
                style={styles.input}
                // onChangeText={ (value: any) => {onChangeHandler(value)
                //     setSearchQuery(searchQuery)
                // } }
                onChangeText={async (text) => {
                    setSearchQuery(text);


                }}
                value={searchQuery}
                placeholder="Keresés..."
                keyboardType="numeric"
                autoFocus
                // onFocus = {()=> Keyboard.dismiss()}
            />
            <Button title="Keresés" onPress={handleFormSubmit}></Button>
            {/*{result && !results && flag &&(*/}
            {/*    <View style={styles.card} >*/}
            {/*        <Text style={{color: 'red'}}>{result.message}</Text>*/}
            {/*        <Text style={{color: 'red'}}>EAN kód: {result.ean}</Text>*/}
            {/*    </View>*/}
            {/*)}*/}
            {/*{results && result && flag && (*/}
            {/*    <View style={styles.card}>*/}

            {/*        <Text>Cikkszám: {result.cikkszam}</Text>*/}
            {/*        <Text>Cikk neve: {result.cikknev}</Text>*/}
            {/*        <Text>EAN kód: {result.eankod}</Text>*/}
            {/*    </View>*/}


            {/*)}*/}
            {results && result && flag && (
                <View style={styles.card}>
                    <Text>{{result}}</Text>
                </View>


            )}


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: '10%'
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        width: '80%',
        marginBottom: 20,
        padding: 10,
    },
    card: {
        width: '80%',
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        marginTop: 20,
    },
});

export default Articles;