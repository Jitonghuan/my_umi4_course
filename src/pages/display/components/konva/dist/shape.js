"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.Graph = exports.MyOperateGroup = exports.MyTableGroup = exports.MyBasicCircirGroup = exports.hoverCircleFill = exports.defaultCircleStrokeWidth = exports.defaultCircleStroke = exports.defaultCircleFill = exports.backgroundColor = exports.fontStyle = exports.operateFontSize = exports.tableFontSize = exports.fontSize = exports.fontFamily = exports.relatedRadius = exports.radius = exports.textMargin = exports.textPadding = void 0;
var konva_1 = require("konva");
exports.textPadding = 10;
exports.textMargin = 12;
exports.radius = 36;
exports.relatedRadius = 65;
exports.fontFamily = "Alibaba Sans";
exports.fontSize = 16;
exports.tableFontSize = 12;
exports.operateFontSize = 12;
exports.fontStyle = 'bold';
exports.backgroundColor = 'rgb(230 235 245 / 17%)';
exports.defaultCircleFill = '#1890ff';
exports.defaultCircleStroke = '#1068bb';
exports.defaultCircleStrokeWidth = 2;
exports.hoverCircleFill = '#127cdf';
// text上方的文字背景
function drawRect(props) {
    return new konva_1["default"].Rect(__assign({ fill: 'white' }, props));
}
// 画圆
function drawCircle(props) {
    var c = new konva_1["default"].Circle(__assign({ radius: exports.radius, fill: exports.defaultCircleFill }, props));
    return c;
}
// 用于画隐藏的圆
function makeOpreateCircle(_a) {
    var selfTable = _a.selfTable, text = _a.text, x = _a.x, y = _a.y, onCollision = _a.onCollision, other = __rest(_a, ["selfTable", "text", "x", "y", "onCollision"]);
    var group = new MyOperateGroup({
        visible: false,
        name: "opreate",
        x: x, y: y,
        selfTable: selfTable,
        onCollision: onCollision
    });
    group.add(drawCircle(__assign({ name: "opreate-circle", fill: 'grey', opacity: 0.2, stroke: 'black', strokeWidth: 2, dash: [2, 2] }, other)));
    if (text) {
        // 中间的字
        group.add(drawCenterAlignText({
            text: text,
            fontSize: exports.operateFontSize,
            fill: 'black',
            name: 'opreate-text'
        }));
        // 上方的字
        group.add(drawRect({
            width: exports.radius * 2,
            height: exports.tableFontSize + exports.textPadding,
            x: -exports.radius,
            y: -exports.radius - exports.textMargin - exports.textPadding / 2 - exports.tableFontSize,
            stroke: 'black',
            fill: 'black',
            opacity: 0.8,
            strokeWidth: 1,
            shadowOffsetY: 1,
            // shadowBlur: 1,
            shadowColor: "#ccc",
            name: 'opreate-text-coll',
            cornerRadius: 5,
            visible: false
        }));
        // 被碰撞了之后显示在上方的字
        group.add(drawCenterAlignText({
            text: text,
            y: -exports.radius - exports.textMargin - exports.textPadding / 2,
            fontSize: exports.operateFontSize,
            fill: 'white',
            name: 'opreate-text-coll',
            visible: false
        }));
    }
    return group;
}
function drawCenterAlignText(props) {
    return new konva_1["default"].Text(__assign(__assign({ fontSize: exports.fontSize,
        fontStyle: exports.fontStyle,
        fontFamily: exports.fontFamily, fill: 'white', align: "center", name: 'key-text', verticalAlign: 'middle' }, props), { x: -getTextWidth(props.text, (props.fontSize || 0)) / 2 + (props.x || 0), y: -(props.fontSize || 0) / 2 + (props.y || 0) }));
}
function getTextWidth(text, fontSize) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    context.font = exports.fontStyle + " " + fontSize + "px  " + exports.fontFamily;
    var metrics = context === null || context === void 0 ? void 0 : context.measureText(text);
    return metrics === null || metrics === void 0 ? void 0 : metrics.width;
}
var MyBasicCircirGroup = /** @class */ (function (_super) {
    __extends(MyBasicCircirGroup, _super);
    function MyBasicCircirGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyBasicCircirGroup.prototype.getKeyCircle = function () {
        return this.findOne('.key-circle');
    };
    MyBasicCircirGroup.prototype.collision = function (r2, padding) {
        if (padding === void 0) { padding = 5; }
        var r1 = this.getKeyCircle();
        var dx = (r1.getClientRect().x + r1.radius()) - (r2.getClientRect().x + r2.radius());
        var dy = (r1.getClientRect().y + r1.radius()) - (r2.getClientRect().y + r2.radius());
        var distance = Math.sqrt(dx * dx + dy * dy);
        return (distance - padding) < (r1.radius() + r2.radius());
    };
    return MyBasicCircirGroup;
}(konva_1["default"].Group));
exports.MyBasicCircirGroup = MyBasicCircirGroup;
// 存放一个group中用到的方法 三个圆为一组 分别是两个隐藏的圆和一个静止的圆
var MyTableGroup = /** @class */ (function (_super) {
    __extends(MyTableGroup, _super);
    function MyTableGroup(_a) {
        var tableData = _a.tableData, other = __rest(_a, ["tableData"]);
        var _this = _super.call(this, other) || this;
        _this.tableData = tableData;
        return _this;
    }
    MyTableGroup.prototype.lock = function () {
        this.draggable(false);
        this.getKeyCircle().fill(exports.defaultCircleFill);
        this.getKeyCircle().stroke(exports.defaultCircleStroke);
        this.getKeyCircle().shadowBlur(0);
        this.getKeyCircle().shadowColor(exports.defaultCircleFill);
        this.getKeyCircle().strokeWidth(exports.defaultCircleStrokeWidth);
    };
    MyTableGroup.prototype.unlock = function () {
        this.draggable(true);
    };
    MyTableGroup.prototype.getOperates = function () {
        return this.find('.opreate');
    };
    MyTableGroup.prototype.startOperate = function () {
        return this.getOperates().forEach(function (e) { return e.show(); });
    };
    MyTableGroup.prototype.endOperate = function () {
        return this.getOperates().forEach(function (e) { return e.hide(); });
    };
    MyTableGroup.prototype.checkOperate = function () {
        return this.getOperates().forEach(function (e) { return e.opreateCheck(); });
    };
    MyTableGroup.prototype.collisionCheck = function (targetTable) {
        if (this === targetTable) {
            return;
        }
        var circle = targetTable.getKeyCircle();
        if (this.collision(circle)) {
            this.startOperate();
            this.getOperates().forEach(function (g) { return g.collisionCheck(targetTable); });
        }
        else {
            this.endOperate();
        }
    };
    MyTableGroup.prototype.clickCircle = function () {
    };
    return MyTableGroup;
}(MyBasicCircirGroup));
exports.MyTableGroup = MyTableGroup;
;
// 存放隐藏圆的一些方法
var MyOperateGroup = /** @class */ (function (_super) {
    __extends(MyOperateGroup, _super);
    function MyOperateGroup(_a) {
        var selfTable = _a.selfTable, onCollision = _a.onCollision, other = __rest(_a, ["selfTable", "onCollision"]);
        var _this = _super.call(this, other) || this;
        _this.selfTable = selfTable;
        _this.onCollision = onCollision;
        return _this;
    }
    MyOperateGroup.prototype.getKeyCircle = function () {
        return this.findOne('.opreate-circle');
    };
    MyOperateGroup.prototype.opreateCheck = function () {
        if (this.opsTable) {
            this.onCollision(this.selfTable, this.opsTable);
        }
    };
    MyOperateGroup.prototype.active = function (t) {
        this.opsTable = t;
        this.findOne('.opreate-circle').opacity(1);
        this.find(".opreate-text-coll").forEach(function (e) { return e.show(); });
        this.find(".opreate-text-coll").forEach(function (e) { return e.moveToTop(); });
    };
    MyOperateGroup.prototype.unactive = function () {
        this.opsTable = undefined;
        this.findOne('.opreate-circle').opacity(0.2);
        this.find(".opreate-text-coll").forEach(function (e) { return e.hide(); });
    };
    MyOperateGroup.prototype.collisionCheck = function (targetTable) {
        var circle = targetTable.getKeyCircle();
        if (this.collision(circle, -5)) {
            this.active(targetTable.tableData);
        }
        else {
            this.unactive();
        }
    };
    return MyOperateGroup;
}(MyBasicCircirGroup));
exports.MyOperateGroup = MyOperateGroup;
;
var Graph = /** @class */ (function () {
    function Graph(container) {
        this.stage = new konva_1["default"].Stage({
            container: container,
            width: container.clientWidth,
            height: container.clientHeight
        });
        this.stage.container().style.backgroundColor = exports.backgroundColor;
        this.layer = new konva_1["default"].Layer();
        this.stage.add(this.layer);
        this.layer.on('dragstart', function (e) {
        });
        this.layer.on('dragmove', function (e) {
            var _a;
            var targetGroup = e.target;
            targetGroup.moveToTop();
            (_a = this.children) === null || _a === void 0 ? void 0 : _a.forEach(function (group) { return group === null || group === void 0 ? void 0 : group.collisionCheck(e.target); });
        });
        this.layer.on('dragend', function (e) {
            var _a, _b;
            (_a = this.children) === null || _a === void 0 ? void 0 : _a.forEach(function (group) { return group === null || group === void 0 ? void 0 : group.endOperate(group); });
            (_b = this.children) === null || _b === void 0 ? void 0 : _b.forEach(function (group) { return group === null || group === void 0 ? void 0 : group.checkOperate(); });
        });
    }
    // 画一组圆 分别是两个隐藏的圆和一个静止的圆
    Graph.prototype.addTable = function (t) {
        var layer = this.layer;
        var x = t.x, y = t.y, _a = t.draggable, draggable = _a === void 0 ? true : _a, other = __rest(t, ["x", "y", "draggable"]);
        var group = new MyTableGroup({
            draggable: draggable,
            x: x || Math.random() * this.stage.width(),
            y: y || Math.random() * this.stage.height(),
            strokeWidth: 1,
            tableData: t
        });
        group.on('click', function (e) {
            var _a;
            (_a = layer.children) === null || _a === void 0 ? void 0 : _a.forEach(function (g) {
                var clickCircle = g.findOne && g.findOne('.key-circle');
                if (clickCircle) {
                    clickCircle.shadowBlur(0);
                }
            });
            var clickCircle = this.findOne('.key-circle');
            t.changeData(t.tableName);
            clickCircle.shadowColor(clickCircle.fill() || exports.defaultCircleFill);
            clickCircle.shadowBlur(20);
        });
        group.add(drawRect({
            width: getTextWidth(t.tableName, 16),
            height: exports.tableFontSize + exports.textPadding,
            x: -getTextWidth(t.tableName, 16) / 2,
            y: -exports.radius - exports.textMargin - exports.textPadding / 2 - exports.tableFontSize,
            stroke: '#ccc',
            strokeWidth: 1,
            shadowOffsetY: 1,
            // shadowBlur: 1,
            shadowColor: "#ccc",
            cornerRadius: 5
        }));
        group.add(drawCenterAlignText({
            y: -exports.radius - exports.textMargin - exports.textPadding / 2,
            fontSize: exports.tableFontSize,
            text: t.tableName,
            fill: 'black',
            name: 'table-text'
        }));
        // 左边隐藏的圆
        group.add(makeOpreateCircle({
            x: -exports.radius * 1.5,
            text: '表关联设置',
            selfTable: t,
            onCollision: t.onRelative
        }));
        // 中间的圆
        group.add(drawCircle(__assign({ name: 'key-circle' }, other)));
        // 右边隐藏的圆
        group.add(makeOpreateCircle({
            x: exports.radius * 1.5,
            text: '行拼接',
            selfTable: t,
            onCollision: t.onJoin
        }));
        // 中间圆的文字
        group.add(drawCenterAlignText({
            text: t.recordCount + '',
            fontSize: exports.fontSize,
            fill: 'white',
            name: 'record-text'
        }));
        this.layer.add(group);
    };
    // 两个圆交集
    Graph.prototype.showRelative = function (related, changeData) {
        var stage = this.stage;
        var textFontSize = 12;
        var numberFontSize = 16;
        // 计算中间数字所占宽度
        var crossX = (getTextWidth(related.corssCount + "", numberFontSize) + exports.textPadding * 3)
            / 2;
        var group = new MyBasicCircirGroup({
            // draggable: true,
            x: this.stage.width() / 2,
            y: this.stage.height() / 2
        });
        // 左边圆 
        var leftGroup = new MyBasicCircirGroup({});
        leftGroup.on('click', function (e) {
            var rightCircle = stage.findOne('.relate-right');
            rightCircle.fill('#ededed');
            var crossArc = stage.findOne('.cross-arc');
            crossArc.fill('#ededed');
            stage.container().style.cursor = 'pointer';
            var currentClick = this.findOne('.relate-left');
            currentClick.fill(exports.defaultCircleFill);
            changeData('left');
        });
        group.add(leftGroup);
        var leftX = -exports.relatedRadius + crossX;
        // var leftText = related.left.tableName + "-" + (related.left.remark || '');
        var leftText = related.left.tableName;
        leftGroup.add(drawCircle(__assign({ radius: exports.relatedRadius, fill: '#ededed', 
            // opacity: 0.15,
            x: leftX, name: 'relate-left' }, related.left)));
        // 左边上方表名
        leftGroup.add(drawCenterAlignText({
            x: -(getTextWidth(leftText, textFontSize) / 2 + exports.textPadding),
            y: -exports.relatedRadius - textFontSize,
            text: leftText,
            fontSize: textFontSize,
            fill: '#c3c30b'
        }));
        // 左边中间数量
        leftGroup.add(drawCenterAlignText({
            x: -2 * exports.relatedRadius + crossX + getTextWidth(related.leftRestCount + "", numberFontSize) / 2 + exports.textPadding,
            text: related.leftRestCount + "",
            fontSize: numberFontSize,
            fill: '#000'
        }));
        // 右边圆
        var rightGroup = new MyBasicCircirGroup({});
        rightGroup.on('click', function (e) {
            // stage.findOne('.relate-left').opacity(0.15);
            // const crossArc = stage.findOne('.cross-arc') as any;
            // crossArc.fill(defaultCircleFill);
            // stage.container().style.cursor = 'pointer';
            // this.findOne('.relate-right').opacity(0.4);
            var rightCircle = stage.findOne('.relate-left');
            rightCircle.fill('#000');
            var crossArc = stage.findOne('.cross-arc');
            crossArc.fill('#000');
            stage.container().style.cursor = 'pointer';
            var currentClick = this.findOne('.relate-right');
            currentClick.fill(exports.defaultCircleFill);
            changeData('right');
        });
        rightGroup.on("mouseover", function (e) {
            // stage.container().style.cursor = 'pointer';
            // this.findOne('.relate-right').opacity(0.5);
        });
        rightGroup.on('mouseleave', function (e) {
            // stage.container().style.cursor = 'default';
            // this.findOne('.relate-right').opacity(0.15);
        });
        group.add(rightGroup);
        var rightX = exports.relatedRadius - crossX;
        var rightText = related.right.tableName;
        rightGroup.add(drawCircle(__assign({ fill: '#ededed', 
            // opacity: 0.15,
            radius: exports.relatedRadius, name: 'relate-right', x: rightX }, related.right)));
        rightGroup.add(drawCenterAlignText({
            x: +getTextWidth(rightText, textFontSize) / 2 + exports.textPadding,
            y: -exports.relatedRadius - textFontSize,
            text: rightText,
            fontSize: textFontSize,
            fill: 'green'
        }));
        rightGroup.add(drawCenterAlignText({
            x: 2 * exports.relatedRadius - crossX - getTextWidth(related.rightRestCount + "", numberFontSize) / 2 - exports.textPadding,
            text: related.rightRestCount + "",
            fontSize: numberFontSize,
            fill: '#000'
        }));
        // 计算扇形角度 分数表示
        var crossAngle = Math.acos((exports.relatedRadius - crossX) / exports.relatedRadius) / (2 * Math.PI);
        // 计算元数据开始角 和 结束角 弧度表示
        var leftAngelStart = 0 / 360 - crossAngle;
        var leftAngelEnd = 0 / 360 + crossAngle;
        var rightAngelStart = 180 / 360 - crossAngle;
        var rightAngelEnd = 180 / 360 + crossAngle;
        //  弧度表示
        var leftRadianslStart = 2 * Math.PI * leftAngelStart;
        var leftRadianslEnd = 2 * Math.PI * leftAngelEnd;
        var rightRadiansStart = 2 * Math.PI * rightAngelStart;
        var rightRadianslEnd = 2 * Math.PI * rightAngelEnd;
        var centerGroup = new MyBasicCircirGroup({});
        centerGroup.on('click', function (e) {
            // stage.container().style.cursor = 'pointer';
            // stage.findOne('.relate-left').opacity(0.15);
            // stage.findOne('.relate-right').opacity(0.15);
            // const csArc = this.findOne('.cross-arc') as any;
            // csArc.fill(hoverCircleFill);
            var rightCircle = stage.findOne('.relate-right');
            rightCircle.fill('#000');
            var crossArc = stage.findOne('.relate-left');
            crossArc.fill('#000');
            stage.container().style.cursor = 'pointer';
            var currentClick = this.findOne('.cross-arc');
            currentClick.fill(exports.defaultCircleFill);
            changeData('center');
        });
        centerGroup.on("mouseover", function (e) {
            // stage.container().style.cursor = 'pointer';
            // const csArc = this.findOne('.cross-arc') as any;
            // csArc.fill(hoverCircleFill);
        });
        centerGroup.on('mouseleave', function (e) {
            // stage.container().style.cursor = 'default';
            // const csArc = this.findOne('.cross-arc') as any;
            // csArc.fill(defaultCircleFill);
        });
        group.add(centerGroup);
        var crossShape = new konva_1["default"].Shape({
            fill: exports.defaultCircleFill,
            // opacity: 0.15,
            name: 'cross-arc',
            sceneFunc: function (context, shape) {
                context.beginPath();
                context.arc(leftX, 0, exports.relatedRadius, leftRadianslStart, leftRadianslEnd, false);
                context.closePath();
                context.fillStrokeShape(shape);
                context.beginPath();
                context.arc(rightX, 0, exports.relatedRadius, rightRadiansStart, rightRadianslEnd, false);
                context.closePath();
                context.fillStrokeShape(shape);
            }
        });
        // 画左右两块不完整扇形
        centerGroup.add(crossShape);
        // 画出两条白色弧线 假装边框
        centerGroup.add(new konva_1["default"].Shape({
            stroke: 'white',
            strokeWidth: 6,
            sceneFunc: function (context, shape) {
                context.beginPath();
                context.arc(leftX, 0, exports.relatedRadius - 3, leftRadianslStart, leftRadianslEnd, false);
                context.strokeShape(shape);
                context.beginPath();
                context.arc(rightX, 0, exports.relatedRadius - 3, rightRadiansStart, rightRadianslEnd, false);
                context.strokeShape(shape);
            }
        }));
        // 中间文字
        centerGroup.add(drawCenterAlignText({
            text: related.corssCount + "",
            fontSize: numberFontSize,
            fill: '#fff'
        }));
        group.add(drawCenterAlignText({
            fontSize: 12,
            fill: 'black',
            text: '两表字段均保留，取两者均有的数据',
            x: 0,
            y: 2 * exports.radius + 10
        }));
        this.layer.add(group);
    };
    // 树形结构图
    Graph.prototype.showRelativeTree = function (related) {
        var _this = this;
        var _a, _b;
        var levelLength = exports.radius * 8;
        var step = exports.radius * 4, yStart = exports.radius * 3;
        var yOrder = function (groups, offset, step) {
            groups.forEach(function (g) {
                g.setY(offset);
                offset += step;
            });
        };
        (_a = this.layer.children) === null || _a === void 0 ? void 0 : _a.map(function (g) { return g === null || g === void 0 ? void 0 : g.lock(); });
        yOrder(this.layer.children, yStart, step);
        (_b = this.layer.children) === null || _b === void 0 ? void 0 : _b.map(function (g) { return g.setX(_this.stage.width() / 2 - levelLength / 2); });
        this.stage.draw();
        this.addTable({
            y: yStart + step / 2,
            x: this.stage.width() / 2 + levelLength / 2 + exports.radius,
            fill: 'orange',
            stroke: '#d18702',
            strokeWidth: 1,
            tableName: "医保上传-校验明细交集数据",
            recordCount: 205,
            shadowColor: 'orange',
            shadowBlur: 20,
            draggable: false
        });
        var arrowTop = new konva_1["default"].Arrow({
            x: this.stage.width() / 2 - exports.radius * 3 + exports.textPadding,
            y: yStart,
            points: [
                0, 0,
                (levelLength - exports.radius * 2) / 2, 0,
                (levelLength - exports.radius * 2) / 2, (exports.radius * 4 / 2),
                levelLength - exports.radius - exports.textPadding * 2, exports.radius * 4 / 2
            ],
            pointerLength: 4,
            pointerWidth: 4,
            fill: '#ccc',
            stroke: '#ccc',
            strokeWidth: 2
        });
        this.layer.add(arrowTop);
        var arrowBottom = new konva_1["default"].Arrow({
            x: this.stage.width() / 2 - exports.radius * 3 + exports.textPadding,
            y: exports.radius * 3 + step,
            points: [
                0, 0,
                (levelLength - exports.radius * 2) / 2, 0,
                (levelLength - exports.radius * 2) / 2, -(exports.radius * 4 / 2),
                levelLength - exports.radius - exports.textPadding * 2, -exports.radius * 4 / 2
            ],
            pointerLength: 4,
            pointerWidth: 4,
            fill: '#ccc',
            stroke: '#ccc',
            strokeWidth: 2
        });
        this.layer.add(arrowBottom);
        var miniCircle = 7;
        this.layer.add(drawRect({
            x: this.stage.width() / 2 + 2 * exports.radius + miniCircle / 2 - miniCircle * 2,
            y: yStart + step / 2 - miniCircle,
            width: miniCircle * 4,
            height: miniCircle * 2,
            fill: '#fbfcfd',
            opacity: 1
        }));
        var leftCircle = drawCircle({
            radius: miniCircle, fill: '#000', opacity: 0.1,
            x: this.stage.width() / 2 + 2 * exports.radius,
            y: yStart + step / 2
        });
        var rightCircle = drawCircle({
            radius: miniCircle, fill: '#000', opacity: 0.1,
            x: this.stage.width() / 2 + 2 * exports.radius + miniCircle,
            y: yStart + step / 2
        });
        this.layer.add(leftCircle);
        this.layer.add(rightCircle);
    };
    return Graph;
}());
exports.Graph = Graph;
exports["default"] = {
    MyOperateGroup: MyOperateGroup,
    MyTableGroup: MyTableGroup,
    MyBasicCircirGroup: MyBasicCircirGroup
};
