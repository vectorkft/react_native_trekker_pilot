import React, {ComponentType, useContext} from 'react';
import {LoadingContext} from '../providers/loading';
import LoadingScreen from '../screens/loading-screen';

// This function takes a component and returns a new component
const withLoader = <P extends object>(Component: ComponentType<P>) => {
  // 'props' is of the inferred type 'P'
  return function WithLoader(props: P) {
    // We access the loading state from the LoadingContext
    const {loading} = useContext(LoadingContext);

    if (loading) {
      // If loading is true, render some kind of loading state
      return <LoadingScreen />;
    }

    // Otherwise, render the component that was passed with all its props
    return <Component {...props} />;
  };
};

export default withLoader;
