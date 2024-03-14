import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import {VTileProps} from "../interfaces/vtile-props";
import {DarkModeProviderService} from "../services/context-providers.service";

const VTile = ({title, tileProps}: VTileProps) => {
    const {isDarkMode} = DarkModeProviderService.useDarkMode();

    return (
        <TouchableOpacity onPress={tileProps.onPress} activeOpacity={0.5} disabled={tileProps.disabled}>
            <View style={[styles.tile, {backgroundColor: isDarkMode ? '#2d2d2d' : '#d2cfcf'}]}>
                <Text style={[styles.title, {color: isDarkMode ? '#fff' : '#000'}]}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    tile: {
        width: 120,
        height: 110,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#00EDAE',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        ...Platform.select({
            android: {
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 2
            }
        }),
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default VTile;
