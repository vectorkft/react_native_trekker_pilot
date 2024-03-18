import React from 'react';
import {TouchableOpacity} from 'react-native';

export interface VtileProps {
  tileProps: React.ComponentProps<typeof TouchableOpacity>;
  title: string;
}
