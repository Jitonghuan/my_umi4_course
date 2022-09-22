import { datetimeCellRender } from '@/utils';
import { Space, Popconfirm, Tooltip,Tag,Button,Select,Input } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
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
export const createProTableColumns = (params: {
  onManage: (record: any, index: number) => void;
  onPublish: (record: any, index: number) => void;
  onDelete: (record: any, index: number) => void;
  currentTabType:string
 
}) => {
  return [
    {
        title:params?.currentTabType === 'app' ? '应用名称' : params?.currentTabType === 'fe-source' ? '前端资源名称' : '基础数据名称',
        key: 'componentName',
        dataIndex: 'componentName',
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
          componentOptions.filter((item: any) => {
            if (item.label === config.record?.componentName) {
              description = item.componentDescription;
            }
          });
          return (
            <Select
              options={componentOptions}
              showSearch
              allowClear
              labelInValue
              optionFilterProp="label"
              onChange={(param: any) => {
                queryProductVersionOptions(param.value, currentTabType);
                componentOptions.filter((item: any) => {
                  if (item.label === param.label) {
                    updateRow(config.recordKey, {
                      ...form.getFieldsValue(config.recordKey),
                      componentDescription: item.componentDescription,
                    });
                  }
                });
              }}
            ></Select>
          );
        },
      },
      {
        title: currentTabType === 'app' ? '应用版本' : currentTabType === 'front' ? '前端资源版本' : '基础数据版本',
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
              options={componentVersionOptions}
              showSearch
              allowClear
              // onChange={(value: any) => {
  
              // }}
            ></Select>
          );
        },
      },
      {
        title: 'Bucket',
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
        title: currentTabType === 'app' ? '应用描述' : currentTabType === 'fe-source' ? '前端资源描述' : '基础数据描述',
        dataIndex: 'componentDescription',
        renderFormItem: (_, config: any, data) => {
          return <Input></Input>;
        },
      },
  
      {
        title: '操作',
        valueType: 'option',
        width: 250,
        render: (text, record: any, _, action) => [
          <a
            onClick={() => {
              history.push({
                pathname: '/matrix/station/component-detail',
              },{
                  initRecord: record,
                  productVersionId: versionId,
                  componentName: record.componentName,
                  componentVersion: record.componentVersion,
                  componentId: record.componentId,
                  componentType: currentTab,
                  componentDescription: record.componentDescription,
                  optType: 'versionDetail',
                  versionDescription: versionDescription,
                  releaseStatus: releaseStatus,
                  descriptionInfoData: descriptionInfoData,
                
              });
            }}
          >
            配置
          </a>,
          <Popconfirm
            title="确定要删除吗？"
            onConfirm={() => {
              if (isEditable) {
                message.info('已发布不可以删除!');
              } else {
                deleteVersionComponent(record.id).then(() => {
                  setDataSource(tableDataSource.filter((item: any) => item.id !== record.id));
                });
              }
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
