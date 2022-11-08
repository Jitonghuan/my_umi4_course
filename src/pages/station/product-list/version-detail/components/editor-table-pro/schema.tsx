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
export const createProTableColumns = (params: {
  currentTabType:string,
  componentOptions:any,
  componentVersionOptions:any,
  bucketsOption:any,
  belongOption:any,
  bucketLoading:boolean,
  belongLoading:boolean,
  type:string
  onEdit: (text:React.ReactNode, record: any, _:any, action:any) => void;
  onDelete: (text:React.ReactNode, record: any, _:any, action:any) => void;
  onChange:(param:any,config:any)=>void;
  
 
}) => {
  return [
    {
      title: params?.currentTabType === 'feResources' ? '前端资源名称' : '基础数据名称',
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
              disabled={params?.type==="edit"}
              optionFilterProp="label"
              onChange={(param: any) => {
                params?.onChange(param,config)
              }}
            ></Select>
          );
        },
    },
    
      {
        title: params?.currentTabType === 'feResources' ? '前端资源版本' : '基础数据版本',
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
            ></Select>
          );
        },
      },
      {
        title: params?.currentTabType === 'sql' ? '归属' : 'Bucket',
        key: "componentConfiguration" ,
        dataIndex: "componentConfiguration" ,
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
              options={params?.currentTabType === 'sql'?params?.belongOption:params?.bucketsOption}
              showSearch
              allowClear
              loading={params?.bucketLoading||params?.belongLoading}
              onChange={(value: any) => {
               
              }}
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
        <InputNumber placeholder="请输入1-100之间的值" min={1} max={100}  style={{width:"100%"}} />
        );
      },},
      {
        title: params?.currentTabType === 'app' ? '应用描述' : params?.currentTabType === 'feResources' ? '前端资源描述' : '基础数据描述',
        dataIndex: 'componentDescription',
        renderFormItem: (_, config: any, data) => {
          return <Input></Input>;
        },
      },
  
      {
        title: '操作',
        valueType: 'option',
        width: 120,
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