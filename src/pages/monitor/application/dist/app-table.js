"use strict";
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.RATE_ENUMS = exports.START_TIME_ENUMS = void 0;
var react_1 = require("react");
var react_dom_1 = require("react-dom");
var antd_1 = require("antd");
var icons_1 = require("@ant-design/icons");
var vc_hulk_table_1 = require("@cffe/vc-hulk-table");
var vc_b_card_layout_1 = require("@cffe/vc-b-card-layout");
var request_1 = require("@/utils/request");
var app_card_1 = require("./app-card");
var cpu_utilization_line_1 = require("./dashboard/cpu-utilization-line");
var memory_utilization_line_1 = require("./dashboard/memory-utilization-line");
var diskIO_line_1 = require("./dashboard/diskIO-line");
var network_line_1 = require("./dashboard/network-line");
var hooks_1 = require("./dashboard/hooks");
var schema_1 = require("./schema");
var service_1 = require("./service");
require("./index.less");
var layoutGrid = {
    xs: 1,
    sm: 1,
    md: 1,
    lg: 2,
    xl: 2,
    xxl: 2,
    xxxl: 2
};
// 开始时间枚举
exports.START_TIME_ENUMS = [
    {
        label: 'Last 30 minutes',
        value: 30 * 60 * 1000
    },
    {
        label: 'Last 1 hours',
        value: 60 * 60 * 1000
    },
    {
        label: 'Last 6 hours',
        value: 6 * 60 * 60 * 1000
    },
    {
        label: 'Last 12 hours',
        value: 12 * 60 * 60 * 1000
    },
    {
        label: 'Last 24 hours',
        value: 24 * 60 * 60 * 1000
    },
    {
        label: 'Last 3 days',
        value: 24 * 60 * 60 * 1000 * 3
    },
    {
        label: 'Last 7 days',
        value: 24 * 60 * 60 * 1000 * 7
    },
    {
        label: 'Last 30 days',
        value: 24 * 60 * 60 * 1000 * 30
    },
];
// 请求频次枚举
exports.RATE_ENUMS = [
    {
        label: 'Off',
        value: 0,
        showLabel: react_1["default"].createElement(icons_1.SyncOutlined, null)
    },
    {
        label: '10s',
        value: 10,
        showLabel: '10s'
    },
    {
        label: '20s',
        value: 20,
        showLabel: '20s'
    },
    {
        label: '30s',
        value: 30,
        showLabel: '30s'
    },
];
/**
 * Application
 * @description 应用监控页面
 * @create 2021-04-12 19:15:42
 */
