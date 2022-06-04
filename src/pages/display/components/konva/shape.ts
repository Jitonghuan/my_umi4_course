
import Konva from 'konva'
import { ContainerConfig } from 'konva/lib/Container';

export const textPadding = 10;
export const textMargin = 12;
export const radius = 36;
export const relatedRadius = 65;
export const fontFamily = "Alibaba Sans";
export const fontSize = 16;
export const tableFontSize = 12;
export const operateFontSize = 12;
export const fontStyle = 'bold';
export const backgroundColor = 'rgb(230 235 245 / 17%)';
export const defaultCircleFill = '#1890ff';
export const hoverCircleFill = '#127cdf';

// text上方的文字背景
function drawRect(props: Konva.RectConfig) {
    return new Konva.Rect({
        fill: 'white',
        ...props
    });
}
// text上方的文字背景
function drawCircle(props: Konva.RectConfig) {
    var c = new Konva.Circle({
        radius,
        fill: defaultCircleFill,
        ...props
    });

    return c;
}
function makeOpreateCircle({ selfTable, text, x, y, onCollision, ...other }: Konva.CircleConfig) {

    var group = new MyOperateGroup({
        visible: false,
        name: "opreate",
        x, y,
        selfTable,
        onCollision
    });
    group.add(drawCircle({
        name: "opreate-circle",
        fill: 'grey',
        opacity: 0.2,
        stroke: 'black',
        strokeWidth: 2,
        dash: [2, 2],
        ...other
    }))
    if (text) {
        group.add(drawCenterAlignText({
            text,
            fontSize: operateFontSize,
            fill: 'black',
            name: 'opreate-text',
        }));
        group.add(drawRect({
            width: radius * 2,
            height: tableFontSize + textPadding,
            x: - radius,
            y: - radius - textMargin - textPadding / 2 - tableFontSize,
            stroke: 'black',
            fill: 'black',
            opacity: 0.8,
            strokeWidth: 1,
            shadowOffsetY: 1,
            // shadowBlur: 1,
            shadowColor: "#ccc",
            name: 'opreate-text-coll',
            cornerRadius: 5,

        }));

        group.add(drawCenterAlignText({
            text,
            y: - radius - textMargin - textPadding / 2,
            fontSize: operateFontSize,
            fill: 'white',
            name: 'opreate-text-coll',
            visible: false,
        }));
    }

    return group;
}
function drawCenterAlignText(props: Konva.TextConfig) {
    return new Konva.Text({
        fontSize,
        fontStyle,
        fontFamily,
        fill: 'white',
        align: "center",
        name: 'key-text',
        verticalAlign: 'middle',
        ...props,
        x: - getTextWidth(props.text, (props.fontSize || 0)) / 2 + (props.x || 0),
        y: - (props.fontSize || 0) / 2 + (props.y || 0),
    });
}

function getTextWidth(text: any, fontSize: number) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d") as any;
    context.font = `${fontStyle} ${fontSize}px  ${fontFamily}`;
    var metrics = context?.measureText(text);
    return metrics?.width;
}
export interface TableConfig extends ContainerConfig { }

export class MyBasicCircirGroup extends Konva.Group {
    getKeyCircle(): Konva.Circle {
        return this.findOne('.key-circle')
    }
    collision(r2: Konva.Circle, padding = 5) {
        const r1 = this.getKeyCircle();
        var dx = (r1.getClientRect().x + r1.radius()) - (r2.getClientRect().x + r2.radius());
        var dy = (r1.getClientRect().y + r1.radius()) - (r2.getClientRect().y + r2.radius());
        var distance = Math.sqrt(dx * dx + dy * dy);

        return (distance - padding) < (r1.radius() + r2.radius());
    }
}

// 三个圆为一组 分别是两个隐藏的圆和一个静止的圆
export class MyTableGroup extends MyBasicCircirGroup {
    tableData: Table
    constructor({ tableData, ...other }: any) {
        super(other);
        this.tableData = tableData;
    }
    getOperates(): MyOperateGroup[] {
        return this.find('.opreate');
    }
    startOperate() {
        return this.getOperates().forEach(e => e.show())
    }
    endOperate() {
        return this.getOperates().forEach(e => e.hide())
    }
    checkOperate() {
        return this.getOperates().forEach(e => e.opreateCheck())
    }
    collisionCheck(targetTable: MyTableGroup) {
        if (this === targetTable) {
            return;
        }
        const circle = targetTable.getKeyCircle();
        if (this.collision(circle)) {
            this.startOperate();
            this.getOperates().forEach(g => g.collisionCheck(targetTable))
        } else {
            this.endOperate();
        }
    }
};

