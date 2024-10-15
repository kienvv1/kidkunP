import React, { useMemo,useState, useEffect,useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
  Animated,
  PanResponder,
  Button,
  useWindowDimensions
} from 'react-native';
import { Sizes } from '../../utils/resource';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { FetchApi } from '../../utils/modules';
import { useQuery } from 'react-query';
import { Loading } from '../../elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast} from "react-native-toast-notifications";
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import { TabView, SceneMap ,TabBar} from 'react-native-tab-view';
const LoiNhan = ({ navigation }) => {
  const studentId = useSelector(state => state?.data?.data?._id);
  const [data, setData] = useState(null);
  const [cd, setCd] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commentValues, setCommentValues] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [choose, setChoose] = useState(null);
  const snapPoints = useMemo(() => ['50%', '50%'], []);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const drawerAnimation = useRef(new Animated.Value(-300)).current;
  const [open,setOpen] = useState(false)
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const overlayOpacity1 = useRef(new Animated.Value(0)).current;
  const bottomSheetModalRef = useRef(null);
  const toast = useToast();
  const [cateID, setCateID] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);
  const layout = useWindowDimensions();
  
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Chưa xem' },
    { key: 'second', title: 'Đã xem' },
  ]);

  const { data: cated, isLoadings } = useQuery(['NewListCate'], async () => {
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

  const openDrawer = () => {
    Animated.parallel([
      Animated.timing(drawerAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(overlayOpacity1, {
        toValue: 0.5, // Độ mờ mong muốn (từ 0 đến 1)
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(()=>{
      setOpen(true);
    });
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(drawerAnimation, {
        toValue: -300,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(overlayOpacity1, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(()=>{
      setOpen(false);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dx < -50) {
          closeDrawer();
        }
      },
    })
  ).current;


  const handleOverlayPress1 = () => {
    closeDrawer();
   
  };

  const fetchData = async () => {
    try {
      const ID = await AsyncStorage.getItem('studentId');
      let updatestudenID;
      if (ID) {
        updatestudenID = ID;
      } else {
        updatestudenID = studentId;
      }
      const advice = await FetchApi.getAdvice(updatestudenID,cateID);
      const advicecd = await FetchApi.getAdvicecd(updatestudenID,cateID);
      const newData = advice;
      const newCd = advicecd;
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


  useEffect(() => {
    // console.log('test fill: ', cated );
    if (cd) {
      
      setCommentValues(cd.map((item) => item.content || ''));
     
      setIsDataLoaded(true);
    }
  }, [cd]);
  useEffect(() => {
    if (cateID !== null) {
      submit2();
    }
  }, [cateID]);
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
  const categoriesFilter = ["Ăn uống"];
  
  // const filteredData = cd.filter(item => categoriesFilter.some(category => category === item.category_name));

  // const filteredData = cd.filter(item => categoriesFilter.includes("Dặn thuốc"));

  // const filteredData = cd.filter(item => item.category_name === cate);
  // console.log('test fill: ', filteredData );
  const submit = (action,id) => {
    setSelectedButton(action === selectedButton ? null : action);
    setCateID(id);
    // fetchData();
  };
 
  const submit2 = () => {
   
    setCateID(cateID);
    fetchData();
    closeDrawer();
  };
  
  const FirstRoute = () => {
  
    return(
      <View style={{ flex: 1, backgroundColor: '#DDDDDD' }}>
         {/* <TouchableOpacity style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.navigate('TaoLoiNhanMoi')}>
        <View
          style={{
            height: 'auto',
            width: '90%',

            paddingHorizontal: 15,
            paddingVertical: 10,
            marginTop: 10,
            borderRadius: 10,
            backgroundColor: 'white',
            // marginTop: insets.top,
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: 'space-between',
          }}>
          <Ionicons name={'add-circle-sharp'} size={30} color={'#0298D3'} />
          <Text allowFontScaling={false}style={{ color: 'black', fontSize: 16, marginVertical: 5 }}>
            Gửi lời nhắn mới{' '}
          </Text>
        </View>
      </TouchableOpacity> */}
     
        <ScrollView style={{ width: '100%' }}>
       
         {(cd || []).map((item, index) => {
        
          const onSubmitDeletecd = async data => {
            try {
              
            
              Alert.alert(
                'Cảnh báo',
                'Bạn muốn xoá lời nhắn này?',
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
                   
                      const result = await FetchApi.deleteLoiNhan(choose.advice_id);
                   
                      if (result._msg_code == 1) {
                        const newCommentValues = commentValues.filter((_, i) => i !== index);
              setCommentValues(newCommentValues);
              toast.show("xoá lời thành công",{
                type: "success",
                placement: "bottom",
                duration: 4000,
                offset: 30,
                animationType: "zoom-in",
              });
                        fetchData();
                      } else {
                        Alert.alert('Xoá lời nhắn thất bại');
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
                  <Text allowFontScaling={false} style={{ color: 'black', fontSize: 16 }}>Chưa xem</Text>
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
                <Text allowFontScaling={false} style={{ color: 'black', fontSize: 16, marginVertical: 5 }}>
                  Lời nhắn đến {item.user_fullname}
                </Text>
                <View style={{flexDirection:'row'}}>
                <Text allowFontScaling={false}style={{ color: 'black', fontSize: 14, marginVertical: 5 }}>Nội dung: </Text>
                <TextInput
                      allowFontScaling={false}
                      
                      style={{ flex:1}}
                        underlineColorAndroid="transparent"
                        value={commentValues[index]}
                    onChangeText={(newText) => {
                      const newCommentValues = [...commentValues];
                      newCommentValues[index] = newText;
                      setCommentValues(newCommentValues);
                      
                    }} 
                        placeholder="Nhập nội dung..."
                        placeholderTextColor="gray"
                        autoCapitalize="none"
                        color="black"
                        multiline
                        maxLength={200}
                        
                      />
                  </View>
                 <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <Text
                allowFontScaling={false}
                  style={{
                    color: '#BFBFBF',
                    fontSize: 12,
                    marginVertical: 5,
                    alignSelf: 'flex-start',
                  }}>
                  Gửi lúc {item.date_at}
                </Text>
                
                </View>
  
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
                onPress={()=>navigation.navigate('EditLoiNhan',{dataProps: choose})}
              >
                <View style={{flexDirection: 'row', marginBottom: 25}}>
                  <View>
                    <Ionicons name={'pencil-outline'} size={23} color={'#FFC125'} />
                  </View>
                  <View style={{marginLeft: 12,flex:1}}>
                    <Text allowFontScaling={false}style={{color: 'black', fontSize: 17, fontWeight: 300}}>
                      Chỉnh sửa lời nhắn
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
                      Xóa lời nhắn
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
      {/* <TouchableOpacity 
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
                onPress={() => navigation.navigate('TaoLoiNhanMoi')}
            > 
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={'add-circle-sharp'} style={{marginTop:-2,marginLeft:1}} size={60} color={'#0298D3'} />
      </View>
            
            </TouchableOpacity>  */}
      </View>
    );
  };

const SecondRoute = () => {
  
  return(
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
       <ScrollView style={{ width: '100%' }}>
      
      {(data || []).map((item, index) => {
        return (
          <View style={styles.blockList} key={index}>
            <View style={{ flexDirection: 'row' }}>
              <Ionicons
                name={`checkmark-circle-sharp`}
                size={20}
                color={'green'}
              />
              <Text allowFontScaling={false}style={{ color: 'black', fontSize: 16 }}>Đã xem</Text>
            </View>
            <Text allowFontScaling={false}style={{ color: 'black', fontSize: 16, marginVertical: 5 }}>
              Lời nhắn đến {item.user_fullname}
            </Text>

            <View style={{flexDirection:'row'}}>
            <Text allowFontScaling={false}style={{ color: 'black', fontSize: 14, marginVertical: 5 }}>Nội dung: </Text>
            <TextInput
                  allowFontScaling={false}
                  
                  style={{ flex:1}}
                    underlineColorAndroid="transparent"
                    value={item.content}
                    placeholder="Nhập nội dung..."
                    placeholderTextColor="gray"
                    autoCapitalize="none"
                    color="black"
                    multiline
                    maxLength={200}
                    
                  />
              </View>
            <Text
            allowFontScaling={false}
              style={{
                color: '#BFBFBF',
                fontSize: 12,
                marginVertical: 5,
                alignSelf: 'flex-start',
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
          width: '100%',
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
        <Text allowFontScaling={false}style={{ color: 'black', fontSize: 20 }}>LỜI NHẮN</Text>
        <TouchableOpacity onPress={openDrawer}>
        <Ionicons name={'filter-outline'} size={30} color={'black'} />
        </TouchableOpacity>
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
                onPress={() => navigation.navigate('TaoLoiNhanMoi')}
            > 
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={'add-circle-sharp'} style={{marginTop:-2,marginLeft:2}} size={60} color={'#0298D3'} />
      </View>
            
            </TouchableOpacity> 
      {/* <ScrollView style={{ width: '100%' }}>
       
         {(cd || []).map((item, index) => {
        
          const onSubmitDeletecd = async data => {
            try {
              
            
              Alert.alert(
                'Cảnh báo',
                'Bạn muốn xoá lời nhắn này?',
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
                   
                      const result = await FetchApi.deleteLoiNhan(choose.advice_id);
                   
                      if (result._msg_code == 1) {
                        const newCommentValues = commentValues.filter((_, i) => i !== index);
              setCommentValues(newCommentValues);
              toast.show("xoá lời thành công",{
                type: "success",
                placement: "bottom",
                duration: 4000,
                offset: 30,
                animationType: "zoom-in",
              });
                        fetchData();
                      } else {
                        Alert.alert('Xoá lời nhắn thất bại');
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
                  <Text allowFontScaling={false} style={{ color: 'black', fontSize: 16 }}>Chưa xem</Text>
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
                <Text allowFontScaling={false} style={{ color: 'black', fontSize: 16, marginVertical: 5 }}>
                  Lời nhắn đến {item.user_fullname}
                </Text>
                <View style={{flexDirection:'row'}}>
                <Text allowFontScaling={false}style={{ color: 'black', fontSize: 14, marginVertical: 5 }}>Nội dung: </Text>
                <TextInput
                      allowFontScaling={false}
                      
                      style={{ flex:1}}
                        underlineColorAndroid="transparent"
                        value={commentValues[index]}
                    onChangeText={(newText) => {
                      const newCommentValues = [...commentValues];
                      newCommentValues[index] = newText;
                      setCommentValues(newCommentValues);
                      
                    }} 
                        placeholder="Nhập nội dung..."
                        placeholderTextColor="gray"
                        autoCapitalize="none"
                        color="black"
                        multiline
                        maxLength={200}
                        
                      />
                  </View>
                 <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <Text
                allowFontScaling={false}
                  style={{
                    color: '#BFBFBF',
                    fontSize: 12,
                    marginVertical: 5,
                    alignSelf: 'flex-start',
                  }}>
                  Gửi lúc {item.date_at}
                </Text>
                
                </View>
  
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
                onPress={()=>navigation.navigate('EditLoiNhan',{dataProps: choose})}
              >
                <View style={{flexDirection: 'row', marginBottom: 25}}>
                  <View>
                    <Ionicons name={'pencil-outline'} size={23} color={'#FFC125'} />
                  </View>
                  <View style={{marginLeft: 12,flex:1}}>
                    <Text allowFontScaling={false}style={{color: 'black', fontSize: 17, fontWeight: 300}}>
                      Chỉnh sửa lời nhắn
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
                      Xóa lời nhắn
                    </Text>
                    
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </BottomSheetModal>
              </View>
            );
          })}
         
    
       
        {(data || []).map((item, index) => {
          return (
            <View style={styles.blockList} key={index}>
              <View style={{ flexDirection: 'row' }}>
                <Ionicons
                  name={`checkmark-circle-sharp`}
                  size={20}
                  color={'green'}
                />
                <Text allowFontScaling={false}style={{ color: 'black', fontSize: 16 }}>Đã xem</Text>
              </View>
              <Text allowFontScaling={false}style={{ color: 'black', fontSize: 16, marginVertical: 5 }}>
                Lời nhắn đến {item.user_fullname}
              </Text>

              <View style={{flexDirection:'row'}}>
              <Text allowFontScaling={false}style={{ color: 'black', fontSize: 14, marginVertical: 5 }}>Nội dung: </Text>
              <TextInput
                    allowFontScaling={false}
                    
                    style={{ flex:1}}
                      underlineColorAndroid="transparent"
                      value={item.content}
                      placeholder="Nhập nội dung..."
                      placeholderTextColor="gray"
                      autoCapitalize="none"
                      color="black"
                      multiline
                      maxLength={200}
                      
                    />
                </View>
              <Text
              allowFontScaling={false}
                style={{
                  color: '#BFBFBF',
                  fontSize: 12,
                  marginVertical: 5,
                  alignSelf: 'flex-start',
                }}>
                Gửi lúc {item.date_at}
              </Text>
            </View>
          );
        })}
      </ScrollView> */}
      
        {isBottomSheetOpen && (
          <Animated.View
            style={[styles.overlay, {opacity: overlayOpacity}]}
            onTouchStart={handleOverlayPress} // Bắt sự kiện nhấn lên overlay
          />
        )}
      </BottomSheetModalProvider>
      <Animated.View
       
       style={{
         ...StyleSheet.absoluteFillObject,
         backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu sắc và độ mờ của overlay
         opacity: overlayOpacity1,
       }}
       pointerEvents={open ? 'auto': 'none'}
       onTouchStart={handleOverlayPress1}
     />
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          position: 'absolute',
          top: 0,
          right: drawerAnimation,
          height: '100%',
          width: '70%',
          backgroundColor: 'white',
        }}
      >
       {/* <Button title="Lọc" onPress={closeDrawer} /> */}
       <View style={{flex:1,paddingLeft:10,paddingTop:10}}>
        <Text allowFontScaling={false} style={{fontSize:27,color:'gray',fontWeight:500,}}>Bộ Lọc</Text>
        <Text allowFontScaling={false} style={{fontSize:18,color:'gray',fontWeight:500,marginTop:20}}>Loại lời nhắn</Text>
        <View style={{flexDirection:'row',flexWrap: 'wrap',width:'100%'}}>
        {cated.map((item, index) => (
            <TouchableOpacity  
            key={index}
            onPress={() => submit(item.title,item.category_id)}
            style={{
              marginTop:15,
              marginRight:8,
              backgroundColor: selectedButton === item.title ? '#0298D3' : 'white',
              borderWidth:0.5,width:'46%',padding:6, borderRadius:10,alignItems:'center'}}>
            <Text allowFontScaling={false} style={{fontSize:18,color:selectedButton === item.title ? 'white' : 'black',}}>{item.title}</Text>
    
            </TouchableOpacity>
       ))}
        <View style={{marginVertical:300,flexDirection:'row',flexWrap: 'wrap',width:'100%'}}>
        {/* <TouchableOpacity  
      
      onPress={() => submit3()}
      style={{
        marginTop:15,
        marginRight:8,

        borderWidth:0.5,width:'46%',padding:6, borderRadius:10,alignItems:'center'}}>
      <Text allowFontScaling={false} style={{fontSize:18,color:'black',}}>Thiết lập lại</Text>

      </TouchableOpacity>
       <TouchableOpacity  
      
            onPress={() => submit2()}
            style={{
              marginTop:15,
              marginRight:8,
              backgroundColor:'#0298D3',
              borderWidth:0.5,width:'46%',padding:6, borderRadius:10,alignItems:'center'}}>
            <Text allowFontScaling={false} style={{fontSize:18,color:'white',}}>Lọc</Text>
    
            </TouchableOpacity> */}
          </View>      
        </View>

        
        
       </View>
      </Animated.View>
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
    // alignItems: 'center',
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
export default LoiNhan;
