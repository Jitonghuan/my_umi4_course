import { treeDataFormatter } from '@/pages/test/autotest/_components/report-detail/formatter';
import G6, { Graph, GraphData } from '@antv/g6';
import moment, { Moment } from 'moment';
import React, { useEffect, useState, useMemo, forwardRef, useRef, useImperativeHandle } from 'react';
// import './index.less';
function mapData(arr: any) {
  if (!arr) return [];
  return arr.map(({ id, title, children, ...other }: any) => ({
    // id: title,
    label: title,
    children: mapData(children),
    ...other,
  }));
}
export default function rightTree(props: any) {
  const { treeData } = props;
  const data = useMemo(() => treeData && { label: 'root11', children: mapData(treeData) }, [treeData]);
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
      height: container.clientHeigth,
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
        type: 'dendrogram', // 布局类型
        direction: 'LR', // 自左至右布局，可选的有 H / V / LR / RL / TB / BT
        nodeSep: 50, // 节点之间间距
        rankSep: 100, // 每个层级之间的间距
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
      // g.fitView();
    }
    setGraph(g);
    return () => g && g.destory && g.destory();
  }, [containerRef, treeData]);
  // 渲染数据
  useEffect(() => {
    if (!graph) return;
  });
  return <div ref={containerRef} id="traceTree" style={{ height: '100%' }}></div>;
}
