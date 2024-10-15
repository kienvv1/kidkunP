import {getUniqueId, getSystemVersion} from 'react-native-device-info';
import {Apis, isIOS} from '../resource';
import {AccountService} from '../Account';
import {ResetFunction} from './ResetFunction';

const CommonCall = async (api, header) => {
  // console.log('api', api);
  // const Strings = LanguageService.get();
  // const networkState = await NetInfo.fetch();
  // if (!networkState.isConnected) {
  //   throw new Error(CheckLogic.No_internet);
  // }
  const account = AccountService.get();
  // console.log('account', account);
  try {
    let headers = {
      'Content-Type': 'application/json',
      deviceid: getUniqueId()._j,
    };
    if (header) {
      //overide Content-type
      headers = {
        ...headers,
        ...header.headers,
      };
    }
    if (account && account.api_token && !api.includes(Apis.login)) {
      headers = {
        ...headers,
        Authorization: 'Bearer ' + account.api_token,
        // deviceid: '2D92C8D4-942D-455D-85A2-4B22AB84BE3F',
      };
    }
    let head = {...header, headers};
    // console.log('head', head);
    let response = await fetch(api, head);

    // console.log('response', response);

    if (
      response.status === 500 ||
      response.status === 502 ||
      response.status === 404 ||
      response.status === 504
    ) {
      throw new Error('ERROR SERVER');
    }

    // if (response.status !== 200) {
    //   throw new Error(result.message);
    // }
    const result = await response.json();
    // console.log('result', result);
    if (result.message === 'Phiên làm việc đã hết. Bạn cần đăng nhập lại.') {
      ResetFunction.resetToLogin();
      console.log('Phiên làm việc đã hết hạn');
    }

    return result;
  } catch (error) {
    // console.log('errorFetch', error);
    if (error.message === 'No Internet') {
      throw new Error(Strings.Network_request_fail);
    }
    if (error.message === "JSON Parse error: Unrecognized token '<'") {
      throw new Error('Data_is_not_correct');
    }
    if (error.message === 'Strings.Account_deactive') {
      throw new Error('Strings.Account_deactive');
    }
    throw new Error(error.message);
  }
};
const CommonCallWithoutUseQuery = async (api, header) => {
  // console.log('api', api);
  // const Strings = LanguageService.get();
  // const networkState = await NetInfo.fetch();
  // if (!networkState.isConnected) {
  //   throw new Error(CheckLogic.No_internet);
  // }
  const account = AccountService.get();
  // console.log('account', account);
  try {
    let headers = {
      'Content-Type': 'application/json',
      deviceid: getUniqueId()._j,
      // deviceid: 'abcdasadfaf324',
    };
    if (header) {
      //overide Content-type
      headers = {
        ...headers,
        ...header.headers,
      };
    }
    if (account && account.api_token && !api.includes(Apis.login)) {
      headers = {
        ...headers,
        Authorization: 'Bearer ' + account.api_token,
      };
    }
    let head = {...header, headers};
    let response = await fetch(api, head);

    // console.log('response', response);

    if (
      response.status === 500 ||
      response.status === 502 ||
      response.status === 404 ||
      response.status === 504
    ) {
      return {
        code: response.status,
        message: 'Lỗi kết nối đến server',
      };
    }

    const result = await response.json();
    // console.log('result', result);

    if (result.message === 'Phiên làm việc đã hết. Bạn cần đăng nhập lại.') {
      ModalBase.error({
        message: 'Phiên làm việc đã hết. Bạn cần đăng nhập lại.',
      });
      // ResetFunction.resetToLogin();
    }

    return result;
  } catch (error) {
    // console.log('errorFetch', error);
    return {message: error.message};
    // if (error.message === CheckLogic.No_internet) {
    //   return {code: 500, message: Strings.Network_request_fail};
    // }
    // if (error.message === "JSON Parse error: Unrecognized token '<'") {
    //   return {code: 11, message: Strings.Data_is_not_correct};
    // }
    // if (error.message === Strings.Account_deactive) {
    // }
    // return {code: 12, message: Strings.something_wrong};
  }
};

