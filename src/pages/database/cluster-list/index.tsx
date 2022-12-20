import React, { useMemo, useEffect, useState } from 'react';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { Button, Form, Table, Input, Select } from 'antd';
import { createTableColumns, clusterTypeOption } from './schema';
import CreateCluster from './create-cluster';
import {history} from 'umi';
import { useDeleteCluster, useQueryEnvList, useClusterList } from './hook';
export default function ClusterList() {
  const [clusterForm] = Form.useForm();
  const [tableLoading, clusterTablePageInfo, clusterTableSource, getClusterList] = useClusterList();
  const [mode, setMode] = useState<EditorMode>('HIDE');
  const [envListLoading, envDataSource, queryEnvData] = useQueryEnvList();
  const [curRecord, setcurRecord] = useState<any>({});
  const [delLoading, deleteCluster] = useDeleteCluster();
  useEffect(() => {
    queryEnvData();
    getClusterList({
      pageIndex: 1,
      pageSize: 20,
    });
  }, []);

  const columns = useMemo(() => {
    return createTableColumns({
      onEdit: (record) => {
        setcurRecord(record);
        setMode('EDIT');
      },
      onView: (record) => {
        // setcurRecord(record);
        // setMode('VIEW');
        history.push({
          pathname:'/matrix/database/instance-list',
          search:`clusterId=${record?.id}&clusterName=${record?.name}`

        })
      },
      onDelete: async (id) => {
        deleteCluster({ id }).then(() => {
          loadListData({ pageIndex: 1, pageSize: 20 });
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
    let value = clusterForm.getFieldsValue();
    getClusterList({ ...params, ...value });
  };

  return (
    <PageContainer>
      <CreateCluster
        mode={mode}
        curRecord={curRecord}
        onClose={() => {
          setMode('HIDE');
        }}
        onSave={() => {
          setMode('HIDE');
          loadListData({ pageIndex: 1, pageSize: 20 });
        }}
      />

      <FilterCard>
        <div>
          <Form
            layout="inline"
            form={clusterForm}
            onFinish={(values: any) => {
              getClusterList({
                ...values,
                pageIndex: 1,
                pageSize: 20,
              });
            }}
            onReset={() => {
              clusterForm.resetFields();
              getClusterList({
                pageIndex: 1,
                pageSize: 20,
              });
            }}
          >
            <Form.Item label="集群名称" name="name">
              <Input placeholder="请输入集群名称" style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="集群类型" name="clusterType">
              <Select placeholder="请选择集群类型" options={clusterTypeOption} style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="环境Code" name="envCode">
              <Select
                placeholder="请选择环境Code"
                loading={envListLoading}
                options={envDataSource}
                allowClear
                showSearch
                style={{ width: 200 }}
              />
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
            <h3>集群列表</h3>
          </div>
          <div className="caption-right">
            <Button
              type="primary"
              onClick={() => {
                setMode('ADD');
              }}
            >
              + 新集群接入
            </Button>
          </div>
        </div>
        <div>
          <Table
            columns={columns}
            dataSource={clusterTableSource}
            loading={tableLoading}
            pagination={{
              current: clusterTablePageInfo.pageIndex,
              total: clusterTablePageInfo.total,
              pageSize: clusterTablePageInfo.pageSize,
              showSizeChanger: true,
              showTotal: () => `总共 ${clusterTablePageInfo.total} 条数据`,
            }}
            onChange={pageSizeClick}
          ></Table>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
