import React, {JSX, useEffect, useRef} from 'react';
import {View, Text, TextInput, Button, Switch, Alert, ActivityIndicator} from 'react-native';
import {useState} from 'react';
import { LoginService  } from '../../services/login.service';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {RouterProps} from "../../interfaces/navigation-props";
import {useStore} from "../../states/states";
import {formStylesheet} from "../../styles/form.stylesheet";
import {parseZodError} from "../../../../shared/services/zod-dto.service";
import {DarkModeService} from "../../services/dark-mode.service";
import ButtonComponent from "../../components/button/button-component";

const Login = ({ navigation }: RouterProps): JSX.Element => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    let passwordInput = useRef<TextInput | null>(null);
    const [loading, setLoading] = useState(true);
    const { setId, setRefreshToken, setAccessToken, setIsLoggedIn } = useStore.getState();
    const { isDarkMode } = DarkModeService.useDarkMode();

    useEffect(() => {
        let cancelled = false;

        LoginService.loadUsernameAndRememberMe().then(({username, rememberMe}) => {
            if (!cancelled) {
                setUsername(username);
                setRememberMe(rememberMe);
                setLoading(false);
            }
        })
            .catch(console.error);

        return () => {
            cancelled = true;
        };
    }, [setUsername,setRememberMe]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const handleFormSubmit = async () => {
        const { isValid, error } = await LoginService.validateForm({name: username, pw: password});

        if (isValid) {
            const loginSuccess = await LoginService.handleSubmit({name: username, pw: password});
            if (loginSuccess !== undefined) {
                if (rememberMe) {
                    await AsyncStorage.multiSet([['username', username],['rememberMe', JSON.stringify(true)]]);
                } else {
                    await AsyncStorage.removeItem('username');
                    await AsyncStorage.setItem('rememberMe', JSON.stringify(false));
                }
                setUsername('');
                setPassword('');
                setIsLoggedIn(true);
                setAccessToken(loginSuccess.accessToken);
                setRefreshToken(loginSuccess.refreshToken);
                setId(loginSuccess.userId);
                navigation.navigate('homescreen');
                Alert.alert("Sikeres bejelentkezés!");
            } else {
                Alert.alert('Sikertelen bejelentkezés!', 'Hibás felhasználónév vagy jelszó!');
            }
        } else {
            const msg = await parseZodError(error);
            Alert.alert('Hibás belépés!', msg);
        }
    };


    return (
        <View style={isDarkMode ? formStylesheet.darkContainer : formStylesheet.lightContainer}>
            <View style={formStylesheet.form}>
                <Text style={formStylesheet.label}>Felhasználónév</Text>
                <TextInput
                    style={formStylesheet.input}
                    placeholder="Add meg a felhasználónevedet"
                    value={username}
                    onChangeText={setUsername}
                    autoFocus
                    onSubmitEditing={() => passwordInput.current?.focus()}
                    blurOnSubmit={false}
                />
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
                <View style={formStylesheet.rememberMe}>
                    <Switch value={rememberMe} onValueChange={setRememberMe} />
                    <Text style={formStylesheet.label}>Emlékezz rám</Text>
                </View>
                <ButtonComponent
                    label="Bejelentkezés"
                    enabled={isDarkMode}
                    onClick={handleFormSubmit}
                />
            </View>
        </View>
    );
};

export default Login;
