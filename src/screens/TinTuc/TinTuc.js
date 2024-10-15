import * as React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Sizes} from '../../utils/resource';
import {FetchApi} from '../../utils/modules';
import {useQuery} from 'react-query';
import {Loading} from '../../elements';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const TinTuc = ({navigation}) => {
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
  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      
        <View
          style={{
            height: 50,
           
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
          <Text allowFontScaling={false}style={{color: 'black', fontSize: 20}}>Tin Tức</Text>
          <Ionicons name={'add-circle-sharp'} size={30} color={'#F5F5F5'} />
        </View>
        <ScrollView>
        {(data || []).map((item, index) => {
          return (
            <TouchableOpacity
              key={item.id}
              style={{flexDirection: 'row'}}
              onPress={() =>
                navigation.navigate('NewAndBlogDetail', {dataProps: item})
              }>
              <View style={styles.blockList} key={index}>
                <Image
                  style={{width: 140, height: 100,borderRadius:10}}
                  source={{
                    uri: item.url_image,
                  }}
                />
                <View style={{flex: 1, marginLeft: 10}}>
                  <Text
                  allowFontScaling={false}
                    style={{
                      fontWeight: '600',
                      color: 'black',
                      fontSize: Sizes.h5,
                    }}
                    multipleLines={true}
                    numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text
                  allowFontScaling={false}
                    style={{
                      fontWeight: '600',
                      color: 'gray',
                      fontSize: Sizes.h6,
                    }}
                    multipleLines={true}
                    numberOfLines={4}>
                    {item.note}
                  </Text>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
   
  },
  blockList: {
   
    height: 'auto',
    width: '90%',
    paddingHorizontal: 0,
    paddingVertical: 5,
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
  },
});
export default TinTuc;
