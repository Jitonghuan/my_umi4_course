// FE BUILDER CONFIG
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/01 21:35
// -----------------------------------------------------------
// $ xxx 表示执行 shell 命令
// #oss 表示上传到 oss， -r 表示目录
// {{group}}, {{project}} 分别对应项目的 git url 中的 group 和 project
// {{version}} 对应 package.json 中的 version
// 更多文档见: http://npm.cfuture.cc/package/@cffe/fe-builder-default

const envCodeMap = {
  dev: 'hbos-dev',
  test: 'hbos-test',
  prod: 'prod',
};

module.exports = {
  type: 'builder',
  builder: '@cffe/fe-builder-default',
  commands: {
    mock: [
      '$ fnpm install',
      '$ npm run umi:mock',
    ],
    dev: [
      '$ fnpm install',
      '$ npm run dev',
    ],
    build: (options) => {
      const buildEnv = options.online ? 'prod' : 'test';
      return [
        '$ fnpm install',
        `$ npm run build:${buildEnv}`,
        (options.jenkins || options.j) && `#tar ./dist/matrix ./dist/seed.jsbundle --path=build`,
      ];
    },
    analyze: [
      '$ npm run build:analyze'
    ],
    // 可以直接是数组，也可以是一个方法，返回一个数组
    publish: async (options) => {
      const buildEnv = options.online ? 'prod' : 'test';
      const ossDir = options.online ? 'prod' : 'dev';
      return [
        '$ fnpm install',
        `$ npm run build:${buildEnv}`,
        `#oss -r ./dist come2future-web:${ossDir}/fe-matrix-front/matrix-front`,
        `#scp ./dist/matrix/index.html root@192.168.0.111:/usr/share/nginx/html/matrix-${buildEnv}/matrix/index.html --pass=&WUb&1u8508P0ohD`,
        '#logger:success publish success!!!',
      ];
    },
  },
};
