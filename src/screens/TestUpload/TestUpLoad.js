import React, { useEffect, useState } from 'react';
import database from '@react-native-firebase/database';
import { View ,Text} from 'react-native';

const TestUpLoad = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      const ref = database().ref('users');
      // Lắng nghe sự kiện thay đổi
      ref.on('value', (snapshot) => {
        if (snapshot.val()) {
          setData(snapshot.val());
        }
      });

      // Return một hàm cleanup để ngừng lắng nghe khi component bị unmount
      return () => ref.off('value');
    };

    fetchData();
  }, []);
  return (
    <View>
      {/* Hiển thị dữ liệu */}
      <Text>{JSON.stringify(data)}</Text>
    </View>
  );
};

export default TestUpLoad;
