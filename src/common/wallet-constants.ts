export type Channels = 'ipc-circle-chain';
export const IpcChannel = 'ipc-circle-chain';
// wallet constants
export const GetWalletPackage = 'get-wallet-package';
export const ImportWallet = 'import-wallet';
export const GetEncodedPrivateKey = 'get-encoded-private-key';
export const SearchTransaction = 'search-transaction';
export const CreateWallet = 'create-wallet';
export const SendToChannel = 'send-to';

// account constants
export const LOGIN = 'login';
export const LOGOUT = 'logout';
export const FORGOT = 'forgot';
export const GetAccount = 'get-account';
export const SaveAccount = 'save-account';
export const LOGIN_PASSWORD = 'login-password';
export const LOGIN_VERIFY_CODE = 'login-verify-code';
export const SEND_LOGIN_VERIFY_CODE = 'send-login-verify-code';
export const REGISTER = 'register';
export const SEND_REGISTER_VERIFY_CODE = 'send-register-verify-code';
export const GetPayPassword = 'get-pay-password';
export const SetPayPassword = 'set-pay-password';

export type Error = {
  code: number;
  msg: string;
};

export const Errors: Error[] = [
  {
    code: 200,
    msg: 'success',
  },
  {
    code: 400,
    msg: 'parameter error',
  },
  {
    code: 404,
    msg: 'not found',
  },
  {
    code: 406,
    msg: 'request invalid',
  },
  {
    code: 500,
    msg: 'system error',
  },
  {
    code: 10000,
    msg: 'not enough balance',
  },
  {
    code: 10001,
    msg: 'transaction not exists',
  },
  {
    code: 10002,
    msg: 'two spent transactions',
  },
  {
    code: 10003,
    msg: 'data already exists',
  },
  {
    code: 10004,
    msg: 'already broadcast',
  },
  {
    code: 11000,
    msg: 'invalid node',
  },
  {
    code: 11001,
    msg: 'invalid address',
  },
  {
    code: 11002,
    msg: 'exceed cloud wallets limit',
  },
  {
    code: 20000,
    msg: 'user not logged in',
  },
  {
    code: 20001,
    msg: 'username or password incorrect',
  },
  {
    code: 20002,
    msg: 'user token expired',
  },
  {
    code: 20003,
    msg: 'username empty',
  },
  {
    code: 20004,
    msg: 'user already exists',
  },
  {
    code: 20005,
    msg: 'username or password incorrect',
  },
  {
    code: 20006,
    msg: 'verify code wrong',
  },
  {
    code: 20007,
    msg: 'two passwords are not the same',
  },
  {
    code: 20008,
    msg: 'password length must be larger or equal than 6 and less than 64!',
  },
  {
    code: 20009,
    msg: 'verify code not exists',
  },
  {
    code: 20010,
    msg: 'verify code expired',
  },
  {
    code: 20011,
    msg: 'password length must be larger or equal than 6 and less than 64!',
  },
  {
    code: 20012,
    msg: 'password is not strong enough, it must contains digits, lower and upper case chars, special chars and the length must be no less than 8.',
  },
  {
    code: 20013,
    msg: 'account is frozen, because of illegal actions',
  },
  {
    code: 20014,
    msg: 'user already deleted, no register any more.',
  },
  {
    code: 20015,
    msg: 'you logged failed for more than 5 times continuously, you are frozen, please try tomorrow.',
  },
  {
    code: 20016,
    msg: 'you logged failed with the same password more times, please try tomorrow.',
  },
  {
    code: 20017,
    msg: 'user not exists',
  },
  {
    code: 20018,
    msg: 'user pay password wrong.',
  },
  {
    code: 20019,
    msg: 'pay password not set.',
  },
  {
    code: 20020,
    msg: 'you reset password with verify code failed for many times, please try tomorrow.',
  },
  {
    code: 30000,
    msg: 'you click too fast.',
  },
  {
    code: 40000,
    msg: 'The coin is mined by others, please try again.',
  },
  {
    code: 40001,
    msg: 'miner machine not exists.',
  },
  {
    code: 40002,
    msg: 'miner machine already sold.',
  },
];

export function buildMessageFromCode(code: number) {
  const error = Errors.find((item) => item.code === code);
  if (error) {
    return error.msg;
  }

  return 'unknown error';
}
