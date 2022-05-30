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
var moment_1 = require("moment");
require("./index.less");
var displayTag = {
    serviceCode: '服务',
    serviceInstanceName: '实例',
    endpointName: '端点',
    type: '跨度类型',
    component: '组件',
    peer: 'Peer',
    isError: '错误'
};
function DetailModal(props) {
    var visible = props.visible, handleCancel = props.handleCancel, detailData = props.detailData;
    var _a = react_1.useState([]), tagList = _a[0], setTagList = _a[1];
    react_1.useEffect(function () {
        var _a;
        if ((detailData === null || detailData === void 0 ? void 0 : detailData.tags) && ((_a = detailData === null || detailData === void 0 ? void 0 : detailData.tags) === null || _a === void 0 ? void 0 : _a.length) !== 0) {
            setTagList(detailData.tags);
        }
    }, [detailData]);
    var Tag = function (_a) {
        var label = _a.label, value = _a.value;
        return (react_1["default"].createElement("div", { className: "detail-item" },
            react_1["default"].createElement("span", { style: { color: '#a7aebb', width: '33.333%' } }, label),
            react_1["default"].createElement("span", { style: { color: '#1c1f24', width: '66.666%' } }, value)));
    };
    var Log = function (_a) {
        var time = _a.time, data = _a.data;
        return (react_1["default"].createElement("div", null,
            react_1["default"].createElement("div", { className: "log-item" },
                react_1["default"].createElement("div", { className: "log-item-label" }, "\u65F6\u95F4"),
                react_1["default"].createElement("div", { className: "log-item-value" }, moment_1["default"](time).format('YYYY-MM-DD HH:mm:ss'))),
            data.map(function (item) { return (react_1["default"].createElement("div", { className: "log-item" },
                react_1["default"].createElement("div", { className: "log-item-label" }, item.key),
                react_1["default"].createElement("div", { className: "log-item-value" }, item.value))); })));
    };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(antd_1.Modal, { visible: visible, onCancel: handleCancel, footer: null, width: "60%" },
            react_1["default"].createElement("div", { className: "detail-wrapper" },
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("span", { className: "title" }, "\u6807\u8BB0"),
                    Object.keys(displayTag).map(function (k) {
                        return k === 'endpointName' ? react_1["default"].createElement(Tag, { label: '\u7AEF\u70B9', value: k in detailData ? detailData[k].toString() || '' : (detailData === null || detailData === void 0 ? void 0 : detailData.oriLabel) || '' })
                            : react_1["default"].createElement(Tag, { label: displayTag[k] || k, value: k in detailData ? detailData[k].toString() : '' });
                    }),
                    tagList.map(function (item) { return (react_1["default"].createElement(Tag, { label: item.key, value: item.value })); })),
                detailData.logs && detailData.logs.length !== 0 && (react_1["default"].createElement("div", null,
                    react_1["default"].createElement("span", { className: "title" }, "\u65E5\u5FD7"),
                    detailData.logs.map(function (log) { return (react_1["default"].createElement(Log, __assign({}, log))); })))))));
}
exports["default"] = DetailModal;
