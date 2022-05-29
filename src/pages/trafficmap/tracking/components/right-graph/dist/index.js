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
var g6_1 = require("@antv/g6");
var react_1 = require("react");
var util_1 = require("@/common/util");
function mapData(arr) {
    if (!arr)
        return [];
    return arr.map(function (_a) {
        var id = _a.id, key = _a.key, endpointName = _a.endpointName, children = _a.children, other = __rest(_a, ["id", "key", "endpointName", "children"]);
        return __assign(__assign({}, other), { 
            // id: id + 'key',
            // id: endpointName + '',
            // label: endpointName,
            label: util_1.formatText(endpointName, 20), oriLabel: endpointName, children: mapData(children) });
    });
}
function rightTree(props) {
    var treeData = props.treeData, showModal = props.showModal;
    var _a = react_1.useState({}), graphData = _a[0], setGraphData = _a[1];
    // const data = useMemo(() => treeData && { label: 'root11', children: mapData(treeData) }, [treeData]);
    var data = react_1.useMemo(function () { return mapData(treeData)[0]; }, [treeData]);
    var containerRef = react_1.useRef(null);
    var _b = react_1.useState(), graph = _b[0], setGraph = _b[1];
    // 初始化图表
    react_1.useEffect(function () {
        if (!containerRef)
            return;
        var g = null;
        var container = containerRef.current;
        var tooltip = new g6_1["default"].Tooltip({
            offsetX: 10,
            offsetY: 10,
            itemTypes: ['node'],
            getContent: function (e) {
                var outDiv = document.createElement('div');
                outDiv.style.width = 'fit-content';
                outDiv.innerHTML = "\n          <ul>\n          <li>\u7AEF\u70B9: " + e.item.getModel().oriLabel + "</li>\n          </ul>\n          ";
                return outDiv;
            }
        });
        g = new g6_1["default"].TreeGraph({
            container: 'traceTree',
            width: container.clientWidth,
            height: container.clientHeight,
            plugins: [tooltip],
            modes: {
                "default": [{
                        type: 'collapse-expand',
                        onChange: function onChange(item, collapsed) {
                            var data = item.get('model');
                            data.collapsed = collapsed;
                            return true;
                        },
                        shouldBegin: function (e) {
                            var _a, _b;
                            if (((_b = (_a = e.target) === null || _a === void 0 ? void 0 : _a.cfg) === null || _b === void 0 ? void 0 : _b.type) === 'text') {
                                return false;
                            }
                            else {
                                return true;
                            }
                        }
                    }, 'drag-canvas', 'zoom-canvas']
            },
            defaultNode: {
                size: 26,
                anchorPoints: [
                    [0, 0.5],
                    [1, 0.5],
                ]
            },
            defaultEdge: {
                type: 'cubic-horizontal'
            },
            // 定义布局
            layout: {
                // type: 'dendrogram', // 布局类型
                type: 'compactBox',
                direction: 'LR',
                nodeSep: 50,
                rankSep: 100,
                nodeSize: 10
            }
        });
        g.node(function (node) {
            return {
                labelCfg: {
                    position: node.children && node.children.length > 0 ? 'left' : 'right',
                    offset: 5
                }
            };
        });
        if (data) {
            g.data(data);
            g.render();
            g.fitView();
        }
        bindListener(g);
        setGraph(g);
        /**
         * 监听dom大小的改变resize graph
         */
        var resizeObserver = new ResizeObserver(function (entries) {
            for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                var entry = entries_1[_i];
            }
            if (!g || g.get('destroyed'))
                return;
            if (!container)
                return;
            g.changeSize(container.scrollWidth, container.scrollHeight - 30);
            g.fitView();
        });
        resizeObserver.observe(container || document.body);
        return function () {
            g && g.destory && g.destory();
            resizeObserver.disconnect();
        };
    }, [containerRef, data]);
    var bindListener = function (graph) {
        graph.on('node:click', function (evt) {
            var _a, _b;
            if (((_b = (_a = evt.target) === null || _a === void 0 ? void 0 : _a.cfg) === null || _b === void 0 ? void 0 : _b.type) === 'text') {
                showModal(evt.item._cfg.model);
            }
        });
        // graph.on('node:mouseenter', (evt: any) => {
        //   const { item } = evt;
        //   const model = item.getModel();
        //   item.update({
        //     label: model.oriLabel,
        //   });
        // });
        // graph.on('node:mouseleave', (evt: any) => {
        //   const { item } = evt;
        //   const model = item.getModel();
        //   item.update({
        //     label: model.label,
        //   });
        // graph.setItemState(item, 'hover', false);
        // });
    };
    return react_1["default"].createElement("div", { ref: containerRef, id: "traceTree", style: { height: '100%' } });
}
exports["default"] = rightTree;
