// fe config
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/03 10:02

module.exports = {
  type: 'builder',
  builder: '@cffe/fe-builder-default',
  commands: {
    // 可以直接是数组，也可以是一个方法，返回一个数组
    publish: (options) => {
      const buildEnv = options.online ? 'prod' : 'test';
      const ossDir = options.online ? 'prod' : 'dev';

      return [
        '$ fnpm install',
        `$ npm run build:${buildEnv}`,
        `#oss -r ./dist come2future-web:${ossDir}/{{group}}/{{project}}`,
        `$ sshpass -p "&WUb&1u8508P0ohD" ssh root@192.168.0.111 "cd /usr/share/nginx/html/matrix-${buildEnv}/matrix && rm -rf index.html && wget https://come2future-web.oss-cn-hangzhou.aliyuncs.com/${ossDir}/fe-matrix-front/matrix-front/matrix/index.html"`,
      ];
    },
  },
};
