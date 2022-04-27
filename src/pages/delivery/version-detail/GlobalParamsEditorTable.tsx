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
  useEditVersionParam,
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
  versionId: any;
  initDataSource?: any;
}

export default (props: VersionDetailProps) => {
  const { currentTab, versionId, initDataSource } = props;
  const [saveLoading, saveParam] = useSaveParam();
  const [editLoading, editVersionParam] = useEditVersionParam();
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
  const [type, setType] = useState<string>('');
  // const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  useEffect(() => {
    //查询交付配置参数
    queryDeliveryGloableParamList(versionId, 'global');
    queryDeliveryParamList(versionId);
  }, []);

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '参数来源组件',
      key: 'configParamName',
      dataIndex: 'configParamName',
      // valueType: 'input',
      editable: (text, record, index) => {
        console.log('text', text, record);
        if (type === 'edit' && text) {
          return false;
        } else if (type === 'add' && !text) {
          return true;
        } else if (type === 'add' && text) {
          return false;
        } else {
          return true;
        }

        // return (type==='edit'||(type==='add'&& !text))?false :true
      },

      formItemProps: () => {
        return {
          rules: [
            {
              required: true,
              message: '此项为必填项',
            },
          ],
          errorType: 'default',
        };
      },
    },
    {
      title: '参数值',
      key: 'configParamValue',
      dataIndex: 'configParamValue',
      // valueType: 'select',
      formItemProps: () => {
        return {
          rules: [
            {
              required: true,
              message: '此项为必填项',
            },
          ],
          errorType: 'default',
        };
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
      render: (text, record: any, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
            setType('edit');
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            console.log('record', record);
            deleteDeliveryParam(record.id).then(() => {
              setGloableDataSource(gloableTableDataSource.filter((item: any) => item.id !== record.id));
            });
          }}
        >
          删除
        </a>,
      ],
    },
  ];
  const handleSearch = () => {
    const param = searchForm.getFieldsValue();
    queryDeliveryGloableParamList(versionId, 'global', param.configParamName);
  };
  return (
    <>
      <div className="table-caption-application">
        <div className="caption-left">
          <Form layout="inline" form={searchForm}>
            <Form.Item name="configParamName">
              <Input style={{ width: 220 }} placeholder="请输入组件名称"></Input>
            </Form.Item>
            <Form.Item>
              <Button onClick={handleSearch} type="primary">
                搜索
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="caption-right">
          <Button
            type="primary"
            onClick={() => {
              setType('add');
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
        pagination={{
          total: pageInfo.total,
          pageSize: pageInfo.pageSize,
          current: pageInfo.pageIndex,
          showSizeChanger: true,
          // onShowSizeChange: (_, size) => {
          //   setPageInfo({
          //     pageIndex: 1,
          //     pageSize: size,
          //   });
          // },
          showTotal: () => `总共 ${pageInfo.total} 条数据`,
        }}
        value={gloableTableDataSource}
        onChange={setGloableDataSource}
        editable={{
          form,
          editableKeys,
          onSave: async () => {
            let value = form.getFieldsValue();
            let objKey = Object.keys(value);
            console.log('value', value, objKey);
            let params = value[objKey[0]];
            if (type === 'add') {
              await saveParam({ ...params, versionId: versionId, configParamComponent: 'global' }).then(() => {
                queryDeliveryGloableParamList(versionId, 'global');
              });
            } else if (type === 'edit') {
              editVersionParam({ ...params, versionId: versionId }).then(() => {
                queryDeliveryGloableParamList(versionId, 'global');
              });
            }

            // await waitTime(800);
          },
          onChange: setEditableRowKeys,
          actionRender: (row, config, dom) => [dom.save, dom.cancel],
        }}
      />
    </>
  );
};
