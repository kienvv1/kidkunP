import MMKVStorage, {useMMKVStorage} from 'react-native-mmkv-storage';

import {
  CheckLogic,
  StringsEnglish,
  StringsFrance,
  StringsItaliano,
  StringsJapanese,
  StringsPortuguese,
  StringsVietnamese,
} from '../../resource';

const tag = 'language-code';

const mmkvId = `mmkv-${tag}`;
const mmkvKey = `key-${tag}`;

const MMKVwithID = new MMKVStorage.Loader().withInstanceID(mmkvId).initialize();

const LanguageService = {
  setCode: code => MMKVwithID.setString(mmkvKey, code),
  getCode: () =>
    MMKVwithID.getString(mmkvKey) || CheckLogic.Language_code.vietnamese,
  get: () => {
    const code = MMKVwithID.getString(mmkvKey);
    if (code === CheckLogic.Language_code.japanese) {
      return StringsJapanese;
    }
    if (code === CheckLogic.Language_code.vietnamese) {
      return StringsVietnamese;
    }
    if (code === CheckLogic.Language_code.france) {
      return StringsFrance;
    }
    if (code === CheckLogic.Language_code.it) {
      return StringsItaliano;
    }
    if (code === CheckLogic.Language_code.pt) {
      return StringsPortuguese;
    }
    return StringsEnglish;
  },
};

function useAppLanguage() {
  //value is languageCode
  //setValue is setLanguageCode
  const [languageCode, setValue] = useMMKVStorage(mmkvKey, MMKVwithID);
  let language = {...StringsVietnamese};
  if (languageCode === CheckLogic.Language_code.vietnamese) {
    language = {...StringsVietnamese};
  }
  if (languageCode === CheckLogic.Language_code.english) {
    language = {...StringsEnglish};
  }

  return {Strings: language, setLanguageCode: setValue};
}
export {useAppLanguage, LanguageService};
