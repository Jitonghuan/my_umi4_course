/*
 * @Author: shixia.ds
 * @Date: 2021-11-23 15:41:41
 * @Description:
 */
import G6, { ModelConfig } from '@antv/g6';
import React, { useEffect, useState } from 'react';
import { OriginData } from './data';

const Topo = () => {
  const [loading, setLoading] = useState(false);

  const ref = React.useRef(null);
  let graph = null as any;
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

  let expandArr = [];
  let comboArr = [];
  const DANGER_COLOR = '#F5222D';
  const WARNING_COLOR = '#FFC020';
  const NORMAL_COLOR = '#3592FE';

  const enumcolor = {
    danger: DANGER_COLOR,
    warning: WARNING_COLOR,
    normal: NORMAL_COLOR,
  };

  const nodeBasicMethod = {
    createNodeBox: (
      group: {
        addShape: (
          arg0: string,
          arg1: {
            attrs:
              | { x: number; y: number; width: any; heigh: any }
              | {
                  x: number;
                  y: number;
                  width: number;
                  height: any;
                  fill: string;
                  stroke: any;
                  radius: number;
                  cursor: string;
                }
              | { x: number; y: number; width: any; heigh: any; fill: string; opacity: number }
              | { x: number; y: number; width: number; height: any; fill: any; radius: number };
            name: string;
          },
        ) => void;
      },
      config: { borderColor: any; basicColor: any },
      w: number,
      h: any,
      isRoot: any,
    ) => {
      /* 最外面的大矩形 */
      const container = group.addShape('rect', {
        attrs: {
          x: 0,
          y: 0,
          width: w,
          heigh: h,
        },
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
        name: 'left-border-shape',
      });
      return container;
    },
    /* 生成树上的 marker */
    createNodeMarker: (
      group: {
        addShape: (
          arg0: string,
          arg1: {
            attrs:
              | { x: number; y: any; r: number; fill: string; opacity: number; zIndex: number }
              | {
                  x: number;
                  y: any;
                  r: number;
                  symbol:
                    | ((x: number, y: any, r: number) => any[][])
                    | ((x: number, y: number, r: number) => (string | number)[][]);
                  stroke: string;
                  fill: string;
                  lineWidth: number;
                  cursor: string;
                };
            name: string;
          },
        ) => void;
      },
      collapsed: any,
      x: number,
      y: any,
    ) => {
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
    afterDraw: (cfg: any, group: any[]) => {
      /* 操作 marker 的背景色显示隐藏 */
      const icon = group.find((element: { get: (arg0: string) => string }) => element.get('name') === 'collapse-icon');
      if (icon) {
        const bg = group.find(
          (element: { get: (arg0: string) => string }) => element.get('name') === 'collapse-icon-bg',
        );
        icon.on('mouseenter', () => {
          bg.attr('opacity', 1);
          graph.get('canvas').draw();
        });
        icon.on('mouseleave', () => {
          bg.attr('opacity', 0);
          graph.get('canvas').draw();
        });
      }
    },

    setState: (name: string, value: any, item: { [x: string]: any; get: (arg0: string) => any }) => {
      const group = item.get('group');
      const cfg = item['_cfg'];
      if (name === 'hover') {
        const fillShape = group.find((e: { get: (arg0: string) => string }) => e.get('name') === 'rect-shape');
        if (value) {
          fillShape.attr('fill', enumcolor[cfg.model.status || 'normal']);
          fillShape.attr('opacity', 0.2);
        } else {
          fillShape.attr('fill', 'white');
          fillShape.attr('opacity', 1);
        }
      }
    },
  };

  const getNodeConfig = (node: ModelConfig | undefined) => {
    let config = {
      basicColor: enumcolor[node.status || 'normal'],
      fontColor: enumcolor[node.status || 'normal'],
      // fontColor: 'black',
      borderColor: enumcolor[node.status || 'normal'],
      bgColor: '#C6E5FF',
    };
    return config;
  };

  G6.registerNode('card-node', {
    draw: (cfg, group) => {
      const config = getNodeConfig(cfg);
      const isRoot = cfg?.dataType === 'root';
      /* the biggest rect */
      const container = nodeBasicMethod.createNodeBox(group, config, 243, 60, isRoot);

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
    afterDraw: nodeBasicMethod.afterDraw,
    setState: nodeBasicMethod.setState,
  });

  G6.registerCombo(
    'card-combo',
    {
      drawShape: function drawShape(cfg, group) {
        const self = this;
        // Get the padding from the configuration
        cfg.padding = cfg.padding || [50, 20, 20, 20];
        // Get the shape's style, where the style.width and style.height correspond to the width and height in the figure of Illustration of Built-in Rect Combo
        const style = self.getShapeStyle(cfg);
        const color = cfg.error ? '#F4664A' : '#30BF78';
        const r = 2;
        const shape = group.addShape('rect', {
          attrs: {
            ...style,
            x: -style.width / 2 - (cfg.padding[3] - cfg.padding[1]) / 2,
            y: -style.height / 2 - (cfg.padding[0] - cfg.padding[2]) / 2,
            stroke: color,
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
            fill: color,
            width: style.width,
            radius: [r, r, 0, 0],
          },
          name: 'title-box',
          draggable: true,
        });
        group.addShape('marker', {
          attrs: {
            ...style,
            fill: '#fff',
            opacity: 1,
            // cfg.style.width and cfg.style.heigth correspond to the innerWidth and innerHeight in the figure of Illustration of Built-in Rect Combo
            x: 5,
            y: -(style.height / 2) - 15,
            r: 10,
            symbol: COLLAPSE_ICON,
          },
          draggable: true,
          name: 'combo-marker-shape',
        });
        return shape;
      },
      // 定义新增的右侧圆的位置更新逻辑
      afterUpdate: function afterUpdate(cfg, combo) {
        // console.log(cfg.collapsed)
        // if(cfg.collapsed){
        //   // combo.update({type:'card-combo'});

        // }else{
        // console.log('card-combo')
        // combo.update({type:'cRect'})

        // combo.update({type:'card-combo'});
        //   combo.refresh();
        // }
        const self = this;
        // Get the shape's style, where the style.width and style.height correspond to the width and height in the figure of Illustration of Built-in Rect Combo
        const style = self.getShapeStyle(cfg);
        const group = combo.get('group');
        // 在该 Combo 的图形分组根据 name 找到右侧圆图形
        const rect = group.find((ele) => ele.get('name') === 'title-box');
        // 更新右侧圆位置
        rect.attr({
          // cfg.style.width 与 cfg.style.heigth 对应 rect Combo 位置说明图中的 innerWdth 与 innerHeight
          x: -style.width / 2 - (cfg.padding[3] - cfg.padding[1]) / 2,
          y: -style.height / 2 - (cfg.padding[0] - cfg.padding[2]) / 2,
          width: style.width,
          height: 20,
        });
        const marker = group.find((ele) => ele.get('name') === 'combo-marker-shape');
        // Update the position of the right circle
        marker.attr({
          // cfg.style.width and cfg.style.heigth correspond to the innerWidth and innerHeight in the figure of Illustration of Built-in Rect Combo
          x: cfg.style.width / 2 + cfg.padding[1],
          y: (cfg.padding[2] - cfg.padding[0]) / 2,
          // The property 'collapsed' in the combo data represents the collapsing state of the Combo
          // Update the symbol according to 'collapsed'
          symbol: cfg.collapsed ? EXPAND_ICON : COLLAPSE_ICON,
        });
      },
    },
    'rect',
  );

  useEffect(() => {
    const container = document.getElementById('topo');

    const width = container?.scrollWidth;
    const height = 600;
    if (!graph) {
      graph = new G6.Graph({
        container: 'topo',
        width,
        height,
        layout: {
          type: 'comboForce',
          nodeSpacing: (d: any) => 100,
          focusNode: 'li',
          linkDistance: (d: any) => {
            // if (d.source.id === 'node0') {
            //   return 200;
            // }
            return 200;
          },
          unitRadius: 100,
          nodeStrength: (d: any) => {
            if (d.isLeaf) {
              return -50;
            }
            return -0;
          },
          preventOverlap: true,
        },
        defaultCombo: {
          // The type of the combos. You can also assign type in the data of combos
          type: 'cRect',
          // ... Other global configurations for combos
        },
        comboStateStyles: {
          dragenter: {
            lineWidth: 4,
            stroke: '#FE9797',
          },
        },
        modes: {
          default: [
            'drag-canvas',
            'drag-node',
            // 'activate-relations',
            {
              type: 'zoom-canvas',
            },
          ],
        },
        defaultNode: {
          /* node type */
          type: 'circle',
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
            img: 'https://gw.alipayobjects.com/zos/bmw-prod/dc1ced06-417d-466f-927b-b4a4d3265791.svg',
          },
        },
        defaultEdge: {
          size: 1,
          style: {
            stroke: '#e2e2e2',
            lineAppendWidth: 2,
            endArrow: {
              path: G6.Arrow.triangle(),
              fill: '#e2e2e2',
            },
          },
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
      const regionData: any[] = [];
      const appData = [];
      OriginData.nodes.forEach((node) => {
        if (node.nodeType == 'region') {
          regionData.push(node);
        } else {
          appData.push(node);
        }
      });
      graph.data({ nodes: regionData, edges: OriginData.edges });
      expandArr = regionData;
      graph.render();
      graph.on('node:mouseenter', (evt: any) => {
        const { item } = evt;
        graph.setItemState(item, 'active', true);
      });

      graph.on('node:mouseleave', (evt: any) => {
        const { item } = evt;
        graph.setItemState(item, 'active', false);
      });

      graph.on('node:click', (evt: any) => {
        const { item } = evt;
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

      graph.on('collapse-icon:click', (evt: any) => {
        handleExpand(evt);
      });
      graph.on('combo:click', (evt: any) => {
        if (evt.target.get('name') === 'combo-marker-shape') {
          // graph.collapseExpandCombo(e.item.getModel().id);
          // graph.collapseExpandCombo(evt.item);
          // if (graph.get('layout')) graph.layout();
          // else graph.refreshPositions();
          handleCollapse(evt);
        }
      });
    }
  }, []);

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
    const nodes = evt.item.getNodes();
    console.log('nodes', nodes[0]);
    const regionId = nodes[0]['_cfg']['model']['nodeRegionCode'];
    if (regionId) {
      OriginData.nodes.forEach((node) => {
        if (node.id == regionId) {
          expandArr.push(node);
        }
      });
    }

    let comboIdx = comboArr.findIndex((combo) => combo.regionCode == regionId);
    comboArr.splice(comboIdx, 1);

    evt.item.changeVisibility(false);
    graph.uncombo(evt.item);

    console.log('filter regionId', regionId);
    const newArr = expandArr.filter(
      (item) => !item.nodeRegionCode || (item.nodeType !== 'region' && item.nodeRegionCode !== regionId),
    );
    console.log('newArr', newArr);
    graph.data({ nodes: newArr, edges: OriginData.edges });
    expandArr = newArr;
    graph.render();

    comboArr.forEach((combo) => {
      graph.createCombo(
        {
          id: combo.id,
          type: combo.type,
        },
        combo.nodes,
      );
    });
  };

  const handleExpand = (evt: any) => {
    const { item } = evt;
    const model = item && item.getModel();
    console.log(model);
    let expandIndex = expandArr.findIndex((node) => node.id == model.id);
    console.log(expandIndex);
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
      type: 'card-combo',
      regionCode: model.id,
      nodes: newNode,
    };
    comboArr.push(newcombo);

    graph.data({ nodes: expandArr, edges: OriginData.edges });
    graph.render();

    comboArr.forEach((combo) => {
      graph.createCombo(
        {
          id: combo.id,
          type: combo.type,
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

  return <div id="topo"></div>;
};

export default Topo;
