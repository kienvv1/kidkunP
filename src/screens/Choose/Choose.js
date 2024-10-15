import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Image} from 'react-native-ui-lib';
import {Loading} from '../../elements';
import {useQuery} from 'react-query';
import {FetchApi} from '../../utils/modules';
const ChonCon = ({navigation}) => {
  const {data, isLoading} = useQuery(['NewStudent'], () => FetchApi.home());
  if (isLoading) {
    return <Loading />;
  }
  return (
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
        alignItems: 'center',
      }}>
      <View style={styles.image}>
        <Image
          source={require('../../utils/Images/Background.png')}
          style={styles.avatar}
        />
      </View>
      <Text allowFontScaling={false} style={styles.text1}>Thông tin của bé</Text>

      {(data._data || []).map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate('SlideDraw', {dataprops: item})}>
            <View style={styles.choose}>
              <Image
                source={{
                  uri: item.avatar_url,
                }}
                style={{width: 70, height: 70, marginRight: 30, borderRadius:100}}
              />
              <Text allowFontScaling={false} style={styles.textch}>{item.student_name}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  text1: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    paddingBottom: 20,
  },
  image: {
    overflow: 'hidden', // Giữ cho hình ảnh không bị tràn ra khỏi khung
    marginTop: 50,
    
    marginTop:100,
  },
  avatar: {
    width: 270,
    height: 200,
  },
  choose: {
    justifyContent: 'center',
    backgroundColor: '#0298D3',
    height: 'auto',
    width: '90%',

    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
  },
  textch: {
    flex: 0.9,
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
});
export default ChonCon;
