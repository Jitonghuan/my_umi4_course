import G6, { Graph, GraphData } from '@antv/g6';
import moment, { Moment } from 'moment';
import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react';
import { getTopoList } from '../../../service';
import { mockRomote, random } from './common';
import { formatText, nodeStyled, edgeStyled, comboStyled, findNode } from './util';
import './index.less';
const layout: any = {
    instance: undefined,
    stop: function (graph: any) {
        this?.instance?.stop();
        graph?.emit('layoutEnd');
    },
};
const Topo = React.forwardRef((props: any, ref: any) => {
    const containerRef: any = useRef(null);
    const { onNodeClick, onRedLineClick, setIsExpand, setSelectTime, selectTime } = props;
    const [graph, setGraph] = useState<Graph>(); //graph实例
    const [originData, setOriginData] = useState<any>({}); //所有节点/边数据
    const [needExpandList, setNeedExpandList] = useState<any>({}); //需要展开但还没处理过的数据
    const [expandList, setExpandList] = useState<any>({}); //所有展开的数据
    let dataInterval: any;
    //传给父组件  全部展开/全部收起
    useImperativeHandle(ref, () => ({
        expandAll: () => {
            const nodes = originData.nodes.filter((item: any) => item.nodeType !== 'region');
            const edges = originData.edges;
            setNeedExpandList({ nodes, edges });
        },
        collapseAll: () => {
            const nodes = originData.nodes.filter((item: any) => item.nodeType === 'region');
            const edges = originData.edges;
            setNeedExpandList({ nodes, edges });
        },
    }));

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

    // 初始化图表
    useEffect(() => {
        if (!containerRef) return;
        let g: any = null;
        const container = containerRef.current;

        const toolbar = new G6.ToolBar();
        //   右键菜单栏
        const menu = new G6.Menu({
            offsetX: 6,
            offsetY: 10,
            itemTypes: ['node'],
            getContent(e: any) {
                layout.stop(g);
                const { item } = e;
                const model = item?.getModel();
                if (model.nodeType === 'region') {
                    return `<ul class="g6-options-menu">
        <li id='expand'>展开当前域</li>
      </ul>`;
                } else {
                    return `<ul class="g6-options-menu">
          <li id='collapse'>折叠当前域</li>
        </ul>`;
                }
            },
            handleMenuClick(target, item) {
                const model = item?.getModel();

                const IdStr = target.id.split('-');
                switch (IdStr[0]) {
                    case 'expand':
                        g.emit('node:expand', model);
                        break;
                    case 'collapse':
                        g.emit('node:collapse', model);
                        break;
                }
            },
        });
        const edgeMenu = new G6.Menu({
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
            handleMenuClick(target, item) { },
        });
        const tooltip = new G6.Tooltip({
            offsetX: 10,
            offsetY: 10,
            itemTypes: ['node'],
            getContent: (e: any) => {
                const outDiv = document.createElement('div');
                outDiv.style.width = 'fit-content';
                outDiv.innerHTML = `
          <ul>
          <li>Id: ${e.item.getModel().id}</li>
          <li>Type: ${e.item.getModel().nodeType}</li>
          <li>Region: ${e.item.getModel().nodeRegion}</li>
          </ul>
          <ul>
            <li>Label: ${e.item?.getModel().nodeLabel || e.item?.getModel().id}</li>
          </ul>
          `;
                return outDiv;
            },
        });

        g = new G6.Graph({
            container: 'topo',
            width: container?.clientWidth,
            height: container?.clientHeight,
            plugins: [tooltip, edgeMenu, menu, toolbar], // 插件
            modes: {
                default: [
                    {
                        type: 'drag-canvas',
                    },
                    {
                        type: 'zoom-canvas',
                        optimizeZoom: 0.01,
                    },
                    'shortcuts-call',
                    'drag-node',
                    'drag-combo',
                ],
            },
            // nodeStateStyles: {
            //   highlight: {
            //     opacity: 1,
            //   },
            //   dark: {
            //     opacity: 0.2,
            //   },
            // },
            // edgeStateStyles: {
            //   highlight: {
            //     stroke: '#999',
            //   },
            // },
        });
        // 关闭局部渲染，防止有残影
        g.get('canvas').set('localRefresh', false);
        bindListener(g);
        setGraph(g);
        return () => g && g.destroy();
    }, [containerRef]);

    useEffect(() => {
        setIsExpand(true);
        props.selectEnv && getTopoData();
    }, [props.selectTime, props.selectEnv]);

    //过滤数据、记录数据
    useEffect(() => {
        if (!needExpandList || !needExpandList.nodes) return;
        const filterData = { nodes: needExpandList.nodes, edges: needExpandList.edges };
        // 过滤掉找不到对应节点的边 防止渲染有问题 布局失败
        filterData.edges = filterData.edges.filter(
            (e: any) => findNode(e.source, filterData.nodes) && findNode(e.target, filterData.nodes),
        );
        setExpandList(filterData);

        const collapseNode = filterData.nodes.filter((item: any) => {
            if (item.nodeType == 'region') {
                return item;
            }
        });
        if (collapseNode.length > 0) {
            setIsExpand(true);
        } else {
            setIsExpand(false);
        }
    }, [needExpandList]);

    // 渲染数据
    useEffect(() => {
        if (!graph) return;
        const linkDistance = 100;
        const edgeStrength = 50;
        const nodeStrength = 200;
        const nodeSpacing = 10;
        if (expandList && expandList.nodes && expandList.nodes.length > 0) {
            const container = containerRef.current;
            const config = {
                type: 'gForce',
                minMovement: 0.1,
                maxIteration: 1000,
                preventOverlap: true,
                damping: 0.99,
                gpuEnabled: true,
                center: [container?.clientWidth / 2, container?.clientHeight / 2],
                linkDistance: (d: any) => {
                    let dist = linkDistance;
                    const sourceNode = findNode(d.source, expandList.nodes);
                    const targetNode = findNode(d.target, expandList.nodes);
                    //   加长和域节点有关的边
                    if (sourceNode.nodeType === 'region' || targetNode.nodeType === 'region') {
                        dist = linkDistance * 5;
                    }
                    return dist;
                },
                edgeStrength: (d: any) => {
                    return edgeStrength;
                },
                nodeStrength: (d: any) => {
                    // 给离散点引力，让它们聚集
                    // if (d.degree === 0) return -10;
                    // 聚合点的斥力大
                    if (d.nodeType === 'region') return nodeStrength * 2;
                    return nodeStrength;
                },
                nodeSize: (d: any) => {
                    if (d.size) return d.size;
                    return 40;
                },
                nodeSpacing: (d: any) => {
                    if (d.degree === 0) return nodeSpacing * 3;
                    return nodeSpacing;
                },
                onLayoutEnd: () => {
                    layout.stop(graph);
                },
                tick: () => {
                    graph.refreshPositions();
                },
            };

            const layoutInstance = new G6.Layout['gForce'](config);
            layoutInstance.init(expandList);
            layoutInstance.execute();
            layout.instance = layoutInstance;
            const existData = graph.save() as GraphData;
            if (existData && existData.nodes && existData.nodes.length) {
                graph.changeData(expandList);
            } else {
                graph.data(expandList);
                graph.render();
            }

            const renderRegions = () => {
                const regions: any = {};
                // 计算现在有几个域
                expandList.nodes.forEach((node: any) => {
                    if (node.nodeType === 'node') {
                        regions[node.nodeRegion] = regions[node.nodeRegion] || [];
                        regions[node.nodeRegion].push(node.id);
                    }
                });
                Object.keys(regions).forEach((k) => {
                    const id = random();
                    graph.createCombo(
                        {
                            id: `${k}-combo`,
                            type: 'region-combo',
                            ...comboStyled({ region: k }),
                        },
                        regions[k],
                    );
                });
            };

            //   展开节点
            const expandNode = (evt: any) => {
                // layout.stop(graph);
                let model: any = null;
                if (evt.item) {
                    // 点击icon展开
                    model = evt.item.getModel();
                    evt.stopPropagation();
                } else {
                    // 右键菜单展开
                    model = evt;
                }
                const oldNodes = expandList.nodes.filter((item: any) => item.id !== model.id);
                const currentRegion = expandList.nodes.find((item: any) => item.id === model.id);
                // 找到当前域下的所有app节点并设置初始位置
                const newNode = originData.nodes
                    .filter((item: any) => item.nodeRegion === model.id && item.nodeType === 'node')
                    .map((n: Node) => ({
                        ...n,
                        x: (currentRegion.x || 0) + random(currentRegion.size) - currentRegion.size / 2,
                        y: (currentRegion.y || 0) + random(currentRegion.size) - currentRegion.size / 2,
                    }));

                setNeedExpandList({ nodes: [...oldNodes, ...newNode], edges: originData.edges });
            };

            //   收起节点
            const collapseNode = (params: any) => {
                const addRegion = originData.nodes.filter((item: any) => item.id === params.nodeRegion);
                const nodes = expandList.nodes.filter((item: any) => item.nodeRegion !== params.nodeRegion);
                setNeedExpandList({ nodes: [...nodes, ...addRegion], edges: originData.edges });
            };
            graph.on('collapse-icon:click', expandNode);
            graph.on('node:collapse', collapseNode);
            graph.on('node:expand', expandNode);
            graph.on('layoutEnd', renderRegions);
            graph.on('combo:click', ({ target, item }: any) => {
                if (target.get('name') === 'combo-marker-shape') {
                    collapseNode(item.getModel());
                }
                clearAllStats(graph);
            });
            return () => {
                layoutInstance.stop();
                layoutInstance.destroy();
                graph.off('collapse-icon:click', expandNode);
                graph.off('node:collapse', collapseNode);
                graph.off('node:expand', expandNode);
                graph.off('layoutEnd', renderRegions);
                graph.off('combo:click');
            };
        }
    }, [expandList]);
    //   处理数据
    const getTopoData = async () => {
        // let res = await getTopoList({
        //   duration: moment(props.selectTime).format('YYYY-MM-DD HH:mm:ss'),
        //   envCode: props.selectEnv,
        // });
        let res = mockRomote();
        const styledData = ({ Nodes, Calls }: any) => {
            const clusterSize: any = {};
            Nodes.forEach((item: any) => {
                item.id = item.nodeId;
                Object.assign(item, {
                    ...item,
                    label: formatText(item.id, 7),
                    shortLabel: formatText(item.id, 7),
                    oriLabel: item.id,
                    text: item.id,
                    ...nodeStyled(item),
                    degree: 0,
                    inDegree: 0,
                    outDegree: 0,
                    type: item.nodeType == 'region' ? 'region-node' : 'app-node',
                    size: item.nodeType == 'region' ? 60 : 40,
                });
                if (item.nodeType === 'node') {
                    clusterSize[item.nodeRegion] = clusterSize[item.nodeRegion] || 0;
                    clusterSize[item.nodeRegion]++;
                }
            });
            Calls.forEach((item: any) => {
                const sourceNode = findNode(item.source, nodes);
                const targetNode = findNode(item.target, nodes);
                if (sourceNode) {
                    sourceNode.degree++;
                    sourceNode.outDegree++;
                }
                if (targetNode) {
                    targetNode.degree++;
                    targetNode.inDegree++;
                }
                item.isReal = sourceNode && targetNode && sourceNode.nodeType === 'node' && targetNode.nodeType === 'node';
                Object.assign(item, {
                    ...edgeStyled(item),
                    // label: item.rt,
                    type: 'custom-line',
                });
            });
        };
        const nodes = res.data.Nodes;
        styledData(res.data);
        const region = nodes.filter((item: any) => item.nodeType === 'region');
        setNeedExpandList({ nodes: region, edges: res.data.Calls });
        setOriginData({ nodes, edges: res.data.Calls });
    };

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

    const clearAllStats = (graph: any) => {
        graph.setAutoPaint(false);
        graph.getNodes().forEach(function (node: any) {
            graph.clearItemStates(node);
        });
        graph.getEdges().forEach(function (edge: any) {
            graph.clearItemStates(edge);
        });
        graph.paint();
        graph.setAutoPaint(true);
    };

    const bindListener = (graph: any) => {
        const nodeActive = (evt: any) => {
            const { item } = evt;
            clearFocusItemState(graph);
            graph.setItemState(item, 'focus', true);
            // 将相关边也高亮
            item.getEdges().forEach((edge: any) => {
                graph.setItemState(edge.getSource(), 'focus', true);
                graph.setItemState(edge.getTarget(), 'focus', true);
                graph.setItemState(edge, 'focus', true);
            });
        };
        const linkActive = (evt: any) => {
            layout.stop(graph);
            const { item } = evt;
            clearFocusItemState(graph);
            graph.setItemState(item, 'focus', true);
        };
        graph.on('node:click', (evt: any) => {
            layout.stop(graph);
            onNodeClick(evt.item._cfg.model.nodeLabel);
            nodeActive(evt);
        });
        graph.on('edge:click', linkActive);
        graph.on('canvas:click', (evt: any) => {
            clearAllStats(graph);
        });

        graph.on('node:mouseenter', (evt: any) => {
            const { item } = evt;
            const model = item.getModel();
            item.update({
                label: model.oriLabel,
            });
            nodeActive(evt);
        });
        graph.on('node:mouseleave', (evt: any) => {
            // clearAllStats(graph);
            const { item } = evt;
            const model = item.getModel();
            item.update({
                label: model.shortLabel,
            });
            clearAllStats(graph);
            // clearFocusItemState(graph);
            graph.setItemState(item, 'hover', false);
        });
    };

    if (typeof window !== 'undefined')
        window.onresize = () => {
            if (!graph || graph.get('destroyed')) return;
            const container = document.getElementById('topo');
            if (!container || !container.scrollWidth || !container.scrollHeight) return;
            graph.changeSize(container.scrollWidth, container.scrollHeight);
        };

    return <div ref={containerRef} id="topo" style={{ height: '100%' }}></div>;
});

export default Topo;