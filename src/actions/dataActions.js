// src/actions/dataActions.js
export const setData = data => {
  return {
    type: 'SET_DATA',
    payload: data,
  };
};
export const setNotiToken = token => {
  return {
    type: 'SET_TOKEN',
    payload: token,
  };
};
export const updateNotificationData = newData => ({
  type: 'UPDATE_NOTIFICATION_DATA',
  payload: newData,
});
