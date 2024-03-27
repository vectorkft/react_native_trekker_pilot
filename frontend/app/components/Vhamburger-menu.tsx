import React, {useContext, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {DarkModeContext} from '../providers/dark-mode';
import {HamburgerMenuProp} from '../interfaces/hamburger-menu';

const HamburgerMenu = ({children}: HamburgerMenuProp) => {
  const {isDarkMode} = useContext(DarkModeContext);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <View>
      <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
        <Icon
          type={'feather'}
          name="menu"
          size={40}
          color={isDarkMode ? '#fff' : '#000'}
        />
      </TouchableOpacity>
      {isOpen && children}
    </View>
  );
};

export default HamburgerMenu;
