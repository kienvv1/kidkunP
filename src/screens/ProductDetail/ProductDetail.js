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
const ProductDetail = ({navigation, route}) => {

  const contentWidth = useWindowDimensions().width;
  const datas = route.params?.dataProps;

  const {data, isLoading} = useQuery(['NewProductDetail'], async () => {
    
    
    const detail = await FetchApi.getProductDetail(datas.id);
    return detail;
  });

  if (isLoading) {
    return <Loading />;
  }
  // const isDarkMode = code === 'dark';
  return (
    <ScrollView
      style={{padding: Sizes.padding, backgroundColor: '#F5F5F5'}}
      contentContainerStyle={{paddingBottom: 60}}>
      <View
        style={{
          height:50,
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
        <Text allowFontScaling={false}style={{color: 'black', fontSize: 20}}>Chi tiết</Text>
        <Ionicons name={'add-circle-sharp'} size={30} color={'#F5F5F5'} />
      </View>
      <HTML
        containerStyle={{flex: 1, width: '100%'}}
        ignoredStyles={['height', 'display', 'width']}
        contentWidth={contentWidth}
        source={{html: data?._data?.content?.content}}
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

export default ProductDetail;
