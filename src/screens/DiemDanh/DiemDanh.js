import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Input,
  Button,
  StyleSheet,
  Image,
  SafeAreaView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Pressable,
} from 'react-native';


import {FetchApi} from '../../utils/modules';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Loading} from '../../elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import SelectDropdown from 'react-native-select-dropdown';
const DiemDanh = ({navigation}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [date, setDate] = useState(new Date());
  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}${month}`;
  };
  const [months, setMonths] = useState(formatDate(date));
  
  const studentId = useSelector(state => state?.data?.data?._id);
  const {data, isLoading} = useQuery(
    ['NewAttendance', months],
    async () => {
      const ID = await AsyncStorage.getItem('studentId');
      let updatestudenID;
      if (ID) {
        updatestudenID = ID;
      } else {
        updatestudenID = studentId;
      }
      const attendance = await FetchApi.getAttendance(updatestudenID, months);
      return attendance;
    },
  );
  
  if (isLoading) {
    return <Loading />;
  }
  let count = 0;
  (data._data || []).map((item, index) => {
    // console.log('test attendance', item);
    count++;
  })
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const getCurrentMonth = () => {
    const currentDate = new Date();
    const monthNames = [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12',
    ];
    const currentMonth = monthNames[currentDate.getMonth()];
    return currentMonth;
  };
  
  const month = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ];
  const valueMapping = {
    'Tháng 1': currentYear+'01',
    'Tháng 2': currentYear+'02',
    'Tháng 3': currentYear+'03',
    'Tháng 4': currentYear+'04',
    'Tháng 5': currentYear+'05',
    'Tháng 6': currentYear+'06',
    'Tháng 7': currentYear+'07',
    'Tháng 8': currentYear+'08',
    'Tháng 9': currentYear+'09',
    'Tháng 10': currentYear+'10',
    'Tháng 11': currentYear+'11',
    'Tháng 12': currentYear+'12',
  };
  const onSelect = (selectedItem, index) => {
    setSelectedItem(selectedItem);
    const selectedValue = valueMapping[selectedItem]; // Lấy giá trị tương ứng
  
    setMonths(selectedValue);
  };
  const formatTimeToHHMM = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    return formattedTime;
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
            height: 50,
            width:'100%',
          
            paddingHorizontal: 15,
            paddingVertical: 10,
            backgroundColor: 'white',
            // marginTop: insets.top,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name={'arrow-back-outline'} size={30} color={'black'} />
          </TouchableOpacity>
          <Text style={{color: 'black', fontSize: 20}}>Điểm danh</Text>
          <Ionicons name={'add-circle-sharp'} size={30} color={'white'} />
        </View>
        <View style={styles.date}>
          <SelectDropdown
            data={month}
            buttonStyle={{backgroundColor: '#48E958', borderRadius:7}}
           
            defaultButtonText={getCurrentMonth() }
            onSelect={onSelect}
            defaultValueByIndex={month.indexOf(selectedItem)}
          />
        </View>
        <View style={{marginLeft:10, marginBottom:5}}>
          
          <Text style={{fontSize:19}}>
            Số ngày đi học: {count}
          </Text>
        </View>
        <ScrollView>
        {(data._data || []).map((item, index) => {
          return(
            <View style={styles.list} key={index}>
            <View
              style={{
                borderRadius: 10,
                backgroundColor: 'white',
                marginTop: 10,
                marginHorizontal: 10,
                padding: 5,
                borderWidth: 1,
                shadowColor: '#171717',
                shadowOffset: {width: -2, height: 4},
                shadowOpacity: 0.2,
                shadowRadius: 3,
                elevation: 11,
                borderColor: '#0298D3',
              }}>
              <View
                style={{
                  
               
                  height:'auto'
                }}>
                  <View style={{ flexDirection: 'row'}}>
                  <Icon name="clock-o" size={20} color="#0298D3" />
                  <Text style={{color: 'black'}}> Ngày: {formatDateToDDMMYYYY(item.login_at)}</Text>
                </View>
                <View style={{ flexDirection: 'row'}}>
                  
                  <Text style={{color: 'black'}}> Đến lúc: {formatTimeToHHMM(item.login_at)}</Text>
                </View>
                <View style={{ flexDirection: 'row'}}>

                  <Text style={{color: 'black'}}> Về lúc: {formatTimeToHHMM(item.logout_at)}</Text>
                </View>
              </View>
             
              
            </View>
          </View>
          )
         })}
       </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    
  },
  info: {
    marginHorizontal: 15,
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    height: 125,
  },
  date: {
    marginVertical: 10,
    
    alignItems:'center',
    justifyContent:'center',
    flexDirection: 'row',
   
  },
  count: {
    marginVertical: 10,
    marginHorizontal: 7,
    flexDirection: 'row',
  },
  items: {
    borderWidth: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: 7,
    borderColor: '#0298D3',
    marginHorizontal: 2,
    height: 60,
  },
  button: {
    width: '50%',
    height: 40,
    backgroundColor: '#0298D3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  list: {
   
    height: 'auto',
  },
  image: {
    flex: 1,
    width: '35%',
    height: 'auto',
  },
  content: {
    flex: 2.5,
  },

});
export default DiemDanh;
