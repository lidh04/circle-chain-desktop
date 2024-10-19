import { AccountPO } from '@lidh04/circle-chain-sdk/dist/cjs/circle-user';

/**
 * @fileOverview
 * @name account-types.ts
 * @author lidh04
 * @license copyright to shc
 */
export const ACCOUNT_RELATIVE_PATH = '.circle-chain/account';
export interface Account {
  type: 'email' | 'phone';
  value: string;
  password?: string;
  verifyCode?: string;
  payPassword?: string;
}

export interface EmailAccount {
  type: 'email';
  value: string;
  password?: string;
  verifyCode?: string;
  payPassword?: string;
}

export interface PhoneAccount {
  type: 'phone';
  value: string;
  password?: string;
  verifyCode?: string;
  payPassword?: string;
}

export interface VerifyCodeInput {
  type: 'email' | 'phone';
  value: string;
}

export interface ResetPasswordInput {
  account: AccountPO;
  verifyCode: string;
  password1: string;
  password2: string;
}

export interface RegisterInput {
  type: 'email' | 'phone';
  value: string;
  passwordInput1: string;
  passwordInput2: string;
  verifyCode: string;
}
