import React, {ComponentType} from 'react';
import VInternetToast from '../components/Vinternet-toast';
import {useNetInfo} from '../states/use-net-info';

export default function withNetInfo<P extends object>(
  WrappedComponent: ComponentType<P>,
) {
  const WithNetInfo = (props: P) => {
    const netInfo = useNetInfo();

    return (
      <>
        <WrappedComponent {...props} />
        <VInternetToast isVisible={!netInfo.isConnected} />
      </>
    );
  };

  WithNetInfo.displayName = `WithNetInfo(${getDisplayName(WrappedComponent)})`;

  return WithNetInfo;
}

function getDisplayName(WrappedComponent: ComponentType<any>): string {
  return (
    WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Internet Toast Component'
  );
}
