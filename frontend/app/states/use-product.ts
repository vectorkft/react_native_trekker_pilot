import {useEffect, useRef} from 'react';
import {TextInput} from 'react-native';

export const useInputChange = (searchQuery: string) => {
  const inputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    if (!searchQuery && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchQuery]);

  return {
    inputRef,
  };
};
