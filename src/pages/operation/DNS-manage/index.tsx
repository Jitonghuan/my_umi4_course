// DNS管理
// @author JITONGHUAN <muxi.jth@come-future.com>
// @create 2022/04/1 14:15

import React, { useState, useEffect, useCallback } from 'react';
import { history } from 'umi';
import { Input, Table, Popconfirm, Form, Button, Spin, Divider, Tag, Cascader, message } from 'antd';
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

type StatusTypeItem = {
  color: string;
  tagText: string;
};

const STATUS_TYPE: Record<string, StatusTypeItem> = {
  '0': { tagText: '正常', color: 'green' },
  '1': { tagText: '暂停', color: 'default' },
};
export const CascaderOptions = [
  {
    label: '主机记录',
    value: 'hostRecord',
  },
  {
    label: '记录类型',
    value: 'recordType',
  },
  {
    label: '记录值',
    value: 'recordValue',
  },
  {
    label: '状态',
    value: 'status',
  },
];
/** 编辑页回显数据 */
export interface recordEditData extends Record<string, any> {
  id: number;
  hostRecord: string;
  recordType: string;
  recordValue: string;
  status: string;
  remark: any;
  envCode: string;
}

export default function DNSManageList(props: any) {
  const [tableLoading, pageInfo, dataSource, setRecordDataSource, setPageInfo, getDnsManageList] = useDnsManageList();
  const [currentEnvCode, getDnsManageEnvCodeList] = useEnvCode();
  const [selectCascaderValue, setSelectCascaderValue] = useState<string>('');
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
  useEffect(() => {
    if (currentEnvCode.envCode) {
      getDnsManageList({ currentEnvCode });
    }
  }, [currentEnvCode.envCode]);

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
      let newStatus: string = record.status === '0' ? '1' : '0';
      let paramObj = {
        envCode: currentEnvCode.envCode,
        id: record.id,
        status: newStatus,
      };
      updateDnsManage(paramObj).then(() => {
        loadListData({ pageIndex: pageInfo.pageIndex, pageSize: pageInfo.pageSize });
      });
      setRecordDataSource(dataSource);
    },
    [dataSource],
  );

  //触发分页
  const pageSizeClick = (pagination: any) => {
    console.log('pagination', pagination);
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
    let value = RecordForm.getFieldsValue();
    // let paramObj = {
    //   [selectCascaderValue]: value.keyword,
    // };
    // getDnsManageList({ currentEnvCode, ...params,...value });
    if (value) {
      getDnsManageList({ currentEnvCode, ...value, ...params });
    } else {
      getDnsManageList({ currentEnvCode, ...params });
    }
  };

  //删除数据
  const handleDelRecord = (record: any) => {
    let id = record.id;
    deleteDnsManage({ envCode: currentEnvCode.envCode, id }).then(() => {
      loadListData({ pageIndex: pageInfo.pageIndex, pageSize: pageInfo.pageSize });
      // getDnsManageList({ currentEnvCode });
    });
  };
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
  };
  const handleSearch = () => {
    let value = RecordForm.getFieldsValue();
    // let paramObj = {
    //   [selectCascaderValue]: value.keyword,
    // };
    getDnsManageList({ currentEnvCode, ...value });
    // if (selectCascaderValue) {
    //   getDnsManageList({ currentEnvCode, ...paramObj });
    // } else {
    //   message.warning('请先选择查询类型');
    // }
  };
  const selectCascader = (values: any) => {
    setSelectCascaderValue(values[0]);
  };

  return (
    <PageContainer className="DNS-list-content">
      <AddRecordModal
        mode={addRecordMode}
        initData={initEnvData}
        envCode={currentEnvCode}
        onSave={() => {
          setAddRecordMode('HIDE');
          setTimeout(() => {
            getDnsManageList({ currentEnvCode });
          }, 100);
        }}
        onClose={() => setAddRecordMode('HIDE')}
      />
      <ImportDataModal
        mode={importDataMode}
        onClose={() => setImportDataMode('HIDE')}
        onSave={() => {
          setImportDataMode('HIDE');
          setTimeout(() => {
            getDnsManageList({ currentEnvCode });
          }, 100);
        }}
        selectedRowKeys={selectedRowKeys}
        envCode={currentEnvCode.envCode}
      />
      <ContentCard>
        <div className="dns-server">
          当前的DNS服务器是：
          {hostSource.toString().replace(/\"/g, '')}
        </div>
        <Divider />
        <div className="table-caption">
          <div className="caption-left">
            <Form layout="inline" form={RecordForm}>
              <Form.Item name="keyWord">
                <Input
                  // addonBefore={
                  //   <Cascader
                  //     placeholder="选择查询项"
                  //     style={{ width: 130 }}
                  //     options={CascaderOptions}
                  //     onChange={selectCascader}
                  //   />
                  // }
                  style={{ width: 500 }}
                  placeholder="请输入关键字"
                ></Input>
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={handleSearch}>
                  搜索
                </Button>
                <Button
                  type="default"
                  danger
                  style={{ marginLeft: 10 }}
                  onClick={() => {
                    RecordForm.resetFields();
                    getDnsManageList({ currentEnvCode });
                  }}
                >
                  重置
                </Button>
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
              // onShowSizeChange: (_, size) => {
              //   debugger
              //   setPageInfo({
              //     pageIndex: 1,
              //     pageSize: size,
              //   });
              // },
              showTotal: () => `总共 ${pageInfo.total} 条数据`,
            }}
            onChange={pageSizeClick}
          >
            <Table.Column title="主机记录" dataIndex="hostRecord" width="20%" />
            <Table.Column title="记录类型" dataIndex="recordType" width="12%" />
            <Table.Column title="记录值" dataIndex="recordValue" width="20%" />
            <Table.Column
              title="状态"
              dataIndex="status"
              width={130}
              render={(value: string, record: any) => (
                <span>
                  <Tag color={STATUS_TYPE[value].color}>{STATUS_TYPE[value].tagText}</Tag>
                </span>
              )}
            />
            <Table.Column title="备注" dataIndex="remark" width={200} />
            <Table.Column
              title="操作"
              width="20%"
              render={(_, record: recordEditData, index) => (
                <div className="action-cell">
                  <Button size="small" type="primary" onClick={() => handleEditEnv(record, index, 'EDIT')}>
                    修改
                  </Button>
                  <Popconfirm title="确定要暂停吗？" onConfirm={() => handleUpdateStatus(record)}>
                    <Button key={index} size="small" type={record.status === '0' ? 'default' : 'primary'}>
                      {record.status === '0' ? '停用' : '启用'}
                    </Button>
                  </Popconfirm>
                  <Popconfirm title="确定要删除吗？" onConfirm={() => handleDelRecord(record)}>
                    <Button size="small" style={{ color: 'red' }} danger loading={delLoading}>
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
