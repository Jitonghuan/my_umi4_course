/*
 * @Author: shixia.ds
 * @Date: 2021-11-23 15:41:41
 * @Description: 拓扑图
 */
import G6 from '@antv/g6';
import moment, { Moment } from 'moment';
import React, { useEffect, useImperativeHandle, forwardRef, useState, memo } from 'react';
import { arrowStyleType } from '../constant';
import { getTopoList } from '../service';
import { OriginData } from './data';
import './topo-register';

interface ITopoProps {
  onNodeClick: (id: string) => void;
  onRedLineClick: (id: string) => void;
  setIsExpand: any;
  setIsMock: any;
  setSelectTime: any;
  selectTime: Moment;
  selectEnv: string;
  refreshFrequency: string;
  isMock: boolean;
}

const Topo = memo(
  forwardRef((props: ITopoProps, ref: any) => {
    //传给父组件 「全部展开」 的方法
    useImperativeHandle(ref, () => ({
      expandAll,
      collapseAll,
    }));

    const { onNodeClick, onRedLineClick, setIsExpand, setSelectTime } = props;
    const [originData, setOriginData] = useState<any>({});

    let dataInterval: any;

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
          <li>Type: ${e.item.getModel().nodeType}</li>
        </ul>
        <ul>
          <li>Label: ${e.item?.getModel().nodeLabel || e.item?.getModel().id}</li>
        </ul>`;
        return outDiv;
      },
    });

    const toolbar = new G6.ToolBar();

    const menu = new G6.Menu({
      offsetX: -10,
      offsetY: -10,
      itemTypes: ['edge'],
      trigger: 'click',
      getContent: (e: any) => {
        const outDiv = document.createElement('div');
        outDiv.style.width = '160px';
        outDiv.innerHTML = `
        <ul>
          <li>rt(响应时间): ${e.item?.getModel().rt || ''}</li>
        </ul>
        <ul>
          <li>suc(调用成功率): ${e.item?.getModel().suc || ''}</li>
        </ul>
        <ul>
          <li>qps(请求频率): ${e.item?.getModel().qps || ''}</li>
        </ul>
        `;
        return outDiv;
      },
      handleMenuClick(target, item) {
        console.log(target, item);
      },
    });

    const getTopoData = async () => {
      let res = await getTopoList({
        duration: moment(props.selectTime).format('YYYY-MM-DD HH:mm:ss'),
        envCode: props.selectEnv,
      });
      console.log('gettopodata', moment(props.selectTime).format('YYYY-MM-DD HH:mm:ss'), props.selectEnv);
      const edges = res?.data?.Calls?.map((item: any) => {
        return {
          id: item.callId,
          style: arrowStyleType[item.status] || arrowStyleType['normal'],
          ...item,
        };
      });
      const nodes = res?.data?.Nodes?.map((item: any) => {
        return {
          id: item.nodeId,
          label: '',
          type: item.nodeType == 'region' ? 'region-node' : 'app-node',
          nodeRegionCode: item.nodeType == 'region' ? undefined : item.nodeRegion,
          ...item,
        };
      });
      setOriginData({
        nodes,
        edges,
      });
    };

    useEffect(() => {
      // props.setIsMock(false);
      setIsExpand(true);
      props.selectEnv && getTopoData();
    }, [props.selectTime, props.selectEnv]);

    useEffect(() => {
      if (props.refreshFrequency == 'infinity') {
      } else if (props.refreshFrequency == '1') {
        setSelectTime(moment().subtract(2, 'minutes'));
        dataInterval = setInterval(() => {
          setSelectTime(moment().subtract(2, 'minutes'));
        }, 60 * 1000);
      } else if (props.refreshFrequency == '5') {
        setSelectTime(moment().subtract(2, 'minutes'));
        dataInterval = setInterval(() => {
          setSelectTime(moment().subtract(2, 'minutes'));
        }, 60 * 5 * 1000);
      }
      return () => {
        clearInterval(dataInterval);
      };
    }, [props.refreshFrequency]);

    // useEffect(() => {
    //   props.isMock ? setOriginData(OriginData) : getTopoData();
    // }, [props.isMock]);

    useEffect(() => {
      if (originData?.nodes?.length > 0) {
        const container = document.getElementById('topo');
        const width = container?.scrollWidth;
        const height = container?.scrollHeight;
        graph = new G6.Graph({
          container: 'topo',
          width,
          height,
          // linkCenter: true,
          plugins: [tooltip, toolbar, menu],
          layout: {
            type: 'gForce',
            //当一次迭代的平均移动长度小于该值时停止迭代。数字越小，布局越收敛，所用时间将越长
            minMovement: 0.5,
            //最大迭代次数。当迭代次数超过该值，但平均移动长度仍然没有达到 minMovement，也将强制停止迭代
            maxIteration: 50000,
            //阻尼系数，取值范围 [0, 1]。数字越大，速度降低得越慢
            damping: 0.99,
            preventOverlap: true,
            // gpuEnabled:true,
            // workerEnabled:true,
            linkDistance: (d: any) => {
              const sourceNode = nodeMap.get(d.source);
              const targetNode = nodeMap.get(d.target);
              if (
                sourceNode.nodeType == 'app' &&
                targetNode.nodeType == 'app' &&
                sourceNode.nodeRegionCode == targetNode.nodeRegionCode
              ) {
                return 50;
              } else {
                return 400;
              }
            },
            nodeSpacing: (d: any) => {
              if (d.nodeType === 'app') return 10;
              if (d.nodeType == 'region') return 100;
            },
            nodeStrength: (d: any) => {
              if (d.nodeType == 'region') return 10000;
              return 1000;
            },
            nodeSize: (d: any) => {
              if (d.nodeType == 'region') return 150;
              return 50;
            },
          },
          defaultCombo: {
            type: 'region-combo',
            labelCfg: {
              refY: 3,
              style: {
                fill: '#fff',
                fontSize: 14,
                fontWeight: 700,
              },
            },
            style: {
              fill: '#fff',
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
            style: {
              lineAppendWidth: 7,
            },
          },
        });

        const regionData: any[] = [];
        const appData = [];

        originData.nodes.forEach((node: any) => {
          // nodeMap[node.id] = node;
          nodeMap.set(node.id, node);
          if (node.nodeType == 'region') {
            regionData.push(node);
          } else {
            appData.push(node);
          }
        });
        graph.data({ nodes: regionData, edges: originData.edges });
        expandArr = regionData;
        graph.render();
        bindListener(graph);
      }
      return () => {
        graph?.destroy();
        resizeObserver.disconnect();
      };
    }, [originData]);

    /**
     * graph实例事件绑定
     * @param graph
     */
    const bindListener = (graph: any) => {
      graph.on('node:mouseenter', (evt: any) => {
        const { item } = evt;
        graph.setItemState(item, 'hover', true);
      });

      graph.on('node:mouseleave', (evt: any) => {
        const { item } = evt;
        graph.setItemState(item, 'hover', false);
      });

      graph.on('node:click', (evt: any) => {
        const { item } = evt;
        onNodeClick(item._cfg.model.nodeLabel);
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
        graph.getEdges().forEach((edge: any) => {
          graph.clearItemStates(edge);
        });
        const { item } = evt;
        onRedLineClick(item._cfg.model.id);
        graph.setItemState(item, 'focus', true);
      });

      graph.on('collapse-icon:click', (evt: any) => {
        handleExpand(evt);
      });
      graph.on('combo:click', (evt: any) => {
        if (evt.target.get('name') === 'combo-marker-shape') {
          handleCollapse(evt.item);
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
     * 基本思路：先找到对应的region的node，从存储combo的arr中删掉收起的combo，同时从graph上移除，从要渲染的数组中移除收起region包含的app
     */
    const handleCollapse = (item: any) => {
      const regionId = item['_cfg']['model']['regionCode'];
      if (regionId) {
        originData.nodes.forEach((node: any) => {
          if (node.id == regionId) {
            expandArr.push(node);
          }
        });
      }

      let comboIdx = comboArr.findIndex((combo: any) => combo.regionCode == regionId);
      if (comboArr.length == 1) {
        comboArr = [];
      } else {
        comboArr.splice(comboIdx, 1);
      }

      item.changeVisibility(false);
      graph.uncombo(item);
      const newArr = expandArr.filter(
        (item: any) => !item.nodeRegionCode || (item.nodeType !== 'region' && item.nodeRegionCode !== regionId),
      );

      graph.data({ nodes: newArr, edges: originData.edges });
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
      getExpandStatus();
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

    const getExpandStatus = () => {
      const collapseNode = expandArr.filter((item: any) => {
        if (item.nodeType == 'region') {
          return item;
        }
      });
      if (collapseNode.length > 0) {
        setIsExpand(true);
      } else {
        setIsExpand(false);
      }
    };

    /**
     * 展开 regionNode
     * @param expandId
     * 基本逻辑是从渲染的节点中移除展开前的node，然后把region包含的app 对应的node放到数组里，渲染
     */
    const regionNodeExpand = (expandId: any) => {
      let expandIndex = expandArr.findIndex((node: any) => node.id == expandId);
      expandArr.splice(expandIndex, 1);

      const newNode: any[] = [];
      originData.nodes.forEach((node: any) => {
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
      graph.data({ nodes: expandArr, edges: originData.edges });
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
      getExpandStatus();
    };

    /**
     * 全部展开
     * 把当前渲染的所有的region 都执行一遍 regionNodeExpand
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

    const collapseAll = () => {
      //
      const regionData: any[] = [];
      const appData = [];

      originData.nodes.forEach((node: any) => {
        nodeMap.set(node.id, node);
        if (node.nodeType == 'region') {
          regionData.push(node);
        } else {
          appData.push(node);
        }
      });
      graph.data({ nodes: regionData, edges: originData.edges });
      expandArr = regionData;
      comboArr = [];
      graph.render();
      getExpandStatus();
    };

    /**
     * 监听dom大小的改变resize graph
     */
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