const FetchApi = {
  login: async ({username, password, appcode}) => {
    try {
      const info = {
        password,
        username,
        appcode,
      };
      const request = JSON.stringify(info);
      const header = {
        method: 'POST',
        body: request,
      };
      const api = Apis.login;
      const result = await CommonCallWithoutUseQuery(api, header);
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  logout: async () => {
    try {
      const header = {
        method: 'POST',
      };
      const api = Apis.logout;
      const result = await CommonCall(api, header);
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  registerNotificationToken: async obj => {
    try {
      const header = {
        method: 'PUT',
        body: JSON.stringify({
          ...obj,
          osname: isIOS ? 'Ios' : 'Android',
          osvesion: getSystemVersion(),
        }),
      };
      const api = Apis.registerNotificationToken;
      const result = await CommonCallWithoutUseQuery(api, header);
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  registerDeviceid: async () => {
    try {
      const header = {
        method: 'POST',
      };
      const api = Apis.registerDeviceid;
      const result = await CommonCall(api, header);
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  profile: async id => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.profile;
      const result = await CommonCallWithoutUseQuery(api, header);
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  updateProfile: async ({
    email,
    first_name,
    last_name,
    birthday,
    gender,
    identity_card,
    phone,
    address,
    nationality,
    avatar
  }) => {
    try {
      const info = {
        email,
    first_name,
    last_name,
    birthday,
    gender,
    identity_card,
    phone,
    address,
    nationality,
    avatar
      };
      const bodyData = {
        info,
      };
      const request = JSON.stringify(bodyData);
      const header = {
        method: 'PUT',
        body: request,
      };
      const api = Apis.updateProfile;
      
      const result = await CommonCall(api, header);
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },

  updateProfileChil: async ({
    student_id,
    first_name,
    last_name,
    sex,
    birthday,
    address,
    avatar
  }) => {
    try {
      const info = {
        first_name,
        last_name,
        sex,
        birthday,
        address,
        avatar
      };
      const bodyData = {
        info,
      };
      const request = JSON.stringify(bodyData);
      const header = {
        method: 'PUT',
        body: request,
      };
      const api = Apis.updateStudent(student_id);
      console.log('test body: ',bodyData);
      const result = await CommonCall(api, header);
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },



  home: async () => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.home;
      const result = await CommonCall(api, header);
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  home_relative: async () => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.home_relative;
      const result = await CommonCall(api, header);
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  getNews: async student_id => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.getNews(student_id);
      const result = await CommonCall(api, header);
      if (result._msg_code === 1) {
        return result._data?.data_info || [];
      }
      // console.log('test ds tin: ', result._data.data_info);
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },

  getProduct: async() => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.getProduct;
      const result = await CommonCall(api, header);
      if (result._msg_code === 1) {
        return result._data?.ds_sanpham || [];
      }
      // console.log('test ds tin: ', result._data.data_info);
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },

  getNewsDetail: async (id, student_id) => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.getNewsDetail({id, student_id});
      const result = await CommonCall(api, header);
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },

  getProductDetail: async (id) => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.getProductDetail(id);
      const result = await CommonCall(api, header);
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },

  getTableHeight: async student_id => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.getTableHeight(student_id);
      const result = await CommonCall(api, header);
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  getTableWeight: async student_id => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.getTableWeight(student_id);
      const result = await CommonCall(api, header);
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  getCharWeight: async student_id => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.getCharWeight(student_id);
      const result = await CommonCall(api, header);
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  getCharHeight: async student_id => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.getCharHeight(student_id);
      const result = await CommonCall(api, header);
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  getMenus: async student_id => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.getMenus(student_id);
      const result = await CommonCall(api, header);
      return result._data;
    } catch (error) {
      return {message: error.message};
    }
  },
  getMenusDay: async (student_id, date) => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.getMenusDay({student_id, date});
      const result = await CommonCall(api, header);
      return result._data;
    } catch (error) {
      return {message: error.message};
    }
  },
  getStudent: async student_id => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.getStudent(student_id);
      const result = await CommonCall(api, header);
      if (result._msg_code === 1) {
        return result._data?.user_info || [];
      }
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  getGrowth: async student_id => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.getGrowth(student_id);
      const result = await CommonCall(api, header);
      if (result._msg_code === 1) {
        return result;
      }
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  getOffSchool: async student_id => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.getOffSchool(student_id);
      const result = await CommonCall(api, header);
      if (result._msg_code === 1) {
        return result._data?.data_info || [];
      }
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  getOffSchoolcd: async student_id => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.getOffSchoolcd(student_id);
      const result = await CommonCall(api, header);
      if (result._msg_code === 1) {
        return result._data?.data_info || [];
      }
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  getListSend: async student_id => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.getListSend(student_id);
      const result = await CommonCall(api, header);
      if (result._msg_code === 1) {
        return result._data || [];
      }
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  postOffSchool: async ({
    description,
    user_id,
    student_id,
    from_date,
    to_date,
  }) => {
    try {
      const info = {
        description,
        user_id,
        student_id,
        from_date,
        to_date,
      };
      const bodyData = {
        info,
      };
      const request = JSON.stringify(bodyData);
      const header = {
        method: 'POST',
        body: request,
      };
      const api = Apis.postOffSchool;
      console.log('headerswww: ', header);
      const result = await CommonCall(api, header);
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  getFee: async (student_id, date) => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.getFee({student_id, date});
      const result = await CommonCall(api, header);
      // console.log('test ds tin: ', result._data.data_info);
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  getAdvice: async (student_id,id) => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.getAdvice({student_id,id});
      const result = await CommonCall(api, header);
      if (result._msg_code === 1) {
        return result._data?.data_info || [];
      }
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  getAdvicecd: async (student_id,id) => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.getAdvicecd({student_id,id});
   
      const result = await CommonCall(api, header);
      if (result._msg_code === 1) {
        return result._data?.data_info || [];
      }
    
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  getAdviceCate: async student_id => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.getAdviceCate(student_id);
      const result = await CommonCall(api, header);
      if (result._msg_code === 1) {
        return result._data || [];
      }
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  postAdvice: async ({content, user_id, category_id, title, student_id}) => {
    try {
      const info = {
        title,
        content,
        user_id,
        category_id,
        student_id,
      };
      const bodyData = {
        info,
      };
      const request = JSON.stringify(bodyData);
      const header = {
        method: 'POST',
        body: request,
      };
      const api = Apis.postAdvice;
      const result = await CommonCall(api, header);
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  getServices: async student_id => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.getServices(student_id);
      const result = await CommonCall(api, header);

      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  getActive: async (student_id, date) => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.getActive({student_id, date});
      const result = await CommonCall(api, header);
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  getAttendance: async (student_id, month) => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.getAttendance({student_id, month});
      const result = await CommonCall(api, header);
     
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  getReview: async (student_id) => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.getReview({student_id});
      console.log('api :', api );
      const result = await CommonCall(api, header);
     
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  getListNotification: async () => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.getListNotification;
      const result = await CommonCall(api, header);
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  getCountNotification: async () => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.getCountNotification;
      const result = await CommonCall(api, header);
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  getNotificationDetail: async id => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.getNotificationDetail(id);
      const result = await CommonCall(api, header);

      return result;
    } catch (error) {
      return {message: error.message};
    }
  },

  getNewFeed: async (student_id,page) => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.getNewFeed({student_id,page});
      console.log('test api ',api)
      const result = await CommonCall(api, header);

      return result;
    } catch (error) {
      return {message: error.message};
    }
  },

  postLike: async ({album_id}) => {
    try {
      const info = {
        album_id,
      };
      const bodyData = {
        info,
      };
      const request = JSON.stringify(bodyData);
      const header = {
        method: 'POST',
        body: request,
      };
      const api = Apis.postLike;
      const result = await CommonCall(api, header);
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  getListComment: async id => {
    try {
      const header = {
        method: 'GET',
      };
      const api = Apis.getListComment(id);
      const result = await CommonCall(api, header);
      // console.log('test ds tin: ', result._data.data_info);
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  postComment: async ({album_id, title}) => {
    try {
      const info = {
        album_id,
        title
      };
      const bodyData = {
        info,
      };
      const request = JSON.stringify(bodyData);
      const header = {
        method: 'POST',
        body: request,
      };
      const api = Apis.postComment;
      const result = await CommonCall(api, header);
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },
  deleteComment: async id => {
    try {

      const header = {
        method: 'DELETE',
      };
      const api = Apis.deleteComment(id);
      
      const result = await CommonCall(api, header);
      
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },

  updateLoiNhan: async ({
    id,
    title,
    user_id,
    category_id,
    content,
    student_id,
  }) => {
    try {
      const info = {
        id,
        title,
        user_id,
        category_id,
        content,
        student_id,
      };
      const bodyData = {
        info,
      };
      console.log(bodyData);
      const request = JSON.stringify(bodyData);
      const header = {
        method: 'PUT',
        body: request,
      };
      const api = Apis.updateLoiNhan(id);
      console.log('test api', api);
      const result = await CommonCall(api, header);
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },

  deleteLoiNhan: async id => {
    try {

      const header = {
        method: 'DELETE',
      };
      const api = Apis.deleteLoiNhan(id);
      
      const result = await CommonCall(api, header);
      
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },

  updateXinNghi: async ({
    id,
    description,
    user_id,
    // student_id,
    from_date,
    to_date
  }) => {
    try {
      const info = {
    description,
    user_id,
    // student_id,
    from_date,
    to_date
      };
      const bodyData = {
        info,
      };
      console.log(bodyData);
      const request = JSON.stringify(bodyData);
      const header = {
        method: 'PUT',
        body: request,
      };
      const api = Apis.updateXinNghi(id);
      console.log('test api', api);
      const result = await CommonCall(api, header);
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },

  deleteXinNghi: async id => {
    try {

      const header = {
        method: 'DELETE',
      };
      const api = Apis.deleteXinNghi(id);
      console.log(api );
      const result = await CommonCall(api, header);
      
      return result;
    } catch (error) {
      return {message: error.message};
    }
  },

};

export {FetchApi};
