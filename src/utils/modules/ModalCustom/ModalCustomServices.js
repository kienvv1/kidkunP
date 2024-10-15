const changeObject = {};

let data = {};

function broadcast() {
  Object.keys(changeObject).forEach(k => changeObject[k]());
}

const ModalCustomServices = {
  get: () => data,

  set: async (newData: {
    title: string,
    description: string,
    children: any,
    closeIcon: boolean,
    titleStyle: TextStyle,
    textClose: string,
    onClose: Function,
    style: ViewStyle,
    onConfirm: Function,
    textConfirm: string,
    iconNoBorder: boolean,
    descriptionStyle: TextStyle,
    confirmBtnStyle: ViewStyle,
    closeIconProps: ViewStyle,
  }) => {
    data = newData;
    broadcast();
  },
  close: () => {
    data = {};
    broadcast();
  },
  addEventListener: (key, cb) => {
    changeObject[key] = () => cb(data);
  },

  removeEventListener: key => {
    if (changeObject[key]) {
      delete changeObject[key];
    }
  },
};

export {ModalCustomServices};
