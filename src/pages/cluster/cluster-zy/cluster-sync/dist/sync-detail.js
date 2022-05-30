"use strict";
// 同步的操作弹层
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/29 16:06
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
var moment_1 = require("moment");
var vc_page_content_1 = require("@/components/vc-page-content");
var request_1 = require("@/utils/request");
var APIS = require("../service");
require("./index.less");
// 每一个状态对应的显示步骤
var category2stepMapping = {
    Pass: 0,
    GetDiffClusterMq: 0,
    DeployClusterMqTopic: 0,
    DeployClusterMqGroup: 1,
    GetDiffClusterConfig: 1,
    DeployClusterConfig: 2,
    GetDiffClusterApp: 2,
    DeployClusterApp: 3,
    DeployClusterWebSource: 3,
    DeployClusterWebVersion: 3,
    ClusterDeployOver: 4
};
var sleep = function (s) { return new Promise(function (resolve) { return setTimeout(resolve, s); }); };
var resultLogCache = '';
function ClusterSyncDetail(props) {
    var _this = this;
    var _a = react_1.useState(true), pending = _a[0], setPending = _a[1];
    var _b = react_1.useState(-1), currStep = _b[0], setCurrStep = _b[1];
    var _c = react_1.useState(''), resultLog = _c[0], setResultLog = _c[1];
    var _d = react_1.useState(), currState = _d[0], setCurrState = _d[1];
    var resultRef = react_1.useRef(null);
    var _e = react_1.useState(), nextDeployApp = _e[0], setNextDeployApp = _e[1];
    var updateResultLog = react_1.useCallback(function (addon) {
        resultLogCache += "[" + moment_1["default"]().format('HH:mm:ss') + "] " + (addon || '<no result> success') + "\n";
        setResultLog(resultLogCache);
    }, []);
    // 查询当前状态
    var queryCurrStatus = react_1.useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var result, initState, ex_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setPending(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, 9, 10]);
                    return [4 /*yield*/, request_1.getRequest(APIS.queryWorkState)];
                case 2:
                    result = _a.sent();
                    initState = result.data.category;
                    if (!(initState === 'DeployClusterApp')) return [3 /*break*/, 4];
                    updateResultLog(result.data.log || '<no initial log>');
                    return [4 /*yield*/, getClusterApp()];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    if (!(initState === 'DeployClusterWebSource')) return [3 /*break*/, 6];
                    setCurrState('DeployClusterApp');
                    return [4 /*yield*/, getFESourceDeployProcess()];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    updateResultLog(result.data.log || '<no initial log>');
                    setCurrState(initState);
                    _a.label = 7;
                case 7: return [3 /*break*/, 10];
                case 8:
                    ex_1 = _a.sent();
                    setCurrState('Pass');
                    return [3 /*break*/, 10];
                case 9:
                    setPending(false);
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); }, []);
    var doAction = react_1.useCallback(function (promise) { return __awaiter(_this, void 0, void 0, function () {
        var result, addon, ex_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setPending(true);
                    return [4 /*yield*/, promise];
                case 1:
                    result = _a.sent();
                    addon = result.data;
                    if (typeof addon === 'object' && 'appCode' in addon) {
                        addon = addon.appCode === 'Pass' ? '应用同步完成' : "\u4E0B\u4E00\u4E2A\u8981\u540C\u6B65\u7684\u5E94\u7528: " + (addon.appCode || '--');
                    }
                    updateResultLog(addon);
                    return [2 /*return*/, result.data];
                case 2:
                    ex_2 = _a.sent();
                    updateResultLog("<ERROR> " + ((ex_2 === null || ex_2 === void 0 ? void 0 : ex_2.message) || 'Server Error'));
                    throw ex_2;
                case 3:
                    setPending(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    react_1.useEffect(function () {
        // 初始化后查询一次状态
        queryCurrStatus();
        // 离开时清空缓存
        return function () {
            resultLogCache = '';
        };
    }, []);
    // 每次日志有新增的时候都滚动到最底部
    react_1.useLayoutEffect(function () {
        var _a;
        (_a = resultRef.current) === null || _a === void 0 ? void 0 : _a.scrollTo({ top: 9999, behavior: 'smooth' });
    }, [resultLog]);
    // 1. get mq diff
    var getMqDiff = react_1.useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, doAction(request_1.getRequest(APIS.mqDiff))];
                case 1:
                    _a.sent();
                    setCurrState('GetDiffClusterMq');
                    return [2 /*return*/];
            }
        });
    }); }, []);
    // 2. deploy mq topic
    var deployTopic = react_1.useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, doAction(request_1.postRequest(APIS.deployTopic))];
                case 1:
                    _a.sent();
                    setCurrState('DeployClusterMqTopic');
                    return [2 /*return*/];
            }
        });
    }); }, []);
    // 3. deploy mq group
    var deployGroup = react_1.useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, doAction(request_1.postRequest(APIS.deployGroup))];
                case 1:
                    _a.sent();
                    setCurrState('DeployClusterMqGroup');
                    return [2 /*return*/];
            }
        });
    }); }, []);
    // 4. get config diff
    var getConfigDiff = react_1.useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, doAction(request_1.getRequest(APIS.configServerDiff))];
                case 1:
                    _a.sent();
                    setCurrState('GetDiffClusterConfig');
                    return [2 /*return*/];
            }
        });
    }); }, []);
    // 5. deploy config
    var deployConfig = react_1.useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, doAction(request_1.postRequest(APIS.configServerDeploy))];
                case 1:
                    _a.sent();
                    setCurrState('DeployClusterConfig');
                    return [2 /*return*/];
            }
        });
    }); }, []);
    // 6. get cluster app
    var getClusterApp = react_1.useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var nextApp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, doAction(request_1.getRequest(APIS.queryClusterApp))];
                case 1:
                    nextApp = _a.sent();
                    // if (!nextApp?.appCode) {
                    //   return message.warning('返回数据异常，appCode 为空值!');
                    // }
                    if ((nextApp === null || nextApp === void 0 ? void 0 : nextApp.appCode) && nextApp.appCode !== 'Pass') {
                        setCurrState('GetDiffClusterApp');
                        setNextDeployApp(nextApp.appCode);
                    }
                    else {
                        setCurrState('DeployClusterApp');
                    }
                    return [2 /*return*/];
            }
        });
    }); }, []);
    // 7. deploy app
    var deployApp = react_1.useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, doAction(request_1.postRequest(APIS.appDeploy, {
                        data: { appCode: nextDeployApp }
                    }))];
                case 1:
                    _a.sent();
                    // 成功后再调一次 queryClusterApp 接口
                    return [4 /*yield*/, getClusterApp()];
                case 2:
                    // 成功后再调一次 queryClusterApp 接口
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [nextDeployApp]);
    // 8. deploy fe source
    var deployFESource = react_1.useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setPending(true);
                    // 1. 触发资源同步
                    return [4 /*yield*/, request_1.postRequest(APIS.frontendSourceDeploy)];
                case 1:
                    // 1. 触发资源同步
                    _a.sent();
                    updateResultLog('前端资源同步开始...');
                    // 2. 轮循调接口获取当前的部署状态，直到没有数据为止
                    return [4 /*yield*/, getFESourceDeployProcess()];
                case 2:
                    // 2. 轮循调接口获取当前的部署状态，直到没有数据为止
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, []);
    // 8.5 获取前端资源同步进度
    var getFESourceDeployProcess = react_1.useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var logCache, addonLog, result, nextLog, ex_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logCache = resultLogCache;
                    addonLog = '';
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 7];
                    return [4 /*yield*/, sleep(6000)];
                case 2:
                    _a.sent(); // 延迟 6 秒获取一次状态
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, request_1.getRequest(APIS.queryFrontendSource)];
                case 4:
                    result = _a.sent();
                    // 没有数据表示已经结束
                    if (!result.data || result.data === 'Pass') {
                        updateResultLog(addonLog);
                        updateResultLog('前端资源同步完成！');
                        setPending(false);
                        return [2 /*return*/, setCurrState('DeployClusterWebSource')];
                    }
                    addonLog = result.data;
                    nextLog = logCache + addonLog;
                    setResultLog(nextLog);
                    return [3 /*break*/, 6];
                case 5:
                    ex_3 = _a.sent();
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 1];
                case 7: return [2 /*return*/];
            }
        });
    }); }, []);
    // 9. deploy fe version
    var deployFEVersion = react_1.useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, doAction(request_1.postRequest(APIS.frontendVersionDeploy))];
                case 1:
                    _a.sent();
                    setCurrState('DeployClusterWebVersion');
                    return [2 /*return*/];
            }
        });
    }); }, []);
    // 10. finish
    var finishDeploy = react_1.useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, doAction(request_1.postRequest(APIS.clusterDeployOver))];
                case 1:
                    _a.sent();
                    setCurrState('ClusterDeployOver');
                    return [2 /*return*/];
            }
        });
    }); }, []);
    // 不同的状态对应不同的 step
    react_1.useEffect(function () {
        if (!currState)
            return;
        var nextStep = category2stepMapping[currState];
        setCurrStep(nextStep);
        // 如果是 pass 状态，自动进行第一步
        if (currState === 'Pass') {
            setTimeout(function () { return getMqDiff(); });
        }
    }, [currState]);
    // const reDeploy = useCallback(() => {
    //   setCurrState('Pass');
    //   setCurrStep(1);
    //   resultLogCache = '';
    //   setResultLog('');
    // }, []);
    return (react_1["default"].createElement(vc_page_content_1.ContentCard, { className: "page-cluster-sync-detail" },
        react_1["default"].createElement(antd_1.Steps, { current: currStep },
            react_1["default"].createElement(antd_1.Steps.Step, { title: "MQ\u540C\u6B65" }),
            react_1["default"].createElement(antd_1.Steps.Step, { title: "\u914D\u7F6E\u540C\u6B65" }),
            react_1["default"].createElement(antd_1.Steps.Step, { title: "\u5E94\u7528\u540C\u6B65" }),
            react_1["default"].createElement(antd_1.Steps.Step, { title: "\u524D\u7AEF\u8D44\u6E90\u540C\u6B65" }),
            react_1["default"].createElement(antd_1.Steps.Step, { title: "\u5B8C\u6210" })),
        currStep !== 4 ? (react_1["default"].createElement("pre", { className: "result-log", ref: resultRef }, resultLog)) : null,
        currStep !== 4 ? (react_1["default"].createElement(antd_1.Spin, { spinning: pending, tip: "\u6267\u884C\u4E2D\uFF0C\u8BF7\u52FF\u5173\u95ED\u6216\u5207\u6362\u9875\u9762" },
            react_1["default"].createElement("div", { className: "action-row" },
                currState === 'Pass' ? (react_1["default"].createElement(antd_1.Button, { type: "primary", onClick: getMqDiff }, "\u5F00\u59CB MQ \u5BF9\u6BD4")) : null,
                currState === 'GetDiffClusterMq' ? (react_1["default"].createElement(antd_1.Button, { type: "primary", onClick: deployTopic }, "\u5F00\u59CB\u540C\u6B65 MQ Topic")) : null,
                currState === 'DeployClusterMqTopic' ? (react_1["default"].createElement(antd_1.Button, { type: "primary", onClick: deployGroup }, "\u5F00\u59CB\u540C\u6B65 MQ Group")) : null,
                currState === 'DeployClusterMqGroup' ? (react_1["default"].createElement(antd_1.Button, { type: "primary", onClick: getConfigDiff }, "\u5F00\u59CB\u8FDB\u884C\u914D\u7F6E\u5BF9\u6BD4")) : null,
                currState === 'GetDiffClusterConfig' ? (react_1["default"].createElement(antd_1.Button, { type: "primary", onClick: deployConfig }, "\u5F00\u59CB\u914D\u7F6E\u540C\u6B65")) : null,
                currState === 'DeployClusterConfig' ? (react_1["default"].createElement(antd_1.Button, { type: "primary", onClick: getClusterApp }, "\u5F00\u59CB\u67E5\u8BE2\u53D1\u5E03\u5E94\u7528")) : null,
                currState === 'GetDiffClusterApp' ? (react_1["default"].createElement(antd_1.Button, { type: "primary", onClick: deployApp }, "\u540C\u6B65\u4E0B\u4E00\u4E2A\u5E94\u7528")) : null,
                currState === 'DeployClusterApp' ? (react_1["default"].createElement(antd_1.Button, { type: "primary", onClick: deployFESource }, "\u5F00\u59CB\u524D\u7AEF\u8D44\u6E90\u540C\u6B65")) : null,
                currState === 'DeployClusterWebSource' ? (react_1["default"].createElement(antd_1.Button, { type: "primary", onClick: deployFEVersion }, "\u5F00\u59CB\u524D\u7AEF\u7248\u672C\u540C\u6B65")) : null,
                currState === 'DeployClusterWebVersion' ? (react_1["default"].createElement(antd_1.Button, { type: "primary", onClick: finishDeploy }, "\u5B8C\u6210\u96C6\u7FA4\u540C\u6B65")) : null,
                react_1["default"].createElement(antd_1.Button, { type: "default", onClick: function () { return props.history.push('./cluster-sync'); } }, "\u53D6\u6D88")))) : null,
        currStep === 4 ? (react_1["default"].createElement(antd_1.Result, { status: "success", title: "\u540C\u6B65\u6210\u529F", extra: [
                // <Button key="again" type="primary" onClick={reDeploy}>
                //   再次同步集群
                // </Button>,
                react_1["default"].createElement(antd_1.Button, { key: "showlist", type: "default", onClick: function () { return props.history.push('./dashboards'); } }, "\u67E5\u770B\u96C6\u7FA4\u770B\u677F"),
            ] })) : null));
}
exports["default"] = ClusterSyncDetail;
