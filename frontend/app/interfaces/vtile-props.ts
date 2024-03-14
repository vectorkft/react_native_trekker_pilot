import React from "react";
import {TouchableOpacity} from "react-native";

export interface VTileProps{
    tileProps: React.ComponentProps<typeof TouchableOpacity>;
    title: string;
}