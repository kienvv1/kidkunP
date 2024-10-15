import React, {useState,useEffect,useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  FlatList
} from 'react-native';
import {Sizes} from '../../utils/resource';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FetchApi} from '../../utils/modules';
import {useQuery} from 'react-query';
import {Loading} from '../../elements';
import {useSelector} from 'react-redux';
import colorObject from 'react-native-ui-lib/src/style/colors';
import { TabView, SceneMap ,TabBar} from 'react-native-tab-view';
const NhanXet = ({navigation,route}) => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Nhận xét hàng ngày' },
    { key: 'second', title: 'Nhận xét tháng tuần' },
  ]);
  const layout = useWindowDimensions();
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


//   //tabar
//   const FirstRoute = () => (
//     <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
//        <FlatList
//   data={data?._data?.rvday}
//   keyExtractor={(item, index) => index.toString()}
//   renderItem={({ item, index }) => ( // Sử dụng tham số index ở đây
//     <View
//       key={index}
//       style={{
//         borderRadius: 10,
//         backgroundColor: 'white',
//         marginTop: 10,
//         marginHorizontal: 10,
//         paddingVertical: 15,
//         paddingHorizontal: 5,
//       }}>
//       <View
//         style={{
//           flexDirection: 'row',
//           height: 'auto',
//         }}>
//         <Image
//           source={{ uri: 'https://quanly.nvoting.com/web/kstools/customer_data/1679091c5a880faf6fb5e6087eb1b2dc/ps_cms_articles/image/Newwaytech/318df8242d8485dadc95.jpg'}}
//           style={styles.image}
//         />
//         <View style={styles.content}>
//           <Text allowFontScaling={false} style={{ color: 'black', fontSize: 18, fontWeight: 700 }}>
//             Nhận xét ngày {item.date_at}
//           </Text>
//           <Text allowFontScaling={false} style={{ color: 'black' }}>
//             Nội dung: {item.note}
//           </Text>
//         </View>
//       </View>
//     </View>
//   )}
// />

   
//       </View>
//   );
  
//   const SecondRoute = () => (
//     <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
//        <FlatList
//   data={data?._data?.rvweek}
//   keyExtractor={(item, index) => index.toString()}
//   renderItem={({ item, index }) => ( // Sử dụng tham số index ở đây
//   <View
//   key={index}
//    style={{
//      borderRadius: 10,
//      backgroundColor: 'white',
//      marginTop: 10,
//      marginHorizontal: 10,
//      paddingVertical:15,
//      paddingHorizontal:5
//    }}>

//    <View
//      style={{
//        flexDirection: 'row',
//        height: 'auto',
//      }}>
//      <Image
//           source={{ uri: 'https://quanly.nvoting.com/web/kstools/customer_data/1679091c5a880faf6fb5e6087eb1b2dc/ps_cms_articles/image/Newwaytech/318df8242d8485dadc95.jpg'}}
       
//        style={styles.image}
//      />
//      <View style={styles.content}>
//        <Text allowFontScaling={false}style={{color: 'black', fontSize:18,fontWeight:700}}>
//        Nhận xét tháng {item.ps_month}
        
//        </Text>
//        {/* <Text allowFontScaling={false}style={{color: 'black'}}>
//          Nội dung: {item.comment}
//        </Text> */}
     
//      </View>
//    </View>
   
//  </View>
//   )}
// />
      
//       </View>
//   );
  
//   const renderScene = SceneMap({
//     first: FirstRoute,
//     second: SecondRoute,
//   });




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
          <Text allowFontScaling={false}style={{color: 'black', fontSize: 20}}>Nhận xét</Text>
          <Ionicons name={'add-circle-sharp'} size={30} color={'#F5F5F5'} />
       </View>
       <FlatList
  data={data?._data?.rvday}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item, index }) => ( // Sử dụng tham số index ở đây
    <View
      key={index}
      style={{
        borderRadius: 10,
        backgroundColor: 'white',
        marginTop: 10,
        marginHorizontal: 10,
        paddingVertical: 15,
        paddingHorizontal: 5,
      }}>
      <View
        style={{
          flexDirection: 'row',
          height: 'auto',
        }}>
        <Image
          source={{ uri: 'https://quanly.nvoting.com/web/kstools/customer_data/1679091c5a880faf6fb5e6087eb1b2dc/ps_cms_articles/image/Newwaytech/318df8242d8485dadc95.jpg'}}
          style={styles.image}
        />
        <View style={styles.content}>
          <Text allowFontScaling={false} style={{ color: 'black', fontSize: 18, fontWeight: 700 }}>
            Nhận xét ngày {formatDateToDDMMYYYY(item.date_at)}
          </Text>
          <Text allowFontScaling={false} style={{ color: 'black' }}>
            Nội dung: {item.note}
          </Text>
        </View>
      </View>
    </View>
  )}
/>
       {/* <TabView
       
       navigationState={{ index, routes }}
       renderScene={renderScene}
       onIndexChange={setIndex}
       initialLayout={{ width: layout.width}}
       
       renderTabBar={props => <TabBar {...props}
       renderLabel={({route, color}) => (
         <Text allowFontScaling={false}style={{ color: 'black', borderBottomColor:'#0298D3'}}>
           {route.title}
         </Text>
       )}
       indicatorStyle={{ backgroundColor: '#0298D3' }}
       style={{backgroundColor: 'white'}}/>} 
     /> */}
      
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  image: {
    flex: 0.7,
    borderRadius:10,
    height: 70,
  },
  content: {
    flex: 2,
    marginLeft:10
  },
});
export default NhanXet;
