import React, { useState ,useEffect} from 'react';
import { View,Text ,StyleSheet,Dimensions, Image,TextInput, TouchableOpacity} from 'react-native';
import { CheckBox } from '@rneui/themed';
import {Loading} from '../../elements';
import {useQuery} from 'react-query';
import {FetchApi} from '../../utils/modules';
import { useToast} from "react-native-toast-notifications";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';

const Profile = () =>{

  const [selectedMedia, setSelectedMedia] = useState([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaLinks, setMediaLinks] = useState('');
  const [avatar, setAvatar] = useState('');
    const [text, setText] = useState('');
    const [text1, setText1] = useState('');
    const [date, setDate] = useState('');
    const [email, setEmail] = useState('');
    const [selectedIndex, setSelectedIndex] = React.useState(-1);
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const toast = useToast();


    const {data, isLoading,refetch} = useQuery(['getProfile'], () => FetchApi.profile());


    useEffect(() => {
        setText(data?._data?.user_info?.first_name);
        setText1(data?._data?.user_info?.last_name);
        setDate(data?._data?.user_info?.birthday);
        setEmail(data?._data?.user_info?.email);
        setPhone(data?._data?.user_info?.phone);
        setAddress(data?._data?.user_info?.address);

        if(data?._data?.user_info?.gender === '0'){
            setSelectedIndex(0)
        }else{
            setSelectedIndex(1)
        }
      }, [data]);


   

    if (isLoading) {
      return <Loading />;
    }


    const uploadImageToFirebase = async (imageUri) => {
      if (!imageUri) {
        Alert.alert('Lỗi', 'Vui lòng chọn ảnh trước khi tải lên.');
        return;
      }
    
      setUploadingMedia(true);
    
      // Giảm kích thước ảnh trước khi tải lên
      ImagePicker.openCropper({
        path: imageUri,
        width: 300, // Đặt kích thước mới cho ảnh
        height: 300,
        compressImageQuality: 0.7, // Giảm chất lượng ảnh (0.7 là một giá trị tham khảo)
        cropperToolbarTitle: 'Chỉnh sửa ảnh',
      })
        .then(async (croppedImage) => {
          const filename = croppedImage.path.substring(croppedImage.path.lastIndexOf('/') + 1);
          const reference = storage().ref(`images/${filename}`);
    
          try {
            await reference.putFile(croppedImage.path);
            console.log('Image uploaded to Firebase successfully.');
      
            // Lấy liên kết (URL) của hình ảnh sau khi tải lên Firebase
            const imageURL = await reference.getDownloadURL();
            
            // Thêm đường link vào mảng mediaLinks
            setMediaLinks(imageURL);
        
            // console.log('Image URL:', imageURL);
        
            // ...
          } catch (error) {
            console.error('Error uploading image to Firebase: ', error);
            // Alert.alert('Lỗi', 'Đã xảy ra lỗi khi tải lên hình ảnh. Vui lòng thử lại sau.');
          }
      
          setUploadingMedia(false);
        })
        .catch((error) => {
          console.log(error);
          setUploadingMedia(false);
        });
    };
    
  

    const handleMediaPicker = () => {
      ImagePicker.openPicker({
        mediaType: 'photo',
        multiple: true,
        maxFiles: 1,
      })
        .then((media) => {
          setSelectedMedia(media);
          
          // // Gọi hàm upload cho từng tệp trong mảng selectedMedia
          media.forEach((item) => {
            setAvatar(item.path)
            uploadImageToFirebase(item.path);
          });
          
          // setMediaLinks('');
           
        })
        .catch((error) => {
          console.log(error);
        });
    };


    const onSubmitUpdate = async () => {
        try {
      
        
          const result = await FetchApi.updateProfile({
            email:email,
            first_name:text,
            last_name:text1,
            birthday:date,
            gender: selectedIndex ,
            identity_card: 123456789,
            phone: phone,
            address: address,
            nationality: "VN",
            avatar: mediaLinks=== '' ? data?._data?.user_info?.avatar_url : mediaLinks
           
          });
          
          if(result._msg_code===1){
            toast.show("Cập nhật thông tin thành công",{
                type: "success",
                placement: "bottom",
                duration: 4000,
                offset: 30,
                animationType: "zoom-in",
              });
              refetch();
          }else{
            toast.show("Vui lòng nhập đủ thông tin",{
                type: "danger",
                placement: "bottom",
                duration: 4000,
                offset: 30,
                animationType: "zoom-in",
              });
          }

          
            
        } catch (err) {
          console.log('err', err);
          
        }
      };

    const onChangeText = (inputText) => {
      setText(inputText);
    };

    const onChangeText1 = (inputText) => {
        setText1(inputText);
      };
      const onChangeText2 = (inputText) => {
        setDate(inputText);
      };
      const onChangeText3 = (inputText) => {
        setEmail(inputText);
      };
      const onChangeText4= (inputText) => {
        setPhone(inputText);
      };
      const onChangeText5= (inputText) => {
        setAddress(inputText);
      };
   
    const handleCheckBox0Press = () => {

     
        setSelectedIndex(0);
  
       
        
      };
      const handleCheckBox1Press = () => {
        setSelectedIndex(1);
  
      };

      

    return(
        <View style={styles.container}>
             <KeyboardAwareScrollView
    extraScrollHeight={70}
    enableOnAndroid={true}
    
    >
            {uploadingMedia 
            ?
            (<Text style={{alignItems:'center',justifyContent:'center',padding:20}}>Đang tải lên...</Text>):
            ( <TouchableOpacity onPress={handleMediaPicker} style={{alignItems:'center',justifyContent:'center',padding:20}} >
            {avatar 
            ? 
            (<Image
              style={{width: 120, height: 120,borderRadius:100,borderWidth:2,borderColor:'white'}}
              source={{
               uri: avatar
              }}
          />)
            :
            (<Image
              style={{width: 120, height: 120,borderRadius:100,borderWidth:2,borderColor:'white'}}
              source={{
               uri: data?._data?.user_info?.avatar_url
              }}
          />)}
             
             <Image
                 style={{width: 20, height: 20,backgroundColor:'white',borderRadius:100,position:'absolute',right:145,bottom:30}}
                 source={require('../../utils/Images/pen.png')}
             />
          </TouchableOpacity>)}
           
           
            <View style={{flex:3}}>
                <View style={{flexDirection:'row',marginBottom:10,backgroundColor:'white',paddingVertical:10,paddingLeft:10, marginHorizontal:10,borderRadius:7}}>
                    <Text allowFontScaling={false} style={{color:'black',fontSize:17}}>Họ đệm :    </Text>
                    <TextInput
                    maxLength={30}
                    allowFontScaling={false}
          style={{ color:'black', borderColor: 'gray' ,fontSize:17}}
              onChangeText={onChangeText}
        value={text}
        placeholder="Nhập họ và tên đệm..."
                    />
                </View>
                <View style={{flexDirection:'row',marginBottom:10,backgroundColor:'white',paddingVertical:10,paddingLeft:10, marginHorizontal:10,borderRadius:7}}>
                    <Text allowFontScaling={false} style={{color:'black',fontSize:17}}>Tên :   </Text>
                    <TextInput
                    maxLength={40}
                    allowFontScaling={false}
          style={{ marginLeft:37, borderColor: 'gray' ,fontSize:17}}
              onChangeText={onChangeText1}
        value={text1}
        placeholder="Nhập tên..."
                    />
                </View>
                <View style={{flexDirection:'row',marginBottom:10,backgroundColor:'white',paddingVertical:10,paddingLeft:10, marginHorizontal:10,borderRadius:7}}>
                    <Text allowFontScaling={false} style={{color:'black',fontSize:17}}>Ngày sinh:  </Text>
                    <TextInput
                    maxLength={40}
                    allowFontScaling={false}
          style={{ color:'black', borderColor: 'gray' ,fontSize:17}}
              onChangeText={onChangeText2}
        value={date}
        placeholder="Nhập ngày sinh..."
                    />
                </View>

                <View style={{flexDirection:'row',marginBottom:10,backgroundColor:'white',paddingVertical:10,paddingLeft:10, marginHorizontal:10,borderRadius:7}}>
                    <Text allowFontScaling={false} style={{color:'black',fontSize:17}}>Email:  </Text>
                    <TextInput
                    maxLength={40}
                    allowFontScaling={false}
          style={{ color:'black',marginLeft:35, borderColor: 'gray' ,fontSize:17}}
              onChangeText={onChangeText3}
        value={email}
        placeholder="Nhập email..."
                    />
                </View>

                <View style={{flexDirection:'row',marginBottom:10,backgroundColor:'white',paddingVertical:10,paddingLeft:10, marginHorizontal:10,borderRadius:7}}>
                    <Text allowFontScaling={false} style={{color:'black',marginTop:17,fontSize:17}}>Giới tính:  </Text>
                
                    <CheckBox
                   titleProps={styles.checkBoxTitle}
      
      title="Nam"
                   
        checked={selectedIndex === 0}
        onPress={handleCheckBox0Press}     
       checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        
      />
    
      <CheckBox
      titleProps={styles.checkBoxTitle}
      title="Nữ"
        checked={selectedIndex === 1}
        onPress={handleCheckBox1Press}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
      />
                </View>

                <View style={{flexDirection:'row',marginBottom:10,backgroundColor:'white',paddingVertical:10,paddingLeft:10, marginHorizontal:10,borderRadius:7}}>
                    <Text allowFontScaling={false} style={{color:'black',fontSize:17}}>SĐT:  </Text>
                    <TextInput
                    maxLength={40}
                    allowFontScaling={false}
          style={{ color:'black',marginLeft:40, borderColor: 'gray' ,fontSize:17}}
              onChangeText={onChangeText4}
        value={phone}
        placeholder="Nhập số điện thoại..."
                    />
                </View>

                <View style={{flexDirection:'row',marginBottom:10,backgroundColor:'white',paddingVertical:10,paddingLeft:10, marginHorizontal:10,borderRadius:7}}>
                    <Text allowFontScaling={false} style={{color:'black',fontSize:17}}>Địa chỉ:  </Text>
                    <TextInput
                    maxLength={100}
                    allowFontScaling={false}
          style={{ color:'black',marginLeft:20, borderColor: 'gray' ,width:260,fontSize:17}}
              onChangeText={onChangeText5}
        value={address}
        placeholder="Nhập địa chỉ..."
                    />
                </View>

                <View style={{alignItems:'center',marginTop:10}}>
                    <TouchableOpacity onPress={()=>onSubmitUpdate()}  style={{alignItems:'center',padding:8,borderRadius:15,backgroundColor:'#0298D3'}} >
                    <Text allowFontScaling={false} style={{color:'white',fontSize:17}}>
                        Cập nhật
                    </Text>
                    </TouchableOpacity >
                </View>
            </View>
            </KeyboardAwareScrollView>
        </View>
    )
} 

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#D8D8D8',
     
    },
    checkBoxTitle: {
        fontSize: 17, // Kích cỡ chữ cố định
        allowFontScaling: false, // Không cho phép scaling font
      },
    
  });
export default Profile;