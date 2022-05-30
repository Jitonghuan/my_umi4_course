"use strict";
exports.__esModule = true;
var react_1 = require("react");
var antd_1 = require("antd");
require("./index.less");
var _moment_2_29_3_moment_1 = require("_moment@2.29.3@moment");
function LeftList(props) {
    var listData = props.listData, changeItem = props.changeItem, total = props.total, pageChange = props.pageChange, loading = props.loading;
    var _a = react_1.useState(), activeItem = _a[0], setActiveItem = _a[1];
    var _b = react_1.useState(1), current = _b[0], setCurrent = _b[1];
    react_1.useEffect(function () {
        if (listData.length !== 0) {
            setActiveItem(listData[0]);
        }
    }, [listData]);
    react_1.useEffect(function () {
        changeItem(activeItem);
    }, [activeItem]);
    return (listData.length !== 0 || loading) ? (React.createElement("div", { className: "left-list" },
        React.createElement(antd_1.Spin, { spinning: loading },
            React.createElement("div", { className: "left-list-wrapper" }, listData === null || listData === void 0 ? void 0 : listData.map(function (item) { return (React.createElement("div", { className: "list-item " + ((item === null || item === void 0 ? void 0 : item.key) === (activeItem === null || activeItem === void 0 ? void 0 : activeItem.key) ? 'list-item-active' : ''), onClick: function () {
                    setActiveItem(item);
                } },
                React.createElement(antd_1.Tooltip, { title: item === null || item === void 0 ? void 0 : item.endpointNames[0] },
                    React.createElement("div", { className: "item-traceId " + (item.isError ? 'list-item-error' : '') }, item === null || item === void 0 ? void 0 : item.endpointNames[0])),
                React.createElement("div", { className: "item-message " + (item.isError ? 'list-item-error' : '') },
                    ' ',
                    React.createElement(antd_1.Tag, { color: "default" }, item === null || item === void 0 ? void 0 :
                        item.duration,
                        "ms"),
                    React.createElement("span", { className: "item-time " + (item.isError ? 'list-item-error' : '') },
                        ' ',
                        _moment_2_29_3_moment_1["default"](Number(item === null || item === void 0 ? void 0 : item.start)).format('YYYY-MM-DD HH:mm:ss'))))); })),
            React.createElement("div", { className: "list-page" },
                React.createElement(antd_1.Pagination, { current: current, total: total, pageSize: 20, size: "small", showSizeChanger: false, onChange: function (page, pageSize) {
                        setCurrent(page);
                        pageChange({ pageIndex: page, pageSize: pageSize });
                    } }))))) : (React.createElement(antd_1.Empty, { image: antd_1.Empty.PRESENTED_IMAGE_SIMPLE, style: { width: '100%', overflow: 'hidden' } }));
}
exports["default"] = LeftList;
