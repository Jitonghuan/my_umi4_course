// helm管理
// @author JITONGHUAN <muxi.jth@come-future.com>
// @create 2022/06/25 14:15

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { history } from 'umi';
import { Input, Table, Form, Button, Space, Select, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { releaseTableSchema } from './schema';
import { queryReleaseList, useGetClusterList, useDeleteRelease, getClusterList } from './hook';
import UpdateDeploy from './update-deploy';

export default function DNSManageList(props: any) {
  // const [loading, clusterOptions, getClusterList] = useGetClusterList();
  const [releaseForm] = Form.useForm();
  const [curRecord, setCurRecord] = useState<any>();
  const [tableLoading, setTableLoading] = useState<any>(false);
  const [tabledataSource, setDataSource] = useState<any>([]);
  const [curClusterName, setCurClusterName] = useState<any>('来未来');
  const [clusterInfo, setClusterInfo] = useState<any>();
  const [mode, setMode] = useState<boolean>(false);
  const [delLoading, deleteRelease] = useDeleteRelease();
  const [clusterOptions, setClusterOptions] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getClusterList().then((res) => {
      setClusterOptions(res);
      const curClusterOption = res?.filter((item: any) => {
        if (item.value === '来未来') return item?.clusterId;
      });

      if (curClusterOption[0].clusterId) {
        setClusterInfo({
          curClusterId: curClusterOption[0].clusterId,
          curClusterName: '来未来',
        });
        getReleaseList({ clusterName: '来未来' });
      } else {
        setClusterInfo({
          curClusterId: res[0].clusterId,
          curClusterName: res[0].value,
        });
        getReleaseList({ clusterName: clusterOptions[0] });
      }
    });
  }, []);
  const queryClusterList = () => {
    setLoading(true);
    getClusterList()
      .then((res) => {
        setClusterOptions(res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getReleaseList = (paramsObj?: { releaseName?: string; namespace?: string; clusterName?: string }) => {
    setTableLoading(true);
    queryReleaseList(paramsObj)
      .then((res) => {
        setDataSource(res);
      })
      .finally(() => {
        setTableLoading(false);
      });
  };

  const dataSource = [
    {
      releaseName: 'dnsmasq',
      status: 'deployed',
      chart: 'dnsmasq',
      namespace: 'devops',
      cluster: 'future',
    },
    {
      releaseName: 'xxl-job',
      status: 'deployed',
      chart: 'xxl-job',
      namespace: 'devops',
      cluster: 'future',
    },
  ];

  // 表格列配置
  const tableColumns = useMemo(() => {
    return releaseTableSchema({
      onUpdateClick: (record, index) => {
        setCurRecord(record);
        setMode(true);
      },
      onDetailClick: (record, index) => {
        history.push({
          pathname: 'helm-detail',
          state: {
            record: record,
            curClusterName: curClusterName,
          },
        });
      },
      onDelClick: async (record, index) => {
        await deleteRelease({
          releaseName: record?.releaseName,
          namespace: record?.namespace,
          clusterName: record?.clusterName,
        }).then(() => {
          queryReleaseList();
        });
      },
    }) as any;
  }, []);

  const changeClusterName = (cluster: any) => {
    const params = releaseForm.getFieldsValue();
    setCurClusterName(cluster);
    const curClusterOption = clusterOptions?.filter((item: any) => {
      if (item.value === cluster) return item?.clusterId;
    });

    console.log('cluster[0-----]', cluster);
    setClusterInfo({
      curClusterId: curClusterOption[0].clusterId,
      curClusterName: cluster,
    });
    getReleaseList({ releaseName: params.releaseName, namespace: params.namespace, clusterName: cluster });
  };

  return (
    <PageContainer>
      <UpdateDeploy
        mode={mode}
        curRecord={curRecord}
        curClusterName={curClusterName}
        onCancle={() => {
          setMode(false);
        }}
        onSave={() => {
          setMode(false);
          getReleaseList({ clusterName: curClusterName });
        }}
      />

      <FilterCard>
        <div>
          <span>
            <b>选择集群：</b>
          </span>
          <Select
            loading={loading}
            options={clusterOptions}
            style={{ width: 290 }}
            allowClear
            showSearch
            defaultValue="来未来"
            onChange={changeClusterName}
          />
        </div>
      </FilterCard>
      <ContentCard>
        <div>
          <Form
            layout="inline"
            form={releaseForm}
            onFinish={(values: any) => {
              getReleaseList({
                ...values,
                clusterName: curClusterName,
              });
            }}
            onReset={() => {
              releaseForm.resetFields();
              getReleaseList({ clusterName: curClusterName });
            }}
          >
            <Form.Item label="命名空间" name="namespace">
              <Select placeholder="请输入命名空间" style={{ width: 290 }} />
            </Form.Item>
            <Form.Item label="名称：" name="releaseName">
              <Input placeholder="请输入名称" style={{ width: 290 }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="ghost" htmlType="reset">
                重置
              </Button>
            </Form.Item>
          </Form>
        </div>
        <Divider />
        <div className="table-caption">
          <div className="caption-left">
            <h3>release列表</h3>
          </div>
          <div className="caption-right">
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  setCurRecord(undefined);
                  history.push({
                    pathname: 'create-chart',
                    state: clusterInfo,
                  });
                }}
              >
                <PlusOutlined />
                创建
              </Button>
            </Space>
          </div>
        </div>

        <div>
          <Table
            columns={tableColumns}
            dataSource={tabledataSource}
            loading={tableLoading}
            pagination={{
              total: tabledataSource.length,
              pageSize: 20,
              showSizeChanger: false,
              showTotal: () => `总共 ${tabledataSource.length} 条数据`,
            }}
            // onChange={pageSizeClick}
          ></Table>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
