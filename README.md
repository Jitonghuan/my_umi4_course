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
127.0.0.1 matrix-test.cfuture.shop

# 配置转发规则 http://127.0.0.1:30323/#/code 中源码编辑补充下面代码

{
  "server_name": "matrix-test.cfuture.shop",
  "proxy": {
      "/matrix/**": {
          "type": "web",
          "port": "9091",
          "target": "http://127.0.0.1:9091",
          "changeOrigin": false,
          "pathRewriter": {}
      }
  }
}

# 启动 matrix 服务， 访问 http://matrix-test.cfuture.shop

```

Build
```
  1. 本地分支开发
  2. 针对需要部署环境，将本地分支代码部署到待部署分支，推到远程【test/prod】
    测试发布分支 test/0.1.0
    线上发布分支 release/0.1.0
  3. Jenkins 构建部署【ops/fe-matrix-test】
```
