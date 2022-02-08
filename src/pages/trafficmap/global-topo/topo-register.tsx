/*
 * @Author: shixia.ds
 * @Date: 2021-12-07 13:48:42
 * @Description: register custom node edge combo
 */

import React from 'react';
import G6, { Item } from '@antv/g6';
import { APP_STATUS_COLOR_MAP, APP_STATUS_FILL_COLOR_MAP, APP_STATUS_ICON_MAP } from './const';

const APP_NODE_FOCUS_SHADOWBLUR = 10;
const APP_NODE_FOCUS_LineWidth = 3;

const APP_NODE_DEFAULT_SHADOWBLUR = 0;
const APP_NODE_DEFAULT_LINEWIDTH = 2;

const COMBO_RADIUS = 2;
const COMBO_HEADER_HEIGHT = 24;

//hover mouseEnter
const NODE_STATUS_HOVER = 'hover';

//focus click
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

const getRegionNodeConfig = (node: any | undefined) => {
  let config = {
    // fontColor: APP_STATUS_COLOR_MAP[node.status || 'normal'],
    fontColor: '#000000',
    borderColor: APP_STATUS_COLOR_MAP[node.status || 'normal'],
    fillColor: APP_STATUS_FILL_COLOR_MAP[node.status || 'normal'],
  };
  return config;
};
/**
 * region-node
 */
const nodeBasicMethod = {
  createNodeBox: (group: any, config: any, w: number, h: any) => {
    /* 最外面的大矩形 */
    const container = group.addShape('rect', {
      attrs: {
        x: 0,
        y: 0,
        width: w,
        height: h,
      },
      draggable: true,
      name: 'big-rect-shape',
    });
    /* 矩形 */
    group.addShape('rect', {
      attrs: {
        x: 3,
        y: 0,
        width: w,
        height: h,
        fill: 'white',
        stroke: config.borderColor,
        radius: 2,
        // cursor: 'pointer',
      },
      draggable: true,
      name: 'rect-shape',
    });

    // halo for hover
    group.addShape('rect', {
      attrs: {
        x: 0,
        y: 0,
        width: w,
        heigh: h,
        fill: 'black',
        opacity: 1,
        // lineWidth: 0,
      },
      name: 'halo-shape',
      // visible: false,
    });

    /* 左边的粗线 */
    group.addShape('rect', {
      attrs: {
        x: 3,
        y: 0,
        width: 5,
        height: h,
        fill: config.borderColor,
        radius: 1.5,
      },
      draggable: true,
      name: 'left-border-shape',
    });
    return container;
  },

  createNodeMarker: (group: any, collapsed: any, x: number, y: any, config: any) => {
    group.addShape('circle', {
      attrs: {
        x: x - 15,
        y,
        r: 13,
        fill: 'rgba(47, 84, 235, 0.05)',
        opacity: 0,
        zIndex: -2,
      },
      name: 'collapse-icon-bg',
    });
    group.addShape('marker', {
      attrs: {
        x: x - 15,
        y,
        r: 7,
        symbol: EXPAND_ICON,
        stroke: config.borderColor,
        lineWidth: 1,
        cursor: 'pointer',
      },
      name: 'collapse-icon',
    });
  },

  setState: (name?: string | undefined, value?: string | boolean | undefined, item?: any) => {
    const group = item.get('group');
    const cfg = item['_cfg'];
    if (name === NODE_STATUS_HOVER) {
      const fillShape = group.find((e: { get: (arg0: string) => string }) => e.get('name') === 'rect-shape');
      if (value) {
        fillShape?.attr('fill', APP_STATUS_FILL_COLOR_MAP[cfg.model.status || 'normal']);
      } else {
        fillShape?.attr('fill', 'white');
      }
    }
  },
};

