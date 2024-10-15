import React, {useState, useMemo,useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Image,
  ImageBackground,
  ActivityIndicator,
  FlatList,
  Animated,
  Modal,
  KeyboardAvoidingView,
  TextInput
} from 'react-native';
import {Sizes} from '../../../utils/resource';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import {FetchApi} from '../../../utils/modules';
import {Loading} from '../../../elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet'
// import Icon from 'react-native-vector-icons/MaterialIcons';
import {Icons} from '../../../elements';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { format,parseISO } from 'date-fns';
import VideoPlayer from 'react-native-video-player';
import { useForm, Controller } from 'react-hook-form';
const ImageAlbum = ({images}) => {
  const [showHiddenImages, setShowHiddenImages] = useState(false);
  let imageSizeStyle;
  let imageView;
  const [isVisible2, setIsVisible2] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const openImageModal = index => {
    setSelectedImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImageIndex(null);
  };
  if (Array.isArray(images) && images.length === 1) {
    imageSizeStyle = styles.singleImage;
    imageView = styles.singleView;
  } else if (Array.isArray(images) && images.length === 2) {
    imageSizeStyle = styles.twoImages; 
    imageView = styles.twoView;
  } else if (Array.isArray(images) && images.length >= 3) {
    imageSizeStyle = styles.threeImages;
    imageView = styles.twoView;
  } else {
    // Xử lý trường hợp mảng images không tồn tại hoặc rỗng
    imageSizeStyle = styles.singleImage; // Hoặc bất kỳ kích thước nào bạn muốn
  }
  const isImageOrVideoUrl =(url)=> {
    // Danh sách các phần mở rộng thông thường của ảnh và video
    const imageExtensionPattern = /\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff)/i;
    
   const videoExtensionPattern = /\.(mp4|avi|mov|mkv|wmv)/i;
  
   if (imageExtensionPattern.test(url)) {
    return 'image';
  } else if (videoExtensionPattern.test(url)) {
    return 'video';
  }

  return null;
  }
  return (
   
      <View style={styles.imageContainer}>
        {images.slice(0, 3).map((image, index) => (
          <View style={imageView} key={index}>
            <TouchableOpacity onPress={() => openImageModal(index)}>
            {isImageOrVideoUrl(image.uri)==='image' ? (
           <Image
             key={index}
             source={{uri:image.uri}}
             style={imageSizeStyle}
           />
         ) : isImageOrVideoUrl(image.uri)==='video' ? (
          <VideoPlayer
            video={{uri:image.uri}}
            key={index}
            style={imageSizeStyle}
            // thumbnail={{uri: "https://baconmockup.com/370/210/"}}
            // endThumbnail={{uri: "https://baconmockup.com/370/210/"}}
            showDuration={true}
            autoplay
            // controlsTimeout= {2000}
            // disableControlsAutoHide={true}
            defaultMuted={true}
            pauseOnPress={true}
          />
         ) : null}
            </TouchableOpacity>
            <Modal visible={selectedImageIndex !== null} transparent>
              <Swiper
                style={styles.wrapper}
                index={selectedImageIndex}
                loop={false}
                showsButtons={false}
                paginationStyle={styles.pagination}>
                {images.map(item => (
                  <View style={styles.slide} key={item.id}>
                  {isImageOrVideoUrl(item.uri)==='image' ? (
                      <Image
                      style={styles.modalImage}
                      resizeMode="contain"
                      source={{uri: item.uri}}
                    />
                    ) : isImageOrVideoUrl(item.uri)==='video' ? (
                           <VideoPlayer
                                  style={styles.modalImage}
                                  video={{uri:item.uri}}
            //                       thumbnail={{uri: "https://baconmockup.com/370/210/"}}
            // endThumbnail={{uri: "https://baconmockup.com/370/210/"}}
            showDuration={true}
            autoplay
            controlsTimeout= {2000}
            disableControlsAutoHide={true}
            defaultMuted={true}
            pauseOnPress={false}
                             
                                />
                    ) :null}

                  </View>
                ))}
              </Swiper>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeImageModal}>
                <Text allowFontScaling={false}style={styles.closeButtonText}>Đóng</Text>
              </TouchableOpacity>
            </Modal>
          </View>
        ))}

        {Array.isArray(images) && images.length > 3 && (
          <View style={styles.hiddenImage}>
            {images.length > 4 ? (
              <ImageBackground
                source={{uri: images[3].uri}}
                style={styles.imageBackground}>
                <TouchableOpacity
                  onPress={() => openImageModal(3)}
                  style={styles.overlay}>
                  <Text allowFontScaling={false}style={{fontSize: 20,color:'white'}}>+{images.length - 4}</Text>
                </TouchableOpacity>
              </ImageBackground>
            ) : images.length === 4 ? (
              <ImageBackground
                source={{uri: images[images.length - 1].uri}}
                style={styles.imageBackground}></ImageBackground>
            ) : null}
          </View>
        )}
      </View>
   
  );
};
const HomeScreen = ({navigation}) => {
const [choose, setChoose] = useState(null);
const [submiting, setSubmiting] = useState(false);
const [isEmty,setIsEmty] = useState(false);

const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
const [isBottomSheetOpen1, setIsBottomSheetOpen1] = useState(false);
const overlayOpacity = useRef(new Animated.Value(0)).current;
const overlayOpacity1 = useRef(new Animated.Value(0)).current;
const bottomSheetModalRef = useRef(null);
const bottomSheetModalRef1 = useRef(null);
const bottomSheetModalRef2 = useRef(null);
const [expanded, setExpanded] = useState(false);
const snapPoints = useMemo(() => ['50%', '50%'], []);
const snapPoints1 = useMemo(() => ['50%', '50%'], []);
const [loading, setLoading] = useState(false);
const [page, setPage] = useState(1);
const reachedEndRef = useRef(false);
const [reachedEnd, setReachedEnd] = useState(false);
const [datas, setData] = useState({}); // Dữ liệu ban đầu
const [likedPosts, setLikedPosts] = useState(new Set());
const [likesCount, setLikesCount] = useState({}); 
const [refreshing, setRefreshing] = useState(false);
const {
  handleSubmit,
  control,
  reset,
} = useForm();


const onRefresh = React.useCallback(() => {
  setRefreshing(true);
  setTimeout(() => {
    // setData({});
    setPage(1); 
    fetchData();
    setRefreshing(false);
  }, 2000);
}, []);
  const studentId = useSelector(state => state?.data?.data?._id);
  const formatDate = (inputDate) => {
    const vietnameseDays = [
      'Chủ Nhật',
      'Thứ Hai',
      'Thứ Ba',
      'Thứ Tư',
      'Thứ Năm',
      'Thứ Sáu',
      'Thứ Bảy'
    ];
  
    const date = parseISO(inputDate);
    const dayOfWeek = vietnameseDays[date.getDay()];
  
    const formattedDate = `${dayOfWeek}, ngày ${format(date, 'dd-MM-yyyy')}`;
  
    return formattedDate;
  };
  
  
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

  const {data:info} = useQuery('useGetStudent', async () => {
    const ID = await AsyncStorage.getItem('studentId');
    let updatestudenID;
    if (ID) {
      updatestudenID = ID;
    } else {
      updatestudenID = studentId;
    }
    const infos = await FetchApi.getStudent(updatestudenID);
    return infos;
  });


  // const {data, isLoading,refetch } = useQuery('useGetNewFeed', async () => {
  //   const ID = await AsyncStorage.getItem('studentId');
  //   let updatestudenID;
  //   if (ID) {
  //     updatestudenID = ID;
  //   } else {
  //     updatestudenID = studentId;
  //   }
  
  //   const newfeed = await FetchApi.getNewFeed(updatestudenID);
  //   return newfeed;
  // });


  const fetchData = async () => {

    if (!reachedEndRef.current && !loading) {
      setLoading(true);
      try {
        const ID = await AsyncStorage.getItem('studentId');
        let updatestudenID;
        if (ID) {
          updatestudenID = ID;
        } else {
          updatestudenID = studentId;
        }
        const response = await FetchApi.getNewFeed(updatestudenID,page);;
        const newData = response._data;
        
        setData(prevData => ({ ...prevData, ...newData })); 
        
        const newLikesCounts = {};
        
        for (const key in newData) {
          if (newData[key].hasOwnProperty('album')) {
            const albumData = newData[key].album;
            
            // Lặp qua mỗi phần tử trong trường album để lấy ra số lượng like
            for (const albumId in albumData) {
              if (albumData[albumId].hasOwnProperty('number_like')) {
                const numberOfLikes = Number(albumData[albumId].number_like);
                newLikesCounts[albumId] = numberOfLikes;
                // Sử dụng số lượng like ở đây theo nhu cầu của bạn
              }
            }
          }
        }
        setLikesCount(prevLikesCount => ({ ...prevLikesCount, ...newLikesCounts }));
        // console.log('like_count: ',likesCount);

        const updatedLikedPosts = new Set(likedPosts);
        for (const key in newData) {
          if (newData[key].hasOwnProperty('album')) {
            const albumData = newData[key].album;
            
            // Lặp qua mỗi phần tử trong trường album để lấy ra số lượng like
            for (const albumId in albumData) {
              if (albumData[albumId].hasOwnProperty('number_like')) {
                const numberOfLikes = Number(albumData[albumId].status_like);
                  if (numberOfLikes > 0 ) {
            updatedLikedPosts.add(albumId);
          }
              }
            }
          }
        }
        setLikedPosts(updatedLikedPosts);
        console.log('likePOST: ', likedPosts);
        
        
        
       
        setPage(page + 1); // Tăng trang lên sau khi đã lấy dữ liệu thành công
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Reset trạng thái loading sau khi dữ liệu đã được tải xong hoặc gặp lỗi
      }
    }
  };

  useEffect(() => {
    fetchData(); // Lấy dữ liệu lần đầu khi component được mount
    
  }, []);

  
 

  const { data:datacomment, refetch:refetchcomment } = useQuery(
    ['getComment',choose],
    async () => {
      const  comment = FetchApi.getListComment(choose);
      return  comment;
    },
    {
      enabled: true , // Tắt tự động tải dữ liệu ban đầu
    }
  );
  
  const views = [];

  const handleLike = postId => {
    onSubmit1(postId) ;
    const updatedLikesCount = { ...likesCount }; // Tạo một bản sao của likesCount để cập nhật
    if (likedPosts.has(postId)) {
      updatedLikesCount[postId] = (updatedLikesCount[postId] || 0) - 1;
    } else {
      updatedLikesCount[postId] = (updatedLikesCount[postId] || 0) + 1;
    }
  
    setLikesCount(updatedLikesCount); // Cập nhật số lượng like
  
    const updatedLikedPosts = new Set(likedPosts);
    if (likedPosts.has(postId)) {
      updatedLikedPosts.delete(postId);
    } else {
      updatedLikedPosts.add(postId);
    }
    setLikedPosts(updatedLikedPosts); // Cập nhật danh sách bài viết đã được like
  };

  const onSubmit1 = async (albumKey) => {
    try {
      
     
      const result = await FetchApi.postLike({
        album_id: albumKey
      });
      console.log('resuilt: ', result);
      refetch();
        
    } catch (err) {
      console.log('err', err);
    }
  };

  const onSubmit2 = async data => {
    try {
      
     
      const { comment } = data;

      // const { cate_id, content } = data;
      console.log('test bình luận: ', comment,choose);
      // const result = await FetchApi.deleteAlbum(choose);
      const result = await FetchApi.postComment({
        album_id: choose,
       title: comment
       
      });
      refetchcomment();
      reset();
        
    } catch (err) {
      console.log('err', err);
    }
  };

{for (const key in datas) {
  if (datas.hasOwnProperty(key)) {
    const item = datas[key];

    const hoatdong = item.hoatdong;
    const diemdanhden = item.diemdanhden;
    const diemdanhve = item.diemdanhve;
    const thucdon = item.thucdon;
    const album = item.album;
    const viewhoatdong = [];
    const viewthucdon = [];
    const viewalbum = [];
    views.push(
      <View key={key}>
            <View style={{paddingHorizontal:10,marginHorizontal:10,height:50,marginTop:5,borderRadius:10,backgroundColor:'#0298D3',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <Ionicons   name={'calendar'} size={35} color={'white'} />
              <Text allowFontScaling={false}style={{color:'white',fontSize:16}}>{formatDate(key)}</Text>
              
            </View>

            {Array.isArray(diemdanhden)?(null):(
               <View style={{borderWidth:0.7,backgroundColor:'white',paddingTop:5,paddingBottom:5,borderRadius:10,borderColor:'#0298D3',marginHorizontal:10, flexDirection:'row',height:'auto',marginVertical:5}}>
               
               <View style={{flex:1,marginLeft:17}}>
                 <Text allowFontScaling={false}style={{color:'black',fontSize:17,fontWeight:500}}> 
              
                   Điểm danh đến </Text>
                 <Text allowFontScaling={false}style={{color:'gray',fontSize:15,fontWeight:400,marginTop:18}}>
                    <Text> <Icon name="clock-o" size={20} color="#0298D3" /> </Text>
                   Lúc: 
                   <Text allowFontScaling={false}style={{color:'black'}}> {diemdanhden.gioden}</Text></Text>
                 <Text allowFontScaling={false}style={{color:'gray',fontSize:15,fontWeight:400,marginTop:18}} >
                 <Text> <Icon name="user" size={23} color="#F0635C" /> </Text>
                    Bởi: <Text allowFontScaling={false}style={{color:'#F0635C'}}>{diemdanhden.gvdon}</Text></Text>
                 <Text allowFontScaling={false}style={{color:'black',fontSize:15,fontWeight:400,marginTop:18}}>
                 <Text> <Icon name="check-circle" size={20} color="#01AD9F" /> </Text>
                   Đi học</Text>
 
               </View>
             </View>
            )}

{Array.isArray(diemdanhve)?(null):(
              <View style={{borderWidth:0.7,paddingTop:5,backgroundColor:'white',paddingBottom:5,borderRadius:10,borderColor:'#0298D3',marginHorizontal:10, flexDirection:'row',height:'auto',marginVertical:5}}>
             
              <View style={{flex:1, marginLeft:17}}>
                <Text allowFontScaling={false}style={{color:'black',fontSize:17,fontWeight:500}}> 
                
                  Điểm danh về </Text>
                <Text allowFontScaling={false}style={{color:'gray',fontSize:15,fontWeight:400,marginTop:18}}>
                   <Text> <Icon name="clock-o" size={20} color="#0298D3" /> </Text>
                  Lúc: 
                  <Text allowFontScaling={false}style={{color:'black'}}> {diemdanhve.giove}</Text></Text>
                <Text allowFontScaling={false}style={{color:'gray',fontSize:15,fontWeight:400,marginTop:18}} >
                <Text> <Icon name="user" size={23} color="#F0635C" /> </Text>
                   Bởi: <Text allowFontScaling={false}style={{color:'#F0635C'}}>{diemdanhve.gvtra}</Text></Text>
                <Text allowFontScaling={false}style={{color:'black',fontSize:15,fontWeight:400,marginTop:18}}>
                <Text> <Icon name="check" size={20} color="#01AD9F" /> </Text>
                  Người đón: {diemdanhve.nguoidon}</Text>

              </View>
            </View>
             )}


            {Array.isArray(album) ?(
              null
            ):(
              <View style={{marginHorizontal:10}}>
                 {viewalbum}
              </View>
            
            )}


            {Array.isArray(hoatdong) ?(
              null
            ):(
              <View  style={{borderWidth:0.7,backgroundColor:'white',paddingTop:5,borderColor:'#0298D3',paddingBottom:5,borderRadius:10,marginHorizontal:10,height:'auto',marginVertical:5}}>
              <View style={{flexDirection:'row',marginHorizontal:5}}>
              <MaterialIcon name="celebration" size={30} color="#FBA534" />
  
                <Text allowFontScaling={false}style={{color: 'black', paddingTop:4,fontSize:17,}}>
                  Hoạt động trong ngày 
                </Text>
                </View>
                 <View style={{marginHorizontal:8,marginVertical:5,borderRadius:10,borderColor:'#0298D3'}}>
                  <View style={{flexDirection:'row'}}>
                    <View style={{flex:1,borderRightWidth:0.2,borderColor:'#0298D3',justifyContent:'center',alignItems:'center',paddingVertical:10}}>
                      <Text allowFontScaling={false}style={{color:'black'}}>Thời gian</Text>
                    </View>
                    <View style={{flex:1.8,justifyContent:'center',alignItems:'center'}}>
                    <Text allowFontScaling={false}style={{color:'black'}}>Nội dung</Text>
                    </View>
                  </View>
                 {viewhoatdong}
                 
                 </View>
              </View>
            )}
            
            {Array.isArray(thucdon) ?(
              null
            ):(
              <View  style={{borderWidth:0.7,backgroundColor:'white',paddingTop:5,borderColor:'#0298D3',paddingBottom:5,borderRadius:10,marginHorizontal:10,height:'auto',marginVertical:5}}>
              <View style={{flexDirection:'row',marginHorizontal:5}}>
              <MaterialIcon name="celebration" size={30} color="#FBA534" />
  
                <Text allowFontScaling={false}style={{color: 'black', paddingTop:4,fontSize:17,}}>
                  Thực đơn trong ngày
                </Text>
                </View>
              
                
                 {viewthucdon}
                 
                
              </View>
            )}

            
           
            
            



           </View>
    );
    if (hoatdong) {
      for (const hoatdongKey in hoatdong) {
        if (hoatdong.hasOwnProperty(hoatdongKey)) {
          const hoatdongItem = hoatdong[hoatdongKey];
          // console.log('hoatdongKey: ', hoatdongKey, hoatdongItem.tieude)
          // Tạo một view cho mỗi hoạt động kèm theo key của nó
          viewhoatdong.push(
            <View key={hoatdongKey} style={{flexDirection:'row'}}>
                    <View style={{flex:1,borderRightWidth:0.2,borderColor:'#0298D3',paddingVertical:15,borderTopWidth:0.2,justifyContent:'center',alignItems:'center'}}>
                    <Text allowFontScaling={false}style={{color:'black'}}>{hoatdongItem.thoigian}</Text>
                    </View>
                    <View style={{flex:1.8,justifyContent:'center',borderColor:'#0298D3',borderTopWidth:0.2}}>
                    <Text allowFontScaling={false}style={{color:'black',marginLeft:15, marginVertical:5}}>{hoatdongItem.tieude}</Text>
                    <Text allowFontScaling={false}style={{color:'black',marginLeft:15, marginRight:10,marginBottom:10}}>{hoatdongItem.noidung}</Text>
                    </View>
                  </View>
          );
        }
      }
    }

    if (thucdon) {
      for (const thucdonKey in thucdon) {
        if (thucdon.hasOwnProperty(thucdonKey)) {
          const thucdonItem = thucdon[thucdonKey];
          
          viewthucdon.push(
            <View key={thucdonKey}>
            <View>
          <Text allowFontScaling={false}style={{color: '#0298D3',fontSize:17, marginHorizontal: 20}}>
        {thucdonItem?.buaan}
      </Text>
          </View>
          <View style={{alignItems:'center'}}>
          <View style={styles.blockList} >
          
            <Image
              style={{width: '35%', height: 86, borderRadius: 10}}
              source={{
                uri: thucdonItem?.hinhanh
                 
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
                  
                  color: 'black',
                  fontSize: Sizes.h6,
                }}
                multipleLines={true}
                numberOfLines={10}>
                {thucdonItem?.monan}
              </Text>
             
            </View>
          </View>
          </View>
          </View>
          );
        }
      }
    }
    if (album) {
      for (const albumKey in album) {
        if (album.hasOwnProperty(albumKey)) {
          const albumItem = album[albumKey];
          const url_file = albumItem.url_file;
          const image = [];
          for(const url_fileKey in url_file){
            const url = url_file[url_fileKey]
            image.push({uri: url,id:url_fileKey});
          }
       
          viewalbum.push(
            <View
            key={albumKey}
            style={{
              marginTop: 5,
              padding: 10,
              borderRadius: 5,
              backgroundColor: 'white',
              width: '100%',
              borderWidth:0.5,
              borderColor:'#0298D3'
            }}
          >
             <View style={{flexDirection: 'row'}}>
                <View>
                  <Image
                    source={{
                      uri: 'https://zpsocial-f45-org.zadn.vn/28efe032a8d4478a1ec5.jpg'
                    }}
                    style={{
                      width: 60,
                      height: 60,
                      marginHorizontal: 5,
                      borderRadius: 70,
                    }}
                  />
                </View>
                <View style={{flex: 1}}>
                  <Text allowFontScaling={false}style={{color: 'black', fontSize: 18}}>
                   Phùng Văn Thành
                  </Text>
                  <Text allowFontScaling={false}style={{color: 'gray'}}>12/12/2023 </Text>
                </View>
                <View>
                 
                </View>
              </View>
              <View>
                <Text
                allowFontScaling={false}
                  style={styles.text}
                  numberOfLines={expanded ? undefined : 3}>
                  {albumItem?.tieude}
                </Text>
                {albumItem?.tieude.length > maxChars && (
                  <TouchableOpacity onPress={toggleContent}>
                    <Text allowFontScaling={false}style={styles.readMore}>
                      {expanded ? 'Rút gọn' : 'Xem thêm'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
  
              <View style={{height: 300}}>
              {/* (item.data_items.data_info || []).map((dataItem, dataItemIndex) => {
                // console.log('Inner item: ', dataItem.url_file);
                urlFiles.push({ uri: dataItem.url_file });
                
              }); */}
                <ImageAlbum images={image}/>
              
              </View>
              <View style={{flexDirection: 'row',marginTop:20}}>
                <TouchableOpacity onPress={() => handleLike(albumKey)}>
                  <View style={{flexDirection: 'row', marginRight: 10}}>
                  <Ionicons name={'heart-sharp'} size={25} color={likedPosts.has(albumKey)?'red':'gray'} />
                    <Text allowFontScaling={false}style={{color: 'black', fontSize: 17}}>{likesCount[albumKey]}</Text>
                  </View>
                </TouchableOpacity>
  
                <TouchableOpacity 
               
                onPress={()=>{
                  openBottomSheet1();
                  setChoose(albumKey)
                }}
               
                >
                  <View style={{flexDirection: 'row'}}>
                    <Ionicons
                      name={'chatbox-ellipses-outline'}
                      size={25}
                      color={'black'}
                    />
                    <Text allowFontScaling={false}style={{color: 'black', fontSize: 17}}>{albumItem.count_comment}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            
         
       
          </View>
          );
        }
      }
    }
    
  }
}
}

const RenderItemComponent = ({ item }) => (
  <View>
    {item}
  </View>
);


// console.log('test view: ', views);
  // if (isLoading) {
  //   return <Loading />;
  // }

  const renderFooter = () => {
    // Hiển thị indicator khi đang fetch dữ liệu
    return loading ? (
      <View style={{paddingVertical: 20}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    ) : null;
  };

  const maxChars = 100;

  const toggleContent = () => {
    setExpanded(!expanded);
  };



  const openBottomSheet1 = () => {
    Animated.timing(overlayOpacity1, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setIsBottomSheetOpen1(true);
      // bottomSheetModalRef1.current?.present();
    });
  };
  const closeBottomSheet1 = () => {
    Animated.timing(overlayOpacity1, {
      toValue: 0,
      duration: 50,
      useNativeDriver: false,
    }).start(() => {
      setIsBottomSheetOpen1(false);
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
    closeBottomSheet1();
    // refetch();
  };
  
  const handleScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const maxOffset = event.nativeEvent.contentSize.height - event.nativeEvent.layoutMeasurement.height;
  
    if (maxOffset - currentOffset <= 10 && !reachedEnd) {
      setReachedEnd(true);
   
      setLoading(true);

      setTimeout(() => {
        fetchData();
        setReachedEnd(false);
        // setLoading(false); // Ẩn spinner sau khi fetch dữ liệu xong
      }, 1000);
  
    // setFetchTimeout(newTimeout);
    } else if (maxOffset - currentOffset > 10) {
      setReachedEnd(false);
    }
  };
  
  
  return (
    <BottomSheetModalProvider>
    <SafeAreaView style={styles.container}>
      
      <View style={styles.info}>
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <Image
            source={{
              uri: info?.avatar_url
            }}
            style={{width:'80%',height:'80%',borderRadius:100}}
          />
        </View>
        <View style={{flex:2.8,justifyContent:'center',}}>
          <View style={{marginHorizontal:10,width:'100%'}}>
          <Text allowFontScaling={false}style={{color:'black',fontSize:18,fontWeight:700}}>{info?.first_name} {info?.last_name}</Text>
          <Text allowFontScaling={false}style={{color:'black',fontSize:15,fontWeight:300}}>Lớp: {info?.class_name}</Text>
          <Text allowFontScaling={false}style={{color:'black',fontSize:15,fontWeight:300}}>Trường: {info?.school_name} </Text>
          </View>
        </View>
      </View>
      <View style={styles.content}>
          {/* <ScrollView>
          {views}
            
          </ScrollView> */}


          <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
           onEndReachedThreshold={5} // Khoảng cách từ bottom của danh sách tới cuối màn hình
           ListFooterComponent={renderFooter} // Hiển thị indicator khi đang load thêm dữ liệu
           onScroll={handleScroll}
          data={views} // Chuyển mảng views vào prop data của FlatList
          keyExtractor={(item, index) => index.toString()} // Định danh cho mỗi item trong FlatList
          renderItem={({ item }) => (
           <RenderItemComponent item={item} /> // Render mỗi item trong FlatList
           )}
        />






          {isBottomSheetOpen1 && (
          <Animated.View
            style={[styles.overlay1, {opacity: overlayOpacity1}]}
          >
         <View
    style={{
     
      width: '100%',
      flex:1,
      backgroundColor: 'white',
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      padding: 20,
      
    }}
  >
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <Icons name={'close'} size={21} color={'rgba(0, 0, 0, 0)'} />
      <Text allowFontScaling={false}style={{ fontSize: 20, color: 'black', textAlign: 'center' }}>
        Bình luận
      </Text>
      <TouchableOpacity onPress={handleOverlayPress}>
        <Icons name={'close'} size={24} color={'black'} />
      </TouchableOpacity>
    </View>

    <View
      style={{
        marginVertical: 10,
      }}
    >
      <Text allowFontScaling={false}style={{ color: 'gray' }}>Có {datacomment?.data_info?.length} bình luận</Text>
    </View>
    <FlatList
     
      data={datacomment?.data_info || []}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => {
        const onSubmit4 = async (data) => {
          try {
            setSubmiting(true);
            const result = await FetchApi.deleteComment(item.id);
            refetchcomment();
          } catch (err) {
            console.log('err', err);
          }
        }
        return (
          <View style={{ marginBottom: 20 }} key={index}>
            <View style={{ flexDirection: 'row' }}>
              <View>
                <Image
                  source={{
                    uri: item.avatar,
                  }}
                  style={{
                    width: 35,
                    height: 35,
                    marginRight: 10,
                    borderRadius: 100,
                   
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                allowFontScaling={false}
                  style={{
                    color: 'black',
                    marginBottom: 5,
                    fontSize: 16,
                    fontWeight: 500,
                  }}
                >
                  {item.name}
                </Text>
                <Text allowFontScaling={false} style={{ color: 'black', fontSize: 15 }}>{item.title}</Text>
              </View>
              {item.relative_id === item.user_id?
              (<TouchableOpacity onPress={onSubmit4}>
                <Text allowFontScaling={false} style={{ color: 'black', fontSize: 15 }}>
                  Xoá
                </Text>
              </TouchableOpacity>)
              :(null)}
              
            </View>
          </View>
        );
      }
    }
    />
    
  </View>

   <KeyboardAvoidingView

      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={190}
    >
  <View
    style={{
      
      flexDirection: 'row', 
      paddingBottom:20,
      paddingTop:20,
      marginHorizontal:10,
      
    }}
  >
    <Controller
      control={control}
      name="comment"
      defaultValue=""
      rules={{ required: 'Chưa nhập comment' }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextInput
        allowFontScaling={false}
        onChangeText={(text) => {
          onChange(text); // Gọi hàm onChange để quản lý trạng thái của Controller
          // const isNotEmpty = !!text; // Kiểm tra xem TextInput có nội dung không
          // Sử dụng biến isNotEmpty theo cách mà bạn muốn
          setIsEmty(text);
        }}
          value={value}
          placeholder="Nhập bình luận..."
          placeholderTextColor={'gray'}
          style={{ width: '90%',color:'black', paddingVertical:0,paddingHorizontal:10,borderBottomWidth:0.2,borderColor:'gray' }}
          multiline={true}
          maxLength={255}
        />
      )}
    />
    <TouchableOpacity onPress={handleSubmit(onSubmit2)} style={{ width: '10%', justifyContent: 'center' }}>
      <Ionicons name={'send-sharp'} size={25} color={isEmty ? '#0298D3' : 'gray'} />
    </TouchableOpacity>
  </View>
  </KeyboardAvoidingView> 

          </Animated.View>
        )}
      </View>
    </SafeAreaView>
    </BottomSheetModalProvider>
  );
};
const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    // alignItems: 'center',
    backgroundColor: '#F5F5F5',
    
  },
  info:{
   
    flex:1,
    flexDirection:'row',
    borderRadius:10,
    marginHorizontal:5
    
  },
  content:{
 
    flex:5.5
  },
  text: {
    color: 'black',
    marginHorizontal: 10,
    marginTop:10
  },
  readMore: {
    color: 'gray',
    marginHorizontal: 10,
    paddingVertical: 5,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  singleImage: {
    width: '98%', 
    height: 300, 
    borderRadius:10
  },
  twoImages: {
    width: '98%', 
    height: 300, 
    borderRadius:10
  },
  threeImages: {
    width: '98%', 
    height: 145, 
    margin: 1,
    borderRadius:10
  },

  hiddenImage: {
    margin: 0.5,
    width: '49%', // Hiển thị cho số lượng ảnh đã ẩn
    height: 150, // Hoặc bất kỳ kích thước nào bạn muốn
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Hoặc màu nền khác
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Đặt overlay để che kín ImageBackground
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền mờ (rgba để có độ trong suốt)
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay1: {
    ...StyleSheet.absoluteFillObject, // Đặt overlay để che kín ImageBackground
    backgroundColor:'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackground: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Đảm bảo hình ảnh nền nằm vừa khung
  },
  singleView: {
    width: '100%',
  },
  twoView: {
    width: '49%',
    margin: 1,
  },
  modalImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  pagination: {
    bottom: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 100,
    right: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
export default HomeScreen;