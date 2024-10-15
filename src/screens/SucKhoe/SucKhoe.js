import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Sizes} from '../../utils/resource';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Image} from 'react-native-ui-lib';
import {useSelector} from 'react-redux';
import {useQuery} from 'react-query';
import {FetchApi} from '../../utils/modules';
import {Loading} from '../../elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SucKhoe = ({navigation}) => {
  const studentId = useSelector(state => state?.data?.data?._id);
  const {data, isLoading} = useQuery('useGetGrowth', async () => {
    const ID = await AsyncStorage.getItem('studentId');
    let updatestudenID;
    if (ID) {
      updatestudenID = ID;
    } else {
      updatestudenID = studentId;
    }
    const growth = await FetchApi.getGrowth(updatestudenID);
    return growth;
  });
  if (isLoading) {
    return <Loading />;
  }

  const itemWidth = Dimensions.get('window').width / 2.35;
  return (
    <View style={styles.container}>
      <ScrollView>
        <View
          style={{
            height: 'auto',
            paddingHorizontal: 15,
            paddingVertical: 10,
            backgroundColor: '#F5F5F5',
            // marginTop: insets.top,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name={'arrow-back-outline'} size={30} color={'black'} />
          </TouchableOpacity>
          <Text allowFontScaling={false}style={{color: 'black', fontSize: 20}}>SỨC KHỎE</Text>
          <Ionicons name={'add-circle-sharp'} size={30} color={'#F5F5F5'} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingBottom: 15,
            margin: 10,
          }}>
          <View style={styles.image}>
            <Image
              source={{
                uri: data._data.user_info.avatar_url,
              }}
              style={styles.avatar}
            />
          </View>

          <Text allowFontScaling={false}style={{color: 'black', fontSize: 18, marginHorizontal: 20}}>
            {data._data.user_info.first_name +
              ' ' +
              data._data.user_info.last_name}
          </Text>
        </View>

        <Text allowFontScaling={false}style={{color: 'black', fontSize: 17, marginHorizontal: 20}}>
          Chiều cao - Cân nặng{' '}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => navigation.navigate('TableHeight')}>
            <View style={[styles.itemContainer, {width: itemWidth}]}>
              <Icon
                name="human-male-height"
                size={45}
                color="#0298D3"
                style={styles.icon}
              />
              <Text>Chiều cao</Text>
              <Text allowFontScaling={false}style={{fontSize: 20, fontWeight: 'bold', color: 'black'}}>
                {data._data.height} cm
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('TableWeight')}>
            <View style={[styles.itemContainer, {width: itemWidth}]}>
              <Icon
                name="weight-kilogram"
                size={45}
                color="#0298D3"
                style={styles.icon}
              />
              <Text>Cân nặng</Text>
              <Text allowFontScaling={false}style={{fontSize: 20, fontWeight: 'bold', color: 'black'}}>
                {data._data.weight} KG
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text allowFontScaling={false}style={{color: 'black', fontSize: 17, marginHorizontal: 20}}>
          Sức khỏe chung{' '}
        </Text>
        <View style={styles.viewbot}>
          <View>
          <Text allowFontScaling={false}style={styles.textbot}>Răng-Hàm-Mặt: </Text>
          <Text allowFontScaling={false}style={styles.textbot}>Tai-Mũi-Họng:  </Text>
          <Text allowFontScaling={false}style={styles.textbot}>Khám mắt: </Text>
          <Text allowFontScaling={false}style={styles.textbot}>Khám tim: </Text>
          <Text allowFontScaling={false}style={styles.textbot}>Khám phổi: </Text>
          <Text allowFontScaling={false}style={styles.textbot}>Khám da: </Text>
          <Text allowFontScaling={false}style={styles.textbot}>Ghi chú: </Text>
        </View>
        <View>
          <Text allowFontScaling={false}style={styles.textbot}>{data._data.tooth}</Text>
          <Text allowFontScaling={false}style={styles.textbot}>{data._data.throat} </Text>
          <Text allowFontScaling={false}style={styles.textbot}>{data._data.eye}</Text>
          <Text allowFontScaling={false}style={styles.textbot}>{data._data.heart}</Text>
          <Text allowFontScaling={false}style={styles.textbot}>{data._data.lung}</Text>
          <Text allowFontScaling={false}style={styles.textbot}>{data._data.skin}</Text>
          <Text allowFontScaling={false}style={styles.textbot}>{data._data.note}</Text>
        </View>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'flex-start',
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    marginHorizontal: 15,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  blockList: {
    height: Sizes.device_width < Sizes.device_height,
    width: 320,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  image: {
    width: 50, // Kích thước của avatar
    height: 50,
    borderRadius: 50, // Đặt borderRadius thành nửa kích thước để làm hình ảnh tròn
    overflow: 'hidden', // Giữ cho hình ảnh không bị tràn ra khỏi khung
  },
  avatar: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  viewbot: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 15,
    backgroundColor: 'white',
    marginVertical: 0,
    marginHorizontal: 15,
    flexDirection: "row",
    // alignItems: "center",
   
    
  },
  textbot: {
    color: 'black',
    fontSize: 15,
    paddingVertical: 10,
  },
});
export default SucKhoe;
