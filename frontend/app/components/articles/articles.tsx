import {RouterProps} from "../../interfaces/navigation-props";
import React, {JSX} from "react";
import {View, Text} from "react-native";

const Articles = ({ navigation }: RouterProps): JSX.Element => {
    return (
        <View>
            <Text>Articles</Text>
        </View>
    );
}

export default Articles;