import React, {useState} from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
const AppButton = ({onPress, title}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handlePressIn = () => {
    setIsHovered(true);
  };

  const handlePressOut = () => {
    setIsHovered(false);
  };

  const buttonBackgroundColor = isHovered ? '#0298D3' : '#0298D3';

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.appButtonContainer,
        {backgroundColor: buttonBackgroundColor},
      ]}>
      <Text allowFontScaling={false} style={styles.appButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  text1: {
    fontSize: 30,
    color: 'green',
    fontWeight: 'bold',
  },
  tinyLogo: {
    width: 100,
    height: 100,
  },
  footer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appButtonContainer: {
    elevation: 8,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: '80%',
    height: 50,
    marginVertical: 10,
    justifyContent: 'center',
  },
  appButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',

    textTransform: 'uppercase',
  },
  input: {
    width: 290,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    color: 'black',
  },
});
export {AppButton};
