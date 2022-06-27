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

  useEffect(() => {
    queryReleaseList();
    getClusterList();
  }, []);

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
  const pageSizeClick = (pagination: any) => {
    setPageInfo({
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
    });
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };

    loadListData(obj);
  };

  const loadListData = (params: any) => {
    let value = releaseForm.getFieldsValue();
    queryReleaseList({ ...params, ...value });
  };

  // 表格列配置
  const tableColumns = useMemo(() => {
    return releaseTableSchema({
      onEditClick: (record, index) => {
        setCurRecord(record);
        setAddReleaseMode('EDIT');
      },
      onViewClick: (record, index) => {
        history.push({
          pathname: 'helm-detail',
          state: {
            record: record,
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

  return (
    <PageContainer>
      {/* <ExecutionDetailsModal
        mode={executionDetailsMode}
        curRecord={curRecord}
        onClose={() => setExecutionDetailsMode('HIDE')}
      />
      <CreateTaskModal
        mode={addTaskMode}
        initData={curRecord}
        onSave={() => {
          setAddReleaseMode('HIDE');
          setTimeout(() => {
            queryReleaseList();
          }, 200);
        }}
        onClose={() => setAddReleaseMode('HIDE')}
      /> */}

      <FilterCard>
        <div>
          <Form
            layout="inline"
            form={releaseForm}
            onFinish={(values: any) => {
              queryReleaseList({
                ...values,
                pageIndex: 1,
                pageSize: 20,
              });
            }}
            onReset={() => {
              releaseForm.resetFields();
              queryReleaseList({
                pageIndex: 1,
                // pageSize: pageSize,
              });
            }}
          >
            <Form.Item label="选择集群" name="clusterName">
              <Select placeholder="请输入任务Code" options={clusterOptions} style={{ width: 290 }} />
            </Form.Item>
            <Form.Item label="命名空间" name="namespace">
              <Select placeholder="请输入任务Code" style={{ width: 290 }} />
            </Form.Item>
            <Form.Item label="名称：" name="releaseName">
              <Input placeholder="请输入任务Code" style={{ width: 290 }} />
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
      </FilterCard>
      <ContentCard>
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
            loading={false}
            pagination={{
              current: pageInfo.pageIndex,
              total: pageInfo.total,
              pageSize: pageInfo.pageSize,
              showSizeChanger: true,
              showTotal: () => `总共 ${pageInfo.total} 条数据`,
            }}
            onChange={pageSizeClick}
          ></Table>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
