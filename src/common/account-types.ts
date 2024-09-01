/**
 * @fileOverview
 * @name account-types.ts
 * @author lidh04
 * @license copyright to shc
 */
export const LOGIN = 'login';
export const REGISTER = 'register';
export const FORGOT = 'forgot';
export const GetAccount = 'get-account';
export const SaveAccount = 'save-account';
export const ACCOUNT_RELATIVE_PATH = '.circle-chain/account';
export interface EmailAccount {
  type: 'email';
  value: string;
  payPassword?: string;
}

export interface PhoneAccount {
  type: 'phone';
  value: string;
  payPassword?: string;
}
