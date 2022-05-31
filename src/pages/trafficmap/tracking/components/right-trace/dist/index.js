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
var antd_1 = require("antd");
var umi_1 = require("umi");
var antd_2 = require("antd");
var antd_3 = require("antd");
var TraceTime_1 = require("./TraceTime");
var icons_1 = require("@ant-design/icons");
var react_copy_to_clipboard_1 = require("react-copy-to-clipboard");
// import TraceTable from './trace-table'
var right_graph_1 = require("../right-graph");
var service_1 = require("../../../service");
require("./index.less");
var detail_modal_1 = require("../detail-modal");
var d3 = require("d3");
var _moment_2_29_3_moment_1 = require("_moment@2.29.3@moment");
function RrightTrace(props) {
    var _a;
    var item = props.item, data = props.data, envCode = props.envCode, selectTime = props.selectTime, loading = props.loading, noiseChange = props.noiseChange;
    var _b = react_1.useState('table'), activeBtn = _b[0], setActiveBtn = _b[1];
    var _c = react_1.useState([]), treeData = _c[0], setTreeData = _c[1]; //用于列表树的数据
    var _d = react_1.useState([]), traceIdOptions = _d[0], setTraceIdOptions = _d[1];
    var _e = react_1.useState(''), selectTraceId = _e[0], setSelectTraceId = _e[1];
    var _f = react_1.useState(false), visible = _f[0], setVisible = _f[1];
    var _g = react_1.useState({}), detailData = _g[0], setDetailData = _g[1];
    var _h = react_1.useState([]), noiseOption = _h[0], setNoiseOption = _h[1];
    var _j = react_1.useState([]), selectNoise = _j[0], setSelectNoise = _j[1];
    var scaleRange = react_1.useMemo(function () { var _a; return (data && data.length ? (_a = data[0]) === null || _a === void 0 ? void 0 : _a.allDurations : 100); }, [data]);
    react_1.useEffect(function () {
        var idList = selectNoise.map(function (item) { return item.value; });
        noiseChange(idList);
    }, [selectNoise]);
    react_1.useEffect(function () {
        var _a;
        if (item && item.traceIds && ((_a = item === null || item === void 0 ? void 0 : item.traceIds) === null || _a === void 0 ? void 0 : _a.length) !== 0) {
            setTraceIdOptions([{ label: item === null || item === void 0 ? void 0 : item.traceIds[0], value: item === null || item === void 0 ? void 0 : item.traceIds[0] }]);
            setSelectTraceId(item === null || item === void 0 ? void 0 : item.traceIds[0]);
        }
        if (!(item === null || item === void 0 ? void 0 : item.traceIds)) {
            setSelectTraceId('');
        }
    }, [item]);
    var containerRef = react_1.useCallback(function (node) {
        if (node) {
            d3.select(node).selectAll('*').remove();
            var svg = d3.select(node).append('svg').style('height', 30).style('overflow', 'inherit');
            var x = d3
                .scaleLinear()
                // .domain([0, 100])
                .domain([0, scaleRange])
                // .domain([0, data.reduce((max: number, e: any) => Math.max(parseInt(e.durations), max), 0)]) // This is what is written on the Axis: from 0 to 100
                .range([0, node.clientWidth]); // This is where the axis is placed: from 100px to 800px
            // Draw the axis
            svg
                .append('g')
                .attr('transform', 'translate(0,25)') // This controls the vertical position of the Axis
                .call(d3
                .axisTop(x)
                .ticks(7)
                .tickFormat(function (d) {
                // var p = d3.format('s')(d);
                return scaleRange > 1000 ? d.valueOf() / 1000 + "s" : d + 'ms';
            }));
        }
    }, [data]);
    var titleList = [
        { key: 'table', label: '表格', icon: react_1["default"].createElement(icons_1.TableOutlined, null) },
        { key: 'list', label: '列表', icon: react_1["default"].createElement(icons_1.UnorderedListOutlined, null) },
        { key: 'tree', label: '树状', icon: react_1["default"].createElement(icons_1.BranchesOutlined, null) },
    ];
    var column = [
        {
            title: 'Method',
            dataIndex: 'endpointName',
            key: 'endpointName',
            width: '35%',
            ellipsis: true,
            render: function (value) { return (react_1["default"].createElement(antd_1.Tooltip, { placement: "topLeft", title: value }, value)); }
        },
        {
            title: 'Start Time',
            dataIndex: 'startTime',
            key: 'startTime',
            ellipsis: true,
            render: function (value) { return (react_1["default"].createElement(antd_1.Tooltip, { placement: "topLeft", title: _moment_2_29_3_moment_1["default"](Number(value)).format('YYYY-MM-DD HH:mm:ss') }, _moment_2_29_3_moment_1["default"](Number(value)).format('YYYY-MM-DD HH:mm:ss') + "ms")); }
        },
        {
            title: 'Exec(ms)',
            dataIndex: 'durations',
            key: 'durations',
            render: function (value, record) { return (record === null || record === void 0 ? void 0 : record.endTime) - (record === null || record === void 0 ? void 0 : record.startTime) + "ms"; }
        },
        {
            title: 'Exec(%)',
            dataIndex: 'durations',
            key: 'durations',
            render: function (value, record) { return react_1["default"].createElement(TraceTime_1["default"], __assign({}, record)); }
        },
        {
            title: 'Self(ms)',
            dataIndex: 'selfDurations',
            key: 'selfDurations',
            render: function (value, record) { return value + "ms"; }
        },
        {
            title: 'API',
            dataIndex: 'component',
            key: 'component',
            ellipsis: true,
            render: function (value) { return (react_1["default"].createElement(antd_1.Tooltip, { placement: "topLeft", title: value }, value)); }
        },
        {
            title: 'Service',
            dataIndex: 'serviceCode',
            key: 'serviceCode',
            ellipsis: true,
            render: function (value) { return (react_1["default"].createElement(antd_1.Tooltip, { placement: "topLeft", title: value }, value)); }
        },
    ];
    react_1.useEffect(function () {
        var handleData = function (data) {
            var _a;
            if (!data) {
                return;
            }
            var icon = react_1["default"].createElement(icons_1.TableOutlined, null);
            if ((data === null || data === void 0 ? void 0 : data.children) && ((_a = data === null || data === void 0 ? void 0 : data.children) === null || _a === void 0 ? void 0 : _a.length) !== 0) {
                data.children.map(function (e) { return handleData(e); });
            }
            data.icon = icon;
            return data;
        };
        var treeData = [handleData(data[0])];
        setTreeData(treeData);
    }, [data]);
    react_1.useEffect(function () {
        service_1.getNoiseList({ pageIndex: -1, pageSize: -1, isEnable: true }).then(function (res) {
            var _a;
            if (res === null || res === void 0 ? void 0 : res.success) {
                var data_1 = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.dataSource;
                var dataList = data_1.map(function (item) { return ({ value: item === null || item === void 0 ? void 0 : item.id, label: item === null || item === void 0 ? void 0 : item.noiseReductionName }); });
                setNoiseOption(dataList);
            }
        });
    }, []);
    var handleCancel = function () {
        setVisible(false);
    };
    var showModal = function (value) {
        setDetailData(value);
        setVisible(true);
    };
    return (react_1["default"].createElement("div", { className: "trace-wrapper" },
        react_1["default"].createElement(detail_modal_1["default"], { visible: visible, detailData: detailData, handleCancel: handleCancel }),
        react_1["default"].createElement("div", { className: "trace-wrapper-top" },
            react_1["default"].createElement("div", { style: { fontWeight: '800' } },
                "\u7AEF\u70B9\uFF1A",
                item.endpointNames && ((_a = item === null || item === void 0 ? void 0 : item.endpointNames) === null || _a === void 0 ? void 0 : _a.length) !== 0 ? item === null || item === void 0 ? void 0 : item.endpointNames[0] : '--'),
            react_1["default"].createElement("div", { className: "top-select-btn" },
                react_1["default"].createElement("div", null,
                    "traceID:",
                    react_1["default"].createElement(antd_3.Select, { options: traceIdOptions, value: selectTraceId, size: "small", onChange: function (id) {
                            setSelectTraceId(id);
                        }, style: { width: 350, marginLeft: '10px' } }),
                    react_1["default"].createElement(react_copy_to_clipboard_1.CopyToClipboard, { text: selectTraceId, onCopy: function () { return antd_1.message.success('复制成功！'); } },
                        react_1["default"].createElement("span", { style: { marginLeft: 8, color: 'royalblue' } },
                            react_1["default"].createElement(icons_1.CopyOutlined, null)))),
                react_1["default"].createElement(antd_1.Button, { type: "primary", size: "small", onClick: function () {
                        umi_1.history.push({
                            pathname: '/matrix/logger/search',
                            query: {
                                envCode: envCode,
                                startTime: _moment_2_29_3_moment_1["default"](selectTime.start).format('YYYY-MM-DD HH:mm:ss'),
                                endTime: _moment_2_29_3_moment_1["default"](selectTime.end).format('YYYY-MM-DD HH:mm:ss'),
                                traceId: selectTraceId
                            }
                        });
                    } }, "\u67E5\u770B\u65E5\u5FD7")),
            react_1["default"].createElement("div", { className: "top-final" },
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("span", null,
                        "\u5F00\u59CB\u65F6\u95F4\uFF1A",
                        _moment_2_29_3_moment_1["default"](Number(item === null || item === void 0 ? void 0 : item.start)).format('YYYY-MM-DD HH:mm:ss') || '--'),
                    react_1["default"].createElement("span", { style: { margin: '0px 20px' } },
                        "\u6301\u7EED\u65F6\u95F4\uFF1A",
                        react_1["default"].createElement(antd_3.Tag, { color: "default" },
                            (item === null || item === void 0 ? void 0 : item.duration) || '--',
                            "ms")),
                    react_1["default"].createElement("span", null,
                        "\u964D\u566A:",
                        react_1["default"].createElement(antd_3.Select, { mode: "multiple", options: noiseOption, value: selectNoise, size: "small", labelInValue: true, onChange: function (value) {
                                setSelectNoise(value);
                            }, 
                            // showSearch
                            style: { width: 180, marginLeft: '10px' }, autoClearSearchValue: true }))),
                react_1["default"].createElement("div", null, titleList.map(function (item) {
                    return (react_1["default"].createElement("span", { className: "top-trace-btn", style: { backgroundColor: item.key === activeBtn ? '#137eec' : '#b0a8a8' }, onClick: function () {
                            setActiveBtn(item.key);
                        } },
                        item.icon,
                        " ",
                        item.label));
                })))),
        react_1["default"].createElement(antd_3.Divider, null),
        react_1["default"].createElement("div", { className: "trace-display" },
            react_1["default"].createElement(antd_3.Spin, { spinning: loading }, activeBtn === 'list' || activeBtn === 'table' ? (react_1["default"].createElement("div", { className: "spin-warp", style: { minHeight: '300px' } },
                activeBtn === 'list' && (react_1["default"].createElement("div", { className: "trace-table" },
                    react_1["default"].createElement("div", { className: "scale-warpper" },
                        react_1["default"].createElement("div", { ref: containerRef, className: "scale", style: { float: 'right' } })),
                    data && data.length ? (react_1["default"].createElement(antd_2.Tree, { treeData: treeData, blockNode: true, defaultExpandAll: true, showIcon: false, showLine: { showLeafIcon: false }, switcherIcon: react_1["default"].createElement("span", { className: "span-icon" }), titleRender: function (node) {
                            return (react_1["default"].createElement(antd_1.Tooltip, { title: react_1["default"].createElement("ul", null,
                                    react_1["default"].createElement("li", { style: { whiteSpace: 'nowrap' } }, (node === null || node === void 0 ? void 0 : node.endpointName) || ''),
                                    react_1["default"].createElement("li", null,
                                        "TotalDurations:", ((node === null || node === void 0 ? void 0 : node.durations) || 0) + "ms"),
                                    react_1["default"].createElement("li", null,
                                        "selfDurations:", ((node === null || node === void 0 ? void 0 : node.selfDurations) || 0) + "ms")) },
                                react_1["default"].createElement("div", { className: (!node.children || node.children.length == 0 ? 'leaf' : '') + " " + (node.isError ? 'error-node' : '') + " span-item", onClick: function () {
                                        setDetailData(node);
                                        setVisible(true);
                                    } },
                                    react_1["default"].createElement("div", { className: "span-item-wrapper" },
                                        react_1["default"].createElement("span", { className: "span-title " + (node.isError ? 'error' : '') }, (node === null || node === void 0 ? void 0 : node.endpointName) || ''),
                                        react_1["default"].createElement(TraceTime_1["default"], __assign({}, node))))));
                        } })) : null)),
                activeBtn === 'table' && (data === null || data === void 0 ? void 0 : data.length) ? (react_1["default"].createElement(antd_3.Table, { columns: column, defaultExpandAllRows: true, dataSource: data, pagination: false, rowClassName: function (record) { return ((record === null || record === void 0 ? void 0 : record.isError) ? 'error-line' : ''); }, onRow: function (record, index) {
                        return {
                            onClick: function (event) {
                                setDetailData(record);
                                setVisible(true);
                            }
                        };
                    }, expandable: {
                        defaultExpandAllRows: true,
                        expandIcon: function (_a) {
                            var _b;
                            var expanded = _a.expanded, onExpand = _a.onExpand, record = _a.record;
                            return ((_b = record === null || record === void 0 ? void 0 : record.children) === null || _b === void 0 ? void 0 : _b.length) ? (expanded ? (react_1["default"].createElement(icons_1.DownOutlined, { style: { marginRight: '3px', fontSize: '9px' }, onClick: function (e) {
                                    onExpand(record, e);
                                    e.stopPropagation();
                                } })) : (react_1["default"].createElement(icons_1.RightOutlined, { style: { marginRight: '3px', fontSize: '9px' }, onClick: function (e) {
                                    onExpand(record, e);
                                    e.stopPropagation();
                                } }))) : null;
                        },
                        indentSize: 20
                    } })) : null)) : null),
            activeBtn === 'tree' && react_1["default"].createElement(right_graph_1["default"], { treeData: data, showModal: showModal }))));
}
exports["default"] = RrightTrace;
