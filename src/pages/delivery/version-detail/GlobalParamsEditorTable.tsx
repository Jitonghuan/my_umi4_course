import React, { useRef, useState, useEffect } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import { history } from 'umi';
import { EditableProTable } from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import { Button, Input, Space, Tag, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ProFormField } from '@ant-design/pro-form';
import {
  useQueryOriginList,
  useQueryDeliveryParamList,
  useSaveParam,
  useQueryDeliveryGloableParamList,
  useDeleteDeliveryParam,
} from './hooks';

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

const defaultData: DataSourceType[] = [
  {
    id: 624748504,
    title: '活动名称一',
    labels: [{ key: 'woman', label: '川妹子' }],
    state: 'open',
    created_at: '2020-05-26T09:42:56Z',
  },
  {
    id: 624691229,
    title: '活动名称二',
    labels: [{ key: 'man', label: '西北汉子' }],
    state: 'closed',
    created_at: '2020-05-26T08:19:22Z',
  },
];

export interface VersionDetailProps {
  currentTab: string;
  versionId: any;
  initDataSource?: any;
}

export default (props: VersionDetailProps) => {
  const { currentTab, versionId, initDataSource } = props;
  const actionRef = useRef<ActionType>();
  const [
    gloableTableLoading,
    gloableTableDataSource,
    gloablePageInfo,
    setGloablePageInfo,
    setGloableDataSource,
    queryDeliveryGloableParamList,
  ] = useQueryDeliveryGloableParamList();
  const [tableLoading, tableDataSource, pageInfo, setPageInfo, setDataSource, queryDeliveryParamList] =
    useQueryDeliveryParamList();
  const [delLoading, deleteDeliveryParam] = useDeleteDeliveryParam();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  // const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  useEffect(() => {
    //查询交付配置参数
    queryDeliveryGloableParamList(versionId, 'gloable');
    queryDeliveryParamList(versionId);
  }, []);

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '参数来源组件',
      key: 'configParamName',
      dataIndex: 'configParamName',
      // valueType: 'input',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '参数值',
      key: 'configParamValue',
      dataIndex: 'configParamValue',
      // valueType: 'select',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
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
          // onClick={() => {
          //   action?.startEditable?.(record.id);
          // }}
          onClick={() => {
            history.push({
              pathname: '/matrix/delivery/component-detail',
              state: {
                activeKey: 'component-config',
                componentId: record.id,
              },
            });
          }}
        >
          配置
        </a>,
        <a
          key="delete"
          onClick={() => {
            setGloableDataSource(gloableTableDataSource.filter((item: any) => item.id !== record.id));
          }}
        >
          删除
        </a>,
      ],
    },
  ];
  const handleSearch = () => {
    const param = searchForm.getFieldsValue();
    queryDeliveryGloableParamList(versionId, 'global', param);
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
            添加全局参数
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
        value={gloableTableDataSource}
        onChange={setGloableDataSource}
        editable={{
          form,
          editableKeys,
          onSave: async () => {
            let value = form.getFieldsValue();
            console.log('value', value);
            await waitTime(800);
          },
          onChange: setEditableRowKeys,
          actionRender: (row, config, dom) => [dom.save, dom.cancel],
        }}
      />
    </>
  );
};
