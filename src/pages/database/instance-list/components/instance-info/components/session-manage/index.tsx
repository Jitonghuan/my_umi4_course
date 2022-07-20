import React, { useMemo, useEffect, useState } from 'react';
import PageContainer from '@/components/page-container';
import G6 from '@antv/g6';
import TableSearch from '@/components/table-search';
import { ContentCard } from '@/components/vc-page-content';
import { FilterCard } from '@/components/vc-page-content';
import { Button, Space, Form, Card, Descriptions, Spin } from 'antd';
import useTable from '@/utils/useTable';
import { INSTANCE_TYPE } from '../../../../schema';
import { useSyncMetaData } from '../../../../hook';
export interface instanceInfoProps {
  loading: boolean;
  infoData: any;
  topoData: any;
  clusterId: number;
  getInstanceDetail: (paramsObj: { id: number }) => Promise<void>;
}
export default function DEMO(props: instanceInfoProps) {
  const [form] = Form.useForm();
  const { loading, infoData, topoData, clusterId, getInstanceDetail } = props;
  const [mode, setMode] = useState<EditorMode>('HIDE');
  const [syncLoading, syncMetaData] = useSyncMetaData();
  G6.registerNode(
    'tree-node',
    {
      drawShape: function drawShape(cfg: any, group: any) {
        const rect = group.addShape('rect', {
          attrs: {
            fill: '#ADD8E6',
            stroke: '#666',
            x: 0,
            y: 0,
            width: 1,
            height: 1,
          },
          name: 'rect-shape',
        });
        const content = cfg.name.replace(/(.{19})/g, '$1\n');
        const text = group.addShape('text', {
          attrs: {
            text: content,
            x: 0,
            y: 0,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: '#666',
          },
          name: 'text-shape',
        });
        const bbox = text.getBBox();
        const hasChildren = cfg.children && cfg.children.length > 0;
        rect.attr({
          x: -bbox.width / 2 - 4,
          y: -bbox.height / 2 - 6,
          width: bbox.width + (hasChildren ? 26 : 12),
          height: bbox.height + 12,
        });
        text.attr({
          x: -bbox.width / 2,
          y: 0,
        });
        if (hasChildren) {
          group.addShape('marker', {
            attrs: {
              x: bbox.width / 2 + 12,
              y: 0,
              r: 6,
              symbol: cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse,
              stroke: '#666',
              lineWidth: 2,
            },
            name: 'collapse-icon',
          });
        }
        return rect;
      },
      update: (cfg, item) => {
        const group = item.getContainer();
        const icon = group.find((e) => e.get('name') === 'collapse-icon');
        icon.attr('symbol', cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse);
      },
    },
    'single-node',
  );
  let currentInfo = '';
  useEffect(() => {
    if (topoData.length > 0) {
      let childrenArry: any = [];
      let masterName = '';
      let labelData: any = [];

      topoData?.map((item: any, index: number) => {
        if (item?.role === 'master') {
          masterName = item?.instanceName;
        } else {
          childrenArry.push({
            name: item?.instanceName,
          });
          labelData.push({
            label: `延迟${item?.delay}s`,
            value: item?.delay,
          });
        }
      });

      const treeData = {
        name: masterName,

        children: childrenArry,
      };

      const container = document.getElementById('container');
      const width = container?.scrollWidth || 1200;
      const height = container?.scrollHeight || 200;
      const graph = new G6.TreeGraph({
        container: 'container',
        width,
        height,
        modes: {
          default: [
            {
              type: 'collapse-expand',
              onChange: function onChange(item: any, collapsed) {
                const data = item.get('model');
                graph.updateItem(item, {
                  collapsed,
                });
                data.collapsed = collapsed;
                return true;
              },
            },
            'drag-canvas',
            'zoom-canvas',
          ],
        },
        defaultNode: {
          type: 'tree-node',
          anchorPoints: [
            [0, 0.5],
            [1, 0.5],
          ],
          style: {
            radius: 10,
            stroke: '#69c0ff',
            fill: '#fff899',
            lineWidth: 1,
            fillOpacity: 1,
          },
        },
        defaultEdge: {
          type: 'line',
          label: '',
          style: {
            stroke: '#A3B1BF',
          },
        },
        layout: {
          type: 'compactBox',
          direction: 'LR',
          getId: function getId(d: any) {
            return d.id;
          },
          getHeight: function getHeight() {
            return 16;
          },
          getWidth: function getWidth() {
            return 16;
          },
          getVGap: function getVGap() {
            return 20;
          },
          getHGap: function getHGap() {
            return 80;
          },
        },
      });

      let i = 0;
      graph.edge((edge) => {
        i++;
        console.log('edge', edge);
        return {
          type: 'line',
          color: labelData[i - 1]?.value === 0 ? '#A3B1BF' : 'red',
          label: labelData[i - 1]?.label,
          // style: {
          //   fill: 'steelblue',
          // },
        };
      });

      graph.data(treeData);
      graph.render();
      graph.fitView();
      if (typeof window !== 'undefined') {
        window.onresize = () => {
          if (graph) {
            // @ts-ignore
            if (!graph || graph.get('destroyed')) return;
            // @ts-ignore
            if (!container || !container.scrollWidth || !container.scrollHeight) return;
            // @ts-ignore
            graph.changeSize(container.scrollWidth, container.scrollHeight);
          }
        };
      }
    }
  }, [topoData]);

  return (
    // <div style={{padding:12}}>
    <ContentCard>
      <Card title="集群拓扑">
        <div id="container"></div>
      </Card>
      <div style={{ marginTop: 14 }}>
        <Spin spinning={loading || syncLoading}>
          <Descriptions
            title="基本信息"
            bordered
            extra={
              <Button
                type="primary"
                loading={syncLoading}
                onClick={() => {
                  syncMetaData({ clusterId });
                }}
              >
                同步元数据
              </Button>
            }
          >
            <Descriptions.Item label="实例ID">{infoData?.id || '-'}</Descriptions.Item>
            <Descriptions.Item label="实例名称">{infoData?.name || '-'}</Descriptions.Item>
            <Descriptions.Item label="数据库类型">{INSTANCE_TYPE[infoData?.dbType]?.tagText || '-'}</Descriptions.Item>
            <Descriptions.Item label="所属集群">{infoData?.cluster || '-'}</Descriptions.Item>
            <Descriptions.Item label="所属环境">{infoData?.envCode || '-'}</Descriptions.Item>
            <Descriptions.Item label="部署类型">{infoData?.clusterType || '-'}</Descriptions.Item>
            <Descriptions.Item label="实例地址">{infoData?.host || '-'}</Descriptions.Item>
            <Descriptions.Item label="CPU">{infoData?.cpu || '-'}</Descriptions.Item>
            <Descriptions.Item label="内存(GB)">{infoData?.memory || '-'}</Descriptions.Item>
            <Descriptions.Item label="最大连接数">{infoData?.maxConnection || '-'}</Descriptions.Item>
            <Descriptions.Item label="描述">{infoData?.desc || '-'}</Descriptions.Item>
            <Descriptions.Item label="存储空间(GB)">{infoData?.diskCapacity || '-'}</Descriptions.Item>
          </Descriptions>
        </Spin>
      </div>
    </ContentCard>
    // </div>
  );
}
