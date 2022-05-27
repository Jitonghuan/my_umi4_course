"use strict";
// 发布详情
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/06 20:08
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var antd_1 = require("antd");
var icons_1 = require("@ant-design/icons");
var umi_1 = require("umi");
var context_1 = require("../../../../../context");
var service_1 = require("@/pages/application/service");
var hook_1 = require("@/pages/application/application-detail/components/branch-manage/hook");
require("./index.less");
var rootCls = 'publish-detail-compo';
var Paragraph = antd_1.Typography.Paragraph;
function PublishDetail(props) {
    var _this = this;
    var _a, _b;
    var deployInfo = props.deployInfo, envTypeCode = props.envTypeCode, onOperate = props.onOperate, pipelineCode = props.pipelineCode, envCode = props.envCode;
    var _c = deployInfo || {}, metadata = _c.metadata, branchInfo = _c.branchInfo, envInfo = _c.envInfo, buildInfo = _c.buildInfo, status = _c.status;
    var buildUrl = (buildInfo || {}).buildUrl;
    var _d = react_1.useContext(context_1["default"]), appData = _d.appData, projectEnvCode = _d.projectEnvCode, projectEnvName = _d.projectEnvName;
    var appCategoryCode = (appData || {}).appCategoryCode;
    var _e = react_1.useState(false), confirmLoading = _e[0], setConfirmLoading = _e[1];
    var _f = react_1.useState(), deployEnv = _f[0], setDeployEnv = _f[1];
    var _g = react_1.useState([]), restartEnv = _g[0], setRestartEnv = _g[1]; //重启时获取到的环境值
    var _h = react_1.useState(), deployMasterEnv = _h[0], setDeployMasterEnv = _h[1];
    var _j = react_1.useState([]), envDataList = _j[0], setEnvDataList = _j[1];
    var _k = react_1.useState(false), deployVisible = _k[0], setDeployVisible = _k[1];
    var _l = react_1.useState(false), restartVisible = _l[0], setRestartVisible = _l[1];
    var _m = react_1.useState(false), deployMasterVisible = _m[0], setDeployMasterVisible = _m[1];
    var _o = react_1.useState([]), masterBranchOptions = _o[0], setMasterBranchOptions = _o[1];
    var _p = react_1.useState(''), selectMaster = _p[0], setSelectMaster = _p[1];
    var masterListData = hook_1.useMasterBranchList({ branchType: 'master', appCode: (appData === null || appData === void 0 ? void 0 : appData.appCode) || '' })[0];
    var newNextEnvTypeCode = '';
    react_1.useEffect(function () {
        if (!appCategoryCode)
            return;
        if (!envTypeCode)
            return;
    }, [appCategoryCode, envTypeCode, metadata === null || metadata === void 0 ? void 0 : metadata.id]);
    react_1.useEffect(function () {
        if (masterListData.length !== 0) {
            var option = masterListData.map(function (item) { return ({ value: item.branchName, label: item.branchName }); });
            setMasterBranchOptions(option);
            var initValue = option.find(function (item) { return item.label === 'master'; });
            setSelectMaster(initValue === null || initValue === void 0 ? void 0 : initValue.value);
        }
    }, [masterListData]);
    // 取消发布
    var handleCancelPublish = function () {
        onOperate('cancelDeployStart');
        antd_1.Modal.confirm({
            title: '确定要取消当前发布吗？',
            icon: react_1["default"].createElement(icons_1.ExclamationCircleOutlined, null),
            onOk: function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, service_1.cancelDeploy({
                            id: metadata === null || metadata === void 0 ? void 0 : metadata.id,
                            envCode: ''
                        }).then(function () {
                            onOperate('cancelDeployEnd');
                        })];
                });
            }); },
            onCancel: function () {
                onOperate('cancelDeployEnd');
            }
        });
    };
    // 部署 master
    var deployToMaster = function () {
        onOperate('deployMasterStart');
        setDeployMasterVisible(true);
    };
    // 放弃部署 master
    var cancelDeployToMaster = function () {
        onOperate('deployMasterEnd');
        setDeployMasterVisible(false);
        setConfirmLoading(false);
    };
    var getBuildType = function () {
        var _a = appData || {}, appType = _a.appType, isClient = _a.isClient;
        if (appType === 'frontend') {
            return 'feMultiBuild';
        }
        else {
            return isClient ? 'beClientBuild' : 'beServerBuild';
        }
    };
    // 确认发布操master作
    var confirmPublishToMaster = function () { return __awaiter(_this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setConfirmLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, service_1.deployMaster({
                            pipelineCode: pipelineCode,
                            envCodes: [envCode],
                            buildType: getBuildType(),
                            masterBranch: selectMaster
                        })];
                case 2:
                    res = _a.sent();
                    if (res === null || res === void 0 ? void 0 : res.success) {
                        antd_1.message.success('操作成功，正在部署中...');
                        setDeployMasterVisible(false);
                        onOperate('deployMasterEnd');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    setConfirmLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // 发布环境
    var I = 0;
    var envNames = react_1.useMemo(function () {
        // const { envs } = deployInfo;
        var deployEnvs = (envInfo || {}).deployEnvs;
        // const envList = deployEnvs?.split(',') || [];
        return envDataList
            .filter(function (envItem) {
            return (deployEnvs || []).includes(envItem.value);
        })
            .map(function (envItem) { return envItem.label + "(" + envItem.value + ")"; })
            .join(',');
    }, [envDataList, deployInfo]);
    // 离线部署
    var uploadFile = function () {
        return service_1.feOfflineDeploy + "?&envCodes=" + deployEnv + "&pipelineCode=" + pipelineCode;
    };
    // 上传按钮 message.error(info.file.response?.errorMsg) ||
    var uploadProps = {
        name: 'image',
        action: uploadFile,
        progress: {
            strokeColor: {
                '0%': '#108ee9',
                '100%': '#87d068'
            },
            strokeWidth: 3,
            format: function (percent) { return parseFloat(percent.toFixed(2)) + "%"; }
        },
        onChange: function (info) {
            var _a;
            if (info.file.status === 'uploading') {
                return;
            }
            if (info.file.status === 'done' && ((_a = info.file) === null || _a === void 0 ? void 0 : _a.response.success) == 'true') {
                antd_1.message.success(info.file.name + " \u4E0A\u4F20\u6210\u529F");
            }
            else if (info.file.status === 'error') {
                antd_1.message.error(info.file.name + " \u4E0A\u4F20\u5931\u8D25");
            }
            else {
                antd_1.message.error(info.file.response.errorMsg || '');
            }
            setDeployVisible(false);
            setDeployEnv([]);
            onOperate('uploadImageEnd');
        }
    };
    var handleCancel = function () {
        setDeployVisible(false);
        setDeployEnv([]);
        onOperate('uploadImageEnd');
    };
    //重启确认
    var confirm = antd_1.Modal.confirm;
    var ensureRestart = function () {
        confirm({
            title: '确定要重启应用吗？',
            icon: react_1["default"].createElement(icons_1.ExclamationCircleOutlined, null),
            onOk: function () {
                service_1.restartApp({
                    appCode: appData === null || appData === void 0 ? void 0 : appData.appCode,
                    // envCode: restartEnv?.[0],
                    envCode: restartEnv,
                    appCategoryCode: appData === null || appData === void 0 ? void 0 : appData.appCategoryCode
                })
                    .then(function (resp) {
                    if (resp.success) {
                        antd_1.message.success('操作成功！');
                    }
                })["finally"](function () {
                    setRestartVisible(false);
                    setRestartEnv([]);
                });
            },
            onCancel: function () { }
        });
    };
    var envDataOption = []; //重启时选择环境option
    envDataList === null || envDataList === void 0 ? void 0 : envDataList.map(function (item) {
        if ((item === null || item === void 0 ? void 0 : item.value) === 'tt-his') {
            envDataOption.push({ label: item.label, value: item.value });
        }
        if ((item === null || item === void 0 ? void 0 : item.value) === 'tt-health') {
            envDataOption.push({ label: item.label, value: item.value });
        }
        if ((item === null || item === void 0 ? void 0 : item.value) === 'seenew-health') {
            envDataOption.push({ label: item.label, value: item.value });
        }
        if ((item === null || item === void 0 ? void 0 : item.value) === 'tt-his-clusterb') {
            envDataOption.push({ label: item.label, value: item.value });
        }
    });
    var errorInfo = [];
    if (status && status.deployErrInfo) {
        Object.keys(status.deployErrInfo).forEach(function (item) {
            if (status.deployErrInfo[item]) {
                errorInfo.push({ key: item, errorMessage: status.deployErrInfo[item] });
            }
        });
    }
    function goToJenkins(item) {
        var jenkinsUrl = [];
        if (buildUrl && (item === null || item === void 0 ? void 0 : item.key)) {
            var data = buildUrl[item === null || item === void 0 ? void 0 : item.key] || '';
            if (data) {
                window.open(data, '_blank');
            }
        }
    }
    var handleChange = function (v) {
        setSelectMaster(v);
    };
    return (react_1["default"].createElement("div", { className: rootCls },
        react_1["default"].createElement("div", { className: rootCls + "__right-top-btns" }, react_1["default"].createElement(antd_1.Button, { type: "primary", onClick: deployToMaster }, "\u90E8\u7F72\u4E3B\u5E72\u5206\u652F")),
        react_1["default"].createElement(antd_1.Descriptions, { title: "\u53D1\u5E03\u8BE6\u60C5", labelStyle: { color: '#5F677A', textAlign: 'right', whiteSpace: 'nowrap' }, contentStyle: { color: '#000' }, column: 4, bordered: true },
            react_1["default"].createElement(antd_1.Descriptions.Item, { label: "CRID", contentStyle: { whiteSpace: 'nowrap' } }, (metadata === null || metadata === void 0 ? void 0 : metadata.id) || '--'),
            react_1["default"].createElement(antd_1.Descriptions.Item, { label: "\u90E8\u7F72\u5206\u652F", span: (appData === null || appData === void 0 ? void 0 : appData.appType) === 'frontend' ? 1 : 2 }, (branchInfo === null || branchInfo === void 0 ? void 0 : branchInfo.releaseBranch) ? react_1["default"].createElement(Paragraph, { copyable: true }, branchInfo === null || branchInfo === void 0 ? void 0 : branchInfo.releaseBranch) : '---'),
            (appData === null || appData === void 0 ? void 0 : appData.appType) === 'frontend' && (react_1["default"].createElement(antd_1.Descriptions.Item, { label: "\u90E8\u7F72\u7248\u672C", contentStyle: { whiteSpace: 'nowrap' } }, ((_a = buildInfo === null || buildInfo === void 0 ? void 0 : buildInfo.buildResultInfo) === null || _a === void 0 ? void 0 : _a.version) ? (react_1["default"].createElement(Paragraph, { copyable: true }, (_b = buildInfo === null || buildInfo === void 0 ? void 0 : buildInfo.buildResultInfo) === null || _b === void 0 ? void 0 : _b.version)) : ('---'))),
            react_1["default"].createElement(antd_1.Descriptions.Item, { label: "\u53D1\u5E03\u73AF\u5883" }, envTypeCode || '--'),
            react_1["default"].createElement(antd_1.Descriptions.Item, { label: "\u51B2\u7A81\u5206\u652F", span: 4 }, (branchInfo === null || branchInfo === void 0 ? void 0 : branchInfo.conflictFeature) || '--'),
            react_1["default"].createElement(antd_1.Descriptions.Item, { label: "\u4E3B\u5E72\u5206\u652F", span: 4 }, (branchInfo === null || branchInfo === void 0 ? void 0 : branchInfo.masterBranch) || '--'),
            react_1["default"].createElement(antd_1.Descriptions.Item, { label: "\u5408\u5E76\u5206\u652F", span: 4 }, (branchInfo === null || branchInfo === void 0 ? void 0 : branchInfo.features.join(',')) || '--'),
            (status === null || status === void 0 ? void 0 : status.deployErrInfo) && errorInfo.length && (react_1["default"].createElement(antd_1.Descriptions.Item, { label: "\u90E8\u7F72\u9519\u8BEF\u4FE1\u606F", span: 4, contentStyle: { color: 'red' } },
                react_1["default"].createElement("div", null, errorInfo.map(function (err) {
                    var _a;
                    return (react_1["default"].createElement("div", null,
                        react_1["default"].createElement("span", { style: { color: 'black' } },
                            " ",
                            (err === null || err === void 0 ? void 0 : err.errorMessage) ? (err === null || err === void 0 ? void 0 : err.key) + "\uFF1A" : ''),
                        react_1["default"].createElement("a", { style: { color: 'red', textDecoration: 'underline' }, onClick: function () {
                                if ((err === null || err === void 0 ? void 0 : err.errorMessage.indexOf('请查看jenkins详情')) !== -1) {
                                    goToJenkins(err);
                                }
                                if ((err === null || err === void 0 ? void 0 : err.errorMessage.indexOf('请查看jenkins详情')) !== -1 && (appData === null || appData === void 0 ? void 0 : appData.appType) !== 'frontend') {
                                    umi_1.history.push("/matrix/application/environment-deploy/deployInfo?appCode=" + (metadata === null || metadata === void 0 ? void 0 : metadata.appCode) + "&id=" + (appData === null || appData === void 0 ? void 0 : appData.id) + "&projectEnvCode=" + projectEnvCode + "&projectEnvName=" + projectEnvName);
                                }
                            } }, err === null || err === void 0 ? void 0 : err.errorMessage),
                        (appData === null || appData === void 0 ? void 0 : appData.appType) !== 'frontend' && ((_a = envInfo === null || envInfo === void 0 ? void 0 : envInfo.depoloyEnvs) === null || _a === void 0 ? void 0 : _a.includes(err.key)) && (react_1["default"].createElement("span", { style: { color: 'gray' } },
                            " ",
                            (err === null || err === void 0 ? void 0 : err.errorMessage) ? '（点击跳转）' : ''))));
                }))))),
        react_1["default"].createElement(antd_1.Modal, { key: "deployMaster", title: "\u9009\u62E9\u53D1\u5E03\u73AF\u5883", visible: deployMasterVisible, confirmLoading: confirmLoading, onOk: confirmPublishToMaster, maskClosable: false, onCancel: cancelDeployToMaster },
            react_1["default"].createElement("div", null,
                react_1["default"].createElement("div", { style: { marginBottom: '10px' } },
                    react_1["default"].createElement("span", null, "\u4E3B\u5E72\u5206\u652F\uFF1A"),
                    react_1["default"].createElement(antd_1.Select, { options: masterBranchOptions, value: selectMaster, style: { width: '200px', marginRight: '20px' }, onChange: handleChange, showSearch: true, size: "small", optionFilterProp: "label", 
                        // labelInValue
                        filterOption: function (input, option) {
                            var _a;
                            return ((_a = option === null || option === void 0 ? void 0 : option.label) === null || _a === void 0 ? void 0 : _a.toLowerCase().indexOf(input.toLowerCase())) >= 0;
                        } }))))));
}
exports["default"] = PublishDetail;
