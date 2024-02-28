import React from "react";
import {CardPropsNotFound} from "../../interfaces/card-props";
import {Text, View} from "react-native";
import {cardComponentStylesheet} from "../../styles/card-component.stylesheet";

const CardComponentNotFound: React.FC<CardPropsNotFound> = ({ title, ean }: CardPropsNotFound) => {
    return (
        <View style={cardComponentStylesheet.card}>
            <Text style={cardComponentStylesheet.notFoundTitle}>{title}</Text>
            <Text style={cardComponentStylesheet.notFoundContent}>EAN kód: {ean}</Text>
        </View>
    );
};

export default CardComponentNotFound;