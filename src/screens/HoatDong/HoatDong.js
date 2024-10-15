import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {Sizes} from '../../../utils/resource';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import {FetchApi} from '../../utils/modules';
import {Loading} from '../../elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HoatDong = ({navigation}) =>{
    const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [text, setText] = useState('Empty');
  const [expandedSections, setExpandedSections] = useState([]);
  const [id, setId] = useState('');
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate = 'Tháng ' + (tempDate.getMonth() + 1);
    setText(fDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };
  const options = {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  };

  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };
  const studentId = useSelector(state => state?.data?.data?._id);
  useEffect(() => {
    const saveStudentId = async () => {
      try {
        if (studentId) {
          await AsyncStorage.setItem('studentId', studentId.toString());
          console.log('Đã lưu mã sinh viên thành công.');
        } else {
          console.log('Lưu mã sinh viên thất bại.');
        }
      } catch (error) {
        console.error('Lỗi khi lưu mã sinh viên:', error);
      }
    };

    saveStudentId();
  }, []);
  const {data, isLoading} = useQuery(
    ['NewActive', formatDate(date)],
    async () => {
      const ID = await AsyncStorage.getItem('studentId');
      let updatestudenID;
      if (ID) {
        updatestudenID = ID;
      } else {
        updatestudenID = studentId;
      }
      const active = await FetchApi.getActive(updatestudenID, formatDate(date));
      return active;
    },
  );
    console.log('test active: ', data);
  if (isLoading) {
    return <Loading />;
  }

  const insets = useSafeAreaInsets();

  const state = {
    tableHead: ['Thời gian', 'Nội dung'],
    tableData: (data?._data?.data_info || []).map((item, index) => [
      item.start_time + ' - ' + item.end_time,
      item.note,
    ]),
  };
  const calculateRowHeight = rowData => {
    const contentHeight = Math.max(...rowData.map(item => item.length));
    return contentHeight * 1;
  };
  const rowHeights = state.tableData.map(rowData =>
    calculateRowHeight(rowData),
  );

  const toggleExpanded = sectionId => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter(id => id !== sectionId));
    } else {
      setExpandedSections([...expandedSections, sectionId]);
    }
  };
       return(
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
          <Text style={{color: 'black', fontSize: 20}}>Hoạt động</Text>
          <Ionicons name={'add-circle-sharp'} size={30} color={'white'} />
        </View>
           <TouchableOpacity onPress={() => showMode('date')}>
        <View
          style={{
            height: 50,
            width: '60%',
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderRadius: 15,
            backgroundColor: '#96CD49',
            marginVertical: 20,
            // marginHorizontal: 30,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Ionicons name={'alarm-outline'} size={30} color={'white'} />
          <Text style={{color: 'white'}}>
            {date.toLocaleDateString('vi-VN', options)}
          </Text>
        </View>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
      <View
        style={{
          height: '70%',
          width: '100%',
          paddingHorizontal: 5,
          borderRadius: 15,
          backgroundColor: 'white',
          marginVertical: -10,
          marginHorizontal: 15,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{color: '#96CD49', fontSize: 20, fontWeight: 'bold'}}>
          HOẠT ĐỘNG TRONG NGÀY
        </Text>

        <View
          style={{
            height: '100%',
            width: '100%',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 15,
            backgroundColor: 'white',
            justifyContent: 'space-between',
          }}>
          <ScrollView>
            {!data?._data?.data_info || data._data.data_info.length === 0 ? (
              <Text
                style={{
                  color: 'black',
                  textAlign: 'center',
                }}>
                Bé Chưa có hoạt động
              </Text>
            ) : (
              data._data.data_info.map(section => (
                <View
                  style={{
                    borderColor: '#00FF00',
                    flexDirection: 'row',
                  }}
                  key={section.id}>
                  <View
                    style={{
                      borderWidth: 1,
                      
                      width: '100%',
                      marginVertical: 5,
                      borderRadius: 10,
                    }}>
                    <View key={section.id}>
                      <TouchableOpacity
                        onPress={() => toggleExpanded(section.id)}>
                        <View style={styles.header}>
                          <Text style={styles.headerText}>
                            {section.start_time + ' - ' + section.end_time}
                          </Text>
                          <Text style={styles.headerText}>{section.title}</Text>
                          <Ionicons
                            name={
                              expandedSections.includes(section.id)
                                ? 'chevron-up'
                                : 'chevron-down'
                            }
                            size={15}
                            color="black"
                            marginTop={2}
                          />
                        </View>
                      </TouchableOpacity>
                      {expandedSections.includes(section.id) && (
                        <View style={styles.content}>
                          <Text style={{textAlign: 'center', color: 'black'}}>
                            {section.note}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>
        </View>
       )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#F5F5F5',
    },
    menu: {
      flexDirection: 'row',
      paddingHorizontal: 7,
      paddingVertical: 7,
      marginTop: 10,
      width: '100%',
      height: '17%',
      justifyContent: 'space-around',
    },
    menu1: {
      flexDirection: 'row',
      paddingHorizontal: 7,
      paddingVertical: 7,
  
      width: '100%',
      height: '17%',
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
      width: '35%',
      height: '60%',
      borderRadius: 25,
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
  });
export default HoatDong