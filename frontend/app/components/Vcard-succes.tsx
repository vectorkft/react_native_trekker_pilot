import React, {useContext} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {CardContent} from '../interfaces/Vcard';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {cardStylesheet} from '../styles/Vcard';
import {DarkModeContext} from '../providers/dark-mode';

const VCardSuccess: React.FC<CardContent> = ({
  title,
  content,
}: CardContent) => {
  const {isDarkMode} = useContext(DarkModeContext);

  const groupedData = [];
  for (let i = 0; i < content.data.length; i += 3) {
    groupedData.push(content.data.slice(i, i + 3));
  }

  return (
    <ScrollView
      contentContainerStyle={cardStylesheet.scrollView}
      indicatorStyle="black">
      {groupedData.map((group, index) => (
        <View
          key={index}
          style={[
            cardStylesheet.cardContainer,
            {backgroundColor: isDarkMode ? Colors.lighter : Colors.darker},
          ]}>
          <Text
            style={[
              cardStylesheet.cardTitle,
              {color: isDarkMode ? '#000' : '#fff'},
            ]}>
            {title}
          </Text>
          {group.map((item, indexGroup) => (
            <View
              key={indexGroup}
              style={cardStylesheet.itemContainer}>
              <Text
                style={[
                  cardStylesheet.itemTitle,
                  {color: isDarkMode ? '#000' : '#fff'},
                ]}>
                {item.title}
              </Text>
              <Text
                style={[
                  cardStylesheet.itemValue,
                  {color: isDarkMode ? '#000' : '#fff'},
                ]}>
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
