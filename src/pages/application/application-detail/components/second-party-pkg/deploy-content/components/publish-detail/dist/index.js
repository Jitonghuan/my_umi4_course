"use strict";
/**
 * PublishDetail
 * @description 发布详情
 * @author moting.nq
 * @create 2021-04-15 10:11
 */
exports.__esModule = true;
var react_1 = require("react");
var antd_1 = require("antd");
var request_1 = require("@/utils/request");
var icons_1 = require("@ant-design/icons");
var context_1 = require("@/pages/application/application-detail/context");
var service_1 = require("@/pages/application/service");
var umi_1 = require("umi");
var service_2 = require("@/pages/application/service");
require("./index.less");
var rootCls = 'publish-detail-compo';
var confirm = antd_1.Modal.confirm;
var PublishDetail = function (_a) {
    var deployInfo = _a.deployInfo, env = _a.env, onOperate = _a.onOperate, pipelineCode = _a.pipelineCode;
    var appData = react_1.useContext(context_1["default"]).appData;
    var _b = deployInfo || {}, metadata = _b.metadata, branchInfo = _b.branchInfo, envInfo = _b.envInfo, buildInfo = _b.buildInfo, status = _b.status;
    var buildUrl = (buildInfo || {}).buildUrl;
    var appCategoryCode = (appData || {}).appCategoryCode;
    var _c = react_1.useState(false), deployVisible = _c[0], setDeployVisible = _c[1];
    var _d = react_1.useState(false), confirmLoading = _d[0], setConfirmLoading = _d[1];
    var _e = react_1.useState(), deployEnv = _e[0], setDeployEnv = _e[1];
    var _f = react_1.useState([]), envDataList = _f[0], setEnvDataList = _f[1];
    var _g = react_1.useState(''), nextPipeline = _g[0], setNextPipeline = _g[1];
    react_1.useEffect(function () {
        if (!appCategoryCode)
            return;
        service_1.queryEnvsReq({
            categoryCode: appCategoryCode,
            envTypeCode: env,
            appCode: appData === null || appData === void 0 ? void 0 : appData.appCode
        }).then(function (data) {
            var _a;
            var envSelect = [];
            (_a = data === null || data === void 0 ? void 0 : data.list) === null || _a === void 0 ? void 0 : _a.map(function (item) {
                envSelect.push({ label: item.envName, value: item.envCode });
            });
            setEnvDataList(envSelect);
        });
    }, [appCategoryCode, env]);
    var envNames = react_1.useMemo(function () {
        var deployEnvs = (envInfo || {}).deployEnvs;
        var namesArr = [];
        return envDataList
            .filter(function (envItem) {
            return (deployEnvs || []).includes(envItem.value);
        })
            .map(function (envItem) { return envItem.label + "(" + envItem.value + ")"; })
            .join(',');
        // return (envDataList as any).find((v: any) => v.envCode === deployEnvs[0])?.envName;
    }, [envDataList, deployInfo]);
    react_1.useEffect(function () {
        request_1.getRequest(service_2.getPipelineUrl, {
            data: { appCode: appData === null || appData === void 0 ? void 0 : appData.appCode, envTypeCode: 'cProd', pageIndex: -1, size: -1 }
        }).then(function (res) {
            var _a, _b;
            if (res === null || res === void 0 ? void 0 : res.success) {
                var data = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.dataSource;
                setNextPipeline((_b = data[0]) === null || _b === void 0 ? void 0 : _b.pipelineCode);
            }
            else {
                setNextPipeline('');
            }
        });
    }, []);
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
    return (react_1["default"].createElement("div", { className: rootCls },
        react_1["default"].createElement("div", { className: rootCls + "__right-top-btns" }, env === 'cDev' && (react_1["default"].createElement(antd_1.Button, { type: "primary", onClick: function () {
                onOperate('deployNextEnvStart');
                confirm({
                    title: '确定要把当前部署分支发布到下一个环境中？',
                    icon: react_1["default"].createElement(icons_1.ExclamationCircleOutlined, null),
                    onOk: function () {
                        return service_1.deployReuse({
                            envCodes: [],
                            pipelineCode: nextPipeline,
                            reusePipelineCode: pipelineCode
                        }).then(function (res) {
                            if (res.success) {
                                antd_1.message.success('操作成功，正在部署中...');
                                onOperate('deployNextEnvSuccess');
                                return;
                            }
                        });
                    },
                    onCancel: function () {
                        onOperate('deployNextEnvEnd');
                    }
                });
            } }, "\u90E8\u7F72\u5230\u4E0B\u4E2A\u73AF\u5883"))),
        react_1["default"].createElement(antd_1.Descriptions, { title: "\u53D1\u5E03\u8BE6\u60C5", labelStyle: { color: '#5F677A', textAlign: 'right' }, contentStyle: { color: '#000' }, column: 2, bordered: true },
            react_1["default"].createElement(antd_1.Descriptions.Item, { label: "CRID" }, (metadata === null || metadata === void 0 ? void 0 : metadata.id) || '--'),
            react_1["default"].createElement(antd_1.Descriptions.Item, { label: "\u90E8\u7F72\u5206\u652F" }, (branchInfo === null || branchInfo === void 0 ? void 0 : branchInfo.releaseBranch) || '--'),
            react_1["default"].createElement(antd_1.Descriptions.Item, { label: "\u53D1\u5E03\u73AF\u5883" }, envNames || '--'),
            react_1["default"].createElement(antd_1.Descriptions.Item, { label: "\u4E3B\u5E72\u5206\u652F" }, (branchInfo === null || branchInfo === void 0 ? void 0 : branchInfo.masterBranch) || '--'),
            react_1["default"].createElement(antd_1.Descriptions.Item, { label: "\u51B2\u7A81\u5206\u652F", span: 2 }, (branchInfo === null || branchInfo === void 0 ? void 0 : branchInfo.conflictFeature) || '--'),
            react_1["default"].createElement(antd_1.Descriptions.Item, { label: "\u5408\u5E76\u5206\u652F", span: 2 }, (branchInfo === null || branchInfo === void 0 ? void 0 : branchInfo.features.join(',')) || '--'),
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
                                if ((err === null || err === void 0 ? void 0 : err.errorMessage.indexOf('请查看jenkins详情')) === -1 && (appData === null || appData === void 0 ? void 0 : appData.appType) !== 'frontend') {
                                    localStorage.setItem('__init_env_tab__', metadata === null || metadata === void 0 ? void 0 : metadata.envTypeCode);
                                    umi_1.history.push("/matrix/application/detail/deployInfo?appCode=" + (metadata === null || metadata === void 0 ? void 0 : metadata.appCode) + "&id=" + (appData === null || appData === void 0 ? void 0 : appData.id));
                                }
                            } }, err === null || err === void 0 ? void 0 : err.errorMessage),
                        (appData === null || appData === void 0 ? void 0 : appData.appType) !== 'frontend' && ((_a = envInfo === null || envInfo === void 0 ? void 0 : envInfo.depoloyEnvs) === null || _a === void 0 ? void 0 : _a.includes(err.key)) && (react_1["default"].createElement("span", { style: { color: 'gray' } },
                            " ",
                            (err === null || err === void 0 ? void 0 : err.errorMessage) ? '（点击跳转）' : ''))));
                }))))),
        react_1["default"].createElement(antd_1.Modal, { title: "\u9009\u62E9\u53D1\u5E03\u73AF\u5883", visible: deployVisible, confirmLoading: confirmLoading, onOk: function () {
                setConfirmLoading(true);
                return service_1.deployReuse({ id: metadata.id })
                    .then(function (res) {
                    if (res.success) {
                        antd_1.message.success('操作成功，正在部署中...');
                        setDeployVisible(false);
                        onOperate('deployNextEnvEnd');
                    }
                })["finally"](function () { return setConfirmLoading(false); });
            }, onCancel: function () {
                setDeployVisible(false);
                setConfirmLoading(false);
                onOperate('deployNextEnvEnd');
            } },
            react_1["default"].createElement("div", null,
                react_1["default"].createElement("span", null, "\u53D1\u5E03\u73AF\u5883\uFF1A"),
                react_1["default"].createElement(antd_1.Checkbox.Group, { value: deployEnv, onChange: function (v) { return setDeployEnv(v); }, options: envDataList || [] })))));
};
// PublishDetail.defaultProps = {};
exports["default"] = PublishDetail;
