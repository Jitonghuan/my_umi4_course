import React, { useRef, useState, useEffect } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import { Button, Input, Form, Select, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  useQueryParamList,
  useQueryDeliveryParamList,
  useSaveParam,
  useDeleteDeliveryParam,
  useQueryOriginList,
  useEditVersionParam,
} from './hooks';

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
      key: 'paramComponent',
      dataIndex: 'paramComponent',
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
      key: 'paramName',
      dataIndex: 'paramName',
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
                    paramValue: item.paramValue,
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
      key: 'paramValue',
      dataIndex: 'paramValue',
      renderFormItem: (_, config: any, data) => {
        return <Input disabled={true}></Input>;
      },
    },
    {
      title: '参数说明',
      dataIndex: 'paramDescription',
    },

    {
      title: '操作',
      valueType: 'option',
      width: 250,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            // if (isEditable) {
            //   message.info('已发布不可以编辑!');
            // } else {
            action?.startEditable?.(record.id);
            setType('edit');
            queryParamList(versionId, record.paramComponent);
            // }
          }}
        >
          编辑
        </a>,
        <Popconfirm
          title="确定要删除吗？"
          onConfirm={() => {
            deleteDeliveryParam(record.id).then(() => {
              setDataSource(tableDataSource.filter((item: any) => item.id !== record.id));
            });
          }}
        >
          <a key="delete">删除</a>
        </Popconfirm>,
      ],
    },
  ];
  const handleSearch = () => {
    const param = searchForm.getFieldsValue();
    queryDeliveryParamList(versionId, param.paramName);
  };
  const tableChange = (values: any) => {
    setDataSource;
  };

  return (
    <>
      <div className="table-caption-application">
        <div className="caption-left">
          <Form layout="inline" form={searchForm}>
            <Form.Item name="paramComponent">
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
          actionRender: (row, config, dom) => [dom.save, dom.cancel],
        }}
      />
    </>
  );
};
