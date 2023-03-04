/**
 * @fileOverview
 * @name util.test.ts
 * @author lidh04
 * @license copyright to shc
 */

import { resolveHtmlPath } from './util';

test("resolveHtmlPath test", async () => {
  const htmlFileName = "index.html";
  const path = resolveHtmlPath(htmlFileName);
  console.log("path:", path);
  expect(path).not.toBe(null);
});