var Coms = function (props) {
    var _a, _b;
    // 该组件会被作为路由组件使用，接收地址栏传参数
    var appCode = (_b = (_a = props.location) === null || _a === void 0 ? void 0 : _a.query) === null || _b === void 0 ? void 0 : _b.appCode;
    var TabPane = antd_1.Tabs.TabPane;
    var _c = react_1.useState({}), filter = _c[0], setFilter = _c[1];
    var prevFilter = react_1.useRef({});
    var _d = react_1.useState([]), appData = _d[0], setAppData = _d[1];
    var _e = react_1.useState([]), envData = _e[0], setEnvData = _e[1];
    // 请求开始时间，由当前时间往前
    var _f = react_1.useState(30 * 60 * 1000), startTime = _f[0], setStartTime = _f[1];
    // pod ip
    var _g = react_1.useState(''), curtIP = _g[0], setCurtIp = _g[1];
    var _h = react_1.useState(''), hostName = _h[0], setHostName = _h[1];
    // 刷新频率
    var _j = react_1.useState(0), timeRate = _j[0], setTimeRate = _j[1];
    // 定时器累计数，初始为0，每次定时器执行时加1，触发图的数据刷新，清除定时器后不再增长
    var _k = react_1.useState(0), rateNum = _k[0], setRateNum = _k[1];
    var prevRateNum = react_1.useRef(0);
    var formInstance = antd_1.Form.useForm()[0];
    var now = new Date().getTime();
    var selectRef = react_1.useRef(null);
    var timeRateInterval = react_1.useRef();
    var _l = hooks_1.useQueryPodCpu(), queryPodCpuData = _l[0], podCpuloading = _l[1], queryPodCpu = _l[2];
    var _m = hooks_1.usequeryPodMem(), queryPodMemData = _m[0], podMemloading = _m[1], queryPodMem = _m[2];
    var _o = hooks_1.useQueryPodDisk(), queryPodDiskData = _o[0], podDiskloading = _o[1], queryPodDisk = _o[2];
    var _p = hooks_1.useQueryPodNetwork(), queryPodNetworkData = _p[0], podNetworkloading = _p[1], queryPodNetwork = _p[2];
    var appConfig = [
        {
            title: 'GC瞬时次数/每分钟',
            getOption: schema_1.getGCNumChartOption,
            hasRadio: true,
            queryFn: service_1.queryGcCount
        },
        {
            title: 'GC瞬时耗时/每分钟',
            getOption: schema_1.getGCTimeChartOption,
            hasRadio: true,
            queryFn: service_1.queryGcTime
        },
        {
            title: '堆内存详情/每分钟',
            getOption: schema_1.getMemoryChartOption,
            queryFn: service_1.queryJvmHeap
        },
        {
            title: '元空间详情/每分钟',
            getOption: schema_1.getGCDataChartOption,
            queryFn: service_1.queryJvmMetaspace
        },
    ];
    // 查询应用列表
    var queryApps = function () {
        service_1.queryAppList().then(function (resp) {
            setAppData(resp);
            prevFilter.current = {
                appCode: appCode || (resp.length ? resp[0].value : undefined)
            };
            setFilter(prevFilter.current);
            formInstance.setFieldsValue(prevFilter.current);
        });
    };
    // 查询环境列表
    var queryEnvs = function () {
        var _a;
        service_1.queryEnvList({
            appCode: (_a = prevFilter.current) === null || _a === void 0 ? void 0 : _a.appCode
        }).then(function (resp) {
            var newResp = __spreadArrays(new Set(resp));
            setEnvData(newResp);
            var reg = /prd$/gi;
            // let reg =/.*(?=prd)prd/
            // console.log('newResp', newResp);
            resp.some(function (item) {
                if (reg.test(item.envCode)) {
                    prevFilter.current = __assign(__assign({}, prevFilter.current), { envCode: item.value });
                    return true;
                }
                else {
                    prevFilter.current = __assign(__assign({}, prevFilter.current), { envCode: resp.length ? resp[0].value : undefined });
                }
            });
            setFilter(prevFilter.current);
            formInstance.setFieldsValue(prevFilter.current);
        });
    };
    // 查询节点使用率
    var _q = react_1.useState([]), nodeDataSource = _q[0], setNodeDataSource = _q[1];
    var queryNodeList = function () {
        request_1.getRequest(service_1.queryPodInfoApi, {
            data: __assign({ start: Number((now - startTime) / 1000), end: Number(now / 1000), pageSize: 1000 }, prevFilter.current)
        })
            .then(function (resp) {
            var _a;
            if (resp.data && resp.data[0]) {
                setCurtIp(resp.data[0].hostIP);
                setHostName((_a = resp.data[0]) === null || _a === void 0 ? void 0 : _a.hostName);
            }
            setNodeDataSource(resp.data);
            if (!resp.success) {
                setNodeDataSource([]);
                return;
            }
            return {
                dataSource: resp.data || [],
                pageInfo: {
                    pageIndex: 1,
                    pageSize: 1000
                }
            };
        })
            .then(function (resp) {
            var _a, _b, _c, _d, _e;
            if (!((_a = resp === null || resp === void 0 ? void 0 : resp.dataSource[0]) === null || _a === void 0 ? void 0 : _a.hostName)) {
                return;
            }
            queryPodCpu((_b = resp === null || resp === void 0 ? void 0 : resp.dataSource[0]) === null || _b === void 0 ? void 0 : _b.hostName, filter.envCode, Number((now - startTime) / 1000), Number(now / 1000), filter.appCode, resp === null || resp === void 0 ? void 0 : resp.dataSource[0].hostIP);
            queryPodMem((_c = resp === null || resp === void 0 ? void 0 : resp.dataSource[0]) === null || _c === void 0 ? void 0 : _c.hostName, filter.envCode, Number((now - startTime) / 1000), Number(now / 1000), filter.appCode, resp === null || resp === void 0 ? void 0 : resp.dataSource[0].hostIP);
            queryPodDisk((_d = resp === null || resp === void 0 ? void 0 : resp.dataSource[0]) === null || _d === void 0 ? void 0 : _d.hostName, filter.envCode, Number((now - startTime) / 1000), Number(now / 1000), filter.appCode, resp === null || resp === void 0 ? void 0 : resp.dataSource[0].hostIP);
            queryPodNetwork((_e = resp === null || resp === void 0 ? void 0 : resp.dataSource[0]) === null || _e === void 0 ? void 0 : _e.hostName, filter.envCode, Number((now - startTime) / 1000), Number(now / 1000), filter.appCode, resp === null || resp === void 0 ? void 0 : resp.dataSource[0].hostIP);
        });
    };
    // const {
    //   // run: queryNodeList,
    //   reset,
    //   tableProps,
    // } = usePaginated({
    //   requestUrl: queryPodInfoApi,
    //   requestMethod: 'GET',
    //   showRequestError: true,
    //   didMounted: false,
    //   formatRequestParams: (params) => {
    //     return {
    //       ...params,
    //       start: Number((now - startTime) / 1000),
    //       end: Number(now / 1000),
    //       pageSize: 1000,
    //       ...prevFilter.current,
    //     };
    //   },
    //   formatResult: (resp) => {
    //     if (resp.data && resp.data[0]) {
    //       setCurtIp(resp.data[0].hostIP);
    //       setHostName(resp.data[0].hostName);
    //     }
    //     return {
    //       dataSource: resp.data || [],
    //       pageInfo: {
    //         pageIndex: 1,
    //         pageSize: 1000,
    //       },
    //     };
    //   },
    //   successFunc: (resp: any) => {
    //     queryPodCpu(
    //       resp.data[0].hostName,
    //       filter.envCode,
    //       Number((now - startTime) / 1000),
    //       Number(now / 1000),
    //       filter.appCode,
    //       resp.data[0].hostIP,
    //     );
    //     queryPodMem(
    //       resp.data[0].hostName,
    //       filter.envCode,
    //       Number((now - startTime) / 1000),
    //       Number(now / 1000),
    //       filter.appCode,
    //       resp.data[0].hostIP,
    //     );
    //     queryPodDisk(
    //       resp.data[0].hostName,
    //       filter.envCode,
    //       Number((now - startTime) / 1000),
    //       Number(now / 1000),
    //       filter.appCode,
    //       resp.data[0].hostIP,
    //     );
    //     queryPodNetwork(
    //       resp.data[0].hostName,
    //       filter.envCode,
    //       Number((now - startTime) / 1000),
    //       Number(now / 1000),
    //       filter.appCode,
    //       resp.data[0].hostIP,
    //     );
    //   },
    //   pagination: false,
    // });
    react_1.useEffect(function () {
        queryApps();
    }, []);
    react_1.useEffect(function () {
        if (filter.appCode) {
            setEnvData([]);
            queryEnvs();
        }
    }, [filter.appCode]);
    react_1.useEffect(function () {
        if ((filter === null || filter === void 0 ? void 0 : filter.appCode) && (filter === null || filter === void 0 ? void 0 : filter.envCode)) {
            // reset();
            queryNodeList();
        }
    }, [filter]);
    // 修改提示框
    react_1.useEffect(function () {
        var select = react_dom_1.findDOMNode(selectRef.current);
        if (select) {
            var selector = select === null || select === void 0 ? void 0 : select.querySelectorAll('.ant-select-selection-item');
            selector === null || selector === void 0 ? void 0 : selector.forEach(function (el) {
                el.setAttribute('title', '');
            });
            if (hostName && curtIP) {
                queryPodCpu(hostName, filter.envCode, Number((now - startTime) / 1000), Number(now / 1000), filter.appCode, curtIP);
                queryPodMem(hostName, filter.envCode, Number((now - startTime) / 1000), Number(now / 1000), filter.appCode, curtIP);
                queryPodDisk(hostName, filter.envCode, Number((now - startTime) / 1000), Number(now / 1000), filter.appCode, curtIP);
                queryPodNetwork(hostName, filter.envCode, Number((now - startTime) / 1000), Number(now / 1000), filter.appCode, curtIP);
            }
        }
    }, [startTime, timeRate]);
    // 过滤操作
    var handleFilter = react_1.useCallback(function (vals) {
        setCurtIp('');
        setHostName('');
        if (vals.appCode) {
            prevFilter.current = __assign({}, vals);
        }
        else {
            prevFilter.current = __assign(__assign({}, filter), vals);
        }
        setFilter(prevFilter.current);
    }, [filter]);
    // 刷新频率改变事件
    var handleTimeRateChange = function (value) {
        setTimeRate(value);
        if (timeRateInterval.current) {
            clearInterval(timeRateInterval.current);
        }
        if (value) {
            timeRateInterval.current = setInterval(function () {
                // reset();
                queryNodeList();
                prevRateNum.current += 1;
                setRateNum(prevRateNum.current);
            }, value * 1000);
        }
    };
    var refreash = function () {
        // reset();
        queryNodeList();
    };
    return (react_1["default"].createElement("div", { style: { flex: 1, overflowY: 'auto' } },
        react_1["default"].createElement("div", { className: "monitor-app-table" },
            react_1["default"].createElement(antd_1.Card, { className: "monitor-app-filter", style: { marginBottom: 12, backgroundColor: '#fff' } },
                react_1["default"].createElement(antd_1.Form, { form: formInstance, layout: "inline", className: "monitor-filter-form", onValuesChange: handleFilter },
                    react_1["default"].createElement(antd_1.Form.Item, { label: "\u5E94\u7528Code", name: "appCode" },
                        react_1["default"].createElement(antd_1.Select, { showSearch: true, options: appData, disabled: !!appCode })),
                    react_1["default"].createElement(antd_1.Form.Item, { label: "\u73AF\u5883Code", name: "envCode" },
                        react_1["default"].createElement(antd_1.Select, { options: envData }))),
                react_1["default"].createElement("div", { className: "monitor-time-select", ref: selectRef },
                    react_1["default"].createElement(antd_1.Tooltip, { title: "Relative time ranges", placement: "top" },
                        react_1["default"].createElement(antd_1.Select, { value: startTime, onChange: function (value) {
                                setStartTime(value);
                                queryPodCpu(hostName, filter.envCode, Number((now - value) / 1000), Number(now / 1000), filter.appCode, curtIP);
                                queryPodMem(hostName, filter.envCode, Number((now - value) / 1000), Number(now / 1000), filter.appCode, curtIP);
                                queryPodDisk(hostName, filter.envCode, Number((now - value) / 1000), Number(now / 1000), filter.appCode, curtIP);
                                queryPodNetwork(hostName, filter.envCode, Number((now - value) / 1000), Number(now / 1000), filter.appCode, curtIP);
                            }, style: { width: 150 } },
                            react_1["default"].createElement(antd_1.Select.OptGroup, { label: "Relative time ranges" }),
                            exports.START_TIME_ENUMS.map(function (time) { return (react_1["default"].createElement(antd_1.Select.Option, { key: time.value, value: time.value }, time.label)); }))),
                    react_1["default"].createElement(antd_1.Tooltip, { title: "Refresh dashboard", placement: "top" },
                        react_1["default"].createElement(antd_1.Select, { value: timeRate, onChange: handleTimeRateChange, optionLabelProp: "label", style: { width: 54 } }, exports.RATE_ENUMS.map(function (time) { return (react_1["default"].createElement(antd_1.Select.Option, { key: time.value, value: time.value, label: time.showLabel }, time.label)); }))),
                    react_1["default"].createElement("span", { style: { marginLeft: 4 } },
                        react_1["default"].createElement(antd_1.Button, { type: "primary", onClick: refreash }, "\u5237\u65B0")))),
            react_1["default"].createElement(antd_1.Card, { className: "monitor-app-body" },
                react_1["default"].createElement("h3", { className: "monitor-tabs-content-title" },
                    "\u8D44\u6E90\u4F7F\u7528\u60C5\u51B5",
                    react_1["default"].createElement(icons_1.RedoOutlined, { style: { float: 'right' }, onClick: function () {
                            // reset();
                            queryNodeList();
                        } })),
                react_1["default"].createElement(vc_hulk_table_1["default"], { rowKey: "ip", size: "small", dataSource: nodeDataSource, columns: schema_1.tableSchema, pagination: false, onRow: function (record) {
                        return {
                            onClick: function () {
                                setCurtIp(record.hostIP);
                                setHostName(record === null || record === void 0 ? void 0 : record.hostName);
                                queryPodCpu(record.hostName, filter.envCode, Number((now - startTime) / 1000), Number(now / 1000), filter.appCode, record.hostIP);
                                queryPodMem(record.hostName, filter.envCode, Number((now - startTime) / 1000), Number(now / 1000), filter.appCode, record.hostIP);
                                queryPodDisk(record.hostName, filter.envCode, Number((now - startTime) / 1000), Number(now / 1000), filter.appCode, record.hostIP);
                                queryPodNetwork(record.hostName, filter.envCode, Number((now - startTime) / 1000), Number(now / 1000), filter.appCode, record.hostIP);
                            }
                        };
                    }, 
                    // scroll={{ y: 300 }}
                    // {...tableProps}
                    customColumnMap: {
                        cpu: function (value) {
                            return value ? value + "%" : '';
                        },
                        memory: function (value) {
                            return value ? value + "%" : '';
                        },
                        RSS: function (value) {
                            return value ? value + "%" : '';
                        },
                        WSS: function (value) {
                            return value ? value + "%" : '';
                        }
                    } }),
                react_1["default"].createElement("div", { style: { marginTop: 14 } },
                    react_1["default"].createElement(antd_1.Tabs, { defaultActiveKey: "1", type: "card" },
                        react_1["default"].createElement(TabPane, { tab: react_1["default"].createElement("span", null, "\u8FDB\u7A0B\u76D1\u63A7"), key: "1" },
                            react_1["default"].createElement("h3", { className: "monitor-tabs-content-title" },
                                "\u76D1\u63A7\u56FE\u8868\u00A0\u00A0",
                                react_1["default"].createElement("span", { style: { fontSize: 12, color: '#1973CC' } }, curtIP ? "\u5F53\u524DIP\uFF1A" + curtIP : '')),
                            react_1["default"].createElement(vc_b_card_layout_1["default"], { grid: layoutGrid, className: "monitor-app-content" }, appConfig.map(function (el, index) { return (react_1["default"].createElement(app_card_1["default"], __assign({ key: index }, el, { requestParams: __assign(__assign({}, filter), { ip: curtIP, startTime: startTime, rateNum: rateNum, hostName: hostName }) }))); }))),
                        react_1["default"].createElement(TabPane, { tab: react_1["default"].createElement("span", null, "\u57FA\u7840\u76D1\u63A7"), key: "2" },
                            react_1["default"].createElement("h3", { className: "monitor-tabs-content-title" },
                                "\u76D1\u63A7\u56FE\u8868\u00A0\u00A0",
                                react_1["default"].createElement("span", { style: { fontSize: 12, color: '#1973CC' } }, curtIP ? "\u5F53\u524DIP\uFF1A" + curtIP : '')),
                            react_1["default"].createElement("div", { style: { width: '100%', height: '100%' } },
                                react_1["default"].createElement("div", { className: "base-monitor-charts" },
                                    react_1["default"].createElement(memory_utilization_line_1["default"], { data: queryPodMemData, loading: podMemloading })),
                                react_1["default"].createElement("div", { className: "base-monitor-charts" },
                                    react_1["default"].createElement(cpu_utilization_line_1["default"], { data: queryPodCpuData, loading: podCpuloading })),
                                react_1["default"].createElement("div", { className: "base-monitor-charts" },
                                    react_1["default"].createElement(network_line_1["default"], { data: queryPodNetworkData, loading: podNetworkloading })),
                                react_1["default"].createElement("div", { className: "base-monitor-charts" },
                                    react_1["default"].createElement(diskIO_line_1["default"], { data: queryPodDiskData, loading: podDiskloading }))))))))));
};
exports["default"] = Coms;
