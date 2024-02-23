import React, {JSX, useContext, useEffect, useRef} from 'react';
import {View, Text, TextInput, Button, Switch, Alert, ActivityIndicator} from 'react-native';
import {useState} from 'react';
import { DarkModeContext } from "../darkmode/dark-mode";
import { LoginService  } from '../../services/login.service';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Errors} from "../../interfaces/login-errors";
import {RouterProps} from "../../interfaces/navigation-props";
import {useStore} from "../../states/states";
import {formStylesheet} from "../../styles/form.stylesheet";

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
                    await AsyncStorage.multiSet([['username', username],['rememberMe', JSON.stringify(true)]]);
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
        <View style={isDarkMode ? formStylesheet.darkContainer : formStylesheet.lightContainer} >
        <View style={formStylesheet.form}>
        <Text style={formStylesheet.label}>Felhasználónév</Text>
            <TextInput
    style={formStylesheet.input}
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
        <Text style={formStylesheet.errorText}>{errors.username}</Text>
    ) : null}
    <Text style={formStylesheet.label}>Jelszó</Text>
        <TextInput
    style={formStylesheet.input}
    placeholder="Add meg a jelszavadat"
    secureTextEntry
    value={password}
    onChangeText={setPassword}
    ref={passwordInput}
    onSubmitEditing={handleFormSubmit}
    />
    {errors.password ? (
        <Text style={formStylesheet.errorText}>{errors.password}</Text>
    ) : null}
    <View style={formStylesheet.rememberMe}>
    <Switch value={rememberMe} onValueChange={setRememberMe} />
    <Text style={formStylesheet.label}>Jegyezze meg</Text>
    </View>
    <Button title="Bejelentkezés" onPress={handleFormSubmit} />
    </View>
    </View>
);
};

export default Login;
