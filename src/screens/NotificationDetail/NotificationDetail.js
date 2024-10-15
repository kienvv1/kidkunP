import React from 'react';
import {
  ScrollView,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import {useQuery} from 'react-query';
import {FetchApi} from '../../utils/modules';
import {Sizes} from '../../utils/resource';
import HTML from 'react-native-render-html';
import {Loading} from '../../elements';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
const NotificationDetail = ({navigation, route}) => {
  const contentWidth = useWindowDimensions().width;
  const datas = route.params?.dataProps;
  const {data, isLoading} = useQuery(['NewNotificationDetail'], () =>
    FetchApi.getNotificationDetail(datas.notification_id),
  );

  if (isLoading) {
    return <Loading />;
  }
  // const isDarkMode = code === 'dark';
  return (
    <ScrollView
      style={{padding: Sizes.padding, backgroundColor: 'white'}}
      contentContainerStyle={{paddingBottom: 60}}>
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
        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
          <Ionicons name={'arrow-back-outline'} size={30} color={'black'} />
        </TouchableOpacity>
        <Text style={{color: 'black', fontSize: 20}}>CHI TIẾT THÔNG BÁO</Text>
        <Ionicons name={'add-circle-sharp'} size={30} color={'white'} />
      </View>
      <HTML
        containerStyle={{flex: 1, width: '100%'}}
        ignoredStyles={['height', 'display', 'width']}
        contentWidth={contentWidth}
        source={{html: data?._data?.content}}
        baseStyle={{color: 'black'}}
        // tagsStyles={{
        //   p: {color: 'black'},
        //   h1: {color: 'black'},
        //   span: {color: 'black'},
        // }}
        ignoredDomTags={['source']}
      />
    </ScrollView>
  );
};

export default NotificationDetail;
