# NGINX HOST

## host 列表

| name       | username@host        | password         | port |
| ---------- | -------------------- | ---------------- | ---- |
| production | root@47.97.186.99    | Nc7*wtf_hok3     |      |
| gmc        | root@192.168.54.139  | seenew123456     |      |
| ttpoc      | root@47.116.74.55    |                  |      |
| ruili      | root@47.96.37.225    |                  |      |
| g3a        | root@192.168.54.147  | Cfuture#k8sNew   |      |
| zizhou     | root@139.198.164.108 |                  | 3622 |
| hbos       | root@192.168.54.151  | zOnKQnU3oRzLlcKo |      |
| base       | root@192.168.0.111   | &WUb&1u8508P0ohD |      |

> 注: 未写密码的是通过 ssh key 登录的

## 不同环境对应的服务器及 nginx 目录

| env                 | host name  | BASE_DIR                                      | desc       |
| ------------------- | ---------- | --------------------------------------------- | ---------- |
| gmc-dev             | gmc        | /usr/share/nginx/dev                          | 医共体DEV  |
| g3a-dev             | g3a        | /usr/share/nginx/dev                          | 三甲DEV    |
| hbos-dev            | hbos       | /usr/share/nginx/dev                          | HBOS DEV   |
| base-dev            | base       | /usr/share/nginx/dev                          | 基础 DEV   |
| gmc-test            | gmc        | /usr/share/nginx/test                         | 医共体TEST |
| g3a-test            | g3a        | /usr/share/nginx/test                         | 三甲TEST   |
| hbos-test           | hbos       | /usr/share/nginx/test                         | HBOS TEST  |
| base-test           | base       | /usr/share/nginx/test                         | 基础TEST   |
| tt-poc              | ttpoc      | /usr/share/nginx/his                          | 天台POC    |
| zy-daily            |            |                                               | 浙一daily  |
| hbos-seenewhospital | hbos       | /usr/share/nginx/seenewhospital               | HBOS演示   |
| ws-prd              | production | /usr/share/nginx/publish/weishan/his          | 巍山生产   |
| zy-prd              | production | /usr/share/nginx/publish/zheyi/his            | 浙一生产   |
| seenew-health       |            |                                               | 熙牛健康   |
| tt-health           | production | /usr/share/nginx/publish/tiantai/tt-health    | 天台健康   |
| tt-manage           |            |                                               | 天台管理   |
| base-prod           | base       | /usr/share/nginx/prod                         | 基础线上   |
| ynrl                | ruili      | /usr/share/nginx/his                          | 瑞丽生产   |
| zs-prd              |            |                                               | 中山生产   |
| tt-his              | production | /usr/share/nginx/publish/tiantai/his          | 天台生产   |
| ~~zizhou~~          | zizhou     | /usr/share/nginx/test                         | 子州生产   |
| ~~tt_micro_portal~~ | production | /usr/share/nginx/publish/tiantai/micro-portal | 天台微门户 |
| ~~tt_dp~~           | production | /usr/share/nginx/publish/tiantai/hbos-dp-fe   | 开发者平台 |

## 不同文件存放方式

> 通用规则：

- 资源文件同步到 {BASE_DIR}/{project}/{version}
- index.html (资源文件根目录中) 同步到 {BASE_DIR}/{project}/index.html

### 微前端-主应用

- 路由文件(index.html、app.json) 同步到 {BASE_DIR}/{routeFile}
- 如果 routeFile ~= *.json，将 index.html (资源文件根目录) 同步到 {BASE_DIR}/index.html

### 微前端-子应用

- 路由文件(index.html、app.json) 同步到 {BASE_DIR}/{routeFile}
