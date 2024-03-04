import React from 'react';
import {View, Text} from 'react-native';
import {cardComponentStylesheet} from '../styles/card-component.stylesheet';
import {CardProps} from '../interfaces/card-props';

const CardComponentSuccess: React.FC<CardProps> = ({
  title,
  content,
}: CardProps) => {
  return (
    <View style={cardComponentStylesheet.card}>
      <Text style={cardComponentStylesheet.title}>{title}</Text>
      <Text style={cardComponentStylesheet.content}>
        Cikkszám: {content.cikkszam}
      </Text>
      <Text style={cardComponentStylesheet.content}>
        Cikk neve: {content.cikknev}
      </Text>
      <Text style={cardComponentStylesheet.content}>
        EAN kód: {content.eankod}
      </Text>
    </View>
  );
};
export default CardComponentSuccess;
