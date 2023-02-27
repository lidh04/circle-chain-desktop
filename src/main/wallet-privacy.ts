/**
 * @fileOverview
 * @name wallet-package.ts
 * @author Charles
 * @license copyright to shc
 */

import { PrivatePoem } from '../common/wallet-types';
import { privatePackageMap } from '../common/wallet-mock-data';

export const PrivateWalletPackage = (function() {
  let keyMap: Record<string, PrivatePoem> = {} as Record<string, PrivatePoem>;
  const initLoad = async () => {
    // TODO load private data here.
    keyMap = privatePackageMap;
  };
  return {
    initLoad,
    getEncodedPrivateKey: (address: string): PrivatePoem | null => keyMap[address] ? keyMap[address] : null,
  };
}());
