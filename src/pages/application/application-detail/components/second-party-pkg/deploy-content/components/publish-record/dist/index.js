"use strict";
/**
 * PublishRecord
 * @description 发布记录
 * @author moting.nq
 * @create 2021-04-25 16:05
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var react_1 = require("react");
var antd_1 = require("antd");
var vc_description_1 = require("@/components/vc-description");
var context_1 = require("@/pages/application/application-detail/context");
var schema_1 = require("./schema");
var service_1 = require("./service");
var vc_hulk_table_1 = require("@cffe/vc-hulk-table");
var service_2 = require("@/pages/application/service");
var moment_1 = require("moment");
require("./index.less");
var rootCls = 'publish-record-compo';
var PublishRecord = function (props) {
    var _a, _b, _c;
    var env = props.env, appCode = props.appCode;
    var appData = react_1.useContext(context_1["default"]).appData;
    var appCategoryCode = (appData || {}).appCategoryCode;
    var _d = react_1.useState({}), curRecord = _d[0], setcurRecord = _d[1];
    var _e = react_1.useState(false), visible = _e[0], setVisible = _e[1];
    var _f = react_1.useState([]), envDataList = _f[0], setEnvDataList = _f[1];
    var _g = vc_hulk_table_1.usePaginated({
        requestUrl: service_1.queryRecordApi,
        requestMethod: 'GET',
        showRequestError: true,
        loadMore: true
    }), queryDataSource = _g.run, tableProps = _g.tableProps, loadMore = _g.loadMore;
    // useEffect(() => {
    //   queryDataSource({
    //     appCode,
    //     env,
    //     isActive: 0,
    //   });
    // }, []);
    react_1.useEffect(function () {
        queryDataSource({
            appCode: appCode,
            envTypeCode: env,
            pageIndex: 1
        });
    }, []);
    react_1.useEffect(function () {
        if (!appCategoryCode)
            return;
        service_2.queryEnvsReq({
            categoryCode: appCategoryCode,
            envTypeCode: env,
            appCode: appCode
        }).then(function (data) {
            var _a;
            var envSelect = [];
            (_a = data === null || data === void 0 ? void 0 : data.list) === null || _a === void 0 ? void 0 : _a.map(function (item) {
                envSelect.push({ label: item.envName, value: item.envCode });
            });
            setEnvDataList(envSelect);
        });
    }, [appCategoryCode, env]);
    react_1.useEffect(function () {
        var intervalId = setInterval(function () {
            if (appCode && env) {
                queryDataSource({
                    appCode: appCode,
                    envTypeCode: env,
                    pageIndex: 1
                });
            }
        }, 8000);
        return function () {
            clearInterval(intervalId);
        };
    }, []);
    var envNames = react_1.useMemo(function () {
        var _a;
        var envs = curRecord.envs;
        var namesArr = [];
        if ((envs === null || envs === void 0 ? void 0 : envs.indexOf(',')) > -1) {
            var list_1 = (envs === null || envs === void 0 ? void 0 : envs.split(',')) || [];
            envDataList === null || envDataList === void 0 ? void 0 : envDataList.forEach(function (item) {
                list_1 === null || list_1 === void 0 ? void 0 : list_1.forEach(function (v) {
                    if ((item === null || item === void 0 ? void 0 : item.envCode) === v) {
                        namesArr.push(item.envName);
                    }
                });
            });
            return __assign(__assign({}, curRecord), { envs: namesArr.join(',') });
        }
        return __assign(__assign({}, curRecord), { envs: (_a = envDataList.find(function (v) { return v.envCode === envs; })) === null || _a === void 0 ? void 0 : _a.envName });
    }, [envDataList, curRecord]);
    var dom = document === null || document === void 0 ? void 0 : document.getElementById('load-more-list');
    var scrollTop = react_1.useRef(dom === null || dom === void 0 ? void 0 : dom.scrollTop);
    var renderLoadMore = function () {
        var _a = (tableProps === null || tableProps === void 0 ? void 0 : tableProps.pagination) || {}, _b = _a.pageSize, pageSize = _b === void 0 ? 0 : _b, _c = _a.total, total = _c === void 0 ? 0 : _c, _d = _a.current, current = _d === void 0 ? 0 : _d;
        return (total > 0 &&
            total > pageSize && (react_1["default"].createElement("div", { className: rootCls + "-btns" },
            react_1["default"].createElement(antd_1.Button, { ghost: true, type: "dashed", loading: tableProps.loading, onClick: loadMore }, "\u52A0\u8F7D\u66F4\u591A"))));
    };
    // 显示详情
    var handleShowDetail = function (record) {
        setVisible(true);
        setcurRecord(record);
    };
    return (react_1["default"].createElement("div", { className: rootCls },
        react_1["default"].createElement("div", { className: rootCls + "__title" }, "\u53D1\u5E03\u8BB0\u5F55"),
        ((_b = (_a = tableProps.dataSource) === null || _a === void 0 ? void 0 : _a.filter(function (v) { return (v === null || v === void 0 ? void 0 : v.envTypeCode) === env; })) === null || _b === void 0 ? void 0 : _b.length) ? (react_1["default"].createElement(antd_1.List, { className: "demo-loadmore-list", 
            // loading={tableProps.loading}
            itemLayout: "vertical", loadMore: renderLoadMore(), dataSource: (_c = tableProps.dataSource) === null || _c === void 0 ? void 0 : _c.filter(function (v) { return (v === null || v === void 0 ? void 0 : v.envTypeCode) === env; }), renderItem: function (item) {
                var _a, _b;
                return (react_1["default"].createElement(antd_1.List.Item, null,
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("label", null, schema_1.recordFieldMapOut['modifyUser']),
                        ":",
                        item['modifyUser']),
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("label", null, schema_1.recordFieldMapOut['deployedTime']),
                        ":",
                        item['deployedTime'] ? moment_1["default"](item['deployedTime']).format('YYYY-MM-DD HH:mm:ss') : null),
                    item.deployStatus === 'multiEnvDeploying' && item.deploySubStates ? (react_1["default"].createElement("div", null,
                        react_1["default"].createElement("label", null, schema_1.recordFieldMapOut['deployStatus']),
                        ":",
                        JSON.parse(item.deploySubStates).map(function (subItem) {
                            var _a, _b;
                            return (react_1["default"].createElement("div", null,
                                react_1["default"].createElement("label", null, subItem.envCode),
                                ":",
                                react_1["default"].createElement("span", { style: { marginLeft: 6 } },
                                    react_1["default"].createElement(antd_1.Tag, { color: ((_a = schema_1.recordDisplayMap[subItem['subState']]) === null || _a === void 0 ? void 0 : _a.color) || 'red' }, ((_b = schema_1.recordDisplayMap[subItem['subState']]) === null || _b === void 0 ? void 0 : _b.text) || '---'))));
                        }))) : (react_1["default"].createElement("div", null,
                        react_1["default"].createElement("label", null, schema_1.recordFieldMapOut['deployStatus']),
                        ":",
                        react_1["default"].createElement("span", { style: { marginLeft: 6 } },
                            react_1["default"].createElement(antd_1.Tag, { color: ((_a = schema_1.recordDisplayMap[item['deployStatus']]) === null || _a === void 0 ? void 0 : _a.color) || 'red' }, ((_b = schema_1.recordDisplayMap[item['deployStatus']]) === null || _b === void 0 ? void 0 : _b.text) || '---')))),
                    react_1["default"].createElement("a", { onClick: function () { return handleShowDetail(item); } }, "\u8BE6\u60C5")));
            } })) : null,
        react_1["default"].createElement(antd_1.Modal, { title: "\u53D1\u5E03\u8BE6\u60C5", width: 600, visible: visible, footer: false, onCancel: function () { return setVisible(false); } },
            react_1["default"].createElement(vc_description_1["default"], { labelStyle: { width: 90, justifyContent: 'flex-end' }, column: 1, dataSource: curRecord }))));
};
PublishRecord.defaultProps = {};
exports["default"] = PublishRecord;
