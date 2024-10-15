import {AccountService} from './Account';
import * as NavigationService from './NavigationService';

const ResetFunction = {
  //fix crash when navigatio is not ready
  resetToHome: navigation => {
    if (navigation) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'SlideDraw',
            params: {
              name: 'Main',
              params: {
                screen: 'Home',
              },
            },
          },
        ],
      });
      return;
    }

    NavigationService.reset({
      index: 0,
      routes: [
        {
          name: 'SlideDraw',
          params: {
            name: 'Main',
            params: {
              screen: 'Home',
            },
          },
        },
      ],
    });
  },
  resetToChoose: navigation => {
    if (navigation) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'ChonCon',
          },
        ],
      });
      return;
    }
    NavigationService.reset({
      index: 0,
      routes: [
        {
          name: 'ChonCon',
        },
      ],
    });
  },
  resetToOff: navigation => {
    if (navigation) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'XinNghi',
          },
        ],
      });
      return;
    }
    NavigationService.reset({
      index: 0,
      routes: [
        {
          name: 'XinNghi',
        },
      ],
    });
  },
  resetToAdvice: navigation => {
    if (navigation) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'LoiNhan',
          },
        ],
      });
      return;
    }
    NavigationService.reset({
      index: 0,
      routes: [
        {
          name: 'LoiNhan',
        },
      ],
    });
  },
  resetToLogin: navigation => {
    // AccountService.set();

    if (navigation) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Login',
          },
        ],
      });
      return;
    }
    NavigationService.reset({
      index: 0,
      routes: [
        {
          name: 'Login',
        },
      ],
    });
  },
};

export {ResetFunction};
