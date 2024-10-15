import React, {useState, useRef, useEffect} from 'react';
import {View, Text} from 'react-native';
import Modal from 'react-native-modal';
import {Sizes} from '../..';
import {AppButton, AppIcon, AppText} from '../../../elements';
import {useAppTheme} from '../../../utils';
import {ModalCustomServices} from './ModalCustomServices';

const ModalCustom = () => {
  const {Colors} = useAppTheme();
  const [data, setData] = useState({
    title: null,
    description: null,
    descriptionStyle: null,
    children: null,
    closeIcon: true,
    titleStyle: null,
    textClose: null,
    onClose: null,
    style: null,
    onConfirm: null,
    confirmBtnStyle: null,
    textConfirm: null,
    iconNoBorder: false,
    wrapperStyle: {},
    closeIconProps: {},
  });

  useEffect(() => {
    ModalCustomServices.addEventListener('ModalCustom', newData => {
      setData(newData);
    });
    return () => {
      ModalCustomServices.removeEventListener('ModalCustom');
    };
  }, []);

  if (!data.children && !data.title && !data.description) {
    return null;
  }
  const Children = data.children;

  const onBtnConfirm = () => {
    data.onConfirm && data.onConfirm();
  };

  return (
    <Modal
      hideModalContentWhileAnimating={true}
      animationIn="pulse"
      useNativeDriver={true}
      isVisible={true}
      style={{
        // backgroundColor: 'rgba(0.1,0.1,0.1,0.6)',
        margin: 0,
      }}
      onBackButtonPress={() => {
        data.onClose && data.onClose();
        ModalCustomServices.close();
      }}
      onBackdropPress={() => {
        data.onClose && data.onClose();
        ModalCustomServices.close();
      }}>
      <View
        style={{
          alignSelf: 'center',
          backgroundColor: 'white',
          paddingVertical: Sizes.padding,
          borderRadius: 8,
          ...data.wrapperStyle,
        }}>
        <AppText
          style={{fontSize: Sizes.h4, textAlign: 'center', ...data.titleStyle}}>
          {data.title}
        </AppText>
        <View style={{position: 'absolute', right: 14, top: 14, zIndex: 10}}>
          <AppIcon
            hitSlop={{top: 14, left: 14, right: 14, bottom: 14}}
            icon="closecircleo"
            type="AntDesign"
            color={'gray'}
            size={22}
            onPress={() => {
              data.onClose && data.onClose();
              ModalCustomServices.close();
            }}
            {...data.closeIconProps}
          />
        </View>
        <View>
          <View
            style={{
              width: Sizes.width(84),
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              ...data.style,
            }}>
            {!!data.description && (
              <Text
                style={{
                  fontSize: Sizes.h5,
                  paddingHorizontal: Sizes.padding,
                  paddingTop: Sizes.padding,
                  paddingBottom: Sizes.padding,
                  ...data.descriptionStyle,
                }}>
                {data.description}
              </Text>
            )}
            {!!data.children && <Children />}
            <View style={{flexDirection: 'row'}}>
              {data.textClose && (
                <AppButton
                  style={{
                    borderRadius: Sizes.border_radius,
                    alignItems: 'center',
                    padding: Sizes.padding / 2,
                    borderWidth: 1,
                    marginBottom: Sizes.padding,
                    marginRight: 10,
                    marginTop: 12,
                    minWidth: 100,
                  }}
                  // ref={(ref) => (this.btnLogin = ref)}
                  textStyle={{
                    fontWeight: 'bold',
                    fontSize: Sizes.h5,
                    paddingVertical: 4,
                    color: 'black',
                  }}
                  colorSpinner={Colors.primary}
                  sizeSpinner={Sizes.h3}
                  onPress={() => {
                    data.onClose && data.onClose();
                    ModalCustomServices.close();
                  }}
                  title={data.textClose}
                />
              )}
              {data.textConfirm && (
                <AppButton
                  style={{
                    borderRadius: Sizes.border_radius,
                    alignItems: 'center',
                    padding: Sizes.padding / 2,
                    borderWidth: 1,
                    borderColor: Colors.primary,
                    backgroundColor: Colors.primary,
                    marginBottom: Sizes.padding,
                    marginTop: 12,
                    minWidth: 100,
                    ...data.confirmBtnStyle,
                  }}
                  textStyle={{
                    fontWeight: 'bold',
                    fontSize: Sizes.h5,
                    paddingVertical: 4,
                    color: 'white',
                  }}
                  colorSpinner={'white'}
                  sizeSpinner={Sizes.h3}
                  onPress={onBtnConfirm}
                  title={data.textConfirm}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export {ModalCustom};
