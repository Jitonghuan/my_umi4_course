import React, { useRef, useState, useEffect } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import { Button, Input, Space, Tag, Form, Select } from 'antd';
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
  initDataSource?: any;
}

export default (props: VersionDetailProps) => {
  const { currentTab, versionId, initDataSource } = props;
  const actionRef = useRef<ActionType>();
  const [saveLoading, saveParam] = useSaveParam();
  const [editLoading, editVersionParam] = useEditVersionParam();
  const [originloading, originOptions, queryOriginList] = useQueryOriginList();
  const [delLoading, deleteDeliveryParam] = useDeleteDeliveryParam();
  const [tableLoading, tableDataSource, pageInfo, setPageInfo, setDataSource, queryDeliveryParamList] =
    useQueryDeliveryParamList();
  const [loading, paramOptions, valueOptions, queryParamList] = useQueryParamList();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [type, setType] = useState<string>('');
  // const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
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
      valueEnum: paramOptions,
      // renderFormItem:(_, config: any, data)=>{

      // }
    },
    {
      title: '参数值',
      key: 'configParamValue',
      dataIndex: 'configParamValue',
      renderFormItem: (_, config: any, data) => {
        // 这里返回的值与Protable的render返回的值差不多,能获取到index,row,data 只是这里是获取对象组,外面会再包一层
        // console.log(_, config, data,'---',paramOptions[config.record?.configParamName])
        let currentValue = paramOptions[config.record?.configParamName];
        if (currentValue) {
          // data.setFieldsValue([{'configParamValue':''}]);
          // data.resetFields(['configParamValue'])
          // form.setFieldsValue({configParamValue:paramOptions[config.record?.configParamName].configParamValue})
          // setDataSource([config.record,...tableDataSource])
          // return  <span >{paramOptions[config.record?.configParamName].configParamValue}</span>
          return (
            <Select>
              <Select.Option value={currentValue.configParamValue}>{currentValue.configParamValue}</Select.Option>
            </Select>
          );
        }
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
            action?.startEditable?.(record.id);
            setType('edit');
          }}
        >
          编辑
        </a>,
        // <a
        //   //  key="editable"
        //   onClick={() => {
        //     history.push({
        //       pathname: '/matrix/delivery/component-detail',
        //       state: {
        //         activeKey: 'component-config',
        //         componentId: record.id,
        //         type: 'componentParams',
        //         // componentName: record.componentName,
        //         // componentVersion: record.componentVersion,
        //         // componentType:currentTab
        //       },
        //     });
        //   }}
        // >
        //   配置
        // </a>,
        <a
          key="delete"
          onClick={() => {
            deleteDeliveryParam(record.id).then(() => {
              setDataSource(tableDataSource.filter((item: any) => item.id !== record.id));
            });
          }}
        >
          删除
        </a>,
      ],
    },
  ];
  const cellChange = (values: any) => {};
  const handleSearch = () => {
    const param = searchForm.getFieldsValue();
    queryDeliveryParamList(versionId, param);
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
        // request={async () => ({
        //   // data: defaultData,
        //   total: 3,
        //   success: true,
        // })}

        value={tableDataSource}
        onChange={(values) => {
          tableChange(values);
          // setPageInfo({
          //   pageIndex: pagination.current,
          //   pageSize: pagination.pageSize,
          //   total: pagination.total,
          // });
          // let obj = {
          //   pageIndex: pagination.current,
          //   pageSize: pagination.pageSize,
          // };

          // loadListData(obj);
        }}
        editable={{
          form,
          editableKeys,
          onSave: async (values) => {
            let value = form.getFieldsValue();
            let objKey = Object.keys(value);
            let params = value[objKey[0]];
            if (type === 'add') {
              await saveParam({ ...params, versionId: versionId }).then(() => {
                queryDeliveryParamList(versionId);
              });
            } else if (type === 'edit') {
              editVersionParam({ ...params, versionId: versionId }).then(() => {
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
