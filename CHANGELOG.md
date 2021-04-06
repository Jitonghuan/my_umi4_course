# 开发日志

## 发布周期
  - 修订版本号：每次有升级或者维护功能的时候都需要迭代版本号
  - 次版本号：每月发布一个带有新特性的向下兼容的版本。
  - 主版本号：含有破坏性更新和新特性，不在发布周期内。

## 迭代分支规则
  - dev/1.0.1 每周若有更新，统一周末递进一个版本

## 1.0.1
  `2021-03-01`

  - 版本首次记录
  - document.ejs 内config和loading资源前缀补充
  - 补充 outputPath 配置，打包路径为 ./dist/{publicPath}

## 1.0.2
  `2021-03-01`

  - refactor: 处理接入统一登录问题，改造登录失效跳转地址位置
  - feat: 接入统一登录：处理login页面接入 business-login，同时约定统一 loginPrefix
  - refactor: login补充docuemtnTitle

  `2021-03-02`

  - 处理 DocumentTitle props问题
  - 处理 React和React-dom版本问题，改用16.X版本

  `2021-03-03`

  - 升级组件 @cffe/fe-backend-component ,优化demo页面

  `2021-03-05`

  - 优化 defaultSettings 配置

   `2021-03-05`

  - 修复inject-config脚本无法读取环境变量的问题
