/**
 * @fileOverview
 * @name account-types.ts
 * @author lidh04
 * @license copyright to shc
 */
export const LOGIN = "login";
export const REGISTER = "register";
export const FORGOT = "forgot";
export interface EmailAccount {
  type: 'email';
  value: string;
}

export interface PhoneAccount {
  type: 'phone';
  value: string;
}
