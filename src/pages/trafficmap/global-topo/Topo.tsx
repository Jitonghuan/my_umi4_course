/*
 * @Author: shixia.ds
 * @Date: 2021-11-23 15:41:41
 * @Description: 拓扑图
 */
import G6 from '@antv/g6';
import React, { useEffect, useImperativeHandle, forwardRef, useState, memo } from 'react';
import { OriginData } from './data';
import './topo-register';

interface ITopoProps {
  onNodeClick: (id: string) => void;
  onRedLineClick: (id: string) => void;
}

const Topo = memo(
  forwardRef((props: ITopoProps, ref: any) => {
    //传给父组件 「全部展开」 的方法
    useImperativeHandle(ref, () => ({
      expandAll,
    }));

    const { onNodeClick, onRedLineClick } = props;

    let graph = null as any;
    const { uniqueId } = G6.Util;

    // 当前渲染的node
    let expandArr: any = [];
    // 当前渲染的combo
    let comboArr: any = [];

    //所有节点的map
    let nodeMap: Map<string, any> = new Map();

    // node tooltip
    const tooltip = new G6.Tooltip({
      offsetX: 10,
      offsetY: 10,
      // the types of items that allow the tooltip show up
      itemTypes: ['node'],
      // custom the tooltip's content
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
      const height = container?.scrollHeight;
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
          modes: {
            default: ['drag-combo', 'drag-node', 'drag-canvas', 'zoom-canvas'],
          },
          defaultNode: {
            type: 'app-node',
          },
          defaultEdge: {
            type: 'custom-edge',
          },
        });

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
      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    /**
     * graph实例事件绑定
     * @param graph
     */

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
        onNodeClick(item._cfg.model.id);

        //清除现有的focus状态
        clearFocusItemState(graph);

        //给对应节点设置focus状态
        graph.setItemState(item, 'focus', true);

        //关联的edge也focus
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
        onRedLineClick(item._cfg.model.id);
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

    /**
     * 清除focus状态
     * @param graph
     * @returns
     */
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

    /**
     * 收起combo
     * @param evt
     */
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

    /**
     * region Node 展开事件
     * @param evt
     */
    const handleExpand = (evt: any) => {
      const { item } = evt;
      const model = item && item.getModel();
      regionNodeExpand(model.id);
    };

    /**
     * 展开 regionNode
     * @param expandId
     */
    const regionNodeExpand = (expandId: any) => {
      let expandIndex = expandArr.findIndex((node: any) => node.id == expandId);
      expandArr.splice(expandIndex, 1);

      const newNode: any[] = [];
      OriginData.nodes.forEach((node) => {
        if (node.nodeRegionCode == expandId) {
          expandArr.push(node);
          newNode.push(node.id);
        }
      });

      let newcombo = {
        id: `combo-${uniqueId()}`,
        label: expandId,
        type: 'region-combo',
        regionCode: expandId,
        status: expandId.status,
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

    /**
     * 全部展开
     */
    const expandAll = () => {
      const collapseNode = expandArr.filter((item: any) => {
        if (item.nodeType == 'region') {
          return item;
        }
      });
      collapseNode.map((item: any) => {
        regionNodeExpand(item.id);
      });
    };

    if (typeof window !== 'undefined')
      window.onresize = () => {
        if (!graph || graph.get('destroyed')) return;
        const container = document.getElementById('topo');
        if (!container) return;
        graph?.changeSize(container.scrollWidth, container.scrollHeight - 30);
      };

    // useEffect(() => {
    //   console.log(graph)
    //   if (!graph || graph.get('destroyed')) return;
    //   const container = document.getElementById('topo');
    //   if (!container) return;
    //   graph.changeSize(container.scrollWidth, container.scrollHeight - 30);
    // }, [isFullScreen]);

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
      }
      if (!graph || graph.get('destroyed')) return;
      const container = document.getElementById('topo');
      if (!container) return;
      graph.changeSize(container.scrollWidth, container.scrollHeight - 30);
    });
    resizeObserver.observe(document.getElementById('topo') || document.body);

    return <div id="topo" style={{ height: '100%' }}></div>;
  }),
);

export default Topo;
