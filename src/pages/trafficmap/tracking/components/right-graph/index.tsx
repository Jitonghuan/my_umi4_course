import G6, { Graph, GraphData } from '@antv/g6';
import React, { useEffect, useState, useMemo, forwardRef, useRef, useImperativeHandle } from 'react';
function mapData(arr: any) {
  if (!arr) return [];
  return arr.map(({ key, endpointName, children, ...other }: any) => ({
    // id: title,
    label: endpointName,
    children: mapData(children),
    ...other,
  }));
}
export default function rightTree(props: any) {
  const { treeData } = props;
  const data = useMemo(() => treeData && { label: 'root11', children: mapData(treeData) }, [treeData]);
  // const data = useMemo(() => mapData(treeData), [treeData])
  const containerRef: any = useRef(null);
  const [graph, setGraph] = useState<any>();
  // 初始化图表
  useEffect(() => {
    if (!containerRef) return;
    let g: any = null;
    const container = containerRef.current;

    g = new G6.TreeGraph({
      container: 'traceTree',
      width: container.clientWidth,
      height: container.clientHeight,
      modes: {
        default: [
          // {
          //     // 定义展开/收缩行为
          //     type: 'collapse-expand',
          // },
          'drag-canvas',
          'zoom-canvas',
        ],
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
  }, [containerRef, treeData]);
  // 渲染数据
  useEffect(() => {
    if (!graph) return;
  });
  return <div ref={containerRef} id="traceTree" style={{ height: '100%' }}></div>;
}
