import React, { useRef, useState, useEffect } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import { Button, Input, Space, Tag, Form } from 'antd';
import { history } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import {
  useQueryParamList,
  useQueryDeliveryParamList,
  useSaveParam,
  useDeleteDeliveryParam,
  useQueryOriginList,
} from './hooks';
import { ProFormField } from '@ant-design/pro-form';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const TagList: React.FC<{
  value?: {
    key: string;
    label: string;
  }[];
  onChange?: (
    value: {
      key: string;
      label: string;
    }[],
  ) => void;
}> = ({ value, onChange }) => {
  const ref = useRef<any>(null);
  const [newTags, setNewTags] = useState<
    {
      key: string;
      label: string;
    }[]
  >([]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    let tempsTags = [...(value || [])];
    if (inputValue && tempsTags.filter((tag) => tag.label === inputValue).length === 0) {
      tempsTags = [...tempsTags, { key: `new-${tempsTags.length}`, label: inputValue }];
    }
    onChange?.(tempsTags);
    setNewTags([]);
    setInputValue('');
  };

  return (
    <Space>
      {(value || []).concat(newTags).map((item) => (
        <Tag key={item.key}>{item.label}</Tag>
      ))}
      <Input
        ref={ref}
        type="text"
        size="small"
        style={{ width: 78 }}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputConfirm}
        onPressEnter={handleInputConfirm}
      />
    </Space>
  );
};

type DataSourceType = {
  id: React.Key;
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
  versionId: any;
  initDataSource?: any;
}

export default (props: VersionDetailProps) => {
  const { currentTab, versionId, initDataSource } = props;
  const actionRef = useRef<ActionType>();
  const [originloading, originOptions, queryOriginList] = useQueryOriginList();
  const [tableLoading, tableDataSource, pageInfo, setPageInfo, setDataSource, queryDeliveryParamList] =
    useQueryDeliveryParamList();
  const [loading, options, queryParamList] = useQueryParamList();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  // const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  console.log('originOptions', originOptions);
  useEffect(() => {
    //获取参数来源组件
    queryOriginList(versionId);
  }, []);
  useEffect(() => {
    //查询交付配置参数
    queryDeliveryParamList(versionId);
  }, []);
  useEffect(() => {
    //获取组件参数及参数值
    queryParamList(versionId); //componentName
  }, [currentTab]);
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '参数来源组件',
      key: 'configParamComponent',
      dataIndex: 'configParamComponent',
      valueType: 'select',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      valueEnum: originOptions,
    },
    {
      title: '选择参数',
      key: 'configParamName',
      dataIndex: 'configParamName',
      valueType: 'select',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      valueEnum: {
        all: { text: '全部', status: 'Default' },
        open: {
          text: '未解决',
          status: 'Error',
        },
        closed: {
          text: '已解决',
          status: 'Success',
        },
      },
    },
    {
      title: '参数值',
      key: 'configParamValue',
      dataIndex: 'configParamValue',
    },
    {
      title: '参数说明',
      dataIndex: 'configParamDescription',
    },

    {
      title: '操作',
      valueType: 'option',
      width: 250,
      render: (text, record, _, action) => [
        // <a
        //   key="editable"
        //   onClick={() => {
        //     action?.startEditable?.(record.id);
        //   }}
        // >
        //   编辑
        // </a>,
        <a
          //  key="editable"
          onClick={() => {
            history.push({
              pathname: '/matrix/delivery/component-detail',
              state: {
                activeKey: 'component-config',
                componentId: record.id,
                type: 'componentParams',
              },
            });
          }}
        >
          配置
        </a>,
        <a
          key="delete"
          onClick={() => {
            setDataSource(tableDataSource.filter((item: any) => item.id !== record.id));
          }}
        >
          删除
        </a>,
      ],
    },
  ];
  const handleSearch = () => {
    const param = searchForm.getFieldsValue();
    queryDeliveryParamList(versionId, param);
  };
  return (
    <>
      <div className="table-caption-application">
        <div className="caption-left">
          <Form layout="inline" form={searchForm}>
            <Form.Item name="configParamComponent">
              <Input style={{ width: 220 }} placeholder="请输入组件参数"></Input>
            </Form.Item>
            <Form.Item>
              <Button onClick={handleSearch}>搜索</Button>
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
            添加组件参数
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
        //   // data: defaultData,
        //   total: 3,
        //   success: true,
        // })}
        value={tableDataSource}
        onChange={setDataSource}
        editable={{
          form,
          editableKeys,
          onSave: async () => {
            await waitTime(800);
          },
          onChange: setEditableRowKeys,
          actionRender: (row, config, dom) => [dom.save, dom.cancel],
        }}
      />
    </>
  );
};
