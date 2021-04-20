import { defineConfig } from 'umi';
import ds from './defaultSettings';

export default defineConfig({
  scripts: [
    { src: `/${ds.appKey}/react.min.js` },
    { src: `/${ds.appKey}/react-dom.min.js` },
  ],
  publicPath: `/${ds.appKey}/`,
});
