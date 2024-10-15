import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Sizes } from '../../utils/resource';
import { Icons, Loading, TouchableCo } from '../../elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useForm, Controller } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DropDownPicker from 'react-native-dropdown-picker';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { FetchApi } from '../../utils/modules';
import { ResetFunction } from '../../utils/modules';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectDropdown from 'react-native-select-dropdown';

const TaoLoiNhanMoi = ({ navigation }) => {
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

    const send = await FetchApi.getListSend(updatestudenID);
    return send;
  });
  const { data: cate, isLoadings } = useQuery(['NewListCate'], async () => {
    const ID = await AsyncStorage.getItem('studentId');
    let updatestudenID;
    if (ID) {
      updatestudenID = ID;
    } else {
      updatestudenID = studentId;
    }
    const cate = await FetchApi.getAdviceCate(updatestudenID);
    return cate;
  });

  const [open1, setOpen1] = useState(false);
  const item1 = (data || []).map(item => ({
    label: item.full_name,
    value: item.user_id,
  }));
  const item2 = (cate || []).map(item => ({
    label: item.title,
    value: item.category_id,
  }));
  // const [items1, setItems1] = useState(
  //   (data || []).map((item, index) => ({
  //     label: item.full_name,
  //     value: item.user_id,
  //   })),
  // );
  const [open2, setOpen2] = useState(false);
  // const [items2, setItems2] = useState(
  //   (cate || []).map((item, index) => ({
  //     label: item.title,
  //     value: item.category_id,
  //   })),
  // );
  // if (isLoading) {
  //   return <Loading />;
  // }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    formState: { errors: errorss },
  } = useForm();
  const [submiting, setSubmiting] = useState(false);
  const onSubmit = async data => {
    try {
      setSubmiting(true);
      const { content, user_id, category_id, title } = data;
      console.log('test data: ', content, user_id, category_id, title);
      const ID = await AsyncStorage.getItem('studentId');
      let updatestudenID;
      if (ID) {
        updatestudenID = ID;
      } else {
        updatestudenID = studentId;
      }
      const result = await FetchApi.postAdvice({
        content: content,
        user_id: user_id,
        category_id: category_id,
        title: 'tieu de' ,
        student_id: updatestudenID,
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

    reset({ content: '' });
  };

  const [inputHeight, setInputHeight] = useState(40);
  const nameToIdMap = {};
  (data || []).forEach(item => {
    nameToIdMap[item.full_name] = item.user_id;

  });
  const cateToIdMap = {};
  (cate || []).forEach(item => {
    cateToIdMap[item.title] = item.category_id;
  });
  return (
    <View style={styles.container}>
      <View
        style={{
          height: 50,
          width: '100%',
          paddingHorizontal: 15,
          paddingVertical: 7,
          backgroundColor: 'white',
          marginBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TouchableCo onPress={() => navigation.goBack()}>
          <Icons name={'close'} size={21} color={'black'} />
        </TouchableCo>
        <Text allowFontScaling={false}style={{ color: 'black', fontSize: 19, marginVertical: -2 }}>
          Tạo Lời nhắn mới{' '}
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
      extraScrollHeight={200}
      enableOnAndroid={true}>
      <View style={{alignItems:'center'}}>
        <Text allowFontScaling={false}style={{ color: 'black', fontSize: 17,width:'84%'}}>
          Giáo viên nhận
        </Text>
        <Controller
          control={control}
          name="user_id"
          defaultValue=""
          rules={{ required: 'Chưa chọn giáo viên nhận' }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <View >
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
      </View>
      <View style={{alignItems:'center'}}>
        <Text allowFontScaling={false}style={{ color: 'black', fontSize: 17 ,width:'84%'}}>
          Danh mục lời nhắn
        </Text>
        <Controller
          control={control}
          name="category_id"
          defaultValue=""
          rules={{ required: 'Chưa chọn danh mục lời nhắn' }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <View>
              {error && <Text allowFontScaling={false}style={styles.errorText}>{error.message}</Text>}
              <SelectDropdown
                buttonStyle={{ width: 300, borderRadius: 10, backgroundColor: 'white', marginBottom: 10 }}
                data={(cate || []).map(item => item.title)} // Hiển thị danh sách name
                onSelect={(selectedCate, index) => {
                  const selectedId = cateToIdMap[selectedCate];
                  onChange(selectedId); // Cập nhật giá trị user_id khi mục được chọn
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                defaultButtonText="Chọn danh mục"
              />
            </View>
          )}
        />
      </View>
      
     
      
        <View>
          <Text allowFontScaling={false}style={{ color: 'black', fontSize: 17, marginLeft: 30 }}>
            Nội dung
          </Text>
          {errorss.content && (
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
              justifyContent: 'space-between',
            }}>
            <SafeAreaView>
              <ScrollView>
                <Controller
                  control={control}
                  name="content"
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextInput
                    allowFontScaling={false}
                      style={styles.input}
                      underlineColorAndroid="transparent"
                      value={value}
                      placeholder="Nhập nội dung..."
                      placeholderTextColor="gray"
                      autoCapitalize="none"
                      onChangeText={onChange}
                      color="black"
                      multiline
                      maxLength={255}
                      onContentSizeChange={e => {
                        setInputHeight(e.nativeEvent.contentSize.height);
                      }}
                    />
                  )}
                />
              </ScrollView>
            </SafeAreaView>
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
    marginBottom: 15,
    zIndex: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
    marginHorizontal: 30,
  },
});
export default TaoLoiNhanMoi;
