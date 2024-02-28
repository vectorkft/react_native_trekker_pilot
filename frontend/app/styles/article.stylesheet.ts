import {StyleSheet} from "react-native";

export const articleStyles = StyleSheet.create({
    container: {
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
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        margin: 10,
    },
});

export const camera = StyleSheet.create({
    container:{
        height: '100%',
        width: '100%'
    }

})