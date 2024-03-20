import React, {useContext} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {CardContent} from '../interfaces/Vcard';
import {cardStylesheet} from '../styles/Vcard';
import {DarkModeContext} from '../providers/dark-mode';

const VCardSuccess: React.FC<CardContent> = ({title, content}: CardContent) => {
  const NUMBER_OF_ITEMS_PER_ROW = 3; // Termékek száma egy sorban
  const {isDarkMode} = useContext(DarkModeContext);

  const groupedData = [];
  for (let i = 0; i < content.data.length; i += NUMBER_OF_ITEMS_PER_ROW) {
    groupedData.push(content.data.slice(i, i + NUMBER_OF_ITEMS_PER_ROW));
  }

  return (
    <ScrollView
      contentContainerStyle={cardStylesheet().scrollView}
      indicatorStyle="black">
      {groupedData.map((group, index) => (
        <View key={index} style={cardStylesheet(isDarkMode).cardContainer}>
          <Text style={cardStylesheet(isDarkMode).cardTitle}>{title}</Text>
          {group.map((item, indexGroup) => (
            <View
              key={indexGroup}
              style={cardStylesheet().itemContainer}>
              <Text style={cardStylesheet(isDarkMode).itemTitle}>
                {item.title}
              </Text>
              <Text style={cardStylesheet(isDarkMode).itemValue}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

export default VCardSuccess;
