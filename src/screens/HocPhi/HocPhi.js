import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Sizes} from '../../utils/resource';
import {Image} from 'react-native-ui-lib';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Table,
  TableWrapper,
  Row,
  Col,
  Cell,
} from 'react-native-table-component';
import {useSelector} from 'react-redux';
import {Loading} from '../../elements';
import {FetchApi} from '../../utils/modules';
import {useQuery} from 'react-query';
import SelectDropdown from 'react-native-select-dropdown';
const HocPhi = ({navigation,route}) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [text, setText] = useState('Empty');

  const [selectedItem, setSelectedItem] = useState(null);
  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${month}${year}`;
  };
  const [months, setMonths] = useState(formatDate(date));
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
  const options = {month: 'long'};

  const studentId = useSelector(state => state?.data?.data?._id);

  const {data, isLoading} = useQuery(['NewFee', months], async () => {
    const ID = await AsyncStorage.getItem('studentId');
    let updatestudenID;
    if (ID) {
      updatestudenID = ID;
    } else {
      updatestudenID = studentId;
    }
    const feeData = await FetchApi.getFee(updatestudenID, months);
    return feeData;
  });
  const datas = route.params?.dataProps;
  const {datass} = useQuery(['NewNotificationDetail'], () =>
    FetchApi.getNotificationDetail(datas.notification_id),
  );
  if (isLoading) {
    return <Loading />;
  }
  const data_info = data._data.data_infos;
  let data1 = 'null';
  let data2 = 'null';
  let data3 = 'null';
  let data4 = 'null';
  let data5 = 'null';
  if (data_info !== null) {
    data1 = data_info.dukien;
    data2 = data_info.duthangtruoc;
    data3 = data_info.tongnop;
    data4 = data_info.danop;
    data5 = data_info.hoantra;
  } else {
    data1 = '';
    data2 = '';
    data3 = '';
    data4 = '';
    data5 = '';
  }

  const tableDatas = [
    {name: 'John', age: '28', occupation: 'Developer'},
    {name: 'Jane', age: '24', occupation: 'Designer'},
    {name: 'Mike', age: '32', occupation: 'Manager'},
  ];
  const state = {
    tableHead: ['Tên phí', 'Số lượng', 'Thành Tiền(vnđ)'],
    tableData: [
      ['Ăn sáng', '26', '260000'],
      ['Ăn trưa', '26', '780000'],
      ['Học phí', '1', '3000000'],
      ['ngoại khóa','1', '200000'],
    ],
  };

  const state2 = {
    tableHead2: [
      'Dự kiến của tháng: ',
      'Số nợ kỳ trước: ',
      'Hoàn trả tháng trước: ',
      'Tổng thanh toán: ',
      'Đã thanh toán: ',
    ],
    tableData: [data1, data2, data5, data3, data4],
  };
  const formatCurrencyVND = number => {
    return new Intl.NumberFormat('vi-VN').format(number);
  };
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
    'Tháng 1': '01'+currentYear,
    'Tháng 2': '02'+currentYear,
    'Tháng 3': '03'+currentYear,
    'Tháng 4': '04'+currentYear,
    'Tháng 5': '05'+currentYear,
    'Tháng 6': '06'+currentYear,
    'Tháng 7': '07'+currentYear,
    'Tháng 8': '08'+currentYear,
    'Tháng 9': '09'+currentYear,
    'Tháng 10': '10'+currentYear,
    'Tháng 11': '11'+currentYear,
    'Tháng 12': '12'+currentYear,
  };
  const onSelect = (selectedItem, index) => {
    setSelectedItem(selectedItem);
    const selectedValue = valueMapping[selectedItem]; // Lấy giá trị tương ứng
    setMonths(selectedValue);
  };

  return (
    <View style={styles.container}>
      
        <View
          style={{
            height: 50,
            paddingHorizontal: 15,
            paddingVertical: 10,

            // marginTop: insets.top,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name={'arrow-back-outline'} size={30} color={'black'} />
          </TouchableOpacity>
          <Text allowFontScaling={false}style={{color: 'black', fontSize: 20}}>HỌC PHÍ</Text>
          <Ionicons name={'add-circle-sharp'} size={30} color={'#F5F5F5'} />
        </View>
        <ScrollView>
        <View
          style={{
            alignItems: 'center',
            paddingBottom: 15,
      
          }}>
          <View style={styles.image}>
            <Image
              source={{
                uri: data._data.user_info.avatar_url,
              }}
              style={styles.avatar}
            />
          </View>

          <Text allowFontScaling={false}style={{color: 'black', fontSize: 16, marginHorizontal: 20}}>
            {data._data.user_info.first_name +
              ' ' +
              data._data.user_info.last_name}
          </Text>
        </View>

        <View style={styles.date}>
          <SelectDropdown
            data={month}
            buttonStyle={{backgroundColor: '#0298D3',borderRadius: 100,height:'auto',width:'auto'}}
            style={{borderWidth: 1,color:'white'}}
            defaultButtonText={getCurrentMonth()}
            buttonTextStyle={{fontSize: 16, color: 'white' }}
            onSelect={onSelect}
            defaultValueByIndex={month.indexOf(selectedItem)}
          />
        </View>

        {/* {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="spinner"
            onChange={onChange}
          />
        )} */}

        <Table style={styles.table}>
          <Row
          allowFontScaling={false}
            data={state.tableHead}
            flexArr={[3.8, 2.7, 3]}
            style={styles.head}
            textStyle={styles.text}
          />
          {(data?._data?.fee || []).map((rowData, index) => (
            <TableWrapper  key={index} style={styles.wrapper}>
              <Cell allowFontScaling={false} data={rowData.se} textStyle={{...styles.text3}} />
              <Cell
              allowFontScaling={false}
                data={formatCurrencyVND(rowData.by_number)}
                textStyle={{...styles.text1}}
              />
              <Cell
              allowFontScaling={false}
                data={formatCurrencyVND(rowData.unit_price)}
                textStyle={{...styles.text2}}
              />
            </TableWrapper>
          ))}
        </Table>

        
         { state2.tableData[0] === ""
         ?
         (null)
         :
         (
          <Table style={styles.table}>
          <TableWrapper style={styles.wrapper1}>
            <Col
            allowFontScaling={false}
              data={state2.tableHead2}
              style={styles.title}
              heightArr={[30, 30, 30, 30, 30]}
              textStyle={styles.titleText}></Col>
            <Col
            allowFontScaling={false}
              data={state2.tableData}
              heightArr={[30, 30, 30, 30, 30]}
              textStyle={styles.text2}
            />
          </TableWrapper>
        </Table>
         )}
       
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    marginHorizontal: 15,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  date: {
    justifyContent: 'center',
    backgroundColor: '#0298D3',
    height: 30,
    marginHorizontal: 120,
    borderRadius: 100,
    alignItems: 'center',
    marginBottom: 20,

  },
  text1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  image: {
    height: 70,
    width: 70,
    borderRadius: 50, // Đặt borderRadius thành nửa kích thước để làm hình ảnh tròn
    overflow: 'hidden', // Giữ cho hình ảnh không bị tràn ra khỏi khung
    marginBottom: 10,

  },
  avatar: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  table: {
    flex: 1,
    backgroundColor: '#fff',
    // borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 10,
  
   
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
    padding:5

  
  },
  singleHead: {width: 80, height: 40, backgroundColor: '#c8e1ff'},
  wrapper: {
    flexDirection: 'row',
    borderWidth: 0.2,
    borderTopColor: 'white',
    borderLeftColor: 'white',
    borderRightColor: 'white',
    borderBottomColor: '#0298D3',
    padding:6,
  },
  wrapper1: {
    flexDirection: 'row',
    borderWidth: 0.2,
    borderTopColor: 'white',
    borderLeftColor: 'white',
    borderRightColor: 'white',
    borderBottomColor: '#0298D3',
    
  },
  title: {flex: 1, backgroundColor: '#f6f8fa', marginHorizontal: 15},
  row: {height: 28},
  text: {color: 'black', fontSize: 15},
  text1: {textAlign: 'center', color: 'black', fontSize: 14},
  text2: {textAlign: 'right', color: 'black', fontSize: 14},
  text3: {color: 'black', fontSize: 14,},
  titleText: {color: 'black'},
});
export default HocPhi;
