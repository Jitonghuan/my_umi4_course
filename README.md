# FE-MATRIX

- 本地开发: http://matrix-local.cfuture.shop:9091/
- 线上环境: http://matrix.cfuture.shop/
- 测试环境: http://matrix-test.cfuture.shop/

## Getting Started

### 1. 环境初始化

fe 环境初始化 （如果仅本地开发，也可以只执行 1.2，安装 fnpm 即可）

- 1.1 执行 `$ fe` 查看是否已安装 fe-cli
  - 如未安装则执行 `$ npm install -g @cffe/fe-cli --registry=http://r.npm.cfuture.cc` 
  - 首次安装完后请执行 `$ fe env init` 初始化开发环境；
- 1.2 执行 `$ fnpm -v` 查看是否已安装 fnpm
  - 如未安装则执行 `$ npm install -g @cffe/fnpm --registry=http://r.npm.cfuture.cc`

### 2. 配置 Host

- 绑定 host 是为了在本地开发时，能使用 cfuture.shop 的 cookie 进行接口联调：
- 本地联调时的接口代理规则配置见 config/config.ts 中的 proxy

```host
127.0.0.1 local.cfuture.shop
```

### 3. 初始化项目

- clone 项目: `$ git clone git@gitlab.cfuture.shop:_IRIM_GIT_GROUP_/_IRIM_PROJECT_NAME_.git`
- 切换到对应分支，分支规范见下文
- 安装依赖: `$ fnpm install`

### 4. 启动本地开发

- 执行 `$ npm run dev` 启动本地开发
- 如果安装了 fe ，也可执行 `$ fe dev`
- 访问 http://local.cfuture.shop:9003
- 本地接口代理请在 config/config.ts 中配置 proxy

本地 mock 数据方法见下文 “关于 Mock 数据”

### 5. 部署到服务器

请保证本地的代码是最新的，并且已经安装 fe

- 布署到 dev 环境: `$ fe publish --dev` 
- 布署到 test 环境: `$ fe publish --test` 
- 布署到 prod 环境: `$ fe publish --prod`

## 开发文档

### 相关配置

- 应用相关配置:  src/app.config.ts
- 工程化相关配置: config/config.ts

### 分支规范

- 开发分支: `feat-xxx/0.0.x` 或 `dev-xxx/0.0.x`
- 测试分支: `test/0.1.x`
- 线上分支: `pub/1.x.x`

### 关于 Mock 数据

- 启动时使用 `$ npm run mock` 
- 如果安装了 fe，可以用 `$ fe mock`
- mock 接口写在 `/mock` 目录，每个文件可以代表一个业务模块，可以参照已有的新增接口

### 权限接入文档

- 权限开启开关: src/app.config.ts 文件中的 `isOpenPermission` 字段
- 接口返回数据格式参考: mock/auth.ts -> /api/global/permission 中的示例接口 ，其中 `menuUrl` 字段必须要有，其它随意
- 权限接口定义在 src/services/apis.ts 文件中的 `queryPermissionURL`

权限原理：根据返回的数据，与 `routes.config.ts` 中的路由进行 merge，然后判断当前的 `location.pathname` 是否在权限中，如果不在，则拦截页面，显示无权限的提示；
- 权限拦截窗口组件请查看 src/components/permission
- 权限初始化逻辑在 src/layouts/basic-layout/index.tsx


### 技术教程文档

- ES6入门教程: https://es6.ruanyifeng.com/
- Ant Design 文档: https://ant.design/components/overview-cn/
- Umi 教程: https://umijs.org/zh-CN/config
- React Hooks入门教程： https://www.ruanyifeng.com/blog/2019/09/react-hooks.html
- Echarts文档: https://echarts.apache.org/zh/option.html

### 需求文档

- 项目文档: https://come-future.yuque.com/sekh46/bbgc7f
- 项目排期: https://come-future.yuque.com/sekh46/bbgc7f/px4te4/edit
- 视觉稿: https://lanhuapp.com/web/#/item/project/stage?tid=3b3b08b2-8068-4d09-9535-148f1c47f6b8&pid=56924b6e-18ea-4be5-860a-d5eef3e89d06
- 三期交互稿: http://vdoc.cfuture.cc/matrix/v3/
- 四期交互稿: http://vdoc.cfuture.cc/matrix/v4/
- 前端发布接入流程: https://come-future.yuque.com/fu-xt/xssxgb/dgmp57
- 屏蔽EDAS设计稿: https://modao.cc/app/5b7aabe3b24533a5d4e809c6ac218d37d2ae7f52

### 业务&接口文档

- 应用部署模块设计: https://come-future.yuque.com/sekh46/bbgc7f/gy8woc
- 自动化三期: https://come-future.yuque.com/sekh46/bbgc7f/bg8qyo
- 发布申请管理: https://come-future.yuque.com/sekh46/bbgc7f/eus31y
- 监控管理: https://come-future.yuque.com/sekh46/bbgc7f/es5pwg
- 双集群管理: https://come-future.yuque.com/sekh46/bbgc7f/dnkgfm
- 应用重启、回滚、屏蔽EDAS: https://come-future.yuque.com/sekh46/bbgc7f/ih8peg
- 数据工厂二期: https://come-future.yuque.com/sekh46/bbgc7f/gvbhuh
- 发布单测卡点: https://come-future.yuque.com/sekh46/bbgc7f/optg5a
- 前端发布: https://come-future.yuque.com/sekh46/bbgc7f/dsyb0t


## FAQ

### 1. windows 中启动报错

windows 中不要使用 `$ fnpm install`，直接使用 `$ npm install`，
前提条件：将 ~/.npmrc 文件（如没有请新建）换成以下内容：

```
registry=https://registry.npm.taobao.org/
@cffe:registry=http://r.npm.cfuture.cc
@ali:registry=http://r.npm.cfuture.ccs
@alife:registry=http://r.npm.cfuture.cc
@seenew:registry=http://r.npm.cfuture.cc
@hbos:registry=http://r.npm.cfuture.cc
```

以上设置是为了让 `npm install` 的时候遇到内网包的 scope 也从内网源获取，外网源从淘宝镜像获取；
下一步直接执行 `npm run dev`
