import {LanguageService} from '../Language';
import {ModalCustomServices} from './ModalCustomServices';

const ModalBase = {
  error: ({result, message, title}) => {
    const Strings = LanguageService.get();
    ModalCustomServices.set({
      title: title || Strings.Error,
      titleStyle: {color: 'red'},
      description:
        message || result.message || result.Message || result._message,
    });
  },
  success: description => {
    const Strings = LanguageService.get();
    ModalCustomServices.set({
      title: Strings.Notification,
      titleStyle: {color: 'green'},
      description: description,
    });
  },
};

export {ModalBase};
