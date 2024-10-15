import {host} from './system';
const Apis = {
  login: `${host.api_mamnon}/ps_user/login`,
  logout: `${host.api_mamnon}/ps_user/logout`,
  register: `${host.api_user}/ps_user/register`,
  //profile
  profile: `${host.api_mamnon}/ps_user/profile`,
  updateProfile: `${host.api_mamnon}/ps_user/profile`,


  home_relative: `${host.api_mamnon}/ps_user/home_relative`,
  home: `${host.api_mamnon}/ps_user/home`,
  registerDeviceid: `${host.api_mamnon}/ps_user/active`,
  registerNotificationToken: `${host.api_mamnon}/ps_user/notification`,
  getNews: student_id =>
    `${host.api_mamnon}/ps_articles/list/all/1?student_id=${student_id}`,
  getNewsDetail: ({id, student_id}) =>
    `${host.api_mamnon}/ps_articles/${id}?student_id=${student_id}`,
  getTableHeight: student_id =>
    `${host.api_mamnon}/ps_student/${student_id}/growth_height`,
  getTableWeight: student_id =>
    `${host.api_mamnon}/ps_student/${student_id}/growth_weight`,
  getCharHeight: student_id =>
    `${host.api_mamnon}/ps_student/${student_id}/growth_chart/height`,
  getCharWeight: student_id =>
    `${host.api_mamnon}/ps_student/${student_id}/growth_chart/weight`,
  getMenus: student_id => `${host.api_mamnon}/ps_student/menus/${student_id}`,
  getMenusDay: ({student_id, date}) =>
    `${host.api_mamnon}/ps_student/menus/${student_id}/${date}`,
  getStudent: student_id => `${host.api_mamnon}/ps_student/${student_id}`,
  updateStudent: student_id => `${host.api_mamnon}/ps_student/${student_id}`,



  getGrowth: student_id => `${host.api_mamnon}/ps_student/${student_id}/growth`,
  getOffSchool: student_id =>
    `${host.api_mamnon}/ps_offschool/offschool/${student_id}?status=ok`,
  getOffSchoolcd: student_id =>
    `${host.api_mamnon}/ps_offschool/offschool/${student_id}?status=cd`,
  getListSend: student_id =>
    `${host.api_mamnon}/ps_offschool/listsend/${student_id}`,
  postOffSchool: `${host.api_mamnon}/ps_offschool/offschool`,

  getFee: ({student_id, date}) =>
    `${host.api_mamnon}/ps_student/${student_id}/${date}/report_fees`,
    getAdvice: ({student_id,id}) =>
    `${host.api_mamnon}/ps_advice/advices/${student_id}?status=ok&catid=${id}`,
  getAdvicecd: ({student_id,id}) =>
    `${host.api_mamnon}/ps_advice/advices/${student_id}?status=cd&catid=${id}`,
  getAdviceCate: student_id =>
    `${host.api_mamnon}/ps_advice/a_categories/${student_id}`,
  postAdvice: `${host.api_mamnon}/ps_advice/advice`,
  getServices: student_id =>
    `${host.api_mamnon}/ps_student/${student_id}/services_used`,
  getActive: ({student_id, date}) =>
    `${host.api_mamnon}/ps_student/${student_id}/active/${date}`,
  getListNotification: `${host.api_mamnon}/ps_cms/notifications/sent`,
  getNotificationDetail: id =>
    `${host.api_mamnon}/ps_cms/notifications/show/sent/${id}`,
  getCountNotification: `${host.api_mamnon}/ps_cms/notread`,
  getAttendance: ({student_id,month}) => `${host.api_mamnon}/ps_student/attendance/${student_id}/${month}`,
   getReview: ({student_id}) => `${host.api_mamnon}/ps_review/relative_view?student_id=${student_id}`,

   getNewFeed: ({student_id,page}) => `${host.api_mamnon}/ps_student/newfeed/${student_id}?page=${page}`,
   postLike: `${host.api_mamnon}/ps_albums/album/like`,
  getListComment: id => `${host.api_mamnon}/ps_albums/albums/show_comment?album_id=${id}`,
  
  postComment: `${host.api_mamnon}/ps_albums/album/comment`,
  deleteComment: id => `${host.api_mamnon}/ps_albums/albums/bl/${id}`,
  getProduct : `${host.api_mamnon}/ps_products/showlist`,
  getProductDetail: id=> `${host.api_mamnon}/ps_products/detail?id=${id}`,

  updateLoiNhan: id => `${host.api_mamnon}/ps_advice/advices?id=${id}`,
  
  deleteLoiNhan: id => `${host.api_mamnon}/ps_advice/advices/delete/${id}`,
  
  updateXinNghi : id =>`${host.api_mamnon}/ps_offschool/offschool/edit/${id}`,

  deleteXinNghi : id =>`${host.api_mamnon}/ps_offschool/offschool/delete/${id}`,
};

export {Apis};
