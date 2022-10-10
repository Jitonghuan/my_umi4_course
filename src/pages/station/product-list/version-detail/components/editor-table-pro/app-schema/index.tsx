import { Popconfirm, Select,Input,InputNumber } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
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
  };
  
  

// 列表页-表格
export const createAppProTableColumns = (params: {
//   currentTabType:string,
  componentOptions:any,
  componentVersionOptions:any,
  onEdit: (text:React.ReactNode, record: any, _:any, action:any) => void;
  onDelete: (text:React.ReactNode, record: any, _:any, action:any) => void;
  onChange:(param:any,config:any)=>void;
  
 
}) => {
  return [
    {
        title: '应用名称',
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
                labelInValue
                optionFilterProp="label"
                onChange={(param: any) => {
                    params?.onChange(param,config)
                }}
              ></Select>
            );
          },
      },
   
      {
        title: '应用版本',
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
        title: '部署优先级',
      key: 'componentPriority',
      dataIndex: 'componentPriority',
      renderFormItem: (_, config: any, data) => {
        //  ]
        return (
        <InputNumber placeholder="请输入1-100之间的值" style={{width:"100%"}} />
        );
      },},
      
     
      {
        title:'应用描述',
        dataIndex: 'componentDescription',
        renderFormItem: (_, config: any, data) => {
          return <Input></Input>;
        },
       
      },
     
  
      {
        title: '操作',
        valueType: 'option',
        width: 150,
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
              params?.onDelete(text, record, _, action)
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
