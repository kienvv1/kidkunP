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
import {Image} from 'react-native-ui-lib';
import {useSelector} from 'react-redux';
import {useQuery} from 'react-query';
import {FetchApi} from '../../utils/modules';
import {Loading} from '../../elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const TableWeight = ({navigation}) => {
  const studentId = useSelector(state => state?.data?.data?._id);
  const {data, isLoading} = useQuery('useGetTableWeight', async () => {
    const ID = await AsyncStorage.getItem('studentId');
    let updatestudenID;
    if (ID) {
      updatestudenID = ID;
    } else {
      updatestudenID = studentId;
    }

    const weight = await FetchApi.getTableWeight(updatestudenID);
    return weight;
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
            height: 50,
            paddingHorizontal: 15,
            paddingVertical: 10,
            backgroundColor: 'white',
            // marginTop: insets.top,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('SucKhoe')}>
            <Ionicons name={'arrow-back-outline'} size={30} color={'black'} />
          </TouchableOpacity>
          <Text allowFontScaling={false}style={{color: 'black', fontSize: 20}}>Cân nặng</Text>
          <Ionicons name={'add-circle-sharp'} size={30} color={'white'} />
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
        {(data._data.growth_info || []).map((item, index) => {
          return (
            <View style={styles.blockList} key={index}>
              <Text allowFontScaling={false}style={{color: 'black', fontSize: 16, marginVertical: 5}}>
                {/* Nguyễn Chí Nghĩa gửi đơn xin nghỉ cho bé Giang 1 ngày{' '} */}
                Ngày khám: {item.date_at}
              </Text>
              <Text allowFontScaling={false}style={{color: 'black', fontSize: 14, marginVertical: 5}}>
                Tuổi: {item._age}
              </Text>
              <Text allowFontScaling={false}style={{color: 'black', fontSize: 14, marginVertical: 5}}>
                Chiều cao: {item._weight}
              </Text>
              <Text allowFontScaling={false}style={{color: 'black', fontSize: 14, marginVertical: 5}}>
                Danh giá: {item._index_weight}
              </Text>
            </View>
          );
        })}
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
    height: '50%',
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
    // flexDirection: "row",
    // alignItems: "center",
    justifyContent: 'space-between',
  },
  textbot: {
    color: 'black',
    fontSize: 15,
    paddingVertical: 10,
  },
});
export default TableWeight;
