import type { ProColumns } from '@ant-design/pro-table';
import {  Input, Select,  Popconfirm, } from 'antd';
export type DataSourceType = {
  id: any;
  title?: string;
  labels?: {
    key: string;
    label: string;
  }[];
  state?: string;
  created_at?: string;
  children?: DataSourceType[];
  recordCreatorProps?: any;
};


  // 列表页-表格
export const createCompontentsTableColumns = (params: {
    type:string;
    paramOptions:any;
    originOptions:any;
    releaseOption:any;
    namespaceOption:any;
    onComChange: (value: any) => void;
    onParamChange: (config: any,value: any) => void;
    onEdit: (record: any, action: any,) => void;
    onDelete: (record: any) => void;
    // currentTabType;
  }) => {
    return [
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
              if (params?.type === 'edit' && text) {
                return false;
              } else if (params?.type === 'add' && !text) {
                return true;
              } else if (params?.type === 'add' && text) {
                return false;
              } else {
                return true;
              }
            },
            renderFormItem: (_, config: any, data) => {
              return (
                <Select
                  options={params?.originOptions}
                  showSearch
                  allowClear
                  onChange={(value: any) => {
                    params?.onComChange(value)
                  }}
                ></Select>
              );
            },
          },
          {
            title: 'Release名称',
            key: 'paramComponentReleaseName',
            dataIndex: 'paramComponentReleaseName',
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
              //  ]
              return (
                <Select
                  options={params?.releaseOption}
                  showSearch
                  allowClear
                  // onChange={(value: any) => {
      
                  // }}
                ></Select>
              );
            },
          },
          {
            title: 'Namespace',
            key: 'paramComponentNamespace',
            dataIndex: 'paramComponentNamespace',
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
              return (
                <Select
                  options={params?.namespaceOption}
                  showSearch
                  allowClear
                  // onChange={(value: any) => {
      
                  // }}
                ></Select>
              );
            },
          },
      
          {
            title: '参数选择',
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
              params?.paramOptions.filter((item: any) => {
                if (item.value === config.record?.componentVersion) {
                  description = item.componentDescription;
                }
              });
              return (
                <Select
                  options={params?.paramOptions}
                  showSearch
                  allowClear
                  onChange={(value: any) => {
                    params?.onParamChange(config,value)
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
            width: 150,
            render: (text, record, _, action) => [
              //text, record, _, action
              <a
                key="editable"
                onClick={() => {
                params?.onEdit(record,action)
                
                }}
              >
                编辑
              </a>,
              <Popconfirm
                title="确定要删除吗？"
                onConfirm={() => {
                 params?.onDelete(record)
                }}
              >
                <a key="delete" style={{ color: 'rgb(255, 48, 3)' }}>
                  删除
                </a>
              </Popconfirm>,
            ],
          },
    ] as ProColumns<DataSourceType>[];
  };
