import * as React from 'react';
import 'react-native-gesture-handler';
import {View, Text, ScrollView, RefreshControl} from 'react-native';

const TopPage = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  // const Tab = createBottomTabNavigator();
  // const Drawer = createDrawerNavigator();
  // const DrawerScreen =()=>{
  //   return(
  //     <Drawer.Navigator initialRouteName="Home">
  //     <Drawer.Screen name="Home" component={HomeScreen} />
  //     <Drawer.Screen name="Notifications" component={SettingsScreen} />
  //   </Drawer.Navigator>
  //   )
  // }
  return (
    // <Tab.Navigator
    //   screenOptions={({route}) => ({
    //     headerShown: false,
    //     tabBarIcon: ({focused, color, size}) => {
    //       let iconName;

    //       if (route.name === 'Home') {
    //         iconName = focused
    //           ? 'ios-information-circle'
    //           : 'ios-information-circle-outline';
    //       } else if (route.name === 'Settings') {
    //         iconName = focused ? 'ios-list' : 'ios-list-outline';
    //       }else if (route.name === 'Blog'){
    //         iconName = focused ? 'md-book' : 'md-book-outline';
    //       }else if (route.name === 'Scan'){
    //         iconName = focused ? 'qr-code' : 'qr-code-outline';
    //       }
    //       // You can return any component that you like here!
    //       return <Ionicons name={iconName} size={size} color={color} />;
    //     },
    //     tabBarActiveTintColor: 'tomato',
    //     tabBarInactiveTintColor: 'gray',
    //   })}>
    //   <Tab.Screen name="Home" component={HomeScreen} />
    //   <Tab.Screen name="Blog" component={Blog} />
    //   <Tab.Screen name="Settings" component={SettingsScreen} />
    //   <Tab.Screen name="Scan" component={Scan} />
    // </Tab.Navigator>
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={{flex: 1}}>
        <Text style={{color: 'black'}}>Nghĩa Đẹp zai</Text>
      </View>
    </ScrollView>
  );
};

export default TopPage;
