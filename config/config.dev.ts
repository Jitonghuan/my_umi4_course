import { defineConfig } from 'umi';
import ds from './defaultSettings';

const publicPathPrefix = `/${ds.appKey}`;

export default defineConfig({
  scripts: [{ src: `${publicPathPrefix}/react.min.js` }, { src: `${publicPathPrefix}/react-dom.min.js` }],
  publicPath: `${publicPathPrefix}/`,
});
