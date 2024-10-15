// src/store/index.js
import {configureStore, combineReducers} from '@reduxjs/toolkit';
import dataReducer from '../reducers/dataReducer';

const rootReducer = combineReducers({
  data: dataReducer,
});

const store = configureStore({
  reducer: rootReducer,
  // Thêm các middleware khác nếu cần thiết
});

export default store;
