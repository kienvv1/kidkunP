import React, {useState,useEffect,useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Sizes} from '../../utils/resource';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FetchApi} from '../../utils/modules';
import {useQuery} from 'react-query';
import {Loading} from '../../elements';
import {useSelector} from 'react-redux';
import colorObject from 'react-native-ui-lib/src/style/colors';
const DanhGia = ({navigation,route}) => {
  const studentId = useSelector(state => state?.data?.data?._id);
  // const {data, isLoading} = useQuery('useGetReview', async () => {
  //   const ID = await AsyncStorage.getItem('studentId');
  //   let updatestudenID;
  //   if (ID) {
  //     updatestudenID = ID;
  //   } else {
  //     updatestudenID = studentId;
  //   }
  //   const news = FetchApi.getReview(updatestudenID);
  //   return news;
  // });
  const { data, isLoading, refetch } = useQuery(
    'useGetReview',
    async () => {
      const ID = await AsyncStorage.getItem('studentId');
      let updatestudenID;
      if (ID) {
        updatestudenID = ID;
      } else {
        updatestudenID = studentId;
      }
      const news = FetchApi.getReview(updatestudenID);
      return news;
    },
    {
      enabled: true , // Tắt tự động tải dữ liệu ban đầu
    }
  );

  const datas = route.params?.dataProps;
  const {datass} = useQuery(['NewNotificationDetail'], () =>
  FetchApi.getNotificationDetail(datas.notification_id),
);
  
  useEffect(() => {
    const loadOnFocus = async () => {
      refetch(); // Gọi hàm refetch để tải lại dữ liệuliệ

    };
  


    const unsubscribe = navigation.addListener('focus', loadOnFocus);
  
    
  }, [navigation]);
  
  if (isLoading) {
    return <Loading />;
  }
  
  
  const formatDateToDDMMYYYY = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Lưu ý: Tháng bắt đầu từ 0 nên cần +1
    const year = date.getFullYear();
    const formattedDate = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;
    return formattedDate;
  }

  return (
    <View style={styles.container}>
       <View
          style={{
            height: 'auto',
            width:'100%',
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
          <Text allowFontScaling={false}style={{color: 'black', fontSize: 20}}>Đánh giá</Text>
          <Ionicons name={'add-circle-sharp'} size={30} color={'#F5F5F5'} />
        </View>
      <ScrollView style={{width: '100%'}}>

   
  {data?._data?.rvweek.map((item, index) => (
    // <TouchableOpacity
    //   key={item.id}
    //   onPress={() =>
    //     navigation.navigate('ChiTietNhanXet', { dataProps: item })
    //   }>
         <TouchableOpacity
         onPress={()=>navigation.navigate('ChiTietNhanXet',{dataProps: item?.web_view})}
         key={index}
          style={{
            borderRadius: 10,
            backgroundColor: 'white',
            marginTop: 10,
            marginHorizontal: 10,
            paddingVertical:15,
            paddingHorizontal:5
          }}>
       
          <View
            style={{
              flexDirection: 'row',
              height: 'auto',
            }}>
            <Image
              source={require('../../utils/Images/Background.png')}
              style={styles.image}
            />
            <View style={styles.content}>
              <Text allowFontScaling={false}style={{color: 'black', fontSize:18,fontWeight:700}}>
              Đánh giá tháng {item.ps_month}
               
              </Text>
              {/* <Text allowFontScaling={false}style={{color: 'black'}}>
                Nội dung: {item.comment}
              </Text>
             */}
            </View>
          </View>
          
        </TouchableOpacity>
    // </TouchableOpacity>
  )
)}
      {/* {(data || []).map((item, index) => {
          return (
            <TouchableOpacity
              key={item.id}
              
              onPress={() =>
                navigation.navigate('ChiTietNhanXet', {dataProps: item})
              }>
           
            </TouchableOpacity>
          );
        })} */}
       
       
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },

  image: {
    flex: 0.7,
    
    height: 70,
  },
  content: {
    flex: 2,
    marginLeft:10
  },
});
export default DanhGia;
