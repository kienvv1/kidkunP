import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

const Sizes = {
  device_width: wp("100%"),
  device_height: hp("100%"),
  width: per => wp(per),
  height: per => hp(per),
  padding: wp("100%") < hp("100%") ? wp("4.27%") : hp("2.27%"),
  paddingTablet: hp("2.27%"),
  border_radius: 4,
  oval_radius: 8,
  elevation: 2,
  input_height: 40,
  border: StyleSheet.hairlineWidth,
  // h1: wp('7.2%'),
  // h2: wp('6.4%'),
  // h3: wp('5.2%'),
  // h4: wp('4.8%'),
  // h5: wp('4.0%'),
  // h6: wp('3.6%'),
  // h7: wp('3.4%'),
  // h8: wp('2.8%'),
  // h9: wp('2.4%'),
  isMobile: wp("100%") < hp("100%"),
  h1: wp("100%") < hp("100%") ? wp("6.8%") : hp("7.8%"),
  h3: wp("100%") < hp("100%") ? wp("4.8%") : hp("5.8%"),
  h4: wp("100%") < hp("100%") ? wp("4.4%") : hp("5.4%"),
  h5: wp("100%") < hp("100%") ? wp("3.6%") : hp("4.6%"),
  h6: wp("100%") < hp("100%") ? wp("3.2%") : hp("4.2%"),
  h7: wp("100%") < hp("100%") ? wp("3.0%") : hp("4.0%"),
  h8: wp("100%") < hp("100%") ? wp("2.4%") : hp("3.4%"),
  h9: wp("100%") < hp("100%") ? wp("2.0%") : hp("3.0%")
};

export { Sizes };