export class MyOperateGroup extends MyBasicCircirGroup {
    selfTable: Table
    opsTable?: Table;
    onCollision: (l: Table, r: Table) => {}
    constructor({ selfTable, onCollision, ...other }: any) {
        super(other);
        this.selfTable = selfTable;
        this.onCollision = onCollision;
    }
    getKeyCircle(): Konva.Circle {
        return this.findOne('.opreate-circle')
    }
    opreateCheck() {
        if (this.opsTable) {
            this.onCollision(this.selfTable, this.opsTable);
        }
    }
    active(t: Table) {
        this.opsTable = t;
        this.findOne('.opreate-circle').opacity(1);
        this.find(".opreate-text-coll").forEach(e => e.show());
        this.find(".opreate-text-coll").forEach(e => e.moveToTop());
    }
    unactive() {
        this.opsTable = undefined;
        this.findOne('.opreate-circle').opacity(0.2);
        this.find(".opreate-text-coll").forEach(e => e.hide());
    }
    collisionCheck(targetTable: MyTableGroup) {
        const circle = targetTable.getKeyCircle();
        if (this.collision(circle, -5)) {
            this.active(targetTable.tableData);
        } else {
            this.unactive();
        }
    }
};

export interface Table extends ContainerConfig {
    tableName: string;
    recordCount: number;
    remark?: string;
    onRelative?: (left: Table, right: Table) => any,
    onJoin?: (left: Table, right: Table) => any,
    [x: string]: any;
}
export interface RelatedData {

    left: Table,
    right: Table,
    leftRestCount: number,
    rightRestCount: number,
    corssCount: number,
}
export class Graph {
    stage: Konva.Stage
    layer: Konva.Layer
    constructor(container: HTMLDivElement) {
        this.stage = new Konva.Stage({
            container,
            width: container.clientWidth,
            height: container.clientHeight,
        })

        this.stage.container().style.backgroundColor = backgroundColor;
        this.layer = new Konva.Layer();

        this.stage.add(this.layer);

        this.layer.on('dragstart', function (e: any) {
        })
        this.layer.on('dragend', function (e: any) {
            this.children?.forEach((group: any) => group?.endOperate(group));
            this.children?.forEach((group: any) => group?.checkOperate());

        })

        this.layer.on('dragmove', function (e: any) {
            var targetGroup = e.target;
            targetGroup.moveToTop();
            this.children?.forEach((group: any) => group?.collisionCheck(e.target));
        });
    }

    addTable(t: Table) {

        const { x, y, ...other } = t;
        var group = new MyTableGroup({
            draggable: true,
            x: x || Math.random() * this.stage.width(),
            y: y || Math.random() * this.stage.height(),
            strokeWidth: 1,
            tableData: t,
        });

        group.add(drawRect({
            width: radius * 2,
            height: tableFontSize + textPadding,
            x: - radius,
            y: - radius - textMargin - textPadding / 2 - tableFontSize,
            stroke: '#ccc',
            strokeWidth: 1,
            shadowOffsetY: 1,
            // shadowBlur: 1,
            shadowColor: "#ccc",
            cornerRadius: 5,

        }));

        group.add(drawCenterAlignText({
            y: - radius - textMargin - textPadding / 2,
            fontSize: tableFontSize,
            text: t.tableName,
            fill: 'black',
            name: 'table-text',
        }));


        group.add(makeOpreateCircle({
            x: -radius * 1.5,
            text: '表关联设置',
            selfTable: t,
            onCollision: t.onRelative,
        }));
        group.add(drawCircle({
            name: 'key-circle',
            ...other,
        }));
        group.add(makeOpreateCircle({
            x: radius * 1.5,
            text: '行拼接',
            selfTable: t,
            onCollision: t.onJoin,
        }));

        group.add(drawCenterAlignText({
            text: t.recordCount + '',
            fontSize,
            fill: 'white',
            name: 'record-text',
        }));
        this.layer.add(group);
    }

    showRelative(related: RelatedData) {
        const stage = this.stage;
        const textFontSize = 12;
        const numberFontSize = 16;

        // 计算中间数字所占宽度
        const crossX = (getTextWidth(related.corssCount + "", numberFontSize) + textPadding * 3) / 2;

        var group = new MyBasicCircirGroup({
            draggable: true,
            x: this.stage.width() / 2,
            y: this.stage.height() / 2,
        });

        // 左边圆 
        var leftGroup = new MyBasicCircirGroup({
        });
        leftGroup.on('click', function (e: any) {
            console.log(related.left);
        })
        leftGroup.on("mouseover", function (e: any) {
            stage.container().style.cursor = 'pointer';
            this.findOne('.relate-left').opacity(0.5);
        })
        leftGroup.on('mouseleave', function (e: any) {
            stage.container().style.cursor = 'default';
            this.findOne('.relate-left').opacity(0.15);
        })
        group.add(leftGroup);

        var leftX = - relatedRadius + crossX;
        var leftText = related.left.tableName + "-" + (related.left.remark || '');

        leftGroup.add(drawCircle({
            radius: relatedRadius,
            fill: '#000',
            opacity: 0.15,
            x: leftX,
            name: 'relate-left',
            ...related.left
        }));
        leftGroup.add(drawCenterAlignText({
            x: - (getTextWidth(leftText, textFontSize) / 2 + textPadding),
            y: - relatedRadius - textFontSize,
            text: leftText,
            fontSize: textFontSize,
            fill: '#c3c30b',
        }));
        leftGroup.add(drawCenterAlignText({
            x: - 2 * relatedRadius + crossX + getTextWidth(related.leftRestCount + "", numberFontSize) / 2 + textPadding,
            text: related.leftRestCount + "",
            fontSize: numberFontSize,
            fill: '#000',
        }));


        // 右边圆
        var rightGroup = new MyBasicCircirGroup({
        });
        rightGroup.on('click', function (e: any) {
            console.log(related.right);
        })
        rightGroup.on("mouseover", function (e: any) {
            stage.container().style.cursor = 'pointer';
            this.findOne('.relate-right').opacity(0.5);
        })
        rightGroup.on('mouseleave', function (e: any) {
            stage.container().style.cursor = 'default';
            this.findOne('.relate-right').opacity(0.15);
        })
        group.add(rightGroup);
        var rightX = relatedRadius - crossX;
        var rightText = related.right.tableName + "-" + (related.right.remark || '');
        rightGroup.add(drawCircle({
            fill: '#000',
            opacity: 0.15,
            radius: relatedRadius,
            name: 'relate-right',
            x: rightX,
            ...related.right
        }))
        rightGroup.add(drawCenterAlignText({
            x: + getTextWidth(rightText, textFontSize) / 2 + textPadding,
            y: - relatedRadius - textFontSize,
            text: rightText,
            fontSize: textFontSize,
            fill: 'green',
        }));
        rightGroup.add(drawCenterAlignText({
            x: 2 * relatedRadius - crossX - getTextWidth(related.rightRestCount + "", numberFontSize) / 2 - textPadding,
            text: related.rightRestCount + "",
            fontSize: numberFontSize,
            fill: '#000',
        }));

        // 计算扇形角度 分数表示
        const crossAngle = Math.acos((relatedRadius - crossX) / relatedRadius) / (2 * Math.PI);

        // 计算元数据开始角 和 结束角 弧度表示
        const leftAngelStart = 0 / 360 - crossAngle;
        const leftAngelEnd = 0 / 360 + crossAngle;
        const rightAngelStart = 180 / 360 - crossAngle;
        const rightAngelEnd = 180 / 360 + crossAngle;
        //  弧度表示
        const leftRadianslStart = 2 * Math.PI * leftAngelStart;
        const leftRadianslEnd = 2 * Math.PI * leftAngelEnd;
        const rightRadiansStart = 2 * Math.PI * rightAngelStart;
        const rightRadianslEnd = 2 * Math.PI * rightAngelEnd;

        var centerGroup = new MyBasicCircirGroup({
        });
        centerGroup.on('click', function (e: any) {
            console.log(related.right);
        })
        centerGroup.on("mouseover", function (e: any) {
            stage.container().style.cursor = 'pointer';
            const csArc = this.findOne('.cross-arc') as any;
            console.log(csArc);

            csArc.fill(hoverCircleFill);
        })
        centerGroup.on('mouseleave', function (e: any) {
            stage.container().style.cursor = 'default';
            const csArc = this.findOne('.cross-arc') as any;
            csArc.fill(defaultCircleFill);
        })
        group.add(centerGroup);
        var crossShape = new Konva.Shape({
            fill: defaultCircleFill,
            name: 'cross-arc',
            sceneFunc(context, shape) {
                context.beginPath();
                context.arc(leftX, 0, relatedRadius, leftRadianslStart, leftRadianslEnd, false);
                context.closePath();
                context.fillStrokeShape(shape);
                context.beginPath();
                context.arc(rightX, 0, relatedRadius, rightRadiansStart, rightRadianslEnd, false);
                context.closePath();
                context.fillStrokeShape(shape);
            }
        })
        // 画左右两块不完整扇形
        centerGroup.add(crossShape);
        // 画出两条白色弧线 假装边框
        centerGroup.add(new Konva.Shape({
            fill: 'red',
            stroke: 'white',
            strokeWidth: 6,
            sceneFunc(context, shape) {
                context.beginPath();
                context.arc(leftX, 0, relatedRadius - 3, leftRadianslStart, leftRadianslEnd, false);
                context.strokeShape(shape);
                context.beginPath();
                context.arc(rightX, 0, relatedRadius - 3, rightRadiansStart, rightRadianslEnd, false);
                context.strokeShape(shape);
            }
        }));
        // 中间文字
        centerGroup.add(drawCenterAlignText({
            text: related.corssCount + "",
            fontSize: numberFontSize,
            fill: '#fff',
        }));


        this.layer.add(group)
    }
}

export default {
    MyOperateGroup,
    MyTableGroup,
    MyBasicCircirGroup,
}