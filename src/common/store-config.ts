/**
 * @fileOverview
 * @name storeConfig.ts
 * @author lidh04
 * @license copyright to shc
 */

import Store from 'electron-store';

const storeSchema = {
  host: {
    type: 'string',
    default: 'https://circle-node.net'
  }
};

export function store_get(key: string) {
  const store = new Store({ schema: storeSchema });
  return store.get(key);
}
