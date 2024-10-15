import * as React from 'react';
import {StackActions} from '@react-navigation/native';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}
export function reset(config) {
  console.log('config:', config);
  navigationRef.current?.reset(config);
}
export function push(config) {
  navigationRef.current?.dispatch(StackActions.push(config));
}
export function getCurrentRoute() {
  return navigationRef.current?.getCurrentRoute()?.name;
}
