# FE-MATRIX

- 本地开发: http://matrix-local.cfuture.shop:9091/
- 线上环境: http://matrix.cfuture.shop/
- 测试环境: http://matrix-test.cfuture.shop/

## Getting Started

1. fe 环境初始化 （也可以只执行 1.2，安装 fnpm 即可）
   - 1.1 `$ fe` 查看是否已安装 fe-cli，如未安装则执行 `$ npm install -g @cffe/fe-cli --registry=http://registry.npm.cfuture.cc` ，首次安装完后请执行 `$ fe env init` 初始化开发环境；
   - 1.2 `$ fnpm -v` 查看是否已安装 fnpm，如未安装则执行 `$ npm install -g @cffe/fnpm --registry=http://registry.npm.cfuture.cc`

2. 配置 Host

绑定 host 是为了在本地开发时，能使用 cfuture.shop 的 cookie 进行接口联调：

```host
127.0.0.1 matrix-local.cfuture.shop
```

3. 初始化项目
   - clone 项目: `$ git clone git@gitlab.cfuture.shop:fe-data-app/fe-matrix.git`
   - 切换到对应分支，分支规范见下文
   - 安装依赖: `$ fnpm install`

4. `$ npm start` 启动本地开发， 访问 http://matrix-local.cfuture.shop:9091 （登录账号同 sso ）

5. 部署到 test:  [jenkins](http://jenkins.cfuture.cc/) -> ops/fe-matrix-test

6. 部署到 prod: [jenkins](http://jenkins.cfuture.cc/) -> ops/fe-matrix-prod

### 分支规范

- 开发分支: `feat-xxx/0.0.x` 或 `dev-xxx/0.0.x`
- 测试分支: `test/0.2.x`
- 线上分支: `pub/2.x.x`

## 相关文档

- VC 组件文档: http://vdoc.cfuture.cc/vc-doc/#/vc-doc/component/list
- Echarts文档: https://echarts.apache.org/zh/option.html
- 项目文档: https://come-future.yuque.com/sekh46/bbgc7f
- 项目排期: https://come-future.yuque.com/sekh46/bbgc7f/px4te4/edit#y44m
- 视觉稿: https://lanhuapp.com/web/#/item/project/stage?tid=3b3b08b2-8068-4d09-9535-148f1c47f6b8&pid=56924b6e-18ea-4be5-860a-d5eef3e89d06
- 三期交互稿: http://vdoc.cfuture.cc/matrix/v3/

## FAQ

### 1. windows 中启动报错

windows 中不要使用 `$ fnpm install`，直接使用 `$ npm install`，
前提条件：将 ~/.npmrc 文件（如没有请新建）换成以下内容：

```
registry=https://registry.npm.taobao.org/
@cffe:registry=http://registry.npm.cfuture.cc
@ali:registry=http://r.npm.cfuture.ccs
@alife:registry=http://registry.npm.cfuture.cc
@seenew:registry=http://registry.npm.cfuture.cc
@hbos:registry=http://registry.npm.cfuture.cc
```

以上设置是为了让 `npm install` 的时候遇到内网包的 scope 也从内网源获取，外网源从淘宝镜像获取；
下一步直接执行 `npm run dev`
