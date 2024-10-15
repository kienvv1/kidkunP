import React from 'react';
import { View, FlatList, Image, StyleSheet,Text,Dimensions } from 'react-native';


const data = [
  { id: '1',name: 'Học phí',imageUrl: 'https://example.com/image1.jpg' },
  { id: '2',name: 'Lịch học',imageUrl: 'https://example.com/image2.jpg' },
  { id: '3',name: 'Hoạt động',imageUrl: 'https://example.com/image3.jpg' },
  { id: '4',name: 'Dịch vụ',imageUrl: 'https://example.com/image3.jpg' },
  // Add more data objects as needed
];

const MyFlatList = () => {
    const columns = 2;
    const itemWidth = Dimensions.get('window').width /2.12;
  
  const renderItem = ({ item }) => (
   
     <View style={[styles.itemContainer,{ width: itemWidth }]} >
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text>{item.name}</Text>
     </View>
   
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={columns}
    />
  );
};

const styles = StyleSheet.create({
    itemContainer: {
        width:'45%',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        padding: 10,
        backgroundColor:'pink'
      },
      image: {
        width: '100%', // Adjust the width of the image as needed
        height: 100, // Adjust the height of the image as needed
        borderRadius: 8,
      },
  name: {
    textAlign:'center',
    fontSize:16,
    fontWeight:'bold',
    marginTop:8,
  }
});

export default MyFlatList;
