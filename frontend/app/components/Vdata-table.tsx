import React, {useContext, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import {DataTableProps} from '../interfaces/data-table-props';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Button} from 'react-native-elements';
import {VDataTableStylesheet} from '../styles/vdata-table.stylesheet';
import {DarkModeContext} from '../providers/dark-mode';

const VdataTable: React.FC<DataTableProps> = ({data}: DataTableProps) => {
  const {isDarkMode} = useContext(DarkModeContext);
  const {data: dataArray} = data;

  const keys = dataArray.map(item => item.key);
  const titles = dataArray.map(item => item.title);
  const values = dataArray.map(item => item.value);

  const rows = [];
  for (let i = 0; i < values.length; i += 3) {
    rows.push(values.slice(i, i + 3));
  }

  const [page, setPage] = useState(0); // Új állapotváltozó a lap számának tárolására

  return (
    <View
      style={[
        VDataTableStylesheet.containerStyle,
        {
          backgroundColor: isDarkMode ? Colors.white : Colors.darker,
        },
      ]}>
      <View
        style={[
          VDataTableStylesheet.titleContainer,
          {borderColor: isDarkMode ? '#000' : '#fff'},
        ]}>
        {titles.slice(0, 3).map((title, index) => (
          <Text
            key={index}
            style={[
              VDataTableStylesheet.textStyle,
              {
                color: isDarkMode ? '#000' : '#fff',
                borderRightWidth: index < 2 ? 1 : 0, // az utolsó cellánál nincs jobb oldali vonal
                borderColor: isDarkMode ? '#000' : '#fff',
              },
            ]}>
            {title}
          </Text>
        ))}
      </View>

      <FlatList
        data={rows.slice(page * 10, (page + 1) * 10)} // Csak a jelenlegi oldal sorait jelenítjük meg
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item: row}) => (
          <View
            style={[
              VDataTableStylesheet.tableContainer,
              {borderColor: isDarkMode ? '#000' : '#fff'},
            ]}>
            {row.map((value, i) => (
              <Text
                style={[
                  VDataTableStylesheet.textStyle,
                  {
                    color: isDarkMode ? '#000' : '#fff',
                    borderRightWidth: i < row.length - 1 ? 1 : 0, // az utolsó cellánál nincs jobb oldali vonal
                    borderColor: isDarkMode ? '#000' : '#fff',
                  },
                ]}
                key={i}>
                {String(value)}
              </Text>
            ))}
          </View>
        )}
      />

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Button
          buttonStyle={{backgroundColor: '#00EDAE'}}
          titleStyle={{color: isDarkMode ? '#000' : '#fff'}}
          title="Előző"
          onPress={() => setPage(Math.max(0, page - 1))} // Csökkentjük az oldalszámot, de nem megyünk 0 alá
          disabled={page === 0} // Letiltjuk a gombot, ha az első oldalon vagyunk
        />
        <Button
          buttonStyle={{backgroundColor: '#00EDAE'}}
          titleStyle={{color: isDarkMode ? '#000' : '#fff'}}
          title="Következő"
          onPress={() => setPage(page + 1)} // Növeljük az oldalszámot
          disabled={(page + 1) * 10 >= rows.length} // Letiltjuk a gombot, ha az utolsó oldalon vagyunk
        />
      </View>
    </View>
  );
};

export default VdataTable;
