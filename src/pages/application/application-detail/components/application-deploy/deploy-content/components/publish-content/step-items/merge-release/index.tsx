// merge release
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:09

import React, { useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Steps, Button, message } from 'antd';
import { retryMerge, getMergeMessage } from '@/pages/application/service';
import { StepItemProps } from '../../types';
import MergeConflict from '../../../merge-conflict';
import { conflictItem } from '../../../merge-conflict/types';

const temp = [
  {
    filePath: 'controllers/appManageControllers/user.go',
    releaseBranch: {
      branchName: 'release_dev_20220119100708',
      context:
        'package1 appManageControllers\n\nimport (\n\t"encoding/json"\n\t"fmt"\n\t"matrix/models/appManageModels"\n\t"matrix/services/appManageServices"\n)\n\n// @Title Create User\n// @Description create user\n// @Param\tbody\tbody\tappManageModels.User true \t"创建用户请求体"\n// @Success\t1000\t"success"\n// @Failure\t1001\t"error message"\n// @router /user/create [POST]\nfunc (this *AppManageController) CreateUser() {\n\tfmt.Println("222")\n\tfmt.Println("222")\n\tfmt.Println("222")\n\tfmt.Println("222")\n\tums := new(appManageServices.UserManageService)\n\tu := new(appManageModels.User)\n\terr := json.Unmarshal(this.Ctx.Input.RequestBody, u)\n\tif err != nil {\n\t\tthis.RespErr(err, "解析参数异常")\n\t\treturn\n\t}\n\n\tu, err = ums.Create(u, this.WhoAmI())\n\tif err != nil {\n\t\tthis.RespErr(err)\n\t\treturn\n\t}\n\n\tthis.RespSuccess(u)\n}\n\n// @Title List User\n// @Description list user\n// @Param \tid  \t\t\tquery\t\tint \t\tfalse \t\t"数据组自增ID"\n// @Param\trole \t\t\tquery\t\tstring \t\tfalse \t\t"角色"\n// @Param \tgroupCode \t\tquery\t\tstring \t\tfalse\t\t"应用分组CODE"\n// @Param \tusername \t\tquery\t\tstring \t\tfalse \t\t"用户名 (支持模糊搜索)"\n// @Param \tssoUsername \tquery\t\tstring \t\tfalse\t\t"sso用户名（支持模糊搜索）"\n// @Param \tcategoryCode \tquery\t\tstring \t\tfalse\t\t"应用分类CODE"\n// @Param \tdingUid \t\tquery\t\tstring \t\tfalse\t\t"钉钉用户ID"\n// @Param \temail\t\t\tquery\t\tstring \t\tfalse\t\t"邮箱地址 (支持模糊搜索)"\n// @Param \tmobile\t\t\tquery\t\tstring \t\tfalse\t\t"手机号 (支持模糊搜索)"\n// @Param\tpageIndex\t\tquery\t\tint \t\tfalse \t\t"分页索引"\n// @Param \tpageSize \t\tquery\t\tint \t\tfalse\t\t"分页大小"\n// @Success 1000\t"success"\n// @Failure 1001\t"error message"\n// @router /user/list [GET]\nfunc (this *AppManageController) ListUser() {\n\tums := new(appManageServices.UserManageService)\n\tid, err := this.GetInt("id", 0)\n\tif err != nil {\n\t\tthis.RespErr(err, "解析参数异常")\n\t\treturn\n\t}\n\n\tpageIndex, err := this.GetInt("pageIndex", 1)\n\tif err != nil {\n\t\tthis.RespErr(err, "解析参数异常")\n\t\treturn\n\t}\n\n\tpageSize, err := this.GetInt("pageSize", 20)\n\tif err != nil {\n\t\tthis.RespErr(err, "解析参数异常")\n\t\treturn\n\t}\n\n\trole := this.GetString("role", "")\n\tgroupCode := this.GetString("groupCode")\n\tusername := this.GetString("username")\n\tssoUsername := this.GetString("ssoUsername")\n\tcategoryCode := this.GetString("categoryCode")\n\tdingUid := this.GetString("dingUid")\n\temail := this.GetString("email")\n\tmobile := this.GetString("mobile")\n\n\tus, total, err := ums.List(pageIndex, pageSize, id, role, groupCode, username, ssoUsername, categoryCode, dingUid, email, mobile)\n\tif err != nil {\n\t\tthis.RespErr(err)\n\t\treturn\n\t}\n\n\tthis.RespListSuccess(pageIndex, pageSize, total, us)\n}\n\n// @Title List User\n// @Description 展示所有用户名\n// @Success 1000\t"success"\n// @Failure 1001\t"error message"\n// @router /user/listAll [GET]\nfunc (this *AppManageController) ListAllUsers() {\n\tfmt.Println("222")\n\tfmt.Println("222")\n\tfmt.Println("222")\n\tfmt.Println("222222")\n\tums := new(appManageServices.UserManageService)\n\tusernames, err := ums.GetAllUsernames()\n\tif err != nil {\n\t\tthis.RespErr(err)\n\t}\n\tthis.RespSuccess(usernames)\n}\n',
    },
    featureBranch: {
      branchName: 'feature_conflict1_20220118201928',
      context:
        'package1 appManageControllers\n\nimport (\n\t"encoding/json"\n\t"fmt"\n\t"matrix/models/appManageModels"\n\t"matrix/services/appManageServices"\n)\n\n// @Title Create User\n// @Description create user\n// @Param\tbody\tbody\tappManageModels.User true \t"创建用户请求体"\n// @Success\t1000\t"success"\n// @Failure\t1001\t"error message"\n// @router /user/create [POST]\nfunc (this *AppManageController) CreateUser() {\n\tfmt.Println("222")\n\tfmt.Println("222")\n\tfmt.Println("222")\n\tfmt.Println("222")\n\tums := new(appManageServices.UserManageService)\n\tu := new(appManageModels.User)\n\terr := json.Unmarshal(this.Ctx.Input.RequestBody, u)\n\tif err != nil {\n\t\tthis.RespErr(err, "解析参数异常")\n\t\treturn\n\t}\n\n\tu, err = ums.Create(u, this.WhoAmI())\n\tif err != nil {\n\t\tthis.RespErr(err)\n\t\treturn\n\t}\n\n\tthis.RespSuccess(u)\n}\n\n// @Title List User\n// @Description list user\n// @Param \tid  \t\t\tquery\t\tint \t\tfalse \t\t"数据组自增ID"\n// @Param\trole \t\t\tquery\t\tstring \t\tfalse \t\t"角色"\n// @Param \tgroupCode \t\tquery\t\tstring \t\tfalse\t\t"应用分组CODE"\n// @Param \tusername \t\tquery\t\tstring \t\tfalse \t\t"用户名 (支持模糊搜索)"\n// @Param \tssoUsername \tquery\t\tstring \t\tfalse\t\t"sso用户名（支持模糊搜索）"\n// @Param \tcategoryCode \tquery\t\tstring \t\tfalse\t\t"应用分类CODE"\n// @Param \tdingUid \t\tquery\t\tstring \t\tfalse\t\t"钉钉用户ID"\n// @Param \temail\t\t\tquery\t\tstring \t\tfalse\t\t"邮箱地址 (支持模糊搜索)"\n// @Param \tmobile\t\t\tquery\t\tstring \t\tfalse\t\t"手机号 (支持模糊搜索)"\n// @Param\tpageIndex\t\tquery\t\tint \t\tfalse \t\t"分页索引"\n// @Param \tpageSize \t\tquery\t\tint \t\tfalse\t\t"分页大小"\n// @Success 1000\t"success"\n// @Failure 1001\t"error message"\n// @router /user/list [GET]\nfunc (this *AppManageController) ListUser() {\n\tums := new(appManageServices.UserManageService)\n\tid, err := this.GetInt("id", 0)\n\tif err != nil {\n\t\tthis.RespErr(err, "解析参数异常")\n\t\treturn\n\t}\n\n\tpageIndex, err := this.GetInt("pageIndex", 1)\n\tif err != nil {\n\t\tthis.RespErr(err, "解析参数异常")\n\t\treturn\n\t}\n\n\tpageSize, err := this.GetInt("pageSize", 20)\n\tif err != nil {\n\t\tthis.RespErr(err, "解析参数异常")\n\t\treturn\n\t}\n\n\trole := this.GetString("role", "")\n\tgroupCode := this.GetString("groupCode")\n\tusername := this.GetString("username")\n\tssoUsername := this.GetString("ssoUsername")\n\tcategoryCode := this.GetString("categoryCode")\n\tdingUid := this.GetString("dingUid")\n\temail := this.GetString("email")\n\tmobile := this.GetString("mobile")\n\n\tus, total, err := ums.List(pageIndex, pageSize, id, role, groupCode, username, ssoUsername, categoryCode, dingUid, email, mobile)\n\tif err != nil {\n\t\tthis.RespErr(err)\n\t\treturn\n\t}\n\n\tthis.RespListSuccess(pageIndex, pageSize, total, us)\n}\n\n// @Title List User\n// @Description 展示所有用户名\n// @Success 1000\t"success"\n// @Failure 1001\t"error message"\n// @router /user/listAll [GET]\nfunc (this *AppManageController) ListAllUsers() {\n\tfmt.Println("222")\n\tfmt.Println("222")\n\tfmt.Println("222")\n\tfmt.Println("222222")\n\tums := new(appManageServices.UserManageService)\n\tusernames, err := ums.GetAllUsernames()\n\tif err != nil {\n\t\tthis.RespErr(err)\n\t}\n\tthis.RespSuccess(usernames)\n}\n',
    },
    id: 1,
    resolved: false,
  },
  {
    filePath: 'main.ts',
    releaseBranch: {
      branchName: 'release_dev_20220119100700',
      context:
        'package2 main\n\nimport (\n\t"fmt"\n\t"github.com/astaxie/beego/context"\n\t"github.com/astaxie/beego/logs"\n\t"github.com/astaxie/beego/orm"\n\t"github.com/astaxie/beego/plugins/cors"\n\t"matrix/lib/sso"\n\t_ "matrix/models/init"\n\t_ "matrix/routers"\n\t_ "matrix/services/crontManage"\n\t_ "matrix/utils/db"\n\t"regexp"\n\t"strings"\n\n\t"github.com/astaxie/beego"\n)\n\nfunc main() {\n\t//跨站处理\n\tbeego.InsertFilter("*", beego.BeforeRouter, cors.Allow(&cors.Options{\n\t\t//允许访问所有源\n\t\tAllowOrigins: []string{"http://*.cfuture.shop*"},\n\t\t//AllowAllOrigins: true,\n\t\t//可选参数"GET", "POST", "PUT", "DELETE", "OPTIONS" (*为所有)\n\t\t//其中Options跨域复杂请求预检\n\t\tAllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},\n\t\t//指的是允许的Header的种类\n\t\tAllowHeaders: []string{"content-type", "*"},\n\t\t//公开的HTTP标头列表\n\t\tExposeHeaders: []string{"Content-Length"},\n\t\t//如果设置，则允许共享身份验证凭据，例如cookie\n\t\tAllowCredentials: true,\n\t}))\n\n\tif beego.BConfig.RunMode == "dev" {\n\t\torm.Debug = true\n\t\tbeego.BConfig.WebConfig.DirectoryIndex = true\n\t\tbeego.BConfig.WebConfig.StaticDir["/swagger"] = "swagger"\n\t}\n\n\t//过滤钉钉回调接口、三方资源推送接口\n\tvar FilterToken = func(ctx *context.Context) {\n\t\tvar tokenKey string\n\t\tswitch beego.AppConfig.String("runmode") {\n\t\tcase "dev":\n\t\t\ttokenKey = "dev_c2f_token"\n\t\tcase "prod":\n\t\t\ttokenKey = "prod_c2f_token"\n\t\tcase "zs-prd":\n\t\t\ttokenKey = "prod_c2f_token"\n\t\tdefault:\n\t\t\ttokenKey = "dev_c2f_token"\n\t\t}\n\t\ttoken := ctx.GetCookie(tokenKey)\n\t\ttoken = strings.Split(token, ".")[0]\n\t\treqUri := ctx.Request.RequestURI\n\n\t\tmatch, err := regexp.Match("/v1/deploy/dingcallback/receive|/v1/ticketManage/handleDingCallBack|"+\n\t\t\t"/v1/monitorManage/alertrecord/create|"+\n\t\t\t"/v1/monitorManage/alertrecord/modifystatus|"+\n\t\t\t"/v1/monitorManage/alertrecord/dingcallback|"+\n\t\t\t"/v1/monitorManage/getNotificationPhones|"+\n\t\t\t"/v1/publishManage/receive|"+\n\t\t\t"/v1/releaseManage/deploy/pushThirdFe|"+\n\t\t\t"/v1/logManage/alertrecord/create|"+\n\t\t\t"/v1/logManage/alertrecord/modifystatus|"+\n\t\t\t"/v1/logManage/alertrecord/dingcallback|"+\n\t\t\t"/v1/appManage/appStatus|"+\n\t\t\t"/v1/appManage/deployInfo/instance/list|"+\n\t\t\t"/v1/appManage/getAppDetailFeUrl|"+\n\t\t\t"/v1/appManage/deployInfo/instance/listContainer|"+\n\t\t\t"/v1/appManage/deployInfo/instance/container/executeCommand|"+\n\t\t\t"/v1/appManage/deployInfo/instance/ws", []byte(reqUri))\n\t\tif err != nil {\n\t\t\tlogs.Error("match requri failed:", err)\n\t\t}\n\n\t\tif token == "" && !match {\n\t\t\tctx.Output.SetStatus(200)\n\t\t\tvar respBody = map[string]interface{}{}\n\t\t\trespBody["code"] = 101012001\n\t\t\trespBody["errorMsg"] = "token不存在"\n\t\t\trespBody["success"] = false\n\t\t\trespBody["data"] = ""\n\t\t\tctx.Output.JSON(respBody, false, false)\n\t\t\treturn\n\t\t}\n\n\t\tif ok := checkToken(token); !ok && !match {\n\t\t\tctx.Output.SetStatus(200)\n\t\t\tvar respBody = map[string]interface{}{}\n\t\t\trespBody["code"] = 101012001\n\t\t\trespBody["errorMsg"] = "token过期"\n\t\t\trespBody["success"] = false\n\t\t\trespBody["data"] = ""\n\t\t\tctx.Output.JSON(respBody, false, false)\n\t\t\treturn\n\t\t}\n\t}\n\n\tbeego.InsertFilter("*", beego.BeforeRouter, FilterToken)\n\tbeego.Run()\n}\n\n//校验token的合法性\nfunc checkToken(token string) bool {\n\tfmt.Println("222")\n\tfmt.Println("222")\n\tfmt.Println("222")\n\tfmt.Println("222")\n\tfmt.Println("222")\n\tuserInfo, err := sso.GetUserInfoFromRedis(token)\n\tif err != nil {\n\t\treturn false\n\t}\n\tif userInfo == nil || len(userInfo.Name) == 0 {\n\t\treturn false\n\t}\n\treturn true\n}\n',
    },
    featureBranch: {
      branchName: 'feature_conflict1_20220118201800',
      context:
        'package2 main\n\nimport (\n\t"fmt"\n\t"github.com/astaxie/beego/context"\n\t"github.com/astaxie/beego/logs"\n\t"github.com/astaxie/beego/orm"\n\t"github.com/astaxie/beego/plugins/cors"\n\t"matrix/lib/sso"\n\t_ "matrix/models/init"\n\t_ "matrix/routers"\n\t_ "matrix/services/crontManage"\n\t_ "matrix/utils/db"\n\t"regexp"\n\t"strings"\n\n\t"github.com/astaxie/beego"\n)\n\nfunc main() {\n\t//跨站处理\n\tbeego.InsertFilter("*", beego.BeforeRouter, cors.Allow(&cors.Options{\n\t\t//允许访问所有源\n\t\tAllowOrigins: []string{"http://*.cfuture.shop*"},\n\t\t//AllowAllOrigins: true,\n\t\t//可选参数"GET", "POST", "PUT", "DELETE", "OPTIONS" (*为所有)\n\t\t//其中Options跨域复杂请求预检\n\t\tAllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},\n\t\t//指的是允许的Header的种类\n\t\tAllowHeaders: []string{"content-type", "*"},\n\t\t//公开的HTTP标头列表\n\t\tExposeHeaders: []string{"Content-Length"},\n\t\t//如果设置，则允许共享身份验证凭据，例如cookie\n\t\tAllowCredentials: true,\n\t}))\n\n\tif beego.BConfig.RunMode == "dev" {\n\t\torm.Debug = true\n\t\tbeego.BConfig.WebConfig.DirectoryIndex = true\n\t\tbeego.BConfig.WebConfig.StaticDir["/swagger"] = "swagger"\n\t}\n\n\t//过滤钉钉回调接口、三方资源推送接口\n\tvar FilterToken = func(ctx *context.Context) {\n\t\tvar tokenKey string\n\t\tswitch beego.AppConfig.String("runmode") {\n\t\tcase "dev":\n\t\t\ttokenKey = "dev_c2f_token"\n\t\tcase "prod":\n\t\t\ttokenKey = "prod_c2f_token"\n\t\tcase "zs-prd":\n\t\t\ttokenKey = "prod_c2f_token"\n\t\tdefault:\n\t\t\ttokenKey = "dev_c2f_token"\n\t\t}\n\t\ttoken := ctx.GetCookie(tokenKey)\n\t\ttoken = strings.Split(token, ".")[0]\n\t\treqUri := ctx.Request.RequestURI\n\n\t\tmatch, err := regexp.Match("/v1/deploy/dingcallback/receive|/v1/ticketManage/handleDingCallBack|"+\n\t\t\t"/v1/monitorManage/alertrecord/create|"+\n\t\t\t"/v1/monitorManage/alertrecord/modifystatus|"+\n\t\t\t"/v1/monitorManage/alertrecord/dingcallback|"+\n\t\t\t"/v1/monitorManage/getNotificationPhones|"+\n\t\t\t"/v1/publishManage/receive|"+\n\t\t\t"/v1/releaseManage/deploy/pushThirdFe|"+\n\t\t\t"/v1/logManage/alertrecord/create|"+\n\t\t\t"/v1/logManage/alertrecord/modifystatus|"+\n\t\t\t"/v1/logManage/alertrecord/dingcallback|"+\n\t\t\t"/v1/appManage/appStatus|"+\n\t\t\t"/v1/appManage/deployInfo/instance/list|"+\n\t\t\t"/v1/appManage/getAppDetailFeUrl|"+\n\t\t\t"/v1/appManage/deployInfo/instance/listContainer|"+\n\t\t\t"/v1/appManage/deployInfo/instance/container/executeCommand|"+\n\t\t\t"/v1/appManage/deployInfo/instance/ws", []byte(reqUri))\n\t\tif err != nil {\n\t\t\tlogs.Error("match requri failed:", err)\n\t\t}\n\n\t\tif token == "" && !match {\n\t\t\tctx.Output.SetStatus(200)\n\t\t\tvar respBody = map[string]interface{}{}\n\t\t\trespBody["code"] = 101012001\n\t\t\trespBody["errorMsg"] = "token不存在"\n\t\t\trespBody["success"] = false\n\t\t\trespBody["data"] = ""\n\t\t\tctx.Output.JSON(respBody, false, false)\n\t\t\treturn\n\t\t}\n\n\t\tif ok := checkToken(token); !ok && !match {\n\t\t\tctx.Output.SetStatus(200)\n\t\t\tvar respBody = map[string]interface{}{}\n\t\t\trespBody["code"] = 101012001\n\t\t\trespBody["errorMsg"] = "token过期"\n\t\t\trespBody["success"] = false\n\t\t\trespBody["data"] = ""\n\t\t\tctx.Output.JSON(respBody, false, false)\n\t\t\treturn\n\t\t}\n\t}\n\n\tbeego.InsertFilter("*", beego.BeforeRouter, FilterToken)\n\tbeego.Run()\n}\n\n//校验token的合法性\nfunc checkToken(token string) bool {\n\tfmt.Println("222")\n\tfmt.Println("222")\n\tfmt.Println("222")\n\tfmt.Println("222")\n\tfmt.Println("222")\n\tuserInfo, err := sso.GetUserInfoFromRedis(token)\n\tif err != nil {\n\t\treturn false\n\t}\n\tif userInfo == nil || len(userInfo.Name) == 0 {\n\t\treturn false\n\t}\n\treturn true\n}\n',
    },
    id: 3,
    resolved: false,
  },
];
/** 合并release */
export default function MergeReleaseStep(props: StepItemProps) {
  const { deployInfo, deployStatus, onOperate, envTypeCode, ...others } = props;
  const [mergeVisible, setMergeVisible] = useState(false); //冲突详情
  const [mergeMessage, setMergeMessage] = useState<any>([]);
  const isLoading = deployStatus === 'merging';
  const isError = deployStatus === 'mergeErr' || deployStatus === 'conflict';

  const retryMergeClick = async () => {
    try {
      await retryMerge({ id: deployInfo.id });
    } finally {
      onOperate('mergeReleaseRetryEnd');
    }
  };

  const openMergeConflict = () => {
    getMergeMessage({ releaseBranch: deployInfo.releaseBranch }).then((res) => {
      if (!res.success) {
        message.error(res.errorMsg);
        return;
      }
      const dataArray = res?.data.map((item: conflictItem, index: number) => ({
        ...item,
        id: index + 1,
        resolved: false,
      }));
      setMergeMessage(dataArray);
      setMergeVisible(true);
    });
    onOperate('mergeStart');
  };
  const handleCancelMerge = () => {
    setMergeVisible(false);
    onOperate('mergeEnd');
  };

  return (
    <>
      <MergeConflict
        visible={mergeVisible}
        handleCancel={handleCancelMerge}
        mergeMessage={mergeMessage}
        releaseBranch={deployInfo.releaseBranch}
      ></MergeConflict>
      <Steps.Step
        {...others}
        title="合并release"
        icon={isLoading && <LoadingOutlined />}
        status={isError ? 'error' : others.status}
        description={
          isError && (
            <>
              {deployInfo.mergeWebUrl && (
                <div style={{ marginTop: 2 }}>
                  <a target="_blank" onClick={openMergeConflict}>
                    解决冲突
                  </a>
                </div>
              )}
              <Button style={{ marginTop: 4 }} onClick={retryMergeClick}>
                重试
              </Button>
            </>
          )
        }
      />
    </>
    // isError &&
    // deployInfo.mergeWebUrl &&
  );
}
