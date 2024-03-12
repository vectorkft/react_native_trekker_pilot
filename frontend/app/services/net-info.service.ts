import {useStore} from '../states/zustand-states';

const {setIsConnected, setUptoDate} = useStore.getState();

export function setUptoDateFunc(isUptoDate: boolean) {
  setUptoDate(isUptoDate);
}

export function networkChange(state: boolean) {
  setIsConnected(state);
  if (!state) {
    setUptoDate(false);
  }
}
