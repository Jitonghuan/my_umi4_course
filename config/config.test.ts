import { defineConfig } from 'umi';
import ds from './defaultSettings';

const publicPathPrefix = 'https://come2future-web.oss-cn-hangzhou.aliyuncs.com/dev/fe-matrix-front/matrix-front';

export default defineConfig({
  scripts: [
    { src: `${publicPathPrefix}/${ds.appKey}/react.min.js` },
    { src: `${publicPathPrefix}/${ds.appKey}/react-dom.min.js` },
  ],
  publicPath: `${publicPathPrefix}/${ds.appKey}/`,
});
