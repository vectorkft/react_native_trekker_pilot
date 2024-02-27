import { StyleSheet, Platform } from 'react-native';

export const buttonStyles = StyleSheet.create({
    button: {
        backgroundColor: 'green',
        padding: 10,
        paddingHorizontal: 20, // Szöveg körüli térköz hozzáadása
        alignItems: 'center',
        borderRadius: 8, // Kisebb lekerekítés
        justifyContent: 'center',
        height: 40,
        alignSelf: 'center',
        marginBottom: 10,
        marginTop: 10,
        position: 'relative',
        ...Platform.select({
            android: {
                elevation: 3, // Árnyék hozzáadása csak Androidon
            },
        }),
    },
    buttonDisabled: {
        backgroundColor: 'gray',
    },
});
