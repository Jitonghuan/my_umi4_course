import React, { useEffect, useMemo, useState, useContext } from 'react';
import { Tag, Table, Empty, Button } from 'antd';
import { PodsDetailColumn, envVarTable } from '../schema';
import { eventTableSchema } from '../../schema';
import { getResourceList } from '../../service';
import { RedoOutlined } from '@ant-design/icons';
import clusterContext from '../../context';
import { history, useLocation } from 'umi';
import { parse } from 'query-string';
import './index.less';

export default function PodsDetail() {
  // const { location } = props;
  let location: any = useLocation();
  const query = parse(location.search);
  const { name, namespace, kind, clusterCode } = query || {};
  const [podsData, setPodsData] = useState([]);
  const { clusterName } = useContext(clusterContext);
  const [eventData, setEventData] = useState([]);
  const [eventLoading, setEventLoading] = useState<boolean>(false);
  const [podsLoading, setPodsLoading] = useState<boolean>(false);
  const [container, setContainer] = useState<any>([]);
  useEffect(() => {
    getContainer();
    getEvents();
  }, [clusterCode]);

  // 表格列配置
  const PodsColumn = useMemo(() => {
    return PodsDetailColumn({
      viewLog: (record: any, index: any) => {
        history.push({
          pathname: '/matrix/pedestal/view-log',
          search: `key=resource-detail&name=${name}&namespace=${record?.namespace}&clusterCode=${clusterCode}&clusterName=${clusterName}&containerName=${record?.name}`
          // query: {
          //   key: 'resource-detail',
          //   name,
          //   namespace: record?.namespace,
          //   clusterCode,
          //   clusterName,
          //   containerName: record?.name,
          // },
        });
      },
      shell: (record: any, index: any) => {
        history.push({
          pathname: '/matrix/pedestal/login-shell',
          search: `key=resource-detail&name=${name}&namespace=${record?.namespace}&clusterCode=${clusterCode}&clusterName=${clusterName}&containerName=${record?.name}&type=pods`
          // query: {
          //   type: 'pods',
          //   key: 'resource-detail',
          //   name,
          //   namespace: record?.namespace,
          //   clusterCode,
          //   clusterName,
          //   containerName: record?.name,
          // },
        });
      },
    }) as any;
  }, [podsData]);

  // 获取容器
  const getContainer = () => {
    setPodsLoading(true);
    getResourceList({ clusterCode, resourceType: 'pods', namespace, resourceName: name })
      .then((res) => {
        if (res?.success) {
          const items = res?.data?.items || []
          const namespace = items.length ? items[0].namespace : "";
          const dataArray = items.length ? items[0].info?.containers : []
          const data = (dataArray || []).map((item: any) => ({
            ...item,
            namespace: namespace || ''
          }));
          setPodsData(data);
          setContainer(data);
        } else {
          setPodsData([]);
          setContainer([]);
        }
      })
      .finally(() => {
        setPodsLoading(false);
      });
  };

  const getEvents = () => {
    setEventLoading(false);
    getResourceList({ clusterCode, resourceType: 'events', involvedObjectName: name, involvedObjectKind: kind || '', namespace })
      .then((res) => {
        if (res?.success) {
          setEventData(res?.data?.items || []);
        } else {
          setEventData([]);
        }
      })
      .finally(() => {
        setEventLoading(false);
      });
  };

  return (
    <div className="pods-detail">
      <div className="flex-space-between">
        <h3 className="descriptions-title">容器：</h3>
        <div>
          <Button
            icon={<RedoOutlined />}
            onClick={() => {
              getContainer();
              getEvents();
            }}
            style={{ marginRight: '10px' }}
            size="small"
          >
            刷新
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              history.back();
            }}
          >
            返回
          </Button>
        </div>
      </div>
      <Table
        columns={PodsColumn}
        pagination={false}
        bordered
        // scroll={{ y: window.innerHeight - 564 }}
        dataSource={podsData}
        loading={podsLoading}
      />
      <h3 className="descriptions-title" style={{ marginTop: '20px' }}>
        事件
      </h3>
      <Table
        dataSource={eventData}
        loading={eventLoading}
        bordered
        rowKey="id"
        pagination={false}
        columns={eventTableSchema()}
      ></Table>
      <h3 className="descriptions-title" style={{ marginTop: '20px' }}>
        环境变量
      </h3>
      {container && container.length ? (
        <>
          {container.map((item: any) => (
            <div className="var-wrapper" style={{ marginBottom: '10px' }}>
              <div style={{ marginBottom: '5px', fontSize: '12px' }}>
                容器名：<Tag color="blue">{item?.containerName || item?.name || '--'}</Tag>
              </div>
              <Table
                dataSource={item?.env || []}
                bordered
                pagination={false}
                rowKey="id"
                columns={envVarTable()}
              ></Table>
            </div>
          ))}
        </>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
      )}
    </div>
  );
}
