import React, { useEffect,useContext } from 'react';
import G6 from '@antv/g6';
import { ContentCard } from '@/components/vc-page-content';
import { Button, Card, Descriptions, Spin } from 'antd';
import { INSTANCE_TYPE } from '../../../../schema';
import { useSyncMetaData } from '../../../../hook';
import { useGetInstanceDetail } from '../../../../hook';
import DetailContext from '../../context'
// interface Iprops{
//   clusterId:number;
//   instanceId:number
// }
export default function InstanceInfo(props:any) {
  const [syncLoading, syncMetaData] = useSyncMetaData();
  // const {clusterId,instanceId} =props;
  const [infoLoading, infoData, topoData, getInstanceDetail] = useGetInstanceDetail();
  const {clusterId,instanceId}=useContext(DetailContext)
  useEffect(() => {
    if (instanceId) {
      getInstanceDetail({ id: instanceId });
    }
  }, [instanceId]);
  
  G6.registerNode(
    'tree-node',
    {
      drawShape: function drawShape(cfg: any, group: any) {
        const rect = group.addShape('rect', {
          attrs: {
            fill: cfg?.name?.includes('当前实例') ? '#40E0D0' : '#ADD8E6',
            stroke: cfg?.name?.includes('当前实例') ? '#B0C4DE' : '#778899',
            radius: 4,
            x: 0,
            y: 0,
            width: 1,
            height: 1,
          },
          name: 'rect-shape',
        });
        const content = cfg?.name?.includes('当前实例')
          ? cfg.name?.slice(5).replace(/(.{19})/g, '$1\n')
          : cfg.name.replace(/(.{19})/g, '$1\n');
        const text = group.addShape('text', {
          attrs: {
            text: content,
            x: 0,
            y: 0,
            textAlign: 'left',
            textBaseline: 'middle',
            fontSize: 10,
            fill: '#666',
          },
          name: 'text-shape',
        });
        const bbox = text.getBBox();
        const hasChildren = cfg.children && cfg.children.length > 0;
        rect.attr({
          x: -bbox.width / 2 - 4,
          y: -bbox.height / 2 - 6,
          width: bbox.width + (hasChildren ? 16 : 8),
          height: bbox.height + 8,
        });
        text.attr({
          fontSize: 10,
          x: -bbox.width / 2,
          y: 0,
        });
        if (hasChildren) {
          group.addShape('marker', {
            attrs: {
              x: bbox.width / 2 + 12,
              y: 0,
              r: 5,
              symbol: cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse,
              stroke: '#666',
              lineWidth: 1,
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
  useEffect(() => {
    if (topoData?.length > 0) {
      let childrenArry: any = [];
      let masterName = '';
      let labelData: any = [];

      topoData?.map((item: any, index: number) => {
        if (item?.role === 'master') {
          if (item?.current === 'true') {
            masterName = '当前实例：' + item?.instanceName;
          } else {
            masterName = item?.instanceName;
          }
        } else if (item?.role !== 'master') {
          if (item?.current === 'true') {
            childrenArry.push({
              name: '当前实例：' + item?.instanceName,
            });
          } else {
            childrenArry.push({
              name: item?.instanceName,
            });
          }

          labelData.push({
            label: `延迟${item?.delay}s`,
            value: item?.delay,
            IORunning: item?.IORunning,
            SQLRunning: item?.SQLRunning,
          });
        }
      });

      const treeData = {
        name: masterName,
        children: childrenArry,
        labelData: labelData,
      };

      const container: any = document.getElementById('container');
      const width = container.scrollWidth || 1160;
      const height = container.scrollHeight || 160;
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
                let i = 0;
                graph.edge((edge) => {
                  i++;
                  return {
                    type: 'line',

                    label: labelData[i - 1]?.label,
                    style: {
                      stroke:
                        labelData[i - 1]?.value !== '0'
                          ? 'red'
                          : labelData[i - 1]?.IORunning === 'No'
                          ? 'red'
                          : labelData[i - 1]?.SQLRunning === 'No'
                          ? 'red'
                          : '#A3B1BF',
                    },
                    // style: {
                    //   fill: 'steelblue',
                    // },
                  };
                });
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
        },
        defaultEdge: {
          type: 'line',
          style: {
            stroke: '#A3B1BF',
          },
        },
        layout: {
          type: 'compactBox',
          direction: 'LR',
          nodeSep: 50, // 节点之间间距
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
      // graph.getMaxZoom();
      // graph.setMinZoom(0.4)
      // graph.setMaxZoom(5);
      // graph.zoomTo(5, { x: 100, y: 100 });

      let i = 0;
      graph.edge((edge) => {
        i++;
        return {
          type: 'line',
          label: labelData[i - 1]?.label,
          style: {
            stroke:
              labelData[i - 1]?.value !== '0'
                ? 'red'
                : labelData[i - 1]?.IORunning === 'No'
                ? 'red'
                : labelData[i - 1]?.SQLRunning === 'No'
                ? 'red'
                : '#A3B1BF',
          },
        };
      });

      graph.data(treeData);
      graph.render();
      // graph.fitView();
      graph.fitView([10, 200]);

      if (typeof window !== 'undefined')
        window.onresize = () => {
          if (!graph || graph.get('destroyed')) return;
          if (!container || !container.scrollWidth || !container.scrollHeight) return;
          graph.changeSize(container.scrollWidth, container.scrollHeight);
        };
    }
  }, [topoData]);

  return (
    <ContentCard>
      <Card title="集群拓扑">
        <div id="container"></div>
      </Card>
      <div style={{ marginTop: 14 }}>
        <Spin spinning={infoLoading || syncLoading}>
          <Descriptions
            title="基本信息"
            bordered
            // extra={
            //   <Button
            //     type="primary"
            //     loading={syncLoading}
            //     onClick={() => {
            //       syncMetaData({ clusterId });
            //     }}
            //   >
            //     同步元数据
            //   </Button>
            // }
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
            <Descriptions.Item label="存储空间(GB)">
              {`已使用${infoData?.diskUsed || '-'}G`}&nbsp;
              <span style={{ color: 'blue' }}>{`(共${infoData?.diskCapacity}G)` || '-'}</span>
            </Descriptions.Item>
          </Descriptions>
        </Spin>
      </div>
    </ContentCard>
    // </div>
  );
}
