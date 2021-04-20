import { defineConfig } from 'umi';
import ds from './defaultSettings';

export default defineConfig({
  publicPath: `https://come2future-web.oss-cn-hangzhou.aliyuncs.com/dev/fe-matrix-front/matrix-front/${ds.appKey}/`,
});
