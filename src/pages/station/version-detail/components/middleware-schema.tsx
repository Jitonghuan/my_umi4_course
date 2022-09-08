
import { history } from 'umi';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import { Button, Input, Select, Form, Popconfirm, message,Space,Tag } from 'antd';

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
    onConfig: (record: any) => void;
    onDelete: (record: any) => void;
    componentOptions:any;
    componentVersionOptions:any
    // currentTabType;
  }) => {
    return [
      {
        title: '中间件名称',
        dataIndex: 'name',
        key: 'name',
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
        title: 'Realease名称',
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
        renderFormItem: (_, config: any, data) => {
          return (
            <Select
              options={[]}
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
      {title: '依赖',
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
            options={[]}
            showSearch
            allowClear
            mode="tags"
            // onChange={(value: any) => {

            // }}
          ></Select>
        );
      },
    },
      
    {
        title: '操作',
        valueType: 'option',
        width: 250,
        render: (text, record: any, _, action) => [
          <a
            onClick={() => {
              params?.onConfig(record)
            
            }}
          >
            配置
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
