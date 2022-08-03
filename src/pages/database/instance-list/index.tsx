import React, { useMemo, useEffect, useState } from 'react';
import PageContainer from '@/components/page-container';
import { Button, Table, Form, Input, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { history } from 'umi';
import { createTableColumns, instanceTypeOption } from './schema';
import CreateInstance from './components/create-instance';
import { useDeleteInstance, useGetClusterList, useInstanceList } from './hook';
export default function InstanceList() {
  const [instanceForm] = Form.useForm();
  const [mode, setMode] = useState<EditorMode>('HIDE');
  const [curRecord, setcurRecord] = useState<any>({});
  const [loading, clusterOptions, getClusterList] = useGetClusterList();
  const [listLoading, pageInfo, dataSource, getInstanceList] = useInstanceList();
  const [delLoading, deleteInstance] = useDeleteInstance();
  useEffect(() => {
    getClusterList();
    getInstanceList({
      pageIndex: 1,
      pageSize: 20,
    });
  }, []);
  const columns = useMemo(() => {
    return createTableColumns({
      onEdit: (record, index) => {
        setcurRecord(record);
        setMode('EDIT');
      },
      onManage: (record, index) => {
        history.push({
          pathname: 'info',
          state: {
            curRecord: record,
            instanceId: record?.id,
            clusterId: record?.clusterId,
            optType: 'instance-list-manage',
          },
        });
      },
      onViewPerformance: (record, index) => {
        history.push({
          pathname: 'info',
          state: {
            curRecord: record,
            instanceId: record?.id,
            usterId: record?.clusterId,
            optType: 'instance-list-trend',
          },
        });
      },
      onDelete: async (id) => {
        deleteInstance({ id }).then(() => {
          loadListData({
            pageIndex: 1,
            pageSize: 20,
          });
        });
      },
      delLoading: delLoading,
    }) as any;
  }, []);
  //触发分页
  const pageSizeClick = (pagination: any) => {
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };

    loadListData(obj);
  };

  const loadListData = (params: any) => {
    let value = instanceForm.getFieldsValue();
    getInstanceList({ ...params, ...value });
  };

  return (
    <PageContainer>
      <CreateInstance
        mode={mode}
        curRecord={curRecord}
        onClose={() => {
          setMode('HIDE');
        }}
        onSave={() => {
          setMode('HIDE');
          loadListData({
            pageIndex: 1,
            pageSize: 20,
          });
        }}
      />
      <FilterCard>
        <div>
          <Form
            layout="inline"
            form={instanceForm}
            onFinish={(values: any) => {
              getInstanceList({
                ...values,
                pageIndex: 1,
                pageSize: 20,
              });
            }}
            onReset={() => {
              instanceForm.resetFields();
              getInstanceList({
                pageIndex: 1,
                pageSize: 20,
              });
            }}
          >
            <Form.Item label="实例名称" name="name">
              <Input placeholder="请输入实例名称" style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="类型" name="type">
              <Select placeholder="请选择实例类型" options={instanceTypeOption} style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="所属集群" name="clusterName">
              <Select placeholder="请选择集群" options={clusterOptions} allowClear showSearch style={{ width: 200 }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="ghost" htmlType="reset" danger>
                重置
              </Button>
            </Form.Item>
          </Form>
        </div>
      </FilterCard>
      <ContentCard>
        <div className="table-caption">
          <div className="caption-left">
            <h3>实例列表</h3>
          </div>
          <div className="caption-right">
            <Button
              type="primary"
              onClick={() => {
                setMode('ADD');
              }}
            >
              <PlusOutlined />
              新实例接入
            </Button>
          </div>
        </div>
        <div>
          <Table
            columns={columns}
            dataSource={dataSource}
            loading={listLoading}
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
