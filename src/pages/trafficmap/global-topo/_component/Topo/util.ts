import React from 'react';
import G6, { Item } from '@antv/g6';
import { Node, Edge } from './common';
import serverblue from '@/assets/imgs/serverblue.svg';
import serverred from '@/assets/imgs/serverred.svg';
import serveryellow from '@/assets/imgs/serveryellow.svg';

export const findNode = (id: any, nodes: any) => nodes.find((e: any) => e.id == id) as Node;
const calcMarkerPostion = (r: number, radius = 45) => ({ x: r * Math.cos(radius), y: -r * Math.sin(radius) });

export const APP_STATUS_ICON_MAP: any = {
    warning: serveryellow,
    dangerous: serverred,
    normal: serverblue,
};
export const APP_STATUS_COLOR: any = {
    dangerous: '#F54F37',
    warning: '#FFC21A',
    normal: '#3692FD',
};
const APP_STATUS_FILL_COLOR: any = {
    dangerous: '#FEEDEB',
    warning: '#faf7b1',
    normal: '#EAF4FE',
};

const NODE_STATUS_HOVER = 'hover';
const NODE_STATUS_FOCUS = 'focus';
const EDGE_STATUS_FOCUS = 'focus';

const COLLAPSE_ICON = function COLLAPSE_ICON(x: number, y: any, r: number) {
    return [
        ['M', x - r, y],
        ['a', r, r, 0, 1, 0, r * 2, 0],
        ['a', r, r, 0, 1, 0, -r * 2, 0],
        ['M', x - r + 4, y],
        ['L', x - r + 2 * r - 4, y],
    ];
};
const EXPAND_ICON = function EXPAND_ICON(x: number, y: number, r: number) {
    return [
        ['M', x - r, y],
        ['a', r, r, 0, 1, 0, r * 2, 0],
        ['a', r, r, 0, 1, 0, -r * 2, 0],
        ['M', x - r + 4, y],
        ['L', x - r + 2 * r - 4, y],
        ['M', x - r + r, y - r + 4],
        ['L', x, y + r - 4],
    ];
};

/**
 * 节点 单独样式设置
 * @param node
 * @returns
 */
export const nodeStyled: any = (node: Node) => {
    const { type, status } = node;
    const res = {
        // type: nodeType === 'region' ? '' : 'app-node',
        style: {
            fill: APP_STATUS_FILL_COLOR[status || 'normal'],
            stroke: APP_STATUS_COLOR[status || 'normal'],
        },
        stateStyles: {
            focus: {
                shadowBlur: APP_NODE_FOCUS_SHADOWBLUR,
                shadowColor: APP_STATUS_COLOR[status || 'normal'],
                lineWidth: APP_NODE_FOCUS_LineWidth,
                opacity: 1,
            },
            hover: {
                shadowBlur: APP_NODE_FOCUS_SHADOWBLUR,
                shadowColor: APP_STATUS_COLOR[status || 'normal'],
                opacity: 0.8,
            },
        },
    };
    return res;
};

/**
 * combo 单独样式设置
 * @param node
 * @returns
 */
export const comboStyled: any = (node: Node) => {
    const { region, status } = node;
    const res = {
        nodeRegion: region,
        label: region,
        labelCfg: {
            refY: 5,
            position: 'top',
            style: {
                fill: 'black',
                stroke: 'black',
                fontSize: 14,
            },
        },
        style: {
            fill: '#fff',
        },
    };
    return res;
};

/**
 * 边 单独样式设置
 * @param node
 * @returns
 */
export const edgeStyled: any = (edge: Edge) => {
    const { status, isReal } = edge;
    const opacity = isReal ? realEdgeOpacity : virtualEdgeOpacity;
    const arrowWidth = 2;
    const arrowLength = 5;
    const arrowBeging = 10 + arrowLength;
    let arrowPath = `M ${arrowBeging},0 L ${arrowBeging + arrowLength},-${arrowWidth} L ${arrowBeging + arrowLength
        },${arrowWidth} Z`;
    let d = 10 + arrowLength;

    return {
        style: {
            ...(arrowStyleType[status] || arrowStyleType['normal']),
            // strokeOpacity: opacity,
            // opacity: opacity,
        },
    };
};

