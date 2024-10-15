import {Platform} from 'react-native';

const isIOS = Platform.OS === 'ios';
const deviceType = Platform.OS === 'ios' ? 'IOS' : 'ANDROID';
const appVersion = isIOS ? '1.0.2' : '1.0.2';
/**
 * config information of App
 */

const host = {
  api_mamnon: 'https://quanly.nvoting.com/api',
}; //dev

//dev
const appKeys = {
  codePush: Platform.select({
    ios: 'CqdRz5S7Y4MfJKpE9AxyFd9t2PV4krcFZlq65',
    android: 'QwuXKOmRHP_gzw3o1Nez0UKn4_ZHTON0tE9ZN',
  }),
};
// // pro
// const appKeys = {
//   codePush: Platform.select({
//     ios: "KIKmTeksrm0yi7J5WC-1uuE4p9UybWLmrN2Dm",
//     android: "PVD16ylRtH-Zb-MJ2NCZN5GMJkNju0Wic8L3A"
//   })
// };

const termsOfService = '';

export {host, termsOfService, isIOS, deviceType, appVersion, appKeys};
