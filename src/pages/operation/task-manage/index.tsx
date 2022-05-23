// DNS管理
// @author JITONGHUAN <muxi.jth@come-future.com>
// @create 2022/04/1 14:15

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { history } from 'umi';
import { Input, Table, Popconfirm, Form, Button, Spin, Select, Divider, Tag, Cascader, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import AddRecordModal from './addRecordEnv';
import { taskTableSchema } from './schema';
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
  const [addTaskMode, setAddTaskMode] = useState<EditorMode>('HIDE');
  const [taskForm] = Form.useForm();
  const [initEnvData, setInitEnvData] = useState<any>([]); //初始化数据
  const [curRecord, setCurRecord] = useState<any>();
  const [createAppVisible, setCreateAppVisible] = useState(false);

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
    let value = taskForm.getFieldsValue();
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
    let value = taskForm.getFieldsValue();
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

  // 表格列配置
  const tableColumns = useMemo(() => {
    return taskTableSchema({
      onEditClick: (record, index) => {
        setCurRecord(record);
        setCreateAppVisible(true);
      },
      onDelClick: async (record, index) => {
        // await deleteApp({ appCode: record.appCode, id: record.id });
        message.success('删除成功');
        // loadAppListData();
      },
      // selectedRows,
      initEnvData,
    }) as any;
  }, []);

  return (
    <PageContainer className="DNS-list-content">
      <AddRecordModal
        mode={addTaskMode}
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

      <FilterCard>
        <div>
          <Form
            layout="inline"
            form={taskForm}
            onFinish={(values: any) => {
              // queryEnvData({
              //   ...values,
              //   pageIndex: 1,
              //   pageSize: 20,
              // });
            }}
            onReset={() => {
              taskForm.resetFields();
              // queryEnvData({
              //   pageIndex: 1,
              //   // pageSize: pageSize,
              // });
            }}
          >
            <Form.Item label="任务Code：" name="taskCode">
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
            <h3>任务列表</h3>
          </div>
          <div className="caption-right">
            <Button
              type="primary"
              onClick={() => {
                setInitEnvData(undefined);
                setAddTaskMode('ADD');
              }}
            >
              <PlusOutlined />
              创建任务
            </Button>
          </div>
        </div>
        <div>
          <Table columns={tableColumns}></Table>
          {/* taskTableSchema  */}
        </div>
      </ContentCard>
    </PageContainer>
  );
}
