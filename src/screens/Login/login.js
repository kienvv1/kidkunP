import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Input,
  StyleSheet,
  Image,
  SafeAreaView,
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import Icon from 'react-native-vector-icons/FontAwesome';
import {FetchApi} from '../../utils/modules';
import {AppButton} from '../../elements';
import {AccountService} from '../../utils/Account';
import {ResetFunction} from '../../utils/modules';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Login = ({navigation}) => {
  const {handleSubmit, control, setValue} = useForm();
  const [submiting, setSubmiting] = useState(false);
  // const account = AccountService.get();

  // useEffect(() => {
  //   //TODO: currently don't need a account to use app
  //   if (account?.api_token) {
  //     ResetFunction.resetToHome(navigation);
  //   } else {
  //     ResetFunction.resetToLogin(navigation);
  //   }
  // }, []);
  const saveToken = async token => {
    try {
      await AsyncStorage.setItem('@token', token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  };
  const saveCredentials = async (username, password) => {
    try {
      await AsyncStorage.setItem(
        '@credentials',
        JSON.stringify({username, password}),
      );
    } catch (error) {
      console.error('Lỗi khi lưu thông tin tài khoản:', error);
    }
  };

  const getSavedCredentials = async () => {
    try {
      const credentialsString = await AsyncStorage.getItem('@credentials');
      return credentialsString ? JSON.parse(credentialsString) : null;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin tài khoản:', error);
      return null;
    }
  };

  const onSubmit = async data => {
    try {
      setSubmiting(true);
      const {password, username, appcode} = data;
      const result = await FetchApi.login({
        username: username,
        password: password,
        appcode: 'R',
      });
      
     
      if (result._msg_code === 3) {
        const data_account = {...result._data, ...{password: password}};
        AccountService.set(data_account);
        FetchApi.registerDeviceid();
        const token = await AsyncStorage.getItem('fcmtoken');
        const deviceNotification = await FetchApi.registerNotificationToken({
          notification_token: token,
        });
        ResetFunction.resetToChoose();
      }
      if (result._msg_code === 1) {
        const data_account = {...result._data, ...{password: password}};
        AccountService.set(data_account);
        saveToken(result._data.api_token);
        saveCredentials(username, password);
        const token = await AsyncStorage.getItem('fcmtoken');

        const deviceNoti = await FetchApi.registerNotificationToken({
          notification_token: token,
        });

        ResetFunction.resetToChoose();
      }
      if (result._msg_code === 0) {
        Alert.alert(
          'Tài khoản hoặc mật khẩu không chính xác. Vui lòng nhập lại.',
        );
      }
      if (result._msg_code === 500) {
        Alert.alert(
          'Tài khoản hoặc mật khẩu không chính xác. Vui lòng nhập lại.',
        );
      }
      if (result.message === 'Network request failed') {
        Alert.alert('Vui lòng kết nối mạng.');
      }
      
    } catch (err) {
      console.log('err', err);
    }
    setSubmiting(false);
    console.log('test login')
  };

  const [hidePass, setHidePass] = useState(true);
  const renderSecure = () => {
    return (
      <View>
        <Icon
          size={20}
          color="#0298D3"
          style={{
            position: 'absolute',
            right: '-35%',
            bottom: 25,
          }}
          name={hidePass ? 'eye' : 'eye-slash'}
          onPress={() => setHidePass(!hidePass)}
        />
      </View>
    );
  };
  useEffect(() => {
    const fetchSavedCredentials = async () => {
      const savedCredentials = await getSavedCredentials();
      if (savedCredentials) {
        setValue('username', savedCredentials.username);
        setValue('password', savedCredentials.password);
      }
    };
    fetchSavedCredentials();
  }, []);
  const topMotion = useRef(new Animated.Value(300)).current;
  useEffect(() => {
    Animated.timing(topMotion, {
      toValue: -40,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);
  return (
   
    <SafeAreaView style={styles.container}> 
    <KeyboardAwareScrollView
    extraScrollHeight={70}
    enableOnAndroid={true}
    >
      <View style={styles.header}>
        <Image
          style={styles.tinyLogo}
          source={require('../../utils/Images/Background.png')}
        />
      </View>
  
      <View
        style={{
          // flex: 1,
          // width: '100%',
          
          alignItems: 'center',
          alignContent: 'center',
          // marginTop: 50,
        }}>
         
        <SafeAreaView style={{width: '100%', alignItems: 'center', marginTop:30}}>
          <Controller
            control={control}
            name="username"
            defaultValue=""
            rules={{required: 'Vui lòng nhập tên đăng nhập'}}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <View style={{width: '100%', alignItems: 'center'}}>
                <TextInput
                allowFontScaling={false}
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  value={value}
                  placeholder="Tên đăng nhập"
                  placeholderTextColor="gray"
                  autoCapitalize="none"
                  onChangeText={onChange}
                />
                {error && <Text allowFontScaling={false} style={styles.errorText}>{error.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="password"
            defaultValue=""
            rules={{required: 'Vui lòng nhập mật khẩu'}} // Thêm luật kiểm tra
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                }}>
                <TextInput
                allowFontScaling={false}
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  value={value}
                  placeholder="Mật khẩu"
                  placeholderTextColor="gray"
                  autoCapitalize="none"
                  secureTextEntry={hidePass ? true : false}
                  onChangeText={onChange}
                />
                {renderSecure()}
                {error && <Text allowFontScaling={false} style={styles.errorText}>{error.message}</Text>}
              </View>
            )}
          />
        </SafeAreaView>

        <AppButton
          onPress={handleSubmit(onSubmit)}
          disabled={submiting}
          title="Đăng nhập"
          size="sm"
        />
      </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
    
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    // flex: 0.8,
    marginTop:60,
    justifyContent: 'center',
    alignItems: 'center',

  },
  content: {
    flex: 1,
    borderWidth: 3,
    // width: '100%',
    alignItems: 'center',
    alignContent: 'center',
    // marginTop: topMotion,
    // justifyContent: 'center',
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
    width: 270,
    height: 200,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
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
    width: '80%',
    height: 50,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    color: 'black',
    borderRadius: 10,
    borderColor: '#0298D3',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
    marginHorizontal: 12,
  },
});
export default Login;
