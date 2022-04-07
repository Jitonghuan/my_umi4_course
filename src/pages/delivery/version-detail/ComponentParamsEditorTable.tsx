import React, { useRef, useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import { Button, Input, Space, Tag, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
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
  initDataSource?: any;
}

export default (props: VersionDetailProps) => {
  const { currentTab, initDataSource } = props;
  const actionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const [form] = Form.useForm();
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '参数来源组件',
      key: 'name',
      dataIndex: 'name',
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
      title: '选择参数',
      key: 'version',
      dataIndex: 'version',
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
      key: 'version',
      dataIndex: 'version',
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
      title: '参数说明',
      dataIndex: 'decs',
      fieldProps: (from, { rowKey, rowIndex }) => {
        if (from.getFieldValue([rowKey || '', 'title']) === '不好玩') {
          return {
            disabled: true,
          };
        }
        if (rowIndex > 9) {
          return {
            disabled: true,
          };
        }
        return {};
      },
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
            action?.startEditable?.(record.id);
          }}
        >
          配置
        </a>,
        <a
          key="delete"
          onClick={() => {
            setDataSource(dataSource.filter((item: any) => item.id !== record.id));
          }}
        >
          删除
        </a>,
      ],
    },
  ];
  return (
    <>
      <div className="table-caption-application">
        <div className="caption-left">
          <Form layout="inline">
            <Form.Item>
              <Input style={{ width: 220 }} placeholder="请输入组件名称"></Input>
            </Form.Item>
            <Form.Item>
              <Button>搜索</Button>
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
        request={async () => ({
          data: defaultData,
          total: 3,
          success: true,
        })}
        value={dataSource}
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
