import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions ,
  FlatList
} from 'react-native';
import {Sizes} from '../../utils/resource';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontawesomeIcon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import {FetchApi} from '../../utils/modules';
import {Loading} from '../../elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TinhNang = ({navigation}) => {
  const scrollViewRef = useRef(null);
  const { width: screenWidth } = Dimensions.get('window');
  
  const studentId = useSelector(state => state?.data?.data?._id);
 
  const {data, isLoading} = useQuery('useGetNewsType', async () => {
    const ID = await AsyncStorage.getItem('studentId');
    let updatestudenID;
    if (ID) {
      updatestudenID = ID;
    } else {
      updatestudenID = studentId;
    }
    const news = FetchApi.getNews(updatestudenID);
    return news;
  });

  const {data:product, isLoading:isLoadings} = useQuery('useGetProduct', async () => {
   
    
    const products = FetchApi.getProduct();
    return products;
  });
  
  if (isLoading || isLoadings) {
    return <Loading />;
  }
  



  
  return (
    <SafeAreaView style={styles.container}>
    <View style={{flex:1.5}}>
    <View style={{marginTop:5,flexDirection:'row', marginLeft:5}}>
      <MaterialIcon name="extension" size={27} color="#EE4B4B" /> 
        <Text allowFontScaling={false}style={{color:'black', fontSize:20, fontWeight:900}}>
        Tương tác với nhà trường
        </Text>
        
    </View>
    <View style={{flex:1,flexDirection:'row'}}>
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <TouchableOpacity onPress={()=>navigation.navigate('HocPhi')} style={{alignItems:'center'}}>
        <MaterialIcon name="payments" size={45} color="green" /> 
        <Text allowFontScaling={false}style={{color:'black', fontSize:15, fontWeight:500}}>
        Học phí
        </Text>
        </TouchableOpacity>
        </View>
       <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <TouchableOpacity onPress={()=>navigation.navigate('XinNghi')} style={{alignItems:'center'}}>
          <Ionicons name="document-text" size={45} color="#10F0FE" /> 
        <Text allowFontScaling={false}style={{color:'black', fontSize:15, fontWeight:500}}>
        Xin Nghỉ
        </Text>
        </TouchableOpacity>
        </View>
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <TouchableOpacity onPress={()=>navigation.navigate('TinTuc')} style={{alignItems:'center'}}>
          <Ionicons name="newspaper-sharp" size={45} color="#08DCEA" /> 
        <Text allowFontScaling={false}style={{color:'black', fontSize:15, fontWeight:500}}>
        Tin Tức
        </Text>
        </TouchableOpacity>
        </View>
        
    </View>
    <View style={{flex:1,flexDirection:'row'}}>
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <TouchableOpacity onPress={()=>navigation.navigate('Albums')} style={{alignItems:'center'}}>
          <Ionicons name="images" size={45} color="#8F14C8" /> 
        <Text allowFontScaling={false}style={{color:'black', fontSize:15, fontWeight:500}}>
        Albums
        </Text>
        </TouchableOpacity>
        </View>
       <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <TouchableOpacity onPress={()=>navigation.navigate('DichVu')} style={{alignItems:'center'}}>
                <Ionicons name="basket" size={45} color="#1227E5" /> 
        <Text allowFontScaling={false}style={{color:'black', fontSize:15, fontWeight:500}}>
        Dịch vụ
        </Text>
        </TouchableOpacity>
        </View>
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <TouchableOpacity onPress={()=>navigation.navigate('NhanXet')} style={{alignItems:'center'}}>
                  <Ionicons name="bookmarks" size={45} color="red" /> 
        <Text allowFontScaling={false}style={{color:'black', fontSize:15, fontWeight:500}}>
        Nhận xét
        </Text>
        </TouchableOpacity>
        </View>
        
        
    </View>
    <View style={{flex:1,flexDirection:'row'}}>
       
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <TouchableOpacity onPress={()=>navigation.navigate('DanhGia')} style={{alignItems:'center'}}>
                  <Ionicons name="book-outline" size={45} color="#FF9900" /> 
        <Text allowFontScaling={false}style={{color:'black', fontSize:15, fontWeight:500}}>
        Đánh giá
        </Text>
        </TouchableOpacity>
        </View>
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          {/* <TouchableOpacity onPress={()=>navigation.navigate('DanhGia')} style={{alignItems:'center'}}>
                  <Ionicons name="book-outline" size={45} color="#FF9900" /> 
        <Text allowFontScaling={false}style={{color:'black', fontSize:15, fontWeight:500}}>
        Đánh giá
        </Text>
        </TouchableOpacity> */}
        </View>
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          {/* <TouchableOpacity onPress={()=>navigation.navigate('DanhGia')} style={{alignItems:'center'}}>
                  <Ionicons name="book-outline" size={45} color="#FF9900" /> 
        <Text allowFontScaling={false}style={{color:'black', fontSize:15, fontWeight:500}}>
        Đánh giá
        </Text>
        </TouchableOpacity> */}
        </View>
    </View>
    </View>
    <View style={{flex:1}}>
    <View style={{marginTop:5,flexDirection:'row', marginLeft:5}}>
      <Ionicons name="newspaper-outline" size={27} color="#08DCEA" /> 
      
        <Text allowFontScaling={false}style={{color:'black', fontSize:20, fontWeight:900}}>
        Tin tức nhà trường
        </Text>
    </View>
      <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ width: screenWidth }}
    >
     {data.length > 0 ? (
  data.map((item, index) => (
    <TouchableOpacity
      key={item.id}
      style={{ flexDirection: 'row', width: screenWidth, height: 'auto' }}
      onPress={() =>
        navigation.navigate('NewAndBlogDetail', { dataProps: item })
      }
    >
      <View style={styles.blockList} key={index}>
        <Image
          style={{ flex: 0.8, height: '85%', borderRadius:20,marginLeft:5,borderWidth:1,borderColor:'#08DCEA' }}
          source={{
            uri: item.url_image,
          }}
        />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text
          allowFontScaling={false}
            style={{
              fontWeight: '600',
              color: 'black',
              fontSize: Sizes.h5,
            }}
            numberOfLines={3}
          >
            {item.title}
          </Text>
          <Text
          allowFontScaling={false}
            style={{
              fontWeight: '600',
              color: 'gray',
              fontSize: Sizes.h6,
            }}
            numberOfLines={4}
          >
            {item.note}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  ))
) : (
  <Text allowFontScaling={false}>Không có dữ liệu</Text>
)}

    </ScrollView>
    </View>
    <View style={{flex:1}}>
    <View style={{marginTop:5,flexDirection:'row', marginLeft:5}}>
      <Ionicons name="gift-outline" size={27} color="#FBA534" /> 
        <Text allowFontScaling={false}style={{color:'black', fontSize:20, fontWeight:900}}>
        Sản phẩm cho bé 
        </Text>
        
    </View>
        <View >
        <ScrollView horizontal={true}>
           

            {product.length > 0 ? (
  product.map((item, index) => (
    <TouchableOpacity
      key={index}
      style={{ flexDirection: 'row', width: screenWidth/2, height: 'auto' }}
      onPress={() =>
        navigation.navigate('ProductDetail', { dataProps: item })
      }
    >
     
     <View style={{paddingHorizontal:5,width:screenWidth/2,justifyContent:'center',alignItems:'center'}}>
              
               <Image
          style={{ width:'90%', height: '70%', borderRadius:20}}
          source={{
            uri: item.image,
          }}
        />
            <Text allowFontScaling={false}style={{color:'black',fontSize:15,marginVertical:5}}>{item.title}</Text>
            </View>

    </TouchableOpacity>
  ))
) : (
  <Text allowFontScaling={false}>Không có dữ liệu</Text>
)}
      
        </ScrollView>
        </View>
    </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#F5F5F5',
  },
  menu: {
    flexDirection: 'row',
    paddingHorizontal: 7,
    paddingVertical: 7,
    marginTop: 10,
    width: '100%',
    height: '20%',
    justifyContent: 'space-around',
  },
  menu1: {
    flexDirection: 'row',
    paddingHorizontal: 7,
    paddingVertical: 7,

    width: '100%',
    height: '20%',
    justifyContent: 'space-around',
  },
  header: {
    backgroundColor: '#FFFFCC',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    textAlign: 'center',
    fontSize: 15,
    alignItems: 'center',
    color: 'black',
  },
  content: {
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#FFFFCC',
  },
  icon: {
    width: '34%',
    height: '60%',
    borderRadius: 29,
    overflow: 'hidden',
    borderColor: 'black',
   
    marginHorizontal: 10,
    marginVertical: 5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderEndEndRadius:10
  },
  textIcon: {
    color: 'black',
    marginHorizontal: 30,
  },
  head: {height: 30, backgroundColor: '#f1f8ff'},
  text: {textAlign: 'center', color: 'black'},
  wrapper: {flexDirection: 'row'},
  title: {flex: 1, backgroundColor: '#f6f8fa'},
  row: {height: 30},
  blockList: {
    height: 'auto',
    width: '95%',
  
    paddingVertical: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 10,
   
    flexDirection: 'row',
   
  },
  blockList1: {
    height: 'auto',
    width: '95%',
    flex: 0.5,
    paddingVertical: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 10,
    
    flexDirection: 'row',
   
  },
});
export default TinhNang;
