import {Button, Icon} from 'react-native-elements';
import {DarkModeService} from '../services/dark-mode.service';

const VCameraIconButton = ({onPress}: any) => {
    const {isDarkMode} = DarkModeService.useDarkMode();

    return (
        <Button
            icon={<Icon type='antdesign' name="camera" size={50} color={isDarkMode ? '#ffffff' : '#000000'} />}
            onPress={onPress}
            type="clear"
        />
    );
};

export default VCameraIconButton;