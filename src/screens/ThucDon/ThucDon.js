import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Sizes} from '../../utils/resource';

import {Loading} from '../../elements';
import {useQuery} from 'react-query';
import {FetchApi} from '../../utils/modules';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThucDon = ({navigation}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShowPicker(true);
  };
  const studentId = useSelector(state => state?.data?.data?._id);
  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };
  const {data, isLoading} = useQuery(
    ['NewThucDon', formatDate(date)],
    async () => {
      const ID = await AsyncStorage.getItem('studentId');
      let updatestudenID;
      if (ID) {
        updatestudenID = ID;
      } else {
        updatestudenID = studentId;
      }

      const menu = await FetchApi.getMenusDay(updatestudenID, formatDate(date));
      return menu;
    },
  );

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
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
         
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name={'arrow-back-outline'} size={30} color={'black'} />
          </TouchableOpacity>
          <Text allowFontScaling={false}style={{color: 'black', fontSize: 20}}>Thực Đơn</Text>
          <Ionicons name={'add-circle-sharp'} size={30} color={'#F5F5F5'} />
        </View>

        <TouchableOpacity style={{alignItems:'center'}}  onPress={showDatepicker}>
          <View
            style={{
              height: 50,
           
              width: '90%',
              paddingHorizontal: 15,
              paddingVertical: 10,
              // marginHorizontal: 30,
              marginVertical: 10,
              borderRadius: 10,
              backgroundColor: '#0298D3',
              // marginTop: insets.top,
              flexDirection: 'row',
              // alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Ionicons name={'calendar-outline'} size={30} color={'white'} />
            <Text
            allowFontScaling={false}
              style={{
                color: 'white',
                fontSize: 16,
                marginVertical: 5,
                marginHorizontal: 18,
              }}>
              {data.day_at}
            </Text>
          </View>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="inline"
            onChange={onChange}
          />
        )}
        <ScrollView>
        {(data.meal || []).map((item, index) => {
          
          return (
            
            <React.Fragment key={index}>
              
              {/* Lặp qua thuộc tính của "food_op" */}
              {Object.keys(item.food_op || {}).map(foodKey => {
                const images = item?.food_op[foodKey]?.image;
                let imagess=null;
                if(images === ""){
                  imagess = 'https://cdn-icons-png.flaticon.com/512/5470/5470133.png'
                }else if(images === null){
                  imagess = 'https://cdn-icons-png.flaticon.com/512/5470/5470133.png'
                }else{
                  imagess = images
                }
                return (
                  <View  key={foodKey}>
                    <View style={{marginTop:15}}>
                  <Text allowFontScaling={false}style={{color: '#0298D3',fontSize:17,fontWeight:500, marginHorizontal: 20}}>
                {item?.meal_title}
              </Text>
                  </View>
                  <View style={{alignItems:'center'}}>
                  <View style={styles.blockList} key={foodKey}>
                  
                    <Image
                      style={{width: '35%', height: 86, borderRadius: 10}}
                      source={{
                        uri: imagess 
                         
                      }}
                    />
                    <View
                      style={{
                        flex: 1,
                        marginLeft: 18,
                       
                      }}>
                      <Text
                      allowFontScaling={false}
                        style={{
                          fontWeight: '600',
                          color: 'black',
                          fontSize: Sizes.h6,
                        }}
                        multipleLines={true}
                        numberOfLines={10}>
                        {item.food_op[foodKey].title}
                      </Text>
                      <Text
                        style={{
                          fontWeight: '600',
                          color: 'gray',
                          fontSize: Sizes.h6,
                        }}
                        multipleLines={true}
                        numberOfLines={3}>
                        {item.food_op[foodKey].note}
                      </Text>
                    </View>
                  </View>
                  </View>
                  </View>
                );
              })}
            </React.Fragment>
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
    // justifyContent: 'flex-start',
    alignContent:'center',
    
  },
  blockList: {
   
    height: 'auto',
    width: '90%',
   
    paddingBottom:5,
    
    // marginHorizontal: 20,
    // marginLeft:10,
    marginVertical: 10,
    borderColor:'#0298D3',
    
    flexDirection: 'row',
  },
});
export default ThucDon;
