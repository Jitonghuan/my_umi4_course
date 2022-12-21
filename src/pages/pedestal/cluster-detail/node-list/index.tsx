import React, { useEffect, useRef, useState, useContext, useMemo } from 'react';
import { Form, Button, Table, message, Input } from 'antd';
import clusterContext from '../context';
import { nodeListTableSchema } from '../schema';
import { RedoOutlined } from '@ant-design/icons';
import { useNodeListData } from '../hook';
import { history } from 'umi';
import { nodeDrain, nodeUpdate, getNode } from '../service';
import AddNode from './add-node';
import SetTag from './set-tag';
import debounce from 'lodash/debounce';
import './index.less';

export default function NodeList() {
  const [visible, setVisble] = useState(false);
  const { clusterCode, clusterName } = useContext(clusterContext);
  const [tagVisible, setTagVisible] = useState(false);
  const [cluster, setCluster] = useState({}) as any;
  const [dataSource, setDataSource] = useState([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [initData, setInitData] = useState<any>({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [baseData, total, loading, loadData] = useNodeListData({ clusterCode: clusterCode || '' }); //表格的基础数据
  const [data, setData] = useState<any>([]); //表格的完整数据
  const [expand, setExpand] = useState<boolean>(true);
  const [form] = Form.useForm();
  const [originData, setOriginData] = useState<any>([]);

  useEffect(() => {
    if (baseData && baseData.length) {
      setData(baseData);
      getNode({ clusterCode: clusterCode || '', needMetric: true }).then((res: any) => {
        if (res?.success) {
          const { items } = res?.data || {};
          setData(items || []);
          setOriginData(items || []);
        }
      });
    } else {
      setData([]);
      setOriginData([]);
    }
  }, [baseData]);

  const tableColumns = useMemo(() => {
    return nodeListTableSchema({
      shell: (record: any, index: any) => {
        history.push({
          pathname: '/matrix/pedestal/login-shell',
          search: `key=node-list&type=node&name=${record.nodeName}&clusterCode=${clusterCode}&clusterName=${clusterName}`
          // query: { key: 'node-list', type: 'node', name: record.nodeName, clusterCode, clusterName },
        });
      },
      // 设置标签
      clickTag: (record: any, index: any) => {
        const c = {
          taints: record.taints || [],
          labels: Object.keys(record?.labels || {}).map((k) => ({ key: k, value: record.labels[k] })),
        };
        setInitData(record);
        setCluster(c);
        setTagVisible(true);
      },
      // 调度
      updateNode: (record: any, index: any) => {
        setUpdateLoading(true);
        nodeUpdate({
          unschedulable: !record.unschedulable,
          clusterCode,
          nodeName: record.nodeName,
          labels: record.labels,
          taints: record.taints,
        })
          .then((res: any) => {
            if (res?.success) {
              message.success('操作成功');
              loadData();
            }
          })
          .finally(() => {
            setUpdateLoading(false);
          });
      },
      // 排空
      drain: (record: any, index: any) => {
        setUpdateLoading(true);
        nodeDrain({ nodeName: record.nodeName, clusterCode: clusterCode })
          .then((res: any) => {
            if (res?.success) {
              message.success('操作成功');
              loadData();
            }
          })
          .finally(() => {
            setUpdateLoading(false);
          });
      },
      expand,
      setExpand
      // 删除
      // handleDelete: async (record: any, index: any) => {
      //     const res = await delRequest(`${appConfig.apiPrefix}/infraManage/node/delete/${record?.nodeName}`);
      //     if (res?.success) {
      //         loadData();
      //     }
      // },
    }) as any;
  }, [data, expand, setExpand]);

  const filter = debounce((value) => filterData(value), 500)

  const filterData = (value: string) => {
    if (!value) {
      setData(originData);
      return;
    }
    const res = JSON.parse(JSON.stringify(originData));
    const afterFilter: any = [];
    res.forEach((item: any) => {
      const judgeLabel = Object.keys(item?.labels || {}).find((e) => {
        return `${e}=${item.labels[e]}`.indexOf(value) !== -1
      })
      if (item.nodeIp?.indexOf(value) !== -1 || item.nodeName?.indexOf(value) !== -1 || judgeLabel) {
        afterFilter.push(item);
      }
    });
    setData(afterFilter);
  }

  const valueChange = (changeValue: any) => {
    filter(changeValue?.searchWord);
  }

  return (
    <div className="cluster-node-list">
      <AddNode
        visible={visible}
        onClose={() => {
          setVisble(false);
        }}
        onSubmit={() => {
          setVisble(false);
          loadData();
        }}
      ></AddNode>
      <SetTag
        visible={tagVisible}
        onSubmit={(tag: any, data: any) => {
          setTagVisible(false);
          loadData();
        }}
        onCancel={() => {
          setTagVisible(false);
        }}
        dirtyTags={cluster.taints}
        baseTags={cluster.labels}
        initData={initData}
      ></SetTag>
      {/* <div className="flex-space-between">
        <h3>节点列表</h3>
        <Button
          icon={<RedoOutlined />}
          onClick={() => {
            loadData();
          }}
          style={{ marginRight: '10px' }}
          size="small"
        >
          刷新
        </Button>
      </div> */}
      <div className="table-caption">
        <div className="caption-left">
          <h3>节点列表</h3>
        </div>
        <div className="caption-right">
          <Form form={form} layout="inline" onValuesChange={valueChange}>
            <Form.Item label="搜索：" name="searchWord">
              <Input placeholder='输入节点名/IP/标签名' style={{ width: 220 }} disabled={!originData?.length} />
            </Form.Item>
          </Form>
          <Button
            icon={<RedoOutlined />}
            onClick={() => {
              form.resetFields();
              loadData();
            }}
            style={{ marginRight: '10px' }}
            size="small"
          >
            刷新
        </Button>
        </div>
      </div>
      <Table
        dataSource={data}
        loading={loading || updateLoading}
        bordered
        rowKey="id"
        // pagination={{
        //     pageSize: pageSize,
        //     total: total,
        //     current: pageIndex,
        //     showSizeChanger: true,
        //     onShowSizeChange: (_, next) => {
        //         setPageIndex(1);
        //         setPageSize(next);
        //     },
        //     onChange: (next) => {
        //         setPageIndex(next)
        //     }
        // }}
        pagination={false}
        columns={tableColumns}
        scroll={{ x: '100vw' }}
      ></Table>
    </div>
  );
}
