export let isConnected = false;

export function networkChange(state: boolean) {
  isConnected = state;
}
