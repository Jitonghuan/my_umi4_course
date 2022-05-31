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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
var icons_1 = require("@ant-design/icons");
var react_1 = require("react");
var react_resizable_1 = require("react-resizable");
require("./styles.less");
// 可以拖拽宽度的组件
var ResizablePro = function (props) {
    var leftComp = props.leftComp, rightComp = props.rightComp, _a = props.isShowExpandIcon, isShowExpandIcon = _a === void 0 ? false : _a, leftWidth = props.leftWidth, _b = props.defaultClose, defaultClose = _b === void 0 ? false : _b, rest = __rest(props, ["leftComp", "rightComp", "isShowExpandIcon", "leftWidth", "defaultClose"]);
    var _c = react_1.useState({
        width: defaultClose ? 0 : leftWidth || 500
    }), resizeState = _c[0], setResizeState = _c[1];
    var _d = react_1.useState(defaultClose), close = _d[0], setClose = _d[1];
    var onClose = function (e) {
        e.stopPropagation();
        setResizeState({ width: close ? leftWidth || 500 : 0 });
        setClose(!close);
    };
    var onResize = function (event, _a) {
        var size = _a.size;
        setResizeState({ width: size.width });
    };
    return (react_1["default"].createElement("div", __assign({ className: "page-resizable" }, rest),
        react_1["default"].createElement(react_resizable_1.Resizable, { className: "resizable-left", onResize: onResize, width: resizeState.width, handle: isShowExpandIcon ? react_1["default"].createElement("div", { className: "react-resizable-handle resizable-handle", onClick: function (e) { return e.stopPropagation(); } }, close ? (react_1["default"].createElement(icons_1.RightCircleFilled, { className: "resizable-click ", onClick: onClose })) : (react_1["default"].createElement(icons_1.LeftCircleFilled, { className: "resizable-click close", onClick: onClose }))) : react_1["default"].createElement("div", { className: "react-resizable-handle resizable-handle" }), height: 0 },
            react_1["default"].createElement("div", { style: { width: resizeState.width, paddingRight: '12px' } }, leftComp)),
        react_1["default"].createElement("div", { className: "resizable-right" }, rightComp)));
};
exports["default"] = ResizablePro;
