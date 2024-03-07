import React, { useState, useCallback } from "react";

export const useCamera = () => {
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [scanned, setScanned] = useState(true);

    const handleOnClose = useCallback(() => {
        setIsCameraActive(false);
        setScanned(true);
    }, [setIsCameraActive, setScanned]);

    const clickCamera = useCallback(() => {
        setIsCameraActive(true);
        setScanned(false);
    }, [setIsCameraActive, setScanned]);

    return { isCameraActive, scanned, handleOnClose, clickCamera, setScanned, setIsCameraActive };
};

export const useInputChange = (onChangeHandler: (value: number) => void, setSearchQuery: React.Dispatch<React.SetStateAction<string>>) => {

    const onChangeInput = useCallback((value) => {
        onChangeHandler(value);
        setSearchQuery(value);
    }, [onChangeHandler, setSearchQuery]);

    const onChangeInputWhenEnabled = useCallback((text: string) => {
        setSearchQuery(text);
    }, [setSearchQuery]);

    return { onChangeInput, onChangeInputWhenEnabled };
};