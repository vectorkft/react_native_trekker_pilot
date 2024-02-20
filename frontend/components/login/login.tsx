/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useContext, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, TextInput, Button, Switch, Alert} from 'react-native';
import {useState} from 'react';
import { DarkModeContext } from "../darkmode/darkmode";
import { useLoginService  } from '../../services/login.service';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Errors {
    username?: string;
    password?: string;
}

const Login: () => React.JSX.Element = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Errors>({});
    const [rememberMe, setRememberMe] = useState(false);
    let passwordInput = useRef<TextInput | null>(null);
    const navigation = useNavigation();
    const loginService = useLoginService();

    const context = useContext(DarkModeContext);

    if (!context) {
        throw new Error("DarkModeContext is undefined");
    }

    const { isDarkMode } = context;

    useEffect(() => {
        const loadSavedData = async () => {
            const { username, rememberMe } = await loginService.loadUsernameAndRememberMe();
            setUsername(username);
            setRememberMe(rememberMe);
        };

        loadSavedData();
    }, []);


    const handleFormSubmit = async () => {
        const { isValid, errors } = loginService.validateForm(username, password);

        if (isValid) {
            const loginSuccess = await loginService.handleSubmit(username, password);
            if (loginSuccess) {
                if (rememberMe) {
                    await AsyncStorage.setItem('username', username);
                    await AsyncStorage.setItem('rememberMe', JSON.stringify(true));
                } else {
                    await AsyncStorage.removeItem('username');
                    await AsyncStorage.setItem('rememberMe', JSON.stringify(false));
                }
                Alert.alert("Sikeres bejelentkezés!");
                navigation.navigate('homescreen');
                setUsername('');
                setPassword('');
                setErrors({});
            } else {
                Alert.alert('Sikertelen bejelentkezés!', 'Hibás felhasználónév vagy jelszó!');
                setErrors(errors);
            }
        }
    };


    return (
        <View style={isDarkMode ? styles.darkContainer : styles.lightContainer} >
        <View style={styles.form}>
        <Text style={styles.label}>Felhasználónév</Text>
            <TextInput
    style={styles.input}
    placeholder="Add meg a felhasználónevedet"
    value={username}
    onChangeText={setUsername}
    autoFocus
    onSubmitEditing={() => {
        passwordInput.current?.focus();
    }}
    blurOnSubmit={false}
    />
    {errors.username ? (
        <Text style={styles.errorText}>{errors.username}</Text>
    ) : null}
    <Text style={styles.label}>Jelszó</Text>
        <TextInput
    style={styles.input}
    placeholder="Add meg a jelszavadat"
    secureTextEntry
    value={password}
    onChangeText={setPassword}
    ref={passwordInput}
    onSubmitEditing={handleFormSubmit}
    />
    {errors.password ? (
        <Text style={styles.errorText}>{errors.password}</Text>
    ) : null}
    <View style={styles.rememberMe}>
    <Switch value={rememberMe} onValueChange={setRememberMe} />
    <Text style={styles.label}>Jegyezze meg</Text>
    </View>
    <Button title="Bejelentkezés" onPress={handleFormSubmit} />
    </View>
    </View>
);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#f5f5f5',
    },
    form: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 15,
        padding: 10,
        borderRadius: 5,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    rememberMe: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    lightContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    darkContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
});

export default Login;
