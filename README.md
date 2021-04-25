# fe-matrix

## Getting Started

Install dependencies,

```bash
$ fnpm i
```

Start the dev server,

```bash
# 不采用mock模式
$ npm run start

# mock模式
$ npm run start:mock
```

Start with SSO
```
# 配置Host
127.0.0.1 matrix-local.cfuture.shop

# 获取git库 https://gitlab.cfuture.shop/fe-base/fe-monitor-web 的权限

# fe环境初始化（在git bash中执行）
1、【fe -v】查看是否安装fe-cli，未安装执行2、3，如已安装则执行4
2、【npm install -g @cffe/fe-cli --registry=http://registry.npm.cfuture.cc】
3、【npm install -g @cffe/fnpm --registry=http://registry.npm.cfuture.cc】
4、【fe env init】按照指示一步一步执行

# monitor 启动【fe monitor start】，配置转发规则 http://127.0.0.1:30323/#/code 中源码编辑补充下面代码

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

# 启动 matrix 服务， 访问 http://matrix-local.cfuture.shop

```

Build
```
  1. 本地分支开发
  2. 针对需要部署环境，将本地分支代码部署到待部署分支，推到远程【test/prod】
    测试发布分支 test/0.1.0
    线上发布分支 release/0.1.0
  3. Jenkins 构建部署【ops/fe-matrix-test】
```

Permission
```
代码管理
  /matrix/code
    /matrix/code/rank    代码排行
    /matrix/code/details   统计详情

监控管理
  /matrix/monitor
    /matrix/monitor/board  监控面板
    /matrix/monitor/application  应用监控

测试管理
  /matrix/test
    /matrix/test/auto    自动化测试
    /matrix/test/result    自动化测试查询

工单列表
  /matrix/ticket
    /matrix/ticket/list    工单列表

应用管理
  /matrix/application
    /matrix/application/all                 全部应用
    /matrix/application/listenerCount       应用列表
    /matrix/application/detail              应用详情
      /matrix/application/detail/overview     概述
      /matrix/application/detail/appDeploy    应用部署
      /matrix/application/detail/branch       分支
      /matrix/application/detail/configMgr      配置管理
      /matrix/application/detail/launchParameters        启动参数
      /matrix/application/detail/addConfig                新增配置
      /matrix/application/detail/addLaunchParameters     新增启动参数
```