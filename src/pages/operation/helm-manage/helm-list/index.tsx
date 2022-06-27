// 任务管理
// @author JITONGHUAN <muxi.jth@come-future.com>
// @create 2022/04/1 14:15

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { history } from 'umi';
import { Input, Table, Form, Button, Space, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { releaseTableSchema } from './schema';
import { queryReleaseList, useGetClusterList } from './hook';
import UpdateDeploy from './update-deploy';

type StatusTypeItem = {
  color: string;
  tagText: string;
};

const STATUS_TYPE: Record<string, StatusTypeItem> = {
  '0': { tagText: '正常', color: 'green' },
  '1': { tagText: '暂停', color: 'default' },
};

export default function DNSManageList(props: any) {
  //   const [tableLoading, taskTablePageInfo, taskTableSource, setTaskTableSource, setTaskTablePageInfo, queryReleaseList] =
  //     useTaskList();
  //   const [loading, pageInfo, source, setSource, setPageInfo, getTaskImplementList] = useTaskImplementList();
  //   const [delLoading, deleteTask] = useDeleteTask();
  const [executionDetailsMode, setExecutionDetailsMode] = useState<EditorMode>('HIDE');
  const [addTaskMode, setAddReleaseMode] = useState<EditorMode>('HIDE');
  const [loading, clusterOptions, getClusterList] = useGetClusterList();
  const [releaseForm] = Form.useForm();
  const [curRecord, setCurRecord] = useState<any>();
  const [createAppVisible, setCreateAppVisible] = useState(false);
  const [pageInfo, setPageInfo] = useState<any>({});
  const [tableLoading, setTableLoading] = useState<any>(false);
  const [tabledataSource, setDataSource] = useState<any>([]);
  const [curClusterName, setCurClusterName] = useState<any>('来未来');
  const [mode, setMode] = useState<boolean>(false);

  useEffect(() => {
    getReleaseList({ clusterName: '来未来' });
    setCurClusterName('来未来' || clusterOptions[0].value);
    getClusterList();
  }, []);

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
  //触发分页
  // const pageSizeClick = (pagination: any) => {
  //   setPageInfo({
  //     pageIndex: pagination.current,
  //     pageSize: pagination.pageSize,
  //     total: pagination.total,
  //   });
  //   let obj = {
  //     pageIndex: pagination.current,
  //     pageSize: pagination.pageSize,
  //   };

  //   loadListData(obj);
  // };

  // const loadListData = (params: any) => {
  //   let value = releaseForm.getFieldsValue();
  //   queryReleaseList({ ...params, ...value });
  // };

  // 表格列配置
  const tableColumns = useMemo(() => {
    return releaseTableSchema({
      onUpdateClick: (record, index) => {
        setCurRecord(record);
        setMode(true);
      },
      onViewClick: (record, index) => {
        history.push({
          pathname: 'helm-detail',
          state: {
            record: record,
            curClusterName: curClusterName,
          },
        });
      },
      onDelClick: async (record, index) => {
        // await deleteTask({ jobCode: record?.jobCode }).then(() => {
        //   queryReleaseList();
        // });
      },
      onGetExecutionDetailClick: (record, index) => {
        setCurRecord(record);
        setExecutionDetailsMode('VIEW');
      },
      onSwitchEnableClick: (record, index) => {
        let enable = record?.enable === 1 ? 2 : 1;
        let paramsObj = {
          ...record,
          enable: enable,
        };

        // updateTaskManage(paramsObj).then(() => {
        //     queryReleaseList();
        //   });
      },
    }) as any;
  }, []);

  const changeClusterName = (value: string) => {
    const params = releaseForm.getFieldsValue();
    setCurClusterName(value);
    getReleaseList({ releaseName: params.releaseName, namespace: params.namespace, clusterName: value });
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
                  setAddReleaseMode('ADD');
                  history.push('create-release');
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
            dataSource={dataSource}
            loading={tableLoading}
            // pagination={{
            //   current: pageInfo.pageIndex,
            //   total: pageInfo.total,
            //   pageSize: pageInfo.pageSize,
            //   showSizeChanger: true,
            //   showTotal: () => `总共 ${pageInfo.total} 条数据`,
            // }}
            // onChange={pageSizeClick}
          ></Table>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
