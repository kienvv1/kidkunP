import React from 'react';
import {View} from 'react-native';
import Spinner from 'react-native-spinkit';
import {Sizes} from '../utils/resource';

const Loading = ({style, sizeSpinner, loadingText}) => {
  return (
    <View
      style={[
        {
          marginTop: 40,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        },
        style,
      ]}>
      <Spinner size={sizeSpinner || 24} type={'Circle'} color={'#0298D3'} />
      {!!loadingText && (
        <Text style={{color: 'green', paddingRight: Sizes.padding / 2}}>
          {loadingText}
        </Text>
      )}
    </View>
  );
};
export {Loading};
