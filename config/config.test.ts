import { defineConfig } from 'umi';
import ds from './defaultSettings';

const publicPathPrefix = `https://come2future-web.oss-cn-hangzhou.aliyuncs.com/dev/fe-matrix-front/matrix-front/${ds.appKey}`;

export default defineConfig({
  scripts: [{ src: `${publicPathPrefix}/react.min.js` }, { src: `${publicPathPrefix}/react-dom.min.js` }],
  publicPath: `${publicPathPrefix}/`,
});
