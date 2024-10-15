import MMKVStorage, {useMMKVStorage} from 'react-native-mmkv-storage';

const tag = 'account';

const mmkvId = `mmkv-${tag}`;
const mmkvKey = `key-${tag}`;

const MMKVwithID = new MMKVStorage.Loader().withInstanceID(mmkvId).initialize();

const AccountService = {
  get: () => MMKVwithID.getMap(mmkvKey),
  set: (value = {}) => {
    MMKVwithID.setMap(mmkvKey, value);
  },
};
const AccountService1 = {
  get: () => MMKVwithID.getMap(mmkvKey),
  set: (value = {}) => {
    const studentIdObject = {id: value};
    MMKVwithID.setMap(mmkvKey, studentIdObject);
  },
};

function useAppAccount() {
  let account = MMKVwithID.getMap(mmkvKey);
  const [value, setValue] = useMMKVStorage(mmkvKey, MMKVwithID);
  if (value) {
    account = value;
  }
  return [account, setValue];
}
export {useAppAccount, AccountService, AccountService1};
