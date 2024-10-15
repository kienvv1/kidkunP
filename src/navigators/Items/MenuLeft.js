// import React from 'react';
// import {View, StyleSheet, Text} from 'react-native';
// import {Sizes} from '../../utils/resource';
// import {TouchableCo} from '../../elements';

// const MenuFunctionItem = ({data}) => {
//   return (
//     <TouchableCo onPress={data.onPress}>
//       <View
//         style={{
//           flexDirection: 'row',
//           paddingVertical: Sizes.padding * 1.2,
//           marginHorizontal: Sizes.padding,
//           borderBottomColor: 'gray',
//           borderBottomWidth: StyleSheet.hairlineWidth,
//           justifyContent: 'space-between',
//         }}>
//         <Text style={{fontSize: Sizes.h6}}>{data.label}</Text>
//         <AppIcon color={'blach'} name={'arrow-forward'} size={10} />
//       </View>
//     </TouchableCo>
//   );
// };
// const MenuFunction = ({navigation}) => {
//   const menuList = [
//     {
//       label: 'Tin Tức',
//       onPress: () => navigation.navigate('TinTuc'),
//     },
//     // {
//     //   label: Strings.Find_caron_gara,
//     //   onPress: () => navigation.navigate('CaronGarages'),
//     // },
//     // {
//     //   label: Strings.Language,
//     //   onPress: () => {
//     //     navigation.navigate('LanguageSetting');
//     //   },
//     // },
//     // {
//     //   label: Strings.Mode,
//     //   onPress: () => {
//     //     navigation.navigate('ModeSetting');
//     //   },
//     // },
//     // {
//     //   label: Strings.Logout,
//     //   onPress: () => {
//     //     try {
//     //       FetchApi.logout();
//     //       ResetFunction.resetToLogin();
//     //       //   AccountService.set({});
//     //       //   const tag = 'fcmToken';

//     //       //   const mmkvId = `mmkv-${tag}`;
//     //       //   const mmkvKey = `key-${tag}`;

//     //       //   const MMKVwithID = new MMKVStorage.Loader()
//     //       //     .withInstanceID(mmkvId)
//     //       //     .initialize();

//     //       //   MMKVwithID.setMap(mmkvKey, {});
//     //     } catch (error) {}
//     //   },
//     // },
//   ];

//   return (
//     <View>
//       {menuList.map(item => {
//         return <MenuFunctionItem data={item} key={item.label} />;
//       })}
//     </View>
//   );
// };

// export {MenuFunction};
