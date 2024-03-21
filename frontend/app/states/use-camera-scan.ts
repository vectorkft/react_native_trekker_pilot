// import React, {useMemo, useState} from 'react';
// import Sound from 'react-native-sound';
// import * as Sentry from '@sentry/react-native';
//
// export const useCamera = (
//   setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
// ) => {
//   const [isCameraActive, setIsCameraActive] = useState(false);
//
//   const handleOnClose = () => {
//     setIsCameraActive(false);
//     setErrorMessage(null);
//   };
//
//   const clickCamera = () => {
//     setIsCameraActive(true);
//     setErrorMessage(null);
//   };
//
//   return {
//     isCameraActive,
//     handleOnClose,
//     clickCamera,
//     setIsCameraActive,
//   };
// };
