// DNS管理
// @author JITONGHUAN <muxi.jth@come-future.com>
// @create 2022/04/1 14:15

import React, { useState, useEffect, useCallback } from 'react';
import { history } from 'umi';
import { Input, Table, Popconfirm, Form, Button, Spin, Divider, Tag } from 'antd';
import { LoginOutlined, HighlightOutlined } from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import AddRecordModal from './addRecordEnv';
import ImportDataModal from './importData';
import {
  useDnsManageList,
  useDeleteDnsManage,
  useUpdateDnsManageStatus,
  useEnvCode,
  useDnsManageHostList,
} from './hooks';

import './index.less';

/** 编辑页回显数据 */
export interface recordEditData extends Record<string, any> {
  id: number;
  hostRecord: string;
  recordType: string;
  recordValue: string;
  status: number;
  remark: any;
  envCode: string;
}

export default function DNSManageList(props: any) {
  const [tableLoading, pageInfo, dataSource, setRecordDataSource, setPageInfo, getDnsManageList] = useDnsManageList();
  const [envCode, getDnsManageEnvCodeList] = useEnvCode();
  const [listLoading, hostSource, getDnsManageHostList] = useDnsManageHostList();
  const [statusLoading, updateDnsManage] = useUpdateDnsManageStatus();
  const [delLoading, deleteDnsManage] = useDeleteDnsManage();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [addRecordMode, setAddRecordMode] = useState<EditorMode>('HIDE');
  const [importDataMode, setImportDataMode] = useState<EditorMode>('HIDE');
  const [RecordForm] = Form.useForm();
  const [initEnvData, setInitEnvData] = useState<any>([]); //初始化数据

  useEffect(() => {
    getDnsManageEnvCodeList();
    getDnsManageHostList();
  }, []);

  const handleEditEnv = useCallback(
    (record: recordEditData, index: number, type) => {
      setInitEnvData(record);
      setAddRecordMode(type);
      setRecordDataSource(dataSource);
    },
    [dataSource],
  );
  const handleUpdateStatus = useCallback(
    (record: any) => {
      let paramObj = {
        envCode: envCode,
        id: record.id,
        status: record.status,
      };
      updateDnsManage(paramObj);
      setRecordDataSource(dataSource);
    },
    [dataSource],
  );

  //触发分页
  const pageSizeClick = (pagination: any) => {
    setPageInfo({
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    });
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    loadListData(obj);
  };

  const loadListData = (params: any) => {
    const values = RecordForm.getFieldsValue();
    getDnsManageList(...params, ...values);
  };

  //删除数据
  const handleDelRecord = (record: any) => {
    let id = record.id;
    deleteDnsManage({ envCode, id });
  };
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
  };

  return (
    <PageContainer className="DNS-list-content">
      <AddRecordModal
        mode={addRecordMode}
        initData={initEnvData}
        onSave={() => {
          setAddRecordMode('HIDE');
          setTimeout(() => {
            getDnsManageList();
          }, 100);
        }}
        onClose={() => setAddRecordMode('HIDE')}
      />
      <ImportDataModal mode={importDataMode} onClose={() => setImportDataMode('HIDE')} />
      <ContentCard>
        <div className="dns-server">
          当前的DNS服务器是：192.9.213.13,192.9.213.14
          {/* {hostSource?.map((item: any) => {
            return (
              <Spin spinning={listLoading}>
                <span>{item},</span>
              </Spin>
            );
          })} */}
        </div>
        <Divider />
        <div className="table-caption">
          <div className="caption-left">
            <Form layout="inline" form={RecordForm}>
              <Form.Item name="hostRecord">
                <Input style={{ width: 220 }} placeholder="请输入关键字"></Input>
              </Form.Item>
              <Form.Item>
                <Button type="primary">搜索</Button>
              </Form.Item>
            </Form>
          </div>
          <div className="caption-right">
            <Button
              type="primary"
              onClick={() => {
                setImportDataMode('ADD');
              }}
            >
              <LoginOutlined />
              导入导出
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setInitEnvData(undefined);
                setAddRecordMode('ADD');
              }}
            >
              <HighlightOutlined />
              添加记录
            </Button>
          </div>
        </div>

        <div style={{ marginTop: '15px' }}>
          <Table
            rowSelection={{ ...rowSelection }}
            dataSource={dataSource}
            loading={tableLoading}
            rowKey="id"
            pagination={{
              current: pageInfo.pageIndex,
              total: pageInfo.total,
              pageSize: pageInfo.pageSize,
              showSizeChanger: true,
              // onChange: (next) => setPageIndex(next),
              onShowSizeChange: (_, size) => {
                setPageInfo({
                  pageIndex: 1,
                  pageSize: size,
                });
              },
              showTotal: () => `总共 ${pageInfo.total} 条数据`,
            }}
            onChange={pageSizeClick}
          >
            <Table.Column title="主机记录" dataIndex="hostRecord" width={150} />
            <Table.Column title="记录类型" dataIndex="recordType" width={130} />
            <Table.Column title="记录值" dataIndex="recordValue" width={90} />
            <Table.Column
              title="状态"
              dataIndex="status"
              width={130}
              render={(value: string, record: any) => (
                <span>
                  <Tag color="green">{value}</Tag>
                </span>
              )}
            />
            <Table.Column title="备注" dataIndex="remark" width={200} />
            <Table.Column
              title="操作"
              width={180}
              render={(_, record: recordEditData, index) => (
                <div className="action-cell">
                  <Button size="small" type="primary" onClick={() => handleEditEnv(record, index, 'EDIT')}>
                    修改
                  </Button>
                  <Popconfirm title="确定要暂停吗？" onConfirm={() => handleUpdateStatus(record)}>
                    <Button size="small" type="primary" loading={statusLoading}>
                      暂停
                    </Button>
                  </Popconfirm>
                  <Popconfirm title="确定要删除吗？" onConfirm={() => handleDelRecord(record)}>
                    <Button size="small" style={{ color: 'red' }} loading={delLoading}>
                      删除
                    </Button>
                  </Popconfirm>
                </div>
              )}
            />
          </Table>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
