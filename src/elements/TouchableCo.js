import React from 'react';
import {TouchableOpacity} from 'react-native';

/**
 *
 * @param {*} loading return loading view when component load data or fetch api
 */
const TouchableCo = props => {
  const {children} = props;
  return <TouchableOpacity {...props}>{children}</TouchableOpacity>;
};

export {TouchableCo};
