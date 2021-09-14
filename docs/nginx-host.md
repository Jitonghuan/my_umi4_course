# NGINX HOST

## host 列表

| name       | username@host        | password       | port |
| ---------- | -------------------- | -------------- | ---- |
| production | root@47.97.186.99    | Nc7*wtf_hok3   |      |
| gmc        | root@192.168.54.139  | seenew123456 |      |
| tt_poc     | root@47.116.74.55    |                |      |
| ruili      | root@47.96.37.225    |                |      |
| g3a        | root@192.168.54.147  | Cfuture#k8sNew |      |
| zizhou     | root@139.198.164.108 |                | 3622 |

> 注: 未写密码的是通过 ssh key 登录的

## 不同环境对应的服务器及 nginx 目录

| env             | host name  | BASE_DIR                                      |
| --------------- | ---------- | --------------------------------------------- |
| gmc_dev         | gmc        | /usr/share/nginx/dev                          |
| gmc_test        | gmc        | /usr/share/nginx/test                         |
| tt_poc          | tt_poc     | /usr/share/nginx/his                          |
| ruili           | ruili      | /usr/share/nginx/his                          |
| zizhou          | zizhou     | /usr/share/nginx/test                         |
| dev             | g3a        | /usr/share/nginx/dev                          |
| test            | g3a        | /usr/share/nginx/test                         |
| prod            | production | /usr/share/nginx/publish/zheyi/his            |
| tt              | production | /usr/share/nginx/publish/tiantai/his          |
| tt_micro_portal | production | /usr/share/nginx/publish/tiantai/micro-portal |
| tt_health       | production | /usr/share/nginx/publish/tiantai/tt-health    |
| tt_dp           | production | /usr/share/nginx/publish/tiantai/hbos-dp-fe   |
| weishan         | production | /usr/share/nginx/publish/weishan/his          |

## 不同文件存放方式

### 单工程

- 资源文件同步到 {BASE_DIR}/{group}/{project}/{version}
- html文件(在资源文件根目录下) 同步到 {BASE_DIR}/{group}/{project}/xxx.html

### 微前微-主应用

- 资源文件同步到 {BASE_DIR}/{group}/{project}/{version}
- 路由文件(可能是html、app.json等) 同步到 {BASE_DIR}/{appData.routeFile}
- html文件(如资源文件根目录下有) 同步到 {BASE_DIR}/{group}/{project}/xxx.html

### 微前端-子应用

- 资源文件同步到 {BASE_DIR}/{group}/{project}/{version}
- 路由文件(可能是html、app.json等) 同步到 {BASE_DIR}/{appData.routeFile}
- html文件(如资源文件根目录下有) 同步到 {BASE_DIR}/{group}/{project}/xxx.html
