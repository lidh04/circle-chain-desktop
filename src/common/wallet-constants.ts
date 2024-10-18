export type Channels = 'ipc-circle-chain';
export const IpcChannel = 'ipc-circle-chain';
export const RELOAD = 'reload';
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
    msg: 'Parameter error',
  },
  {
    code: 404,
    msg: 'Not found',
  },
  {
    code: 406,
    msg: 'Request invalid',
  },
  {
    code: 500,
    msg: 'System error',
  },
  {
    code: 10000,
    msg: 'Not enough balance',
  },
  {
    code: 10001,
    msg: 'Transaction not exists',
  },
  {
    code: 10002,
    msg: 'Two spent transactions',
  },
  {
    code: 10003,
    msg: 'Data already exists',
  },
  {
    code: 10004,
    msg: 'Already broadcast',
  },
  {
    code: 11000,
    msg: 'Invalid node',
  },
  {
    code: 11001,
    msg: 'Invalid address',
  },
  {
    code: 11002,
    msg: 'Exceed cloud wallets limit',
  },
  {
    code: 20000,
    msg: 'User not logged in',
  },
  {
    code: 20001,
    msg: 'Username or password incorrect',
  },
  {
    code: 20002,
    msg: 'User token expired',
  },
  {
    code: 20003,
    msg: 'Username empty',
  },
  {
    code: 20004,
    msg: 'User already exists',
  },
  {
    code: 20005,
    msg: 'Username or password incorrect',
  },
  {
    code: 20006,
    msg: 'Verify code wrong',
  },
  {
    code: 20007,
    msg: 'Two passwords are not the same',
  },
  {
    code: 20008,
    msg: 'Password length must be larger or equal than 6 and less than 64!',
  },
  {
    code: 20009,
    msg: 'Verify code not exists',
  },
  {
    code: 20010,
    msg: 'Verify code expired',
  },
  {
    code: 20011,
    msg: 'Password length must be larger or equal than 6 and less than 64!',
  },
  {
    code: 20012,
    msg: 'Password is not strong enough, it must contains digits, lower and upper case chars, special chars and the length must be no less than 8.',
  },
  {
    code: 20013,
    msg: 'Account is frozen, because of illegal actions',
  },
  {
    code: 20014,
    msg: 'User already deleted, no register any more.',
  },
  {
    code: 20015,
    msg: 'You logged failed for more than 5 times continuously, you are frozen, please try tomorrow.',
  },
  {
    code: 20016,
    msg: 'You logged failed with the same password more times, please try tomorrow.',
  },
  {
    code: 20017,
    msg: 'User not exists',
  },
  {
    code: 20018,
    msg: 'User pay password wrong.',
  },
  {
    code: 20019,
    msg: 'Pay password not set.',
  },
  {
    code: 20020,
    msg: 'You reset password with verify code failed for many times, please try tomorrow.',
  },
  {
    code: 30000,
    msg: 'You click too fast.',
  },
  {
    code: 40000,
    msg: 'The coin is mined by others, please try again.',
  },
  {
    code: 40001,
    msg: 'Miner machine not exists.',
  },
  {
    code: 40002,
    msg: 'Miner machine already sold.',
  },
];

export function buildMessageFromCode(code: number) {
  const error = Errors.find((item) => item.code === code);
  if (error) {
    return error.msg;
  }

  return 'unknown error';
}
