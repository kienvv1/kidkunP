import React, {useEffect} from 'react';
import {View, StyleSheet, Image} from 'react-native';

import {AccountService, AccountService1} from '../../utils/Account';
import {ResetFunction} from '../../utils/modules';

const AppIntro = ({navigation}) => {
  const account = AccountService.get();
  
  useEffect(() => {
    //TODO: currently don't need a account to use app
    const timer = setTimeout(() => {
      if (account?.api_token) {
        ResetFunction.resetToHome(navigation);
      } else {
        ResetFunction.resetToLogin(navigation);
      } // Chuyển đến màn hình "Login" sau khi intro hoàn thành
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.tinyLogo}
          source={require('../../utils/Images/Background.png')}
        />
      </View>
    </View>
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
    color: '#5F01D6',
    fontWeight: 'bold',
  },
  text1_giang: {
    fontSize: 30,
    color: '#000',
    fontWeight: 'bold',
  },
  tinyLogo: {
    width: 300,
    height: 220,
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
    marginVertical: 10,
  },
  appButtonText: {
    fontSize: 18,
    color: '#5F00D6',
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
  input: {
    width: 290,
    height: 40,
    margin: 12,
    borderWidth: 0.5,
    padding: 10,
    color: 'green',
    borderRadius: 10,
    borderColor: 'green',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
    marginHorizontal: 12,
  },
});
export default AppIntro;
