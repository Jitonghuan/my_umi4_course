import type { ProColumns } from '@ant-design/pro-table';
import {  Input, Select,  Popconfirm,InputNumber} from 'antd';

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
  // 列表页-表格
export const createMiddlewareTableColumns = (params: {
    nameOnchange: (record: any, config: any) => void;
    onEdit: (text:React.ReactNode, record: any, _:any, action:any) => void;
    onDelete: (record: any) => void;
    componentOptions:any;
    componentVersionOptions:any
    namespaceOption:any;
    type:string;
  }) => {
    return [
      {
        title: '中间件名称',
        dataIndex: 'componentName',
        key: 'componentName',
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
            params?.componentOptions.filter((item: any) => {
              if (item.label === config.record?.componentName) {
                description = item.componentDescription;
              }
            });
            return (
              <Select
                options={ params?.componentOptions}
                showSearch
                allowClear
                disabled={params?.type==="edit"}
                labelInValue
                optionFilterProp="label"
                onChange={(param: any) => {
                  params?.nameOnchange(param,config)
                }}
              ></Select>
            );
          },
      },
      {
        title: '版本',
        key: 'componentVersion',
        dataIndex: 'componentVersion',
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
              options={params?.componentVersionOptions}
              showSearch
              allowClear
              // onChange={(value: any) => {
  
              // }}
            ></Select>
          );
        },
      },
      {
        title: 'Release名称',
        key: 'componentReleaseName',
        dataIndex: 'componentReleaseName',
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
            <Input/>
          )},
      },
      {
        title: 'Namespace',
        key: 'componentNamespace',
        dataIndex: 'componentNamespace',
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
              onChange={(value: any) => {
               
              }}
            ></Select>
          );
        },
      },
      {
        title: '中间件描述',
        dataIndex: 'componentDescription',
        renderFormItem: (_, config: any, data) => {
          return <Input></Input>;
        },
      },
      {title: '部署优先级',
      key: 'componentPriority',
      dataIndex: 'componentPriority',
      renderFormItem: (_, config: any, data) => {
       
        //  ]
        return (
          
        <InputNumber placeholder="请输入1-100之间的值"  min={1} max={100}  style={{width:"100%"}}/>
        );
      },
    },
    //componentDependency
    {title: '依赖',
    key: 'componentDependency',
    dataIndex: 'componentDependency',
    renderFormItem: (_, config: any, data) => {
     
      //  ]
      return (
        
      <Input  disabled={true}  style={{width:"100%"}}/>
      );
    },
  },
      
    {
        title: '操作',
        valueType: 'option',
        width: 100,
        render: (text, record: any, _, action) => [
          <a
            onClick={() => {
              params?.onEdit(text, record, _, action)
            
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
