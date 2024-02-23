import React, {JSX, useContext, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, TextInput, Button, Switch, Alert, ActivityIndicator} from 'react-native';
import {useState} from 'react';
import { DarkModeContext } from "../darkmode/dark-mode";
import { LoginService  } from '../../services/login.service';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Errors} from "../../interfaces/login-errors";
import {RouterProps} from "../../interfaces/navigation-props";
import {useStore} from "../../states/states";

const Login = ({ navigation }: RouterProps): JSX.Element => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Errors>({});
    const [rememberMe, setRememberMe] = useState(false);
    let passwordInput = useRef<TextInput | null>(null);
    const [loading, setLoading] = useState(true);
    const { setId, setRefreshToken, setAccessToken, setIsLoggedIn } = useStore.getState();

    const context = useContext(DarkModeContext);

    if (!context) {
        throw new Error("DarkModeContext is undefined");
    }

    const { isDarkMode } = context;

    useEffect(() => {
        LoginService.loadUsernameAndRememberMe().then(({username, rememberMe}) => {
            setUsername(username);
            setRememberMe(rememberMe);
            setLoading(false);
        })
            .catch(console.error);
    }, [setUsername,setRememberMe]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const handleFormSubmit = async () => {
        const { isValid, errors } = LoginService.validateForm(username, password);

        if (isValid) {
            const loginSuccess = await LoginService.handleSubmit(username, password);
            if (loginSuccess !== undefined) {
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
                setIsLoggedIn(true);
                setAccessToken(loginSuccess.accessToken);
                setRefreshToken(loginSuccess.refreshToken);
                setId(loginSuccess.userId);
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
