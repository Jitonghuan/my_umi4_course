import showResourceModal from '@/pages/ticket/resource-apply/resource-show';
import G6, { Graph, GraphData } from '@antv/g6';
import React, { useEffect, useState, useMemo, forwardRef, useRef, useImperativeHandle } from 'react';
import { formatText } from '@/common/util';

function mapData(arr: any) {
  if (!arr) return [];

  return arr.map(({ id, key, endpointName, children, ...other }: any) => ({
    ...other,
    id: id + '',
    // label: endpointName,
    label: formatText(endpointName, 20),
    oriLabel: endpointName,
    children: mapData(children),
  }));
}

export default function rightTree(props: any) {
  const { treeData, showModal } = props;
  const [graphData, setGraphData] = useState<any>({});
  // const data = useMemo(() => treeData && { label: 'root11', children: mapData(treeData) }, [treeData]);
  const data = useMemo(() => mapData(treeData)[0], [treeData]);
  console.log(data, 'data');
  const containerRef: any = useRef(null);
  const [graph, setGraph] = useState<any>();

  // 初始化图表
  useEffect(() => {
    if (!containerRef) return;
    let g: any = null;
    const container = containerRef.current;

    const tooltip = new G6.Tooltip({
      offsetX: 10,
      offsetY: 10,
      itemTypes: ['node'],
      getContent: (e: any) => {
        const outDiv = document.createElement('div');
        outDiv.style.width = 'fit-content';
        outDiv.innerHTML = `
          <ul>
          <li>端点: ${e.item.getModel().oriLabel}</li>
          <li>Region: ${e.item.getModel().oriLabel}</li>
          </ul>
          `;
        return outDiv;
      },
    });

    g = new G6.TreeGraph({
      container: 'traceTree',
      width: container.clientWidth,
      height: container.clientHeight,
      plugins: [tooltip], // 插件
      modes: {
        default: ['drag-canvas', 'zoom-canvas'],
      },
      defaultNode: {
        size: 26,
        anchorPoints: [
          [0, 0.5],
          [1, 0.5],
        ],
      },
      defaultEdge: {
        type: 'cubic-horizontal',
      },
      // 定义布局
      layout: {
        // type: 'dendrogram', // 布局类型
        type: 'compactBox',
        direction: 'LR', // 自左至右布局，可选的有 H / V / LR / RL / TB / BT
        nodeSep: 50, // 节点之间间距
        rankSep: 100, // 每个层级之间的间距
        nodeSize: 10,
      },
    });
    g.node(function (node: any) {
      return {
        label: node.id,
        labelCfg: {
          position: node.children && node.children.length > 0 ? 'left' : 'right',
          offset: 5,
        },
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
    const resizeObserver = new ResizeObserver((entries: any) => {
      for (let entry of entries) {
      }
      if (!g || g.get('destroyed')) return;
      if (!container) return;
      g.changeSize(container.scrollWidth, container.scrollHeight - 30);
      g.fitView();
    });
    resizeObserver.observe(container || document.body);

    return () => {
      g && g.destory && g.destory();
      resizeObserver.disconnect();
    };
  }, [containerRef, data]);

  const bindListener = (graph: any) => {
    graph.on('node:click', (evt: any) => {
      showModal(evt.item._cfg.model);
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

  return <div ref={containerRef} id="traceTree" style={{ height: '100%' }}></div>;
}
