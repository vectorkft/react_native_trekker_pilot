import React from 'react';
import {TouchableOpacity} from 'react-native';

export interface TileButton {
  tileProps: React.ComponentProps<typeof TouchableOpacity>;
  title: string;
}
