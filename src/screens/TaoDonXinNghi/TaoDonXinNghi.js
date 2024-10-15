import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Sizes } from '../../utils/resource';
import { Icons, TouchableCo } from '../../elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import Icon from 'react-native-vector-icons/MaterialIconss';
import { useForm, Controller } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DropDownPicker from 'react-native-dropdown-picker';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { FetchApi, ResetFunction } from '../../utils/modules';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectDropdown from 'react-native-select-dropdown';

import { Loading } from '../../elements';
const TaoDonXinNghi = ({ navigation }) => {
  const studentId = useSelector(state => state?.data?.data?._id);
  const [selectedItem, setSelectedItem] = useState('');
  const [selectId, setSelectId] = useState('');
  const { data, isLoading } = useQuery(['NewListSend'], async () => {
    const ID = await AsyncStorage.getItem('studentId');
    let updatestudenID;
    if (ID) {
      updatestudenID = ID;
    } else {
      updatestudenID = studentId;
    }
    const listsend = await FetchApi.getListSend(updatestudenID);
    return listsend;
  });
  // if (isLoading) {
  //   return <Loading />;
  // }
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();
  const [submiting, setSubmiting] = useState(false);
  const onSubmit = async data => {
    try {
      setSubmiting(true);
      const { description, user_id, from_date, to_date } = data;
      console.log('test post:', description, user_id, from_date, to_date);
      const ID = await AsyncStorage.getItem('studentId');
      let updatestudenID;
      if (ID) {
        updatestudenID = ID;
      } else {
        updatestudenID = studentId;
      }
      const result = await FetchApi.postOffSchool({
        description: description,
        user_id: user_id,
        student_id: updatestudenID,
        from_date: from_date,
        to_date: to_date,
      });
      if (result._msg_code == 1) {
        Alert.alert(result._msg_text);
        navigation.goBack();
        // navigation.navigate('XinNghi');
      } else {
        Alert.alert(result._msg_text);
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  const nameToIdMap = {};
  (data || []).forEach(item => {
    nameToIdMap[item.full_name] = item.user_id;
  });
  const [inputHeight, setInputHeight] = useState(40);

  //date_picker
  const [showPicker1, setShowPicker1] = useState(false);
  const [showPicker2, setShowPicker2] = useState(false);

  const showDatepicker1 = () => {
    setShowPicker1(true);
  };
  const showDatepicker2 = () => {
    setShowPicker2(true);
  };
  const countries = ["Egypt", "Canada", "Australia", "Ireland"]
  return (
    <View style={styles.container}>
      <View
        style={{
          height: 'auto',
          paddingHorizontal: 15,
          paddingVertical: 10,
          backgroundColor: 'white',
          width: '100%',
          // marginTop: insets.top,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TouchableCo onPress={() => navigation.goBack()}>
          <Icons name={'close'} size={21} color={'black'} />
        </TouchableCo>
        <Text allowFontScaling={false}style={{ color: 'black', fontSize: 19, marginVertical: -2 }}>
          Tạo đơn xin nghỉ{' '}
        </Text>
        <TouchableCo onPress={handleSubmit(onSubmit)}>
        <Ionicons
                  name={'send'}
                  size={30}
                  color={'#0298D3'}
                />
        </TouchableCo>
      </View>
      <KeyboardAwareScrollView       
      extraScrollHeight={70}
  enableOnAndroid={true}>
      <View style={{ marginVertical: 5, }}>
        <Text allowFontScaling={false} style={{ color: 'black', fontSize: 17, marginLeft: 30 }}>
          Từ ngày
        </Text>
        <Controller
          control={control}
          name="from_date"
          defaultValue=""
          placeholder="Full Name"
          rules={{ required: 'Chưa chọn ngày bắt đầu' }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Pressable onPress={showDatepicker1}>
              {error && <Text allowFontScaling={false}style={styles.errorText}>{error.message}</Text>}
              <View
                style={styles.fromdate

                }>
                <Ionicons
                  name={'calendar-outline'}
                  size={30}
                  color={'#0298D3'}
                />
                <TextInput
                allowFontScaling={false}
                  style={{ color: 'black' }}
                  underlineColorAndroid="transparent"
                  value={value ? new Date(value).toLocaleDateString() : ''}
                  placeholder="Từ ngày"
                  placeholderTextColor="black"
                  autoCapitalize="none"
                  editable={false}
                />
              </View>
              {showPicker1 && (
                <DateTimePicker
                  value={value ? new Date(value) : new Date()}
                  mode="date"
                  display='inline'
                  onChange={(event, selectedDate) => {
                    onChange(selectedDate ? selectedDate.toISOString() : '');
                    setShowPicker1(false);
                  }}
                />
              )}
            </Pressable>
          )}
        />
      </View>
      <View>
        <Text allowFontScaling={false}style={{ color: 'black', fontSize: 17, marginLeft: 30 }}>
          Đên ngày
        </Text>
        <Controller
          control={control}
          name="to_date"
          defaultValue=""
          placeholder="Full Name"
          rules={{ required: 'Chưa chọn ngày kết thúc' }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Pressable onPress={showDatepicker2}>
              {error && <Text allowFontScaling={false}style={styles.errorText}>{error.message}</Text>}
              <View
                style={
                  styles.fromdate
                }>
                <Ionicons
                  name={'calendar-outline'}
                  size={30}
                  color={'#0298D3'}
                />
                <TextInput
                allowFontScaling={false}
                  style={{ color: 'black' }}
                  underlineColorAndroid="transparent"
                  value={value ? new Date(value).toLocaleDateString() : ''}
                  placeholder="Đến ngày"
                  placeholderTextColor="black"
                  autoCapitalize="none"
                  editable={false}
                />
              </View>
              {showPicker2 && (
                <DateTimePicker
                  value={value ? new Date(value) : new Date()}
                  mode="date"
                  display='inline'
                  onChange={(event, selectedDate) => {
                    onChange(selectedDate ? selectedDate.toISOString() : '');
                    setShowPicker2(false);
                  }}
                />
              )}
            </Pressable>
          )}
        />
      </View>
      <Controller
        control={control}
        name="user_id"
        defaultValue=""
        rules={{ required: 'Chưa chọn người nhận' }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View style={{alignItems:'center'}}>
            {error && <Text allowFontScaling={false}style={styles.errorText}>{error.message}</Text>}
            <SelectDropdown
              buttonStyle={{ width: 300, borderRadius: 10, backgroundColor: 'white', marginBottom: 10 }}
              data={(data || []).map(item => item.full_name)} // Hiển thị danh sách name
              onSelect={(selectedName, index) => {
                const selectedId = nameToIdMap[selectedName];
                onChange(selectedId); // Cập nhật giá trị user_id khi mục được chọn
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
              defaultButtonText="Chọn người nhận"
            />
          </View>
        )}
      />

      <View>
        
          <Text allowFontScaling={false}style={{ color: 'black', fontSize: 17, marginLeft: 30 }}>
            Nội dung
          </Text>
          {errors.content && (
            <Text allowFontScaling={false}style={{ color: 'red', marginLeft: 30 }}>
              Nội dung không được để trống
            </Text>
          )}
          <View
            style={{
              height: 200,
              width: 300,
              paddingHorizontal: 15,
              paddingVertical: 10,
              marginHorizontal: 30,
              marginVertical: 10,
              borderRadius: 10,
              backgroundColor: 'white',
              // marginTop: insets.top,
              // flexDirection: 'row',
              // alignItems: 'center',
              
            }}>

            <Controller
              control={control}
              name="description"
              defaultValue=""
              rules={{ required: 'Chưa nhập nội dung' }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View style={{ height: 'auto' }}>
                  {error && (
                    <Text
                    allowFontScaling={false}
                      style={{
                        color: 'red',
                        fontSize: 14,
                        marginTop: 5,
                        marginHorizontal: 0,
                      }}>
                      {error.message}
                    </Text>
                  )}
                  <TextInput
                    allowFontScaling={false}
                    underlineColorAndroid="transparent"
                    value={value}
                    placeholder="Nhập nội dung..."
                    placeholderTextColor="gray"
                    autoCapitalize="none"
                    onChangeText={onChange}
                    color="black"
                    multiline={true}
                    maxLength={255}
                    onContentSizeChange={e => {
                      setInputHeight(e.nativeEvent.contentSize.height);
                    }}
                  />
                </View>
              )}
            />

          </View>
        
      </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDDDDD',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  drop: {
    width: 300,
    height: 40,
    borderWidth: 0,
    padding: 10,
    color: 'black',
    marginHorizontal: 30,
    marginBottom: 20,
    // zIndex: -1,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
    marginHorizontal: 30,
  },
  fromdate: {
    height: 'auto',

    width: 300,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 30,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    // marginTop: insets.top,
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    height: '100%',
    borderWidth:1
  }
});
export default TaoDonXinNghi;
