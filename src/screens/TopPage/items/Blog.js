import * as React from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import {useQuery} from 'react-query';
import {Sizes} from '../../../utils/resource';
import {FetchApi} from '../../../utils/modules';

const Blog = ({navigation}) => {
  const {data, isLoading} = useQuery('useGetNewsType', () =>
    FetchApi.getNewsType(1),
  );
  //   if (isLoading) {
  //     return <Loading />;
  //   }
  return (
    <ScrollView>
      {(data || []).map((item, index) => {
        return (
          <TouchableOpacity
            key={item.id}
            style={{padding: 10, flexDirection: 'row'}}
            onPress={() =>
              navigation.navigate('NewAndBlogDetail', {dataProps: item})
            }>
            <Image
              style={{
                width: Sizes.width(32),
                height: Sizes.width(32),
                marginRight: 10,
              }}
              source={{
                uri: item.file_name,
              }}
            />
            <View style={{flex: 1}}>
              <Text
                style={{fontWeight: '600', color: 'black', fontSize: Sizes.h5}}
                multipleLines={true}
                numberOfLines={2}>
                {item.title}
              </Text>
              <Text
                style={{fontWeight: '600', color: 'gray', fontSize: Sizes.h6}}
                multipleLines={true}
                numberOfLines={3}>
                {item.note}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};
export default Blog;
