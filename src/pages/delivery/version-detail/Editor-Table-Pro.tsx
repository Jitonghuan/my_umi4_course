import React, { useRef, useState, useEffect } from 'react';
import { history } from 'umi';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import { Button, Input, Space, Select, Form, Popconfirm } from 'antd';
import { productionPageTypes } from './tab-config';
import { PlusOutlined } from '@ant-design/icons';
import {
  useQueryComponentOptions,
  useQueryComponentVersionOptions,
  useQueryVersionComponentList,
  useDeleteVersionComponent,
  useAddCompontent,
} from './hooks';
import { ProFormField } from '@ant-design/pro-form';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const OptionList: React.FC<{
  value?: {
    label: string;
    value: string;
  }[];
  onChange?: (
    value: {
      label: string;
      value: string;
    }[],
  ) => void;
}> = ({ value, onChange }) => {
  const ref = useRef<any>(null);
  const [newTags, setNewTags] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [selectValue, setSelectValue] = useState<string>('');

  const handleSelectChange = (e: React.ChangeEvent<HTMLOptionElement>) => {
    console.log('e.target.value', e.target.value);
    setSelectValue(e.target.value);
  };

  return (
    <Space>
      {(value || []).concat(newTags).map((item) => (
        <Select key={item.value}>{item.label}</Select>
      ))}
      <Input
        ref={ref}
        type="text"
        size="small"
        style={{ width: 78 }}
        value={selectValue}
        // onChange={handleSelectChange}
      />
    </Space>
  );
};

type DataSourceType = {
  id: any;
  title?: string;
  labels?: {
    key: string;
    label: string;
  }[];
  state?: string;
  created_at?: string;
  children?: DataSourceType[];
};

export interface VersionDetailProps {
  currentTab: string;
  currentTabType: string;
  versionId: number;
  initDataSource?: any;
}

export default (props: VersionDetailProps) => {
  const { currentTab, versionId, currentTabType, initDataSource } = props;
  const [searchForm] = Form.useForm();
  const [addLoading, addComponent] = useAddCompontent();
  const [versionLoading, componentVersionOptions, queryProductVersionOptions] = useQueryComponentVersionOptions();
  const [componentLoading, componentOptions, queryComponentOptions] = useQueryComponentOptions();
  const [loading, tableDataSource, setDataSource, pageInfo, setPageInfo, queryVersionComponentList] =
    useQueryVersionComponentList();
  const [delLoading, deleteVersionComponent] = useDeleteVersionComponent();
  const actionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  // const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const [form] = Form.useForm();
  useEffect(() => {
    queryComponentOptions(currentTabType); //组件查询
    queryProductVersionOptions(currentTabType); //组件版本查询
    queryVersionComponentList(versionId, currentTab);
  }, [currentTab]);
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '组件名称',
      key: 'componentName',
      dataIndex: 'componentName',
      valueType: 'select',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      // renderFormItem:()=><TagList />
      valueEnum: componentOptions,
    },
    {
      title: '组件版本',
      key: 'componentVersion',
      dataIndex: 'componentVersion',
      valueType: 'select',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      valueEnum: componentVersionOptions,
    },
    {
      title: '组件描述',
      dataIndex: 'componentDescription',
    },

    {
      title: '操作',
      valueType: 'option',
      width: 250,
      render: (text, record: any, _, action) => [
        <a
          //  key="editable"
          onClick={() => {
            history.push({
              pathname: '/matrix/delivery/component-detail',
              state: {
                // activeKey: 'component-config',
                initRecord: record,
                componentName: record.componentName,
                componentVersion: record.componentVersion,
                componentId: record.id,
                componentType: currentTab,
              },
            });
          }}
        >
          配置
        </a>,
        <Popconfirm
          title="确定要删除吗？"
          onConfirm={() => {
            deleteVersionComponent(record.id).then(() => {
              setDataSource(tableDataSource.filter((item: any) => item.id !== record.id));
              // setDataSource(dataSource.filter((item: any) => item.id !== record.id));
            });
          }}
        >
          <a key="delete">删除</a>
        </Popconfirm>,
      ],
    },
  ];
  const search = () => {
    const componentName = searchForm.getFieldsValue();
    queryVersionComponentList(versionId, currentTab, componentName);
  };
  return (
    <>
      <div className="table-caption-application">
        <div className="caption-left">
          <Form layout="inline" form={searchForm}>
            <Form.Item name="componentName">
              <Input style={{ width: 220 }} placeholder="请输入组件名称"></Input>
            </Form.Item>
            <Form.Item>
              <Button
                onClick={() => {
                  search();
                }}
              >
                搜索
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="caption-right">
          <Button
            type="primary"
            onClick={() => {
              actionRef.current?.addEditRecord?.({
                id: (Math.random() * 1000000).toFixed(0),
              });
            }}
            icon={<PlusOutlined />}
          >
            {productionPageTypes[currentTab].text}
          </Button>
        </div>
      </div>
      {/* <Space>
         
            <Button
             key="rest"
             onClick={() => {
             form.resetFields();
          }}
          >
          重置表单
          </Button>
        </Space> */}

      <EditableProTable<DataSourceType>
        rowKey="id"
        actionRef={actionRef}
        headerTitle="可编辑表格"
        // maxLength={5}
        // 关闭默认的新建按钮
        recordCreatorProps={false}
        columns={columns}
        // request={async () => ({
        //   data: defaultData,
        //   total: 3,
        //   success: true,
        // })}
        value={tableDataSource}
        onChange={setDataSource}
        pagination={{
          total: pageInfo.total,
          pageSize: pageInfo.pageSize,
          current: pageInfo.pageIndex,
          showSizeChanger: true,
          onShowSizeChange: (_, size) => {
            setPageInfo({
              pageIndex: 1,
              pageSize: size,
            });
          },
          showTotal: () => `总共 ${pageInfo.total} 条数据`,
        }}
        editable={{
          form,
          editableKeys,
          onSave: async () => {
            let value = form.getFieldsValue();
            let objKey = Object.keys(value);
            let params = value[objKey[0]];
            // addComponent(versionId,initDataSource,)
            await addComponent({ versionId, ...params, componentType: currentTab }).then(() => {
              queryVersionComponentList(versionId, currentTab);
            });
          },
          onChange: setEditableRowKeys,
          actionRender: (row, config, dom) => [dom.save, dom.cancel],
        }}
      />
    </>
  );
};
