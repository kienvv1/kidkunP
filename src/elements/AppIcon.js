import * as React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Sizes} from '../../utils/resource';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Icons = props => {
  const {color, size, name, style, Press} = props;
  return (
    <Ionicons
      style={props.style}
      name={props.name}
      size={props.size}
      color={props.color}
    />
  );
};

export {Icons};
