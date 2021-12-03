/*
 * @Author: shixia.ds
 * @Date: 2021-11-23 15:41:41
 * @Description:
 */
import G6, { IItemBaseConfig, Item, ModelConfig } from '@antv/g6';
import React, { useEffect, useState } from 'react';
import { OriginData } from './data';
import serverblue from '@/assets/imgs/serverblue.svg';
import serverred from '@/assets/imgs/serverred.svg';
import serveryellow from '@/assets/imgs/serveryellow.svg';

const Topo = (props: any) => {
  let graph = null as any;
  const { onAppClick } = props;
  const { uniqueId } = G6.Util;

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

  let expandArr: any = [];
  let comboArr: any = [];
  let nodeMap = new Map();
  const DANGER_COLOR = '#F54F37';
  const WARNING_COLOR = '#FFC21A';
  const NORMAL_COLOR = '#3692FD';

  const DANGER_COLOR_Fill = '#FEEDEB';
  const WARNING_COLOR_Fill = '#FFF8E8';
  const NORMAL_COLOR_Fill = '#EAF4FE';

  interface IColor {
    [propName: string]: any;
  }
  const enumcolor: IColor = {
    danger: DANGER_COLOR,
    warning: WARNING_COLOR,
    normal: NORMAL_COLOR,
  };
  const enumfillcolor: IColor = {
    danger: DANGER_COLOR_Fill,
    warning: WARNING_COLOR_Fill,
    normal: NORMAL_COLOR_Fill,
  };
  const iconenum: IColor = {
    warning: serveryellow,
    danger: serverred,
    normal: serverblue,
  };
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
          width: w - 19,
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
          fill: config.basicColor,
          radius: 1.5,
        },
        draggable: true,
        name: 'left-border-shape',
      });
      return container;
    },
    /* 生成树上的 marker */
    createNodeMarker: (group: any, collapsed: any, x: number, y: any) => {
      group.addShape('circle', {
        attrs: {
          x: x - 30,
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
          x: x - 30,
          y,
          r: 7,
          symbol: EXPAND_ICON,
          stroke: 'rgba(0,0,0,0.25)',
          fill: 'rgba(0,0,0,0)',
          lineWidth: 1,
          cursor: 'pointer',
        },
        name: 'collapse-icon',
      });
    },
    // afterDraw: (cfg: any, group: any[]) => {
    //   /* 操作 marker 的背景色显示隐藏 */
    //   const icon = group.find((element: { get: (arg0: string) => string }) => element.get('name') === 'collapse-icon');
    //   if (icon) {
    //     const bg = group.find(
    //       (element: { get: (arg0: string) => string }) => element.get('name') === 'collapse-icon-bg',
    //     );
    //     icon.on('mouseenter', () => {
    //       bg.attr('opacity', 1);
    //       graph.get('canvas').draw();
    //     });
    //     icon.on('mouseleave', () => {
    //       bg.attr('opacity', 0);
    //       graph.get('canvas').draw();
    //     });
    //   }
    // },

    setState: (name?: string | undefined, value?: string | boolean | undefined, item?: any) => {
      const group = item.get('group');
      const cfg = item['_cfg'];
      if (name === 'hover') {
        const fillShape = group.find((e: { get: (arg0: string) => string }) => e.get('name') === 'rect-shape');
        if (value) {
          fillShape?.attr('fill', enumfillcolor[cfg.model.status || 'normal']);
        } else {
          fillShape?.attr('fill', 'white');
        }
      }
    },
  };

  const getNodeConfig = (node: any | undefined) => {
    let config = {
      basicColor: enumcolor[node.status || 'normal'],
      fontColor: enumcolor[node.status || 'normal'],
      // fontColor: 'black',
      borderColor: enumcolor[node.status || 'normal'],
      bgColor: '#C6E5FF',
    };
    return config;
  };

  G6.registerNode(
    'card-node',
    {
      /**
       * 绘制节点，包含文本
       * @param  {Object} cfg 节点的配置项
       * @param  {G.Group} group 图形分组，节点中图形对象的容器
       * @return {G.Shape} 返回一个绘制的图形作为 keyShape，通过 node.get('keyShape') 可以获取。
       * 关于 keyShape 可参考文档 核心概念-节点/边/Combo-图形 Shape 与 keyShape
       */
      draw: (cfg: any, group: any) => {
        const config = getNodeConfig(cfg);
        /* the biggest rect */
        const container = nodeBasicMethod.createNodeBox(group, config, 243, 60);

        /* name */
        group?.addShape('text', {
          attrs: {
            text: cfg?.name || cfg?.id,
            x: 19,
            y: 30,
            fontSize: 14,
            fontWeight: 700,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: config.fontColor,
            cursor: 'pointer',
          },
          name: 'name-text-shape',
        });

        nodeBasicMethod.createNodeMarker(group, cfg.collapsed, 236, 32);
        return container;
      },
      // afterDraw: nodeBasicMethod.afterDraw,
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
   * desc：自定义combo
   */
  G6.registerCombo(
    'card-combo',
    {
      drawShape: function drawShape(cfg: any, group: any) {
        const self = this;
        // Get the padding from the configuration
        cfg.padding = cfg.padding || [50, 20, 20, 20];
        cfg.status = cfg.status || 'normal';
        const style = self.getShapeStyle(cfg);
        const r = 2;
        const shape = group.addShape('rect', {
          attrs: {
            ...style,
            x: -style.width / 2 - (cfg.padding[3] - cfg.padding[1]) / 2,
            y: -style.height / 2 - (cfg.padding[0] - cfg.padding[2]) / 2,
            stroke: enumcolor[cfg.status],
            radius: r,
          },
          name: 'main-box',
          draggable: true,
        });

        group.addShape('rect', {
          attrs: {
            ...style,
            x: -style.width / 2 - (cfg.padding[3] - cfg.padding[1]) / 2,
            y: -style.height / 2 - (cfg.padding[0] - cfg.padding[2]) / 2,
            height: 20,
            fill: enumcolor[cfg.status],
            width: style.width,
            radius: [r, r, 0, 0],
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
            fill: '#fff',
            opacity: 1,
            x: 0,
            y: 0,
            r: 10,
            symbol: COLLAPSE_ICON,
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
          height: 20,
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
   * desc：自定义app node
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
            stroke: enumcolor[cfg.status || 'normal'],
          },
        });
        group.addShape('image', {
          attrs: {
            height: 20,
            img: iconenum[cfg.status || 'normal'],
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
        if (name === 'focus') {
          if (value) {
            shape.attr('shadowBlur', 10);
            shape.attr('shadowColor', enumcolor[cfg.model.status || 'normal']);
            shape.attr('lineWidth', 4);
          } else {
            shape.attr('shadowBlur', 0);
            shape.attr('shadowColor', '');
            shape.attr('lineWidth', 3);
          }
        } else if (name == 'active') {
          if (value) {
            shape.attr('shadowBlur', 10);
            shape.attr('shadowColor', enumcolor[cfg.model.status || 'normal']);
          } else {
            const state = item.hasState('focus');
            if (!state) {
              shape.attr('shadowBlur', 0);
              shape.attr('shadowColor', '');
              shape.attr('lineWidth', 3);
            }
          }
        }
      },
    },
    'circle',
  );

  G6.registerEdge(
    'can-running',
    {
      setState(name?: string | undefined, value?: string | boolean | undefined, item?: Item | undefined) {
        const shape = item?.get('keyShape');
        const cfg: any = item?._cfg || {};
        const status = cfg?.model?.status || 'normal';
        if (name === 'focus') {
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
                  stroke: enumcolor[status],
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
            // shape.attr('stroke', enumcolor[status]);
          }
        }
      },
    },
    'line',
  );

  const tooltip = new G6.Tooltip({
    offsetX: 10,
    offsetY: 10,
    // the types of items that allow the tooltip show up
    // 允许出现 tooltip 的 item 类型
    itemTypes: ['node'],
    // custom the tooltip's content
    // 自定义 tooltip 内容
    getContent: (e: any) => {
      const outDiv = document.createElement('div');
      outDiv.style.width = 'fit-content';
      //outDiv.style.padding = '0px 0px 20px 0px';
      outDiv.innerHTML = `
        <ul>
          <li>Type: ${e.item.getType()}</li>
        </ul>
        <ul>
          <li>Label: ${e.item?.getModel().label || e.item?.getModel().id}</li>
        </ul>`;
      return outDiv;
    },
  });

  useEffect(() => {
    const container = document.getElementById('topo');

    const width = container?.scrollWidth;
    const height = 600;
    if (!graph) {
      graph = new G6.Graph({
        container: 'topo',
        width,
        height,
        // linkCenter: true,
        plugins: [tooltip],
        layout: {
          type: 'gForce',
          minMovement: 0.04,
          maxIteration: 5000,
          damping: 0.99,
          nodeSize: 500,
          preventOverlap: true,
          // nodeSpacing: (d: any) => 100,
          focusNode: 'li',
          linkDistance: (d: any) => {
            const sourceNode = nodeMap.get(d.source);
            const targetNode = nodeMap.get(d.target);
            if (
              sourceNode.nodeType == 'app' &&
              targetNode.nodeType == 'app' &&
              sourceNode.nodeRegionCode == targetNode.nodeRegionCode
            ) {
              return 50;
            }
            return 400;
          },
          nodeSpacing: (d: any) => {
            if (d.nodeType === 'app') return 10;
            if (d.nodeType == 'region') return 100;
            return 100;
          },
          edgeStrength: (d: any) => {
            const sourceNode = nodeMap.get(d.source);
            const targetNode = nodeMap.get(d.source);
            // 聚合节点之间的引力小
            if (sourceNode.nodeType == 'region' && targetNode.nodeType == 'region') {
              return 25;
            }
            if (
              sourceNode.nodeType == 'app' &&
              targetNode.nodeType == 'app' &&
              sourceNode.nodeRegionCode == targetNode.nodeRegionCode
            ) {
              return 50;
            }
            return 25;
          },
          nodeStrength: (d: any) => {
            if (d.nodeType == 'region') return 3000;
            return 1000;
          },
        },
        defaultCombo: {
          type: 'cRect',
          // fixSize: [500, 300],
          labelCfg: {
            refY: 2,
            style: {
              fill: '#fff',
              fontSize: 14,
              fontWeight: 700,
            },
          },
        },
        comboStateStyles: {
          dragenter: {
            lineWidth: 4,
            stroke: '#FE9797',
          },
        },
        modes: {
          default: ['drag-combo', 'drag-node', 'drag-canvas', 'zoom-canvas'],
        },
        defaultNode: {
          /* node type */
          type: 'app-node',
          /* node size */
          size: 50,
          /* style for the keyShape */
          style: {
            fill: '#9EC9FF',
            stroke: '#5B8FF9',
            lineWidth: 3,
          },
          labelCfg: {
            /* label's position, options: center, top, bottom, left, right */
            position: 'bottom',
            /* label's offset to the keyShape, 4 by default */
            //   offset: 12,
            /* label's style */
            //   style: {
            //     fontSize: 20,
            //     fill: '#ccc',
            //     fontWeight: 500
            //   }
          },
          /* icon configuration */
          icon: {
            show: true,
            img: serverblue,
          },
        },
        defaultEdge: {
          type: 'can-running',
          size: 1,
          // style: {
          //   stroke: '#e2e2e2',
          //   lineAppendWidth: 2,
          //   cursor: 'pointer',
          //   endArrow: {
          //     path: G6.Arrow.triangle(),
          //     fill: '#e2e2e2',
          //   },
          // },
        },
        nodeStateStyles: {
          // node style of active state
          active: {
            fillOpacity: 0.2,
          },
          // node style of selected state
          selected: {
            lineWidth: 5,
            fillOpacity: 0.2,
          },
          focus: {
            lineWidth: 5,
            fillOpacity: 0.2,
          },
        },
        edgeStateStyles: {
          selected: {
            // stroke: '#e2e2e2',
            // fill: '#e2e2e2',
            // lineWidth: 3,
          },
          focus: {
            lineWidth: 5,
            fillOpacity: 0.2,
          },
        },
      });
      // graph.get('canvas').set('localRefresh', false);

      const regionData: any[] = [];
      const appData = [];

      OriginData.nodes.forEach((node) => {
        // nodeMap[node.id] = node;
        nodeMap.set(node.id, node);
        if (node.nodeType == 'region') {
          regionData.push(node);
        } else {
          appData.push(node);
        }
      });

      graph.data({ nodes: regionData, edges: OriginData.edges });
      expandArr = regionData;
      graph.render();
      bindListener(graph);
    }
  }, []);

  const bindListener = (graph: any) => {
    graph.on('node:mouseenter', (evt: any) => {
      const { item } = evt;
      graph.setItemState(item, 'active', true);
      graph.setItemState(item, 'hover', true);
    });

    graph.on('node:mouseleave', (evt: any) => {
      const { item } = evt;
      graph.setItemState(item, 'active', false);
      graph.setItemState(item, 'hover', false);
    });

    graph.on('node:click', (evt: any) => {
      const { item } = evt;
      onAppClick(item._cfg.model.id);
      clearFocusItemState(graph);
      graph.setItemState(item, 'focus', true);
      const relatedEdges = item.getEdges();
      relatedEdges.forEach((edge: any) => {
        graph.setItemState(edge, 'focus', true);
      });
    });

    graph.on('canvas:click', (evt: any) => {
      graph.getNodes().forEach((node: any) => {
        graph.clearItemStates(node);
      });
      graph.getEdges().forEach((edge: any) => {
        graph.clearItemStates(edge);
      });
    });

    graph.on('edge:click', (evt: any) => {
      const { item } = evt;
      props.onRedLineClick(item._cfg.model.id);
      graph.setItemState(item, 'focus', true);
    });

    graph.on('collapse-icon:click', (evt: any) => {
      handleExpand(evt);
    });
    graph.on('combo:click', (evt: any) => {
      if (evt.target.get('name') === 'combo-marker-shape') {
        handleCollapse(evt);
      }
    });
  };

  // useEffect(() => {
  //   graph&&bindListener(graph)
  // }, [props.appInfoList])

  const clearFocusItemState = (graph: any) => {
    if (!graph) return;
    clearFocusNodeState(graph);
    clearFocusEdgeState(graph);
  };

  // 清除图上所有节点的 focus 状态及相应样式
  const clearFocusNodeState = (graph: any) => {
    const focusNodes = graph.findAllByState('node', 'focus');
    focusNodes.forEach((fnode: any) => {
      graph.setItemState(fnode, 'focus', false); // false
    });
  };

  // 清除图上所有边的 focus 状态及相应样式
  const clearFocusEdgeState = (graph: any) => {
    const focusEdges = graph.findAllByState('edge', 'focus');
    focusEdges.forEach((fedge: any) => {
      graph.setItemState(fedge, 'focus', false);
    });
  };

  const handleCollapse = (evt: any) => {
    const regionId = evt.item['_cfg']['model']['regionCode'];
    if (regionId) {
      OriginData.nodes.forEach((node) => {
        if (node.id == regionId) {
          expandArr.push(node);
        }
      });
    }

    let comboIdx = comboArr.findIndex((combo: any) => combo.regionCode == regionId);
    comboArr.splice(comboIdx, 1);

    evt.item.changeVisibility(false);
    graph.uncombo(evt.item);

    const newArr = expandArr.filter(
      (item: any) => !item.nodeRegionCode || (item.nodeType !== 'region' && item.nodeRegionCode !== regionId),
    );
    graph.data({ nodes: newArr, edges: OriginData.edges });
    expandArr = newArr;
    graph.render();

    comboArr.forEach((combo: any) => {
      graph.createCombo(
        {
          id: combo.id,
          type: combo.type,
          label: combo.label,
          status: combo.status,
          regionCode: combo.regionCode,
        },
        combo.nodes,
      );
    });
  };

  const handleExpand = (evt: any) => {
    const { item } = evt;
    const model = item && item.getModel();
    let expandIndex = expandArr.findIndex((node: any) => node.id == model.id);
    expandArr.splice(expandIndex, 1);

    const newNode: any[] = [];
    OriginData.nodes.forEach((node) => {
      if (node.nodeRegionCode == model.id) {
        expandArr.push(node);
        newNode.push(node.id);
      }
    });

    let newcombo = {
      id: `combo-${uniqueId()}`,
      label: model.id,
      type: 'card-combo',
      regionCode: model.id,
      status: model.status,
      nodes: newNode,
    };
    comboArr.push(newcombo);

    graph.data({ nodes: expandArr, edges: OriginData.edges });
    graph.render();

    comboArr.forEach((combo: any) => {
      graph.createCombo(
        {
          id: combo.id,
          type: combo.type,
          label: combo.label,
          status: combo.status,
          regionCode: combo.regionCode,
        },
        combo.nodes,
      );
    });
  };

  if (typeof window !== 'undefined')
    window.onresize = () => {
      if (!graph || graph.get('destroyed')) return;
      const container = document.getElementById('topo');
      if (!container) return;
      graph.changeSize(container.scrollWidth, container.scrollHeight - 30);
    };

  useEffect(() => {
    if (!graph || graph.get('destroyed')) return;
    const container = document.getElementById('topo');
    if (!container) return;
    graph.changeSize(container.scrollWidth, container.scrollHeight - 30);
  }, [props.isFullScreen]);

  return <div id="topo" style={{ height: '100%' }}></div>;
};

export default Topo;
