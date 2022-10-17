import type { ProColumns } from '@ant-design/pro-table';
import {Input, Select,  Popconfirm, } from 'antd';

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
export const createServiceConfigTableColumns = (params: {
    type:string;
    // paramOptions:any;
    originOptions:any;
    paramtypeOptions:any
    // onParamChange: (config: any,value: any) => void;
    onEdit: (record: any, action: any,) => void;
    onDelete: (record: any) => void;
    // currentTabType;
  }) => {
    return [
      {
        title: '基准配置值',
        key: 'paramName',
        dataIndex: 'paramName',
        renderFormItem: (_, config: any, data) => {
          return <Input placeholder="单行输入"></Input>;
        },
      },

    {
      title: '配置中心',
      key: 'paramType',
      dataIndex: 'paramType',
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
        // let description = '';
        // params?.paramOptions.filter((item: any) => {
        //   if (item.value === config.record?.componentVersion) {
        //     description = item.componentDescription;
        //   }
        // });
        return (
          <Select
            options={ params?.paramtypeOptions}
            showSearch
            allowClear
            onChange={(value: any) => {
            }}
          ></Select>
        );
      },
    },
    {
      title: '配置说明',
      key: 'paramDescription',
      dataIndex: 'paramDescription',
      renderFormItem: (_, config: any, data) => {
        return <Input ></Input>;
      },
    },
    // {
    //   title: '参数说明',
    //   dataIndex: 'paramDescription',
    // },

    {
      title: '操作',
      valueType: 'option',
      width: 150,
      render: (text, record, _, action) => [
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
