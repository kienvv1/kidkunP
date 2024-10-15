import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {FetchApi} from '../../utils/modules';
import {Loading} from '../../elements';
import {useQuery} from 'react-query';
const Notification = ({navigation}) => {
  // const {data, isLoading} = useQuery(['NewNotification'], () =>
  //   FetchApi.getListNotification(),
  // );
  const [data, setData] = useState(null); // Dữ liệu ban đầu
  const [isLoading, setIsLoading] = useState(true); // Trạng thái loading

  const {data:info} = useQuery('useGetStudent', async () => {
    const ID = await AsyncStorage.getItem('studentId');
    let updatestudenID;
    if (ID) {
      updatestudenID = ID;
    } else {
      updatestudenID = studentId;
    }
    const infos = await FetchApi.getStudent(updatestudenID);
    return infos;
  });

  const fetchData = async () => {
    try {
      const response = await FetchApi.getListNotification();
      const newData = response; // Giả sử dữ liệu từ API có thuộc tính _data
      setData(newData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      fetchData();
    });

    // Loại bỏ trình nghe khi component bị hủy
    return () => {
      focusListener();
    };
  }, [navigation]);


  if (isLoading) {
    return <Loading />;
  }

  const Data_Null = () => {
    return (
      <Text
        style={{
          color: 'gray',
          justifyContent: 'center',
          marginVertical: 200,
        }}>
        Bạn không có thông báo.
      </Text>
    );
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          height: 50,
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
        <Text allowFontScaling={false}style={{color: 'black', fontSize: 20}}>THÔNG BÁO</Text>
        <Ionicons name={'add-circle-sharp'} size={30} color={'#F5F5F5'} />
      </View>

      <ScrollView>
        {(data?._data?.data_info || []).map((item, index) => {
          const textStyle =
            item.status_read == 0 ? styles.title : styles.unread;
          return (
            <TouchableOpacity
              key={index}
              onPress={() =>
                navigation.navigate(item.root_screen, {dataProps: item})
              }>
              <View style={styles.unreadBlockList}>
                <Image
                  style={{width: 60, height: 60,borderRadius:10}}
                  source={{
                    uri: info?.avatar_url
                  }}
                />
                <View style={{marginLeft:10}}>
                  <Text allowFontScaling={false}style={textStyle}>
                    {item.notification_title}
                  </Text>
                  <Text allowFontScaling={false}style={textStyle}>{item.date_at}</Text>
                </View>
              </View>
            </TouchableOpacity>
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
    justifyContent: 'center',
  },
  title:{ 
    color:'black',
    fontWeight:'800',
    fontSize:18
  },
  unread:{
    color:'black',
    fontSize:15
  },
  blockList: {
    height: 'auto',
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom:5,
    // marginHorizontal: 20,
    // marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#CCFF66',
    flexDirection: 'row',
  },
  unreadBlockList: {
    height: 'auto',
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    // marginHorizontal: 20,
    // marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    borderBottomColor:'#08DCEC',
    borderBottomWidth:0.4
  },
});
export default Notification;