import React, { useRef, useState, useEffect } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import { Button, Input, Space, Tag, Form, Select, message } from 'antd';
import { history } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import {
  useQueryParamList,
  useQueryDeliveryParamList,
  useSaveParam,
  useDeleteDeliveryParam,
  useQueryOriginList,
  useEditVersionParam,
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
  isEditable: boolean;
  initDataSource?: any;
}

export default (props: VersionDetailProps) => {
  const { currentTab, versionId, isEditable, initDataSource } = props;
  const actionRef = useRef<ActionType>();
  const [saveLoading, saveParam] = useSaveParam();
  const [editLoading, editVersionParam] = useEditVersionParam();
  const [originloading, originOptions, queryOriginList] = useQueryOriginList();
  const [delLoading, deleteDeliveryParam] = useDeleteDeliveryParam();
  const [tableLoading, tableDataSource, pageInfo, setPageInfo, setDataSource, queryDeliveryParamList] =
    useQueryDeliveryParamList();
  const [loading, paramOptions, queryParamList] = useQueryParamList();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [type, setType] = useState<string>('');
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  const updateRow = (rowKey: string, row: any) => {
    form.setFieldsValue({ [rowKey]: row });
  };
  useEffect(() => {
    //获取参数来源组件
    queryOriginList(versionId);
  }, []);
  useEffect(() => {
    //查询交付配置参数
    queryDeliveryParamList(versionId);
  }, []);
  const columns: ProColumns<any>[] = [
    {
      title: '参数来源组件',
      key: 'configParamComponent',
      dataIndex: 'configParamComponent',
      valueType: 'select',
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
      // valueEnum: originOptions,
      editable: (text, record, index) => {
        if (type === 'edit' && text) {
          return false;
        } else if (type === 'add' && !text) {
          return true;
        } else if (type === 'add' && text) {
          return false;
        } else {
          return true;
        }
      },
      renderFormItem: (_, config: any, data) => {
        return (
          <Select
            options={originOptions}
            onChange={(value: any) => {
              console.log('value', value);
              queryParamList(versionId, value);
            }}
          ></Select>
        );
      },
    },

    {
      title: '选择参数',
      key: 'configParamName',
      dataIndex: 'configParamName',
      valueType: 'select',
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
      renderFormItem: (_, config: any, data) => {
        let description = '';
        paramOptions.filter((item: any) => {
          if (item.value === config.record?.componentVersion) {
            description = item.componentDescription;
          }
        });
        return (
          <Select
            options={paramOptions}
            onChange={(value: any) => {
              // console.log('value', value);
              paramOptions.filter((item: any) => {
                if (item.value === value) {
                  updateRow(config.recordKey, {
                    ...form.getFieldsValue(config.recordKey),
                    configParamValue: item.configParamValue,
                  });
                }
              });
            }}
          ></Select>
        );
      },
    },
    {
      title: '参数值',
      key: 'configParamValue',
      dataIndex: 'configParamValue',
      renderFormItem: (_, config: any, data) => {
        return <Input disabled={true}></Input>;
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
        <a
          key="editable"
          onClick={() => {
            if (isEditable) {
              message.info('已发布不可以编辑!');
            } else {
              action?.startEditable?.(record.id);
              setType('edit');
              queryParamList(versionId, record.configParamComponent);
            }
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            if (isEditable) {
              message.info('已发布不可以删除!');
            } else {
              deleteDeliveryParam(record.id).then(() => {
                setDataSource(tableDataSource.filter((item: any) => item.id !== record.id));
              });
            }
          }}
        >
          删除
        </a>,
      ],
    },
  ];
  const handleSearch = () => {
    const param = searchForm.getFieldsValue();
    queryDeliveryParamList(versionId, param.configParamName);
  };
  const tableChange = (values: any) => {
    setDataSource;
  };

  return (
    <>
      <div className="table-caption-application">
        <div className="caption-left">
          <Form layout="inline" form={searchForm}>
            <Form.Item name="configParamComponent">
              <Input style={{ width: 220 }} placeholder="请输入参数来源组件"></Input>
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
            disabled={isEditable}
            onClick={() => {
              actionRef.current?.addEditRecord?.({
                id: (Math.random() * 1000000).toFixed(0),
              });
              setType('add');
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
        loading={tableLoading}
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
        headerTitle="可编辑表格"
        // maxLength={5}
        // 关闭默认的新建按钮
        recordCreatorProps={false}
        columns={columns}
        value={tableDataSource}
        onChange={(values) => {
          tableChange(values);
        }}
        editable={{
          form,
          editableKeys,
          onSave: async (values) => {
            let value = form.getFieldsValue();
            let objKey = Object.keys(value);
            let params = value[objKey[0]];
            if (type === 'add') {
              await saveParam({ ...params, versionId }).then(() => {
                queryDeliveryParamList(versionId);
              });
            } else if (type === 'edit') {
              editVersionParam({ ...params, id: parseInt(objKey[0]) }).then(() => {
                queryDeliveryParamList(versionId);
              });
            }
          },
          onChange: setEditableRowKeys,
          //  console.log('value',value)

          actionRender: (row, config, dom) => [dom.save, dom.cancel],
        }}
      />
    </>
  );
};
