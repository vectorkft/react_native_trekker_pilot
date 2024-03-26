import React, {useContext, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import {DataTableInterface} from '../interfaces/Vdata-table';
import {Button} from 'react-native-elements';
import {dataTableStylesheet} from '../styles/Vdata-table';
import {DarkModeContext} from '../providers/dark-mode';

const VDataTable: React.FC<DataTableInterface> = ({
  data,
}: DataTableInterface) => {
  const {isDarkMode} = useContext(DarkModeContext);
  const dataArray = data?.data;
  const ITEMS_PER_PAGE = 10;
  const ITEMS_PER_ROW = 3;

  // const keys = dataArray.map(item => item.key);
  const titles = dataArray?.map((item: {title: string}) => item.title);
  const values = dataArray?.map((item: {value: number}) => item.value);

  const rows = [];
  for (let i = 0; i < values.length; i += ITEMS_PER_ROW) {
    rows.push(values.slice(i, i + ITEMS_PER_ROW));
  }

  const [page, setPage] = useState(0); // Új állapotváltozó a lap számának tárolására

  return (
    <View style={dataTableStylesheet(isDarkMode).containerStyle}>
      <View style={dataTableStylesheet(isDarkMode).titleContainer}>
        {titles
          .slice(0, ITEMS_PER_ROW)
          .map((title: string, index: number | undefined) => (
            <Text
              key={index}
              style={dataTableStylesheet(isDarkMode, index).titleStyle}>
              {title}
            </Text>
          ))}
      </View>

      <FlatList
        data={rows.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)} // Csak a jelenlegi oldal sorait jelenítjük meg
        keyExtractor={(_item, index) => index.toString()}
        renderItem={({item: row}) => (
          <View style={dataTableStylesheet(isDarkMode).tableContainer}>
            {row.map((value: number, i: number | undefined) => (
              <Text
                style={dataTableStylesheet(isDarkMode, i, row).textStyle}
                key={i}>
                {String(value)}
              </Text>
            ))}
          </View>
        )}
      />

      <View style={dataTableStylesheet().navigationView}>
        <Button
          buttonStyle={dataTableStylesheet().buttonStyle}
          titleStyle={dataTableStylesheet().buttonTitleStyle}
          title="Előző"
          onPress={() => setPage(Math.max(0, page - 1))} // Csökkentjük az oldalszámot, de nem megyünk 0 alá
          disabled={page === 0} // Letiltjuk a gombot, ha az első oldalon vagyunk
        />
        <Button
          buttonStyle={dataTableStylesheet().buttonStyle}
          titleStyle={dataTableStylesheet().buttonTitleStyle}
          title="Következő"
          onPress={() => setPage(page + 1)} // Növeljük az oldalszámot
          disabled={(page + 1) * ITEMS_PER_PAGE >= rows.length} // Letiltjuk a gombot, ha az utolsó oldalon vagyunk
        />
      </View>
    </View>
  );
};

export default VDataTable;