const DANGEROUS_COLOR = '#F5222D';
const WARNING_COLOR = '#FFC020';
const NORMAL_COLOR = '#3592FE';
export const arrowStyleType: any = {
    dangerous: {
        stroke: DANGEROUS_COLOR,
        defaultColor: DANGEROUS_COLOR,
        lineAppendWidth: 10,
        cursor: 'pointer',
        lineDash: [4, 4, 4, 4],
        lineWidth: 1,
        endArrow: {
            path: G6.Arrow.triangle(8, 8),
            fill: DANGEROUS_COLOR,
            // strokeOpacity: 0,
        },
    },
    warning: {
        stroke: WARNING_COLOR,
        defaultColor: WARNING_COLOR,
        lineAppendWidth: 10,
        cursor: 'pointer',
        lineDash: [4, 4, 4, 4],
        lineWidth: 1,
        endArrow: {
            path: G6.Arrow.triangle(8, 8),
            fill: WARNING_COLOR,
            // strokeOpacity: 0,
        },
    },
    normal: {
        stroke: NORMAL_COLOR,
        defaultColor: NORMAL_COLOR,
        lineAppendWidth: 10,
        cursor: 'pointer',
        lineDash: [4, 4, 4, 4],
        lineWidth: 1,
        endArrow: {
            path: G6.Arrow.triangle(8, 8),
            fill: NORMAL_COLOR,
            // strokeOpacity: 0,
        },
    },
};

const APP_NODE_FOCUS_SHADOWBLUR = 5;
const APP_NODE_FOCUS_LineWidth = 2;

const APP_NODE_DEFAULT_SHADOWBLUR = 0;
const APP_NODE_DEFAULT_LINEWIDTH = 3;

// 截断文本
export const formatText = (text: string, length = 5, elipsis = '...') => {
    if (!text) return '';
    if (text.length > length) {
        return `${text.substr(0, length)}${elipsis}`;
    }
    return text;
};

const duration = 2000;
const animateOpacity = 0.9;
const animateBackOpacity = 0.1;
const virtualEdgeOpacity = 0.5;
const realEdgeOpacity = 0.5;

