# fe-matrix

- 线上环境: http://matrix.cfuture.shop/
- 测试环境: http://matrix-test.cfuture.shop/

## Getting Started

1. fe 环境初始化
   - `$ fe` 查看是否安装 fe-cli，未安装执行以下步骤，如已安装则执行 2
   - `$ npm install -g @cffe/fe-cli --registry=http://registry.npm.cfuture.cc`
   - `$ npm install -g @cffe/fnpm --registry=http://registry.npm.cfuture.cc`
   - `$ fe env init` 按照指示一步一步执行

2. 配置 Host

```host
127.0.0.1 matrix-local.cfuture.shop
```

3. 初始化项目
   - clone 项目: `$ git clone git@gitlab.cfuture.shop:fe-data-app/fe-matrix.git`
   - 切换到对应分支
   - 安装依赖: `$ fnpm install`

4. monitor 启动 `$ fe monitor start` 
   - 配置转发规则 http://127.0.0.1:30323/#/code 中源码编辑补充下面代码 
   - 如果已有规则为空，则需要将规则以 `[]` 包起来

```json
{
  "server_name": "matrix-local.cfuture.shop",
  "proxy": {
    "/matrix/**": {
      "type": "web",
      "port": "9091",
      "target": "http://127.0.0.1:9091",
      "changeOrigin": false,
      "pathRewriter": {}
    },
    "/v1/**": {
      "type": "web",
      "port": "9091",
      "target": "http://127.0.0.1:9091",
      "changeOrigin": false,
      "pathRewriter": {}
    },
    "/**": {
      "type": "web",
      "port": "9091",
      "target": "http://127.0.0.1:9091",
      "changeOrigin": false,
      "pathRewriter": {}
    }
  }
}
```

5. `$ npm start` 启动 matrix 服务， 访问 http://matrix-local.cfuture.shop

6. 部署到 test:  jenkins -> ops/fe-matrix-test

7. 部署到 prod: jenkins -> ops/fe-matrix-prod

### 环境配置

- 本地开发时，请确保 .env 文件中的 `UMI_ENV=dev`
- 推到测试环境时，请确保 .env 文件中的 `UMI_ENV=test`
- 推到线上环境时，请确保 .env 文件中的 `UMI_ENV=prod`

### 分支规范

- 开发分支: `feat-xxx/0.x.x` 或 `dev-xxx/0.x.x`
- 测试分支: `test/0.x.x`
- 线上分支: `pub/1.x.x`

### 相关文档

- VC 组件文档: http://vdoc.cfuture.cc/vc-doc/#/vc-doc/component/list
- 项目文档: https://come-future.yuque.com/sekh46/bbgc7f
- 项目排期: https://come-future.yuque.com/sekh46/bbgc7f/px4te4/edit#y44m
- 视觉稿: https://lanhuapp.com/web/#/item/project/stage?tid=3b3b08b2-8068-4d09-9535-148f1c47f6b8&pid=56924b6e-18ea-4be5-860a-d5eef3e89d06
