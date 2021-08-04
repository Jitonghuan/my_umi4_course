// fe config
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/03 10:02

module.exports = {
  type: 'builder',
  builder: '@cffe/fe-builder-default',
  commands: {
    // 可以直接是数组，也可以是一个方法，返回一个数组
    publish: async (options) => {
      const buildEnv = options.online ? 'prod' : 'test';
      const ossDir = options.online ? 'prod' : 'dev';

      return [
        '$ fnpm install',
        `$ npm run build:${buildEnv}`,
        `#oss -r ./dist come2future-web:${ossDir}/fe-matrix-front/matrix-front`,
        `#scp ./dist/matrix/index.html root@192.168.0.111:/usr/share/nginx/html/matrix-${buildEnv}/matrix/index.html --pass=&WUb&1u8508P0ohD`,
      ];
    },
  },
};
