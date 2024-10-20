/**
 * @fileOverview
 * @name acount.ts
 * @author Charles
 * @license copyright to cettire
 */

import os from 'os';
import { ACCOUNT_RELATIVE_PATH } from './account-types';

// eslint-disable-next-line import/prefer-default-export
export function getAccountInfoPath() {
  return `${os.homedir()}/${ACCOUNT_RELATIVE_PATH}`;
}
