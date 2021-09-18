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
  dev: 'base-dev',
  test: 'base-test',
  prod: 'base-prod',
};

module.exports = {
  type: 'builder',
  builder: '@cffe/fe-builder-default',
  commands: {
    mock: [
      '$ fnpm i',
      '$ npm run mock',
    ],

    // `$ fe d` 或 `$ fe dev`
    dev: [
      '$ fnpm i',
      '$ npm run dev'
    ],

    // `$ fe b` 或 `$ fe build`
    build: (options, projectInfo) => {
      process.env.VERSION = options.version || '';

      return [
        '$ fnpm i',
        '$ npm run build',
        '#tar ./dist ./dist/seed.jsbundle --path=build'
      ];
    },

    // `$ fe p` 或 `$ fe publish`
    publish: (options, projectInfo) => {
      const { t, test, p, prod, online, local } = options;
      const envCode = (t || test) ? envCodeMap.test : (p || prod || online) ? envCodeMap.prod : envCodeMap.dev;
      const project = options.project || projectInfo.project;
      const version = options.version || projectInfo.version || '';

      process.env.BUILD_ENV = envCode;

      // TODO 如果 local = false，则触发 jenkins 单工程构建 #jenkins:fe-single
      //      相关的参数在 fe-builder-default 中默认传入

      return [
        `$ fe build --version=${version}`,
        `#oss -r ./dist c2f-resource:${envCode}/${project}/${version}`,
        `#oss ./dist/index.html c2f-resource:${envCode}/${project}/index.html`,

        '#logger:success PUBLISH SUCCESS!!',
      ];
    },

    scp: [
      '#scp ./dist/index.html root@192.168.0.111:/usr/share/nginx/html/matrix-test/matrix/index.html --pass=&WUb&1u8508P0ohD',
    ],

    rollback: (options, projectInfo) => {
      const { t, test, p, prod, online } = options;
      const envCode = (t || test) ? envCodeMap.test : (p || prod || online) ? envCodeMap.prod : envCodeMap.dev;
      const project = options.project || projectInfo.project;

      return [
        `#oss ./dist/index.html c2f-resource:${envCode}/${project}/index.html`,
      ];
    },

    analyze: [
      '$ npm run build:analyze'
    ],
  },
};