if (G6) {
  /**
   * desc：展开前的region
   */
  G6.registerNode(
    'region-node',
    {
      /**
       * 绘制节点，包含文本
       * @param  {Object} cfg 节点的配置项
       * @param  {G.Group} group 图形分组，节点中图形对象的容器
       * @return {G.Shape} 返回一个绘制的图形作为 keyShape，通过 node.get('keyShape') 可以获取。
       */
      draw: (cfg: any, group: any) => {
        const config = getRegionNodeConfig(cfg);
        /* the biggest rect */
        const container = nodeBasicMethod.createNodeBox(group, config, 168, 60);
        /* name */
        group?.addShape('text', {
          attrs: {
            text: cfg?.name || cfg?.id,
            x: 19,
            y: 30,
            fontSize: 14,
            fontWeight: 500,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: config.fontColor,
          },
          draggable: true,
          name: 'name-text-shape',
        });

        nodeBasicMethod.createNodeMarker(group, cfg.collapsed, 168, 32, config);
        return container;
      },

      setState: nodeBasicMethod.setState,

      getAnchorPoints() {
        return [
          [0, 0],
          [0.5, 0],
          [1, 0],
          [0, 0.5],
          [1, 0.5],
          [0, 1],
          [0.5, 1],
          [1, 1],
        ];
      },
    },
    'rect',
  );

  /**
   * desc：自定义combo 展开后的框
   */
  G6.registerCombo(
    'region-combo',
    {
      drawShape: function drawShape(cfg: any, group: any) {
        const self = this;
        cfg.padding = cfg.padding || [50, 20, 20, 20];
        cfg.status = cfg.status || 'normal';
        const style = self.getShapeStyle(cfg);
        const shape = group.addShape('rect', {
          attrs: {
            ...style,
            x: -style.width / 2 - (cfg.padding[3] - cfg.padding[1]) / 2,
            y: -style.height / 2 - (cfg.padding[0] - cfg.padding[2]) / 2,
            stroke: APP_STATUS_COLOR_MAP[cfg.status],
            radius: COMBO_RADIUS,
            opacity: 1,
          },
          name: 'main-box',
          draggable: true,
        });

        group.addShape('rect', {
          attrs: {
            ...style,
            x: -style.width / 2 - (cfg.padding[3] - cfg.padding[1]) / 2,
            y: -style.height / 2 - (cfg.padding[0] - cfg.padding[2]) / 2,
            height: COMBO_HEADER_HEIGHT,
            fill: APP_STATUS_COLOR_MAP[cfg.status],
            width: style.width,
            radius: [COMBO_RADIUS, COMBO_RADIUS, 0, 0],
          },
          name: 'title-box',
          draggable: true,
        });

        /* name */
        // group?.addShape('text', {
        //   attrs: {
        //     text: cfg?.name || cfg?.label,
        //     x: 0.5,
        //     y: -(style.height) / 2,
        //     fontSize: 14,
        //     fontWeight: 700,
        //     textAlign: 'left',
        //     textBaseline: 'middle',
        //     fill: '#fff',
        //     cursor: 'pointer',
        //   },
        //   name: 'name-text-shape',
        // });

        group?.addShape('marker', {
          attrs: {
            ...style,
            storke: '#ffffff',
            fill: 'rgba(255,255,255,0)',
            x: 0,
            y: 0,
            r: 7,
            symbol: COLLAPSE_ICON,
            cursor: 'pointer',
          },
          draggable: true,
          name: 'combo-marker-shape',
        });
        return shape;
      },
      // 定义新增的右侧圆的位置更新逻辑
      afterUpdate: function afterUpdate(cfg?: any, item?: Item | undefined) {
        const self = this;
        const style = self.getShapeStyle(cfg);
        const group = item?.get('group');

        const keyshape = group.find((ele: any) => ele.get('name') === 'main-box');
        keyshape.attr({
          ...style,
        });

        // 在该 Combo 的图形分组根据 name 找到右侧圆图形
        const rect = group.find((ele: any) => ele.get('name') === 'title-box');
        rect.attr({
          x: -style.width / 2 - (cfg.padding[3] - cfg.padding[1]) / 2,
          y: -style.height / 2 - (cfg.padding[0] - cfg.padding[2]) / 2,
          width: style.width,
          height: COMBO_HEADER_HEIGHT,
        });

        const marker = group.find((ele: any) => ele.get('name') === 'combo-marker-shape');
        marker.attr({
          x: style.width / 2 - cfg.padding[1] / 2,
          y: -style.height / 2 - (cfg.padding[0] - cfg.padding[2]) / 2 + 10,
          symbol: cfg?.collapsed ? EXPAND_ICON : COLLAPSE_ICON,
        });
      },
    },
    'rect',
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
            r: 20,
            x: 0,
            y: 0,
            // fill: enumcolor[cfg.status || 'normal'],
            fill: '#fff',
            stroke: APP_STATUS_COLOR_MAP[cfg.status || 'normal'],
            lineWidth: APP_NODE_DEFAULT_LINEWIDTH,
          },
        });
        group.addShape('image', {
          attrs: {
            height: 20,
            img: APP_STATUS_ICON_MAP[cfg.status || 'normal'],
            show: true,
            width: 20,
            x: -10,
            y: -10,
          },
        });
        group.addShape('text', {
          attrs: {},
        });
        return keyShape;
      },

      setState(name: any, value: any, item: any) {
        const cfg = item['_cfg'];
        const group = item.getContainer();
        const shape = group.get('children')[0]; // 顺序根据 draw 时确定
        if (name === NODE_STATUS_FOCUS) {
          if (value) {
            shape.attr('shadowBlur', APP_NODE_FOCUS_SHADOWBLUR);
            shape.attr('shadowColor', APP_STATUS_COLOR_MAP[cfg.model.status || 'normal']);
            shape.attr('lineWidth', APP_NODE_FOCUS_LineWidth);
          } else {
            shape.attr('shadowBlur', APP_NODE_DEFAULT_SHADOWBLUR);
            shape.attr('shadowColor', '');
            shape.attr('lineWidth', APP_NODE_DEFAULT_LINEWIDTH);
          }
        } else if (name == NODE_STATUS_HOVER) {
          if (value) {
            shape.attr('shadowBlur', APP_NODE_FOCUS_SHADOWBLUR);
            shape.attr('shadowColor', APP_STATUS_COLOR_MAP[cfg.model.status || 'normal']);
          } else {
            const state = item.hasState('focus');
            if (!state) {
              shape.attr('shadowBlur', APP_NODE_DEFAULT_SHADOWBLUR);
              shape.attr('shadowColor', '');
              shape.attr('lineWidth', APP_NODE_DEFAULT_LINEWIDTH);
            }
          }
        }
      },
    },
    'circle',
  );

  G6.registerEdge(
    'custom-edge',
    {
      setState(name?: string | undefined, value?: string | boolean | undefined, item?: Item | undefined) {
        const shape = item?.get('keyShape');
        const cfg: any = item?._cfg || {};
        const status = cfg?.model?.status || 'normal';
        if (name === EDGE_STATUS_FOCUS) {
          if (value) {
            let index = 0;
            shape.animate(
              () => {
                index++;
                if (index > 9) {
                  index = 0;
                }
                const res = {
                  lineDash: [4, 4, 4, 4],
                  lineDashOffset: -index,
                  lineWidth: 2,
                  stroke: APP_STATUS_COLOR_MAP[status] || APP_STATUS_COLOR_MAP['normal'],
                };
                // return the params for this frame
                return res;
              },
              {
                repeat: true,
                duration: 3000,
              },
            );
          } else {
            shape.stopAnimate();
            shape.attr('lineWidth', 1);
          }
        }
      },
    },
    'line',
  );
}

const reacComponent = () => {
  return <></>;
};

export default reacComponent;