if (G6) {
    /**
     * desc：展开前的region
     */
    G6.registerNode(
        'region-node',
        {
            draw: (cfg: any, group: any) => {
                const { status } = cfg;
                let config = {
                    fontColor: '#000000',
                    borderColor: APP_STATUS_COLOR[status || 'normal'],
                    fillColor: APP_STATUS_FILL_COLOR[status || 'normal'],
                };
                const keyShape = group.addShape('circle', {
                    attrs: {
                        r: 40,
                        fill: APP_STATUS_FILL_COLOR[status || 'normal'],
                        stroke: APP_STATUS_COLOR[status || 'normal'],
                        zIndex: -2,
                    },
                    name: 'collapse-icon-bg',
                });
                group.addShape('marker', {
                    attrs: {
                        ...calcMarkerPostion(40),
                        r: 7,
                        symbol: EXPAND_ICON,
                        stroke: 'white',
                        lineWidth: 1,
                        fill: config.borderColor,
                        cursor: 'pointer',
                    },
                    name: 'collapse-icon',
                });
                /* name */
                group?.addShape('text', {
                    attrs: {
                        text: cfg?.label || cfg?.id,
                        x: 0,
                        y: 0,
                        fontSize: 14,
                        fontWeight: 500,
                        textAlign: 'center',
                        textBaseline: 'middle',
                        fill: config.fontColor,
                    },
                    draggable: true,
                    name: 'name-text-shape',
                });

                return keyShape;
            },
            // 防止 state 更新的时候，调用原生的渲染方法
            update: undefined,
            setState: (name?: string | undefined, value?: string | boolean | undefined, item?: any) => {
                const group = item.get('group');
                const cfg = item['_cfg'];
                if (name === NODE_STATUS_HOVER) {
                    const fillShape = group.find((e: { get: (arg0: string) => string }) => e.get('name') === 'rect-shape');
                    if (value) {
                        fillShape?.attr('fill', APP_STATUS_FILL_COLOR[cfg.model.status || 'normal']);
                    } else {
                        fillShape?.attr('fill', 'white');
                    }
                }
            },
        },
        'circle',
    );
    G6.registerCombo(
        'region-combo',
        {
            setState: () => { },
            drawShape: function drawShape(cfg: any, group: any) {
                const self = this;
                cfg.padding = cfg.padding || [50, 20, 20, 20];
                cfg.status = cfg.status || 'normal';
                const style = self.getShapeStyle(cfg);
                const shape = group.addShape('circle', {
                    attrs: {
                        ...style,
                    },
                    name: 'region-box',
                    draggable: true,
                });

                group?.addShape('marker', {
                    attrs: {
                        ...style,
                        stroke: '#fff',
                        fill: '#91908d',
                        r: 7,
                        ...calcMarkerPostion(style.r, -225),
                        symbol: COLLAPSE_ICON,
                        cursor: 'pointer',
                    },
                    draggable: true,
                    name: 'combo-marker-shape',
                });
                return shape;
            },
            // 当combo发生变化时 让图标也跟着更新位置
            afterUpdate: function afterUpdate(cfg?: any, item?: Item | undefined) {
                const self = this;
                const style = self.getShapeStyle(cfg);
                const group = item?.get('group');
                const keyshape = group.find((ele: any) => ele.get('name') === 'region-box');
                keyshape.attr({
                    ...style,
                    symbol: COLLAPSE_ICON,
                    cursor: 'pointer',
                });
                const marker = group.find((ele: any) => ele.get('name') === 'combo-marker-shape');
                marker.attr({
                    ...calcMarkerPostion(style.r, -225),
                    symbol: COLLAPSE_ICON,
                });
            },
        },
        'circle',
    );
    /**
     * desc：自定义app node 圆形
     */
    G6.registerNode(
        'app-node',
        {
            draw(cfg: any, group: any) {
                const { style } = cfg;
                const keyShape = group.addShape('circle', {
                    attrs: {
                        ...style,
                        r: 15,
                        x: 0,
                        y: 0,
                        fill: '#fff',
                        stroke: APP_STATUS_COLOR[cfg.status || 'normal'],
                        lineWidth: 1,
                        opacity: 0.7,
                        text: cfg.text,
                    },
                    draggable: true,
                    name: 'app-node-bg',
                });
                group.addShape('image', {
                    draggable: true,
                    name: 'app-node-icon',
                    attrs: {
                        height: 15,
                        img: APP_STATUS_ICON_MAP[cfg.status || 'normal'],
                        show: true,
                        width: 15,
                        x: -7.5,
                        y: -7.5,
                    },
                });
                if (cfg.label) {
                    const text = cfg.label;
                    let labelStyle: any = {};
                    let refY = 0;
                    if (cfg.labelCfg) {
                        labelStyle = Object.assign(labelStyle, cfg.labelCfg.style);
                        refY += cfg.labelCfg.refY || 0;
                    }
                    let offsetY = 0;
                    const fontSize = labelStyle.fontSize < 8 ? 8 : labelStyle.fontSize;
                    const lineNum = (cfg.labelLineNum as number) || 1;
                    offsetY = lineNum * (fontSize || 12);

                    group.addShape('text', {
                        draggable: true,
                        name: 'name-text-shape',
                        className: 'text-shape',
                        attrs: {
                            text,
                            x: 0,
                            // y: 25 + refY + offsetY ,//文字在下面
                            y: refY + offsetY - 35,
                            textAlign: 'center',
                            textBaseLine: 'alphabetic',
                            cursor: 'pointer',
                            fontSize,
                            fill: APP_STATUS_ICON_MAP[cfg.status || 'normal'],
                            opacity: 0.2,
                            // fontWeight: 100,
                            // fill:"#666"
                            stroke: APP_STATUS_ICON_MAP[cfg.status || 'normal'],
                        },
                    });
                }
                return keyShape;
            },
            // 防止 state 更新的时候，调用原生的渲染方法
            update: undefined,

            setState(name: any, value: any, item: any) {
                const cfg = item['_cfg'];
                const group = item.getContainer();
                const shape = group.get('children')[0]; // 顺序根据 draw 时确定
                if (name === NODE_STATUS_FOCUS) {
                    if (value) {
                        shape.attr('shadowBlur', APP_NODE_FOCUS_SHADOWBLUR);
                        shape.attr('shadowColor', APP_STATUS_COLOR[cfg.model.status || 'normal']);
                        shape.attr('lineWidth', APP_NODE_FOCUS_LineWidth);
                    } else {
                        // shape.attr('shadowBlur', APP_NODE_DEFAULT_SHADOWBLUR);
                        shape.attr('shadowColor', '');
                        shape.attr('lineWidth', 1);
                    }
                } else if (name == NODE_STATUS_HOVER) {
                    if (value) {
                        shape.attr('shadowBlur', APP_NODE_FOCUS_SHADOWBLUR);
                        shape.attr('shadowColor', APP_STATUS_COLOR[cfg.model.status || 'normal']);
                        shape.attr('lineWidth', APP_NODE_DEFAULT_LINEWIDTH);
                    } else {
                        shape.attr('lineWidth', 1);
                        const state = item.hasState('focus');
                        if (!state) {
                            shape.attr('shadowBlur', APP_NODE_DEFAULT_SHADOWBLUR);
                            shape.attr('shadowColor', '');
                            // shape.attr('lineWidth', APP_NODE_DEFAULT_LINEWIDTH);
                        }
                    }
                }
            },
        },
        'circle',
    );

    // 自定义边
    G6.registerEdge(
        'custom-line',
        {
            setState: (name: any, value: any, item: any) => {
                const group = item.get('group');
                const model = item.getModel();
                if (name === 'focus') {
                    const keyShape = group.find((ele: any) => ele.get('name') === 'edge-shape');
                    const back = group.find((ele: any) => ele.get('name') === 'back-line');
                    if (back) {
                        back.stopAnimate();
                        back.remove();
                        back.destroy();
                    }
                    const arrow: any = model.style.endArrow;
                    if (value) {
                        if (keyShape.cfg.animation) {
                            keyShape.stopAnimate(true);
                        }
                        keyShape.attr({
                            strokeOpacity: animateOpacity,
                            opacity: animateOpacity,
                            stroke: model.style.defaultColor,
                            endArrow: {
                                ...arrow,
                                stroke: model.style.defaultColor,
                                fill: model.style.defaultColor,
                            },
                        });
                        if (model.isReal) {
                            const { path, stroke, lineWidth = 4 } = keyShape.attr();
                            const back = group.addShape('path', {
                                attrs: {
                                    path,
                                    stroke,
                                    lineWidth,
                                    opacity: animateBackOpacity,
                                },
                                name: 'back-line',
                            });
                            back.toBack();
                            const length = keyShape.getTotalLength();
                            keyShape.animate(
                                (ratio: any) => {
                                    const startLen = ratio * length;
                                    const cfg = {
                                        lineDash: [startLen, length - startLen],
                                    };
                                    return cfg;
                                },
                                {
                                    repeat: true,
                                    duration,
                                },
                            );
                        } else {
                            const lineDash = keyShape.attr('lineDash');
                            const totalLength = lineDash[0] + lineDash[1];
                            let index = 0;
                            keyShape.animate(
                                () => {
                                    index++;
                                    if (index > totalLength) {
                                        index = 0;
                                    }
                                    const res = {
                                        lineDash,
                                        lineDashOffset: -index,
                                    };
                                    return res;
                                },
                                {
                                    repeat: true,
                                    duration,
                                },
                            );
                        }
                    } else {
                        keyShape.stopAnimate();

                        const stroke = model.style.defaultColor;
                        const opacity = model.isReal ? realEdgeOpacity : virtualEdgeOpacity;
                        keyShape.attr({
                            stroke,
                            strokeOpacity: opacity,
                            opacity: opacity,
                            lineDash: [4, 4, 4, 4],
                            lineWidth: 1,
                            endArrow: {
                                ...arrow,
                                stroke,
                                fill: stroke,
                            },
                        });
                    }
                }
            },
        },
        'quadratic',
    );
}

export default {
    formatText,
};