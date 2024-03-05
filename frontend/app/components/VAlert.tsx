import React, {useState} from 'react';
import {
  Box,
  Text,
  IconButton,
  VStack,
  Alert,
  CloseIcon,
  useTheme,
  Modal,
} from 'native-base';
import {AlertProps} from '../interfaces/alert-props';

const VAlert: React.FC<AlertProps> = ({type, title, message}) => {
  const {colors} = useTheme();
  const backgroundColor =
    type === 'error' ? '#ff4d4d' : type === 'warning' ? '#ffcc00' : '#3399ff';
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <Modal.Content>
        <Alert status={type} variant="solid" style={{backgroundColor}}>
          <VStack space={2} flexShrink={1} w="100%">
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between">
              <Alert.Icon />
              <Text fontWeight="bold" color={colors.white}>
                {title.toUpperCase()}
              </Text>
              <IconButton
                icon={<CloseIcon size="3" color={colors.white} />}
                onPress={() => {
                  setIsOpen(false);
                }}
              />
            </Box>
            <Text color={colors.white}>{message}</Text>
          </VStack>
        </Alert>
      </Modal.Content>
    </Modal>
  );
};

export default VAlert;
