import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import {View, Text, Button, Image, StyleSheet, SafeAreaView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {navigationRef} from './utils/modules';
import * as NavigationService from './utils/modules';
import MainNavigator from './navigators/MainNavigator';
import {Sizes} from './utils/resource';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Loading, TouchableCo} from './elements';
import {useNavigation} from '@react-navigation/core';

import {useQuery} from 'react-query';
import {AccountService} from './utils/Account';
import {FetchApi} from './utils/modules';
import {ResetFunction} from './utils/modules';
import {useDispatch} from 'react-redux';
import {setData} from './actions/dataActions';
import Login from './screens/Login/login';
import AppIntro from './screens/AppIntro/AppIntro';
import ChonCon from './screens/Choose/Choose';
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const MenuFunctionItem = ({data}) => {
  return (
    <TouchableCo onPress={data.onPress}>
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: Sizes.padding * 1.2,
          marginHorizontal: Sizes.padding,
          borderBottomColor: 'gray',
          borderBottomWidth: StyleSheet.hairlineWidth,
          justifyContent: 'space-between',
        }}>
        <Text allowFontScaling={false}style={{fontSize: Sizes.h4, color: 'black'}}>{data.label}</Text>
        <Ionicons color={'black'} name={'arrow-forward'} size={20} />
      </View>
    </TouchableCo>
  );
};
const MenuFunction = () => {
  const navigation = useNavigation();
  const menuList = [
    {
      label: 'Chọn bé',
      onPress: () => ResetFunction.resetToChoose(),
    },
    {
      label: 'Thông tin của bé',
      onPress: () => navigation.navigate('ProfileChil'),
    },
    {
      label: 'Tài khoản',
      onPress: () => navigation.navigate('Profile'),
    },
    {
      label: 'Đăng xuất',
      onPress: () => {
        try {
          FetchApi.logout();
          ResetFunction.resetToLogin();
          
        } catch (error) {}
      },
    },
  ];

  return (
    <SafeAreaView>
      {menuList.map(item => {
        return <MenuFunctionItem data={item} key={item.label} />;
      })}
    </SafeAreaView>
  );
};
const menu2 = ({navigation}) => {
  return <MenuFunction />;
};
const SlideDraw = ({route}) => {
  const data = route.params?.dataprops;
  const dispatch = useDispatch();
  dispatch(setData(data));
  return (
    <Drawer.Navigator
      drawerType={'back'}
      drawerContent={menu2}
      screenOptions={{
        headerShown: false,
      }}>
      <Drawer.Screen name="Mains" component={MainStack} />
    </Drawer.Navigator>
  );
};
const HeaderApp = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState(null); // Dữ liệu ban đầu
  const [isLoading, setIsLoading] = useState(true); // Trạng thái loading

  const fetchData = async () => {
    try {
      const response = await FetchApi.getCountNotification();
      const newData = response; // Giả sử dữ liệu từ API có thuộc tính _data
      setData(newData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Gọi fetchData khi component được tạo

    const interval = setInterval(() => {
      fetchData(); // Gọi fetchData mỗi 5 giây
    }, 1000);

    // Clear interval khi component unmount
    return () => {
      clearInterval(interval);
    };
  }, []);

  // if (isLoading) {
  //   return <Loading />;
  // }

  return (
    <View
      style={{
        height: Sizes.device_width < Sizes.device_height ? 50 : 70,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#F5F5F5',
        marginTop: insets.top,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <TouchableCo
        onPress={() => {
          navigation.toggleDrawer();
        }}>
        <Ionicons name={'menu'} size={33} color={'#0298D3'} />
      </TouchableCo>
      <TouchableCo onPress={() => navigation.goBack()}>
        <Image
          style={{width: 60, height: 45, borderColor: 'black'}}
          source={require('./utils/Images/Background.png')}
        />
      </TouchableCo>
      <TouchableCo onPress={() => navigation.navigate('Notification')}>
        <View style={{position: 'relative'}}>
          <Ionicons name={'notifications'} size={30} color={'#FBA534'} />
          <View
            style={{
              position: 'absolute',
              top: -7,
              right: -7,
              backgroundColor: 'red',
              borderRadius: 10,
              minWidth: 20,
              minHeight: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text allowFontScaling={false}style={{color: 'white', fontSize: 12}}>
              {data?._data?.number_notifications_not_read}
            </Text>
            {/* Số lượng thông báo */}
          </View>
        </View>
      </TouchableCo>
    </View>
  );
};
const MainStack = ({navigation, route}) => {
  const [isShow, setIsShow] = useState(true);
  useEffect(() => {
    if (NavigationService.getCurrentRoute() === 'Gift') {
      setIsShow(false);
    } else {
      if (!isShow) {
        setIsShow(true);
      }
    }
  }, [route]);

  return (
    <View style={{flex: 1}}>
      {<HeaderApp navigation={navigation} />}

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Main" component={MainNavigator} />
        {/* <Stack.Screen name="Web" component={MainNavigator} /> */}
      </Stack.Navigator>
    </View>
  );
};
const AppContent = ()=>{
    return(
        <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="AppIntro" component={AppIntro} />
        <Stack.Screen name="Login" component={Login} />

        <Stack.Screen name="ChonCon" component={ChonCon} />

        <Stack.Screen name="SlideDraw" component={SlideDraw} /> 
      </Stack.Navigator>
    </NavigationContainer>
    )
}
export default AppContent;