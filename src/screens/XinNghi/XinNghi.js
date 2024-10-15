import React, {useState, useEffect,useMemo,useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
  useWindowDimensions
} from 'react-native';
import {Sizes} from '../../utils/resource';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useQuery} from 'react-query';
import {FetchApi} from '../../utils/modules';
import {useSelector} from 'react-redux';
import {Loading} from '../../elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast} from "react-native-toast-notifications";
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import { TabView, SceneMap ,TabBar} from 'react-native-tab-view';

const XinNghi = ({navigation}) => {
  const studentId = useSelector(state => state?.data?.data?._id);
  const [data, setData] = useState(null);
  const [cd, setCd] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [choose, setChoose] = useState(null);
  const snapPoints = useMemo(() => ['50%', '50%'], []);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const drawerAnimation = useRef(new Animated.Value(-300)).current;
  const [open,setOpen] = useState(false)
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const overlayOpacity1 = useRef(new Animated.Value(0)).current;
  const bottomSheetModalRef = useRef(null);
  const toast = useToast();
  const [commentValues, setCommentValues] = useState([]);
  const layout = useWindowDimensions();
  
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Chưa duyệt' },
    { key: 'second', title: 'Đã duyệt' },
  ]);


  const fetchData = async () => {
    try {
      const ID = await AsyncStorage.getItem('studentId');
      let updatestudenID;
      if (ID) {
        updatestudenID = ID;
      } else {
        updatestudenID = studentId;
      }
      const offschool = await FetchApi.getOffSchool(updatestudenID);
      const offschoolcd = await FetchApi.getOffSchoolcd(updatestudenID);
      const newData = offschool;
      const newCd = offschoolcd;
      setData(newData);
      setCd(newCd);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      fetchData();
    });

    // Loại bỏ trình nghe khi component bị hủy
    return () => {
      focusListener();
    };
  }, [navigation]);

  if (isLoading) {
    return <Loading />;
  }

  const openBottomSheet = () => {
    Animated.timing(overlayOpacity, {
      toValue: 0.5,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setIsBottomSheetOpen(true);
      bottomSheetModalRef.current?.present();
    });
  };
  const closeBottomSheet = () => {
    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 50,
      useNativeDriver: false,
    }).start(() => {
      bottomSheetModalRef.current?.close();
      setIsBottomSheetOpen(false);
    });
  };


  const handleOverlayPress = () => {
    // Khi nhấn lên overlay, đóng bottom sheet
    closeBottomSheet();
   
    // refetch;
  };
  
  const handleSheetChanges = index => {
    if (index === -1) {
      setIsBottomSheetOpen(false);
    } else {
      setIsBottomSheetOpen(true);
    }
  };

  const FirstRoute = () => {
  
    return(
      <View style={{ flex: 1, backgroundColor: '#DDDDDD' }}>
         <ScrollView>
        {(cd || []).map((item, index) => {
           const onSubmitDeletecd = async data => {
            try {
              
            
              Alert.alert(
                'Cảnh báo',
                'Bạn muốn xoá xin nghỉ này?',
                [
                  {
                    text: 'Huỷ',
                    onPress: () => {
                      console.log('Hủy bỏ hành động');
                    },
                    style: 'cancel',
                  },
                  {
                    text: 'Xoá',
                    onPress: async () => {
                   
                      const result = await FetchApi.deleteXinNghi(choose.id);
                      console.log(result);
                      if (result._msg_code == 1) {
                        const newCommentValues = commentValues.filter((_, i) => i !== index);
              setCommentValues(newCommentValues);
              toast.show("xoá xin nghỉ thành công",{
                type: "success",
                placement: "bottom",
                duration: 4000,
                offset: 30,
                animationType: "zoom-in",
              });
                        fetchData();
                      } else {
                        Alert.alert('Xoá xin nghỉ thất bại');
                      }
                    },
                  },
                ],
                { cancelable: false } 
              );
              
  
  
                
            } catch (err) {
              console.log('err', err);
            }
          };  
  
          return (
            <View style={styles.blockList} key={index}>
             <View style={{ flexDirection: 'row' }}>
                  <View style={{ flexDirection: 'row' ,flex:1}}>
                  <Ionicons
                    name={`checkmark-circle-sharp`}
                    size={20}
                    color={'gray'}
                  />
                  <Text allowFontScaling={false} style={{ color: 'black', fontSize: 16 }}>Chưa duyệt</Text>
                  </View>
                  <TouchableOpacity 
                  onPress={()=>{
                    openBottomSheet()
                    setChoose(item)
                  }}
                  >
                  <Ionicons
                    name={`ellipsis-horizontal`}
                    size={20}
                    color={'black'}
                  />
                  </TouchableOpacity>
                </View>
              <Text allowFontScaling={false}style={{color: 'black', fontSize: 16, marginVertical: 5}}>
                {/* Nguyễn Chí Nghĩa gửi đơn xin nghỉ cho bé Giang 1 ngày{' '} */}
                {item.relative_fullname} gửi đơn xin nghỉ cho bé{' '}
                {item.student_name}
              </Text>
              <Text allowFontScaling={false}style={{color: 'black', fontSize: 14, marginVertical: 5}}>
                Từ ngày: {item.from_date}
              </Text>
              <Text allowFontScaling={false}style={{color: 'black', fontSize: 14, marginVertical: 5}}>
                Đến ngày: {item.to_date}
              </Text>
              <Text allowFontScaling={false}style={{color: 'black', fontSize: 14, marginVertical: 5}}>
                Lý do: {item.description}
              </Text>
              <Text
              allowFontScaling={false}
                style={{
                  color: '#BFBFBF',
                  fontSize: 12,
                  marginVertical: 5,
                  alignSelf: 'flex-end',
                }}>
                Gửi lúc {item.date_at}
              </Text>
              <BottomSheetModal
              ref={bottomSheetModalRef}
              index={1}
              onChange={handleSheetChanges}
              snapPoints={snapPoints}>
              <View
                style={{
                  width: '100%',
                  height: 300,
                  backgroundColor: 'white',
                  borderTopRightRadius: 20,
                  borderTopLeftRadius: 20,
                  padding: 20,
                }}>
                <TouchableOpacity 
                  onPress={()=>navigation.navigate('EditXinNghi',{dataProps: choose})}
                >
                  <View style={{flexDirection: 'row', marginBottom: 25}}>
                    <View>
                      <Ionicons name={'pencil-outline'} size={23} color={'#FFC125'} />
                    </View>
                    <View style={{marginLeft: 12,flex:1}}>
                      <Text allowFontScaling={false}style={{color: 'black', fontSize: 17, fontWeight: 300}}>
                        Chỉnh sửa xin nghỉ
                      </Text>
                      
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={onSubmitDeletecd}  >
                  <View style={{flexDirection: 'row', marginBottom: 25}}>
                    <View>
                      <Ionicons name={'trash-outline'} size={23} color={'red'} />
                    </View>
                    <View style={{marginLeft: 12}}>
                      <Text allowFontScaling={false}style={{color: 'black', fontSize: 17, fontWeight: 300}}>
                        Xóa xin nghỉ
                      </Text>
                      
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </BottomSheetModal>
            </View>
          );
        })}
        
      </ScrollView>
      </View>
    );
  };

const SecondRoute = () => {
  
  return(
    <View style={{ flex: 1, backgroundColor: '#DDDDDD' }}>
         <ScrollView>
        
        {(data || []).map((item, index) => {
          return (
            <View style={styles.blockList} key={index}>
              <View style={{flexDirection: 'row'}}>
                <Ionicons
                  name={`checkmark-circle-sharp`}
                  size={20}
                  color={'green'}
                />
                <Text allowFontScaling={false}style={{color: 'black', fontSize: 16}}>Đã duyệt</Text>
              </View>
              <Text allowFontScaling={false}style={{color: 'black', fontSize: 16, marginVertical: 5}}>
                {/* Nguyễn Chí Nghĩa gửi đơn xin nghỉ cho bé Giang 1 ngày{' '} */}
                {item.relative_fullname} gửi đơn xin nghỉ cho bé{' '}
                {item.student_name}
              </Text>
              <Text allowFontScaling={false}style={{color: 'black', fontSize: 14, marginVertical: 5}}>
                Từ ngày: {item.from_date}
              </Text>
              <Text allowFontScaling={false}style={{color: 'black', fontSize: 14, marginVertical: 5}}>
                Đến ngày: {item.to_date}
              </Text>
              <Text allowFontScaling={false}style={{color: 'black', fontSize: 14, marginVertical: 5}}>
                Lý do: {item.description}
              </Text>
              <Text
              allowFontScaling={false}
                style={{
                  color: '#BFBFBF',
                  fontSize: 12,
                  marginVertical: 5,
                  alignSelf: 'flex-end',
                }}>
                Gửi lúc {item.date_at}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
  
};

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

  return (
    <View style={styles.container}>
      
        <View
          style={{
            height: 'auto',
            paddingHorizontal: 15,
            width:'100%',
            paddingVertical: 10,
            backgroundColor: 'white',
            // marginTop: insets.top,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('TinhNang')}>
            <Ionicons name={'arrow-back-outline'} size={30} color={'black'} />
          </TouchableOpacity>
          <Text allowFontScaling={false}style={{color: 'black', fontSize: 20}}>XIN NGHỈ</Text>
          <Ionicons name={'add-circle-sharp'} size={30} color={'white'} />
        </View>
        
        <BottomSheetModalProvider>

        <TabView
       
       navigationState={{ index, routes }}
       renderScene={renderScene}
       onIndexChange={setIndex}
       initialLayout={{ width: layout.width}}
       
       renderTabBar={props => <TabBar {...props}
       renderLabel={({route, color}) => (
         <Text allowFontScaling={false}style={{ color: 'black', borderBottomColor:'#0298D3'}}>
           {route.title}
         </Text>
       )}
       indicatorStyle={{ backgroundColor: '#0298D3' }}
       style={{backgroundColor: 'white'}}/>} 
     />
<TouchableOpacity 
                style={{ 
                  //  borderWidth:1,
                    borderColor: 'red', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    width: 60, 
                    position: 'absolute', 
                    top: 480, 
                    right: 20, 
                    height: 60, 
                    backgroundColor: 'white', 
                    borderRadius: 100, 
                }} 
                onPress={() => navigation.navigate('TaoDonXinNghi')}
            > 
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={'add-circle-sharp'} style={{marginTop:-2,marginLeft:2}} size={60} color={'#0298D3'} />
      </View>
            
            </TouchableOpacity> 


      {isBottomSheetOpen && (
          <Animated.View
            style={[styles.overlay, {opacity: overlayOpacity}]}
            onTouchStart={handleOverlayPress} // Bắt sự kiện nhấn lên overlay
          />
        )}
      </BottomSheetModalProvider>
    </View>
  );
};
const styles = StyleSheet.create({

  overlay: {
    ...StyleSheet.absoluteFillObject, // Đặt overlay để che kín ImageBackground
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền mờ (rgba để có độ trong suốt)
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: '#DDDDDD',
    justifyContent: 'flex-start',
    
  },
  blockList: {
    height: 'auto',
    width: '90%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: 'white',
  },
});
export default XinNghi;
