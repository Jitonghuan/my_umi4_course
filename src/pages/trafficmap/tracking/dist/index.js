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
exports.__esModule = true;
var react_1 = require("react");
var moment_1 = require("moment");
var resiable_pro_1 = require("@/components/resiable-pro");
var vc_page_content_1 = require("@/components/vc-page-content");
var page_container_1 = require("@/components/page-container");
var left_list_1 = require("./components/left-list");
var right_trace_1 = require("./components/right-trace");
var antd_1 = require("antd");
var icons_1 = require("@ant-design/icons");
var service_1 = require("../service");
var RangePicker = antd_1.DatePicker.RangePicker;
require("./index.less");
var START_TIME_ENUMS = [
    {
        label: '最近15分钟',
        value: 15 * 60 * 1000
    },
    {
        label: '最近30分钟',
        value: 30 * 60 * 1000
    },
    {
        label: '最近1小时',
        value: 60 * 60 * 1000
    },
    {
        label: '最近1天',
        value: 24 * 60 * 60 * 1000
    },
    {
        label: '最近一周',
        value: 24 * 60 * 60 * 1000 * 7
    },
    {
        label: '最近一月',
        value: 24 * 60 * 60 * 1000 * 30
    },
];
function Tracking() {
    var _a = react_1.useState(), listData = _a[0], setListData = _a[1]; //左侧list数据
    var _b = react_1.useState([]), rightData = _b[0], setRightData = _b[1]; //右侧渲染图的数据
    var form = antd_1.Form.useForm()[0];
    var _c = react_1.useState(''), selectEnv = _c[0], setSelectEnv = _c[1];
    var _d = react_1.useState(''), appID = _d[0], setAppID = _d[1];
    var _e = react_1.useState({
        start: moment_1["default"]().subtract(15, 'minute'),
        end: moment_1["default"]()
    }), selectTime = _e[0], setSelectTime = _e[1];
    var _f = react_1.useState([]), applicationList = _f[0], setApplicationList = _f[1];
    var _g = react_1.useState([]), instanceList = _g[0], setInstanceList = _g[1];
    var _h = react_1.useState([]), envOptions = _h[0], setEnvOptions = _h[1];
    var _j = react_1.useState(false), expand = _j[0], setIsExpand = _j[1];
    var _k = react_1.useState(), currentItem = _k[0], setCurrentItem = _k[1];
    var _l = react_1.useState(false), loading = _l[0], setLoading = _l[1]; //左侧列表的loading
    var _m = react_1.useState(false), rightLoading = _m[0], setRightLoading = _m[1]; //右侧的loading
    var _o = react_1.useState(0), total = _o[0], setTotal = _o[1];
    var _p = react_1.useState(1), pageIndex = _p[0], setPageIndex = _p[1];
    var _q = react_1.useState(Number(15 * 60 * 1000)), timeOption = _q[0], setTimeOption = _q[1];
    var _r = react_1.useState([]), noiseList = _r[0], setNoiseList = _r[1];
    var _s = react_1.useState(true), first = _s[0], setFirst = _s[1];
    var btnMessageList = [
        { expand: true, label: '收起更多', icon: React.createElement(icons_1.CaretUpOutlined, null) },
        { expand: false, label: '更多查询', icon: React.createElement(icons_1.CaretDownOutlined, null) },
    ];
    var btnMessage = react_1.useMemo(function () { return btnMessageList.find(function (item) { return item.expand === expand; }); }, [expand]);
    //获取环境列表
    react_1.useEffect(function () {
        service_1.getEnvs().then(function (res) {
            var _a;
            if (res && res.success) {
                var data = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.envs.map(function (item) { return ({ label: item.envName, value: item.envCode }); });
                setEnvOptions(data);
            }
        });
    }, []);
    react_1.useEffect(function () {
        form.setFieldsValue({ traceState: 'ALL' });
    }, []);
    react_1.useEffect(function () {
        var _a;
        if (envOptions.length !== 0) {
            setSelectEnv((_a = envOptions[0]) === null || _a === void 0 ? void 0 : _a.value);
        }
    }, [envOptions]);
    react_1.useEffect(function () {
        if (selectEnv) {
            form.resetFields();
            setFirst(true);
            setApplicationList([]);
            // queryTraceList({ pageIndex: 1, pageSize: 20 });
            setInstanceList([]);
            getAppList();
        }
    }, [selectEnv]);
    react_1.useEffect(function () {
        if (!first) {
            queryTraceList({ pageIndex: 1, pageSize: 20 });
        }
    }, [selectTime]);
    react_1.useEffect(function () {
        if (selectEnv && appID) {
            form.setFieldsValue({ instanceCode: '' });
            getIns();
        }
    }, [selectEnv, appID]);
    // 获取右侧图的数据
    react_1.useEffect(function () {
        var _a;
        if (currentItem && ((_a = currentItem === null || currentItem === void 0 ? void 0 : currentItem.traceIds) === null || _a === void 0 ? void 0 : _a.length) !== 0) {
            queryTreeData([]);
        }
    }, [currentItem]);
    //获取应用
    var getAppList = function () {
        var start = moment_1["default"](selectTime.start).format('YYYY-MM-DD HH:mm:ss');
        var end = moment_1["default"](selectTime.end).format('YYYY-MM-DD HH:mm:ss');
        service_1.getApplicationList({ envCode: selectEnv, start: start, end: end })
            .then(function (res) {
            var _a;
            if (res && res.success) {
                var data = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.map(function (item) { return (__assign(__assign({}, item), { value: item.key })); });
                setApplicationList(data);
            }
        })["catch"](function () { return setApplicationList([]); });
    };
    // 获取实例
    var getIns = function () {
        var start = moment_1["default"](selectTime.start).format('YYYY-MM-DD HH:mm:ss');
        var end = moment_1["default"](selectTime.end).format('YYYY-MM-DD HH:mm:ss');
        service_1.getInstance({ envCode: selectEnv, appID: appID, start: start, end: end })
            .then(function (res) {
            var _a;
            if (res && res.success) {
                var data = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.map(function (item) { return (__assign(__assign({}, item), { value: item.key })); });
                setInstanceList(data);
            }
        })["catch"](function () {
            setInstanceList([]);
        });
    };
    // 获取左侧list数据
    var queryTraceList = function (params) {
        setFirst(false);
        setLoading(true);
        // setListData([]);
        var values = form.getFieldsValue();
        var start = moment_1["default"](selectTime.start).format('YYYY-MM-DD HH:mm:ss');
        var end = moment_1["default"](selectTime.end).format('YYYY-MM-DD HH:mm:ss');
        service_1.getTrace(__assign(__assign(__assign({}, params), values), { end: end, start: start, envCode: selectEnv, noiseReductionIDs: noiseList }))
            .then(function (res) {
            var _a, _b, _c;
            if (res) {
                setListData((_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.dataSource);
                setTotal((_c = (_b = res === null || res === void 0 ? void 0 : res.data) === null || _b === void 0 ? void 0 : _b.pageInfo) === null || _c === void 0 ? void 0 : _c.total);
            }
        })["finally"](function () {
            setLoading(false);
        });
    };
    // 获取右侧数据
    var queryTreeData = function (value) {
        if (!(currentItem === null || currentItem === void 0 ? void 0 : currentItem.traceIds[0]))
            return;
        setRightLoading(true);
        service_1.getTraceInfo({ traceID: currentItem === null || currentItem === void 0 ? void 0 : currentItem.traceIds[0], envCode: selectEnv, noiseReductionIDs: value })
            .then(function (res) {
            var _a, _b;
            if (res === null || res === void 0 ? void 0 : res.success) {
                var max_1 = parseInt((_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.endTime) - parseInt((_b = res === null || res === void 0 ? void 0 : res.data) === null || _b === void 0 ? void 0 : _b.startTime);
                var handleData_1 = function (data) {
                    var _a;
                    if (!data) {
                        return;
                    }
                    if ((data === null || data === void 0 ? void 0 : data.children) && ((_a = data === null || data === void 0 ? void 0 : data.children) === null || _a === void 0 ? void 0 : _a.length) !== 0) {
                        data.children.map(function (e) { return handleData_1(e); });
                    }
                    else {
                        data.children = [];
                    }
                    data.key = data.id;
                    data.allDurations = max_1; //该条链路总执行时间
                    data.durations = parseInt(data.endTime) - parseInt(data.startTime); //执行时间
                    var self = data.durations - data.children.reduce(function (p, c) { return p + c.durations; }, 0);
                    data.selfDurations = self < 0 ? 0 : self; //自身执行时间
                    return data;
                };
                var rightData_1 = handleData_1(res === null || res === void 0 ? void 0 : res.data);
                setRightData([rightData_1]);
            }
        })["finally"](function () {
            setRightLoading(false);
        });
    };
    var leftItemChange = function (value) {
        setCurrentItem(value);
    };
    // 降噪下拉框发生改变时
    var noiseChange = function (value) {
        queryTreeData(value);
        setNoiseList(value);
    };
    var timeOptionChange = function (value) {
        setTimeOption(value);
        var now = new Date().getTime();
        var start = moment_1["default"](Number(now - value));
        var end = moment_1["default"](now);
        setSelectTime({ start: start, end: end });
    };
    // 处理数据 将list转化成tree格式
    function listToTree(list) {
        var _a;
        var map = {};
        var node = null;
        var roots = [];
        for (var i = 0; i < list.length; i++) {
            map[list[i].spanId] = i; // 初始化map
            list[i].key = list[i].spanId;
            list[i].children = undefined;
        }
        for (var j = 0; j < list.length; j++) {
            node = list[j];
            if (node.parentSpanId !== 0) {
                list[map[node.parentSpanId]].children = list[map[node.parentSpanId]].children || []; // 初始化children
                (_a = list[map[node.parentSpanId]]) === null || _a === void 0 ? void 0 : _a.children.push(node);
            }
            else {
                roots.push(node);
            }
        }
        return roots;
    }
    return (React.createElement(page_container_1["default"], null,
        React.createElement(vc_page_content_1.ContentCard, { className: "trace-detail-page", style: { height: '100%' } },
            React.createElement("div", { className: "detail-top" },
                React.createElement("div", null,
                    "\u9009\u62E9\u73AF\u5883\uFF1A",
                    React.createElement(antd_1.Select, { options: envOptions, value: selectEnv, onChange: function (env) {
                            setSelectEnv(env);
                        }, showSearch: true, style: { width: 140 } })),
                React.createElement("div", null,
                    "\u65F6\u95F4\u8303\u56F4\uFF1A",
                    React.createElement(RangePicker, { showTime: true, allowClear: false, onChange: function (v, time) {
                            setSelectTime({ start: time[0], end: time[1] });
                        }, value: [moment_1["default"](selectTime.start), moment_1["default"](selectTime.end)], format: "YYYY-MM-DD HH:mm:ss" }),
                    React.createElement(antd_1.Select, { value: timeOption, onChange: timeOptionChange, style: { width: 140 } }, START_TIME_ENUMS.map(function (time) { return (React.createElement(antd_1.Select.Option, { key: time.value, value: time.value }, time.label)); })))),
            React.createElement(antd_1.Divider, null),
            React.createElement("div", { style: { marginBottom: '20px' } },
                React.createElement(antd_1.Form, { layout: "inline", form: form, onFinish: function () {
                        queryTraceList({
                            pageIndex: 1,
                            pageSize: 20
                        });
                    }, onReset: function () {
                        form.resetFields();
                        queryTraceList({
                            pageIndex: 1,
                            pageSize: 20
                        });
                    } },
                    expand && (React.createElement(antd_1.Form.Item, { label: "\u5E94\u7528", name: "appID" },
                        React.createElement(antd_1.Select, { value: appID, options: applicationList, onChange: function (value) {
                                setAppID(value);
                            }, allowClear: true, showSearch: true, style: { width: 160 } }))),
                    expand && (React.createElement(antd_1.Form.Item, { label: "\u5B9E\u4F8B", name: "instanceCode" },
                        React.createElement(antd_1.Select, { options: instanceList, showSearch: true, allowClear: true, style: { width: 150 } }))),
                    expand && (React.createElement(antd_1.Form.Item, { label: "\u72B6\u6001\uFF1A", name: "traceState" },
                        React.createElement(antd_1.Select, { style: { width: 100 } },
                            React.createElement(antd_1.Select.Option, { value: 'ALL' }, "\u5168\u90E8"),
                            React.createElement(antd_1.Select.Option, { value: 'SUCCESS' }, "\u6210\u529F"),
                            React.createElement(antd_1.Select.Option, { value: 'ERROR' }, "\u5931\u8D25")))),
                    expand && (React.createElement(antd_1.Form.Item, { label: "\u7AEF\u70B9\uFF1A", name: "endpoint" },
                        React.createElement(antd_1.Input, { placeholder: "\u8BF7\u8F93\u5165\u7AEF\u70B9\u4FE1\u606F", style: { width: 140 } }))),
                    React.createElement(antd_1.Form.Item, { label: "traceID\uFF1A", name: "traceID" },
                        React.createElement(antd_1.Input, { placeholder: "\u8BF7\u8F93\u5165traceID", style: { width: 300 } })),
                    React.createElement(antd_1.Form.Item, null,
                        React.createElement(antd_1.Button, { type: "primary", htmlType: "submit" }, "\u67E5\u8BE2")),
                    React.createElement(antd_1.Form.Item, null,
                        React.createElement(antd_1.Button, { type: "ghost", htmlType: "reset" }, "\u91CD\u7F6E")),
                    React.createElement(antd_1.Button, { type: "link", onClick: function () {
                            setIsExpand(!expand);
                        } }, btnMessage === null || btnMessage === void 0 ? void 0 :
                        btnMessage.label,
                        React.createElement("span", { style: { marginLeft: '3px' } }, btnMessage === null || btnMessage === void 0 ? void 0 : btnMessage.icon)))),
            React.createElement("div", { className: "detail-main" }, first ? React.createElement("div", { className: "empty-holder" }, "\u8BF7\u70B9\u51FB\u67E5\u8BE2\u8FDB\u884C\u641C\u7D22") :
                React.createElement(resiable_pro_1["default"], { leftComp: React.createElement(left_list_1["default"], { listData: listData || [], total: total, loading: loading, changeItem: leftItemChange, pageChange: queryTraceList }), rightComp: listData && (listData === null || listData === void 0 ? void 0 : listData.length) !== 0 ? (React.createElement(right_trace_1["default"], { item: currentItem || {}, data: rightData, envCode: selectEnv, selectTime: selectTime, noiseChange: noiseChange, loading: rightLoading })) : (React.createElement(antd_1.Empty, { image: antd_1.Empty.PRESENTED_IMAGE_SIMPLE, style: { width: '100%', overflow: 'hidden' } })), isShowExpandIcon: true, defaultClose: true, leftWidth: 240 })))));
}
exports["default"] = Tracking;
