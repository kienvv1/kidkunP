import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Sizes} from '../../utils/resource';
import {Image} from 'react-native-ui-lib';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from 'react-native-table-component';
import {useSelector} from 'react-redux';
import {Loading} from '../../elements';
import {FetchApi} from '../../utils/modules';
import {useQuery} from 'react-query';
const DichVu = ({navigation}) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [text, setText] = useState('Empty');

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
  const studentId = useSelector(state => state?.data?.data?._id);
  const {data, isLoading} = useQuery(['NewService'], async () => {
    const ID = await AsyncStorage.getItem('studentId');
    let updatestudenID;
    if (ID) {
      updatestudenID = ID;
    } else {
      updatestudenID = studentId;
    }
    const service = await FetchApi.getServices(updatestudenID);
    return service;
  });

  if (isLoading) {
    return <Loading />;
  }
  const state = {
    tableHead: ['Tên dịch vụ', 'Số lượng', 'Giá Tiền(vnđ)'],
    tableData: [
      ['Ăn sáng', '26', '260000'],
      ['Ăn trưa', '26', '780000'],
      ['Học phí', '1', '3000000'],
      ['ngoại khóa', '1', '200000'],
    ],
  };
  const formatCurrencyVND = number => {
    return new Intl.NumberFormat('vi-VN').format(number);
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
          <Text allowFontScaling={false}style={{color: 'black', fontSize: 20}}>Dịch Vụ</Text>
          <Ionicons name={'add-circle-sharp'} size={30} color={'#F5F5F5'} />
        </View>
        <ScrollView>
        <View
          style={{
            alignItems: 'center',
            paddingBottom: 15,
            margin: 10,
          }}>
          <View style={styles.image}>
            <Image
              source={{
                uri: data._data.user_info.avatar_url,
              }}
              style={styles.avatar}
            />
          </View>

          <Text allowFontScaling={false}style={{color: 'black', fontSize: 17, marginHorizontal: 20}}>
            {data._data.user_info.first_name +
              ' ' +
              data._data.user_info.last_name}
          </Text>
        </View>

        {/* <View style={styles.date}>
          <Text allowFontScaling={false}onPress={() => showMode('date')} style={styles.text1}>
            {text}
          </Text>
        </View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )} */}

        <Table style={styles.table}>
          <Row
          allowFontScaling={false}
            data={state.tableHead}
            flexArr={[3.2, 2.5, 2]}
            style={styles.head}
            textStyle={styles.text1}
          />
          {(data._data.data_info || []).map((rowData, index) => (
            <TableWrapper key={index} style={styles.wrapper}>
              <Cell allowFontScaling={false} data={rowData.title} textStyle={styles.text1} />
              <Cell allowFontScaling={false} data={rowData.status} textStyle={styles.text} />
              <Cell
              allowFontScaling={false}
                data={formatCurrencyVND(rowData.price)}
                textStyle={styles.text2}
              />
            </TableWrapper>
          ))}
        </Table>
        {/* 
        <Table style={styles.table} borderStyle={{borderWidth: 1}}>
          <TableWrapper style={styles.wrapper}>
            <Col
              data={state2.tableHead2}
              style={styles.title}
              heightArr={[30, 30, 30]}
              textStyle={styles.titleText}></Col>
            <Col
              data={state2.tableData}
              heightArr={[30, 30, 30]}
              textStyle={styles.text}
            />
          </TableWrapper>
        </Table> */}
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
    backgroundColor: '#48E958',
    height: 50,
    marginHorizontal: 50,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  text1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  image: {
    height: 100,
    width: 100,
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
    marginHorizontal: 15,
    marginBottom: 10,
    
  },
  head: {height: 40, backgroundColor: '#f1f8ff',padding:10},
  singleHead: {width: 80, height: 40, backgroundColor: '#c8e1ff'},
  wrapper: {
    flexDirection: 'row',
    borderWidth: 0.2,
    borderTopColor: 'white',
    borderLeftColor: 'white',
    borderRightColor: 'white',
    borderBottomColor: '#0298D3',
    padding:10,
  },
  title: {flex: 1, backgroundColor: '#f6f8fa'},
  row: {height: 28},
  text: {textAlign: 'center', color: 'black'},
  text1: {color: 'black'},
  text2: {textAlign: 'right', color: 'black'},
  titleText: {color: 'black'},
});
export default DichVu;
