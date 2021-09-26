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
  builder: 'default',
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
      process.env.BUILD_ENV = options.env?.replace(/^base-/, '');

      return [
        '$ fnpm i',
        '$ npm run build',
        '#tar ./dist ./dist/seed.jsbundle --path=build'
      ];
    },

    // `$ fe p` 或 `$ fe publish`
    publish: (options, projectInfo) => {
      const { test, prod, online, local } = options;
      const envCode = test ? envCodeMap.test : (prod || online) ? envCodeMap.prod : envCodeMap.dev;
      const project = options.project || projectInfo.project;
      const version = options.version || projectInfo.version || '';

      if (local) {
        return [
          `$ fe build --version=${version} --env=${envCode}`,
          `#oss -r ./dist c2f-resource:${envCode}/${project}/${version}`,
          `#oss ./dist/index.html c2f-resource:${envCode}/${project}/index.html`,
        ];
      }

      return [
        '#gitpush',

        // `#jenkins fe-single?REPOSITORY={{repository}}&BRANCH={{gitBranch}}&GROUP={{group}}&PROJECT=${project}&VERSION=${version}&ENV=${envCode}`
      ];
    },

    rollback: (options, projectInfo) => {
      const { test, prod, online } = options;
      const envCode = test ? envCodeMap.test : (prod || online) ? envCodeMap.prod : envCodeMap.dev;
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
