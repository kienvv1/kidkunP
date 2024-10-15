import React, {useEffect, useState} from 'react';

import {Provider} from 'react-redux';
import store from './store';
import AppContent from './AppContent';
import {QueryClient, QueryClientProvider} from 'react-query';
import { ToastProvider } from 'react-native-toast-notifications'

import {
  NotificationListner,
  requestUserPermission,
} from './utils/pushnotificationHelper';
const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    requestUserPermission();
    NotificationListner();
  }, []);

  return (
    <ToastProvider
    
    successColor="green"
    offsetBottom={100}
  
    >
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent/>
      </QueryClientProvider>
    </Provider>
    </ToastProvider>
  );
};

export default App;
