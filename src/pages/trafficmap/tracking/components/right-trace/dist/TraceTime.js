"use strict";
exports.__esModule = true;
var react_1 = require("react");
var antd_1 = require("antd");
function TraceTime(_a) {
    var durations = _a.durations, allDurations = _a.allDurations, selfDurations = _a.selfDurations;
    var allP = 0;
    var selfP = 0;
    if (durations !== 0) {
        allP = (durations / allDurations) * 100;
    }
    if (selfDurations !== 0 && durations !== 0) {
        selfP = (selfDurations / durations) * 100;
    }
    // const allP = (durations / allDurations) * 100;
    // const selfP = (selfDurations / durations) * 100;
    return (react_1["default"].createElement("div", { className: "trace-time" },
        react_1["default"].createElement("div", { className: "duration", style: {
                height: '7px',
                borderRadius: '3px',
                background: '#3fb1e3',
                position: 'relative',
                border: 'none',
                backgroundColor: '#3fb1e3',
                width: allP > 100 ? '100%' : "" + (allP + '%')
            } },
            react_1["default"].createElement(antd_1.Progress, { style: { position: 'absolute', top: '-7px' }, percent: selfP, showInfo: false, size: "small", trailColor: "transparent", className: "span-progress" }))));
}
exports["default"] = TraceTime;
