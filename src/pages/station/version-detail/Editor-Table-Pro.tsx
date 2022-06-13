import React, { useRef, useState, useEffect } from 'react';
import { history } from 'umi';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import { Button, Input, Select, Form, Popconfirm, message } from 'antd';
import { productionPageTypes } from './tab-config';
import { PlusOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-form';
import {
  useQueryComponentOptions,
  useQueryComponentVersionOptions,
  useQueryVersionComponentList,
  useDeleteVersionComponent,
  useAddCompontent,
} from './hooks';
import { useQueryProductlineList } from '../component-center/hook';
import BatchDraw from './BatchAddDraw';

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
  currentTabType: string;
  versionId: number;
  versionDescription: string;
  isEditable: boolean;
  initDataSource?: any;
  releaseStatus?: any;
  descriptionInfoData?: any;
}

export default (props: VersionDetailProps) => {
  const {
    currentTab,
    versionId,
    currentTabType,
    isEditable,
    releaseStatus,
    initDataSource,
    versionDescription,
    descriptionInfoData,
  } = props;
  const [searchForm] = Form.useForm();
  const [addLoading, addComponent] = useAddCompontent();
  const [versionLoading, componentVersionOptions, queryProductVersionOptions] = useQueryComponentVersionOptions();
  const [componentLoading, componentOptions, queryComponentOptions] = useQueryComponentOptions();
  const [loading, tableDataSource, setDataSource, queryVersionComponentList] = useQueryVersionComponentList();
  const [delLoading, deleteVersionComponent] = useDeleteVersionComponent();
  const actionRef = useRef<ActionType>();
  const ref = useRef<ProFormInstance>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [batchAddMode, setBatchAddMode] = useState<EditorMode>('HIDE');
  const [form] = Form.useForm();
  const [position, setPosition] = useState<'top' | 'bottom' | undefined>('top');
  const updateRow = (rowKey: string, row: any) => {
    form.setFieldsValue({ [rowKey]: row });
  };
  useEffect(() => {
    queryComponentOptions(currentTabType); //组件查询
    // getProductlineList();
    // queryProductVersionOptions(currentTabType); //组件版本查询
    queryVersionComponentList(versionId, currentTab);
  }, [currentTab]);

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: currentTabType === 'app' ? '应用名称' : currentTabType === 'middleware' ? '中间件名称' : '基础数据名称',
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
      title: currentTabType === 'app' ? '应用版本' : currentTabType === 'middleware' ? '中间件版本' : '基础数据版本',
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
      title: currentTabType === 'app' ? '应用描述' : currentTabType === 'middleware' ? '中间件描述' : '基础数据描述',
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
              state: {
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
              },
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
          <a key="delete">删除</a>
        </Popconfirm>,
      ],
    },
  ];

  const search = () => {
    const value = searchForm.getFieldsValue();
    queryVersionComponentList(versionId, currentTab, value.componentName);
  };
  return (
    <>
      <BatchDraw
        mode={batchAddMode}
        versionId={versionId}
        onClose={() => setBatchAddMode('HIDE')}
        onSave={() => {
          queryVersionComponentList(versionId, currentTab);
          setBatchAddMode('HIDE');
          searchForm.resetFields();
        }}
      />
      <div className="table-caption-application">
        <div className="caption-left">
          <Form layout="inline" form={searchForm}>
            <Form.Item name="componentName">
              <Input
                style={{ width: 220 }}
                placeholder={
                  currentTabType === 'app'
                    ? '请输入应用名称'
                    : currentTabType === 'middleware'
                    ? '请输入中间件名称'
                    : '请输入基础数据名称'
                }
              ></Input>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                onClick={() => {
                  search();
                }}
              >
                搜索
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="caption-right">
          {/* {currentTabType === 'app' && (
            <Button
              type="primary"
              disabled={isEditable}
              icon={<PlusOutlined />}
              style={{ marginRight: 12 }}
              onClick={() => setBatchAddMode('ADD')}
            >
              添加应用
            </Button>
          )} */}

          {/* {currentTabType !== 'app' && (
            <Button
              type="primary"
              disabled={isEditable}
              onClick={() => {
                // actionRef.current?.addEditRecord?.({
                //   id: (Math.random() * 1000000).toFixed(0)
                // },);
                setPosition('top');
              }}
              icon={<PlusOutlined />}
            >
              {productionPageTypes[currentTab].text}
            </Button>
          )} */}
        </div>
      </div>
      <EditableProTable<DataSourceType>
        rowKey="id"
        actionRef={actionRef}
        formRef={ref}
        headerTitle="可编辑表格"
        loading={loading}
        // maxLength={5}
        // 关闭默认的新建按钮
        // recordCreatorProps={false}
        recordCreatorProps={{
          position: 'top',
          // newRecordType: 'dataSource',
          creatorButtonText: '新增组件',
          record: { id: (Math.random() * 1000000).toFixed(0) },
        }}
        columns={columns}
        scroll={{ y: window.innerHeight - 340 }}
        value={tableDataSource}
        onChange={setDataSource}
        pagination={false}
        editable={{
          form,
          editableKeys,
          onSave: async () => {
            let value = form.getFieldsValue();
            let objKey = Object.keys(value);
            let params = value[objKey[0]];
            // console.log('params',params)
            await addComponent({
              versionId,
              ...params,
              componentName: params.componentName.label,
              componentType: currentTab,
            }).then(() => {
              queryVersionComponentList(versionId, currentTab);
            });
          },
          onChange: setEditableRowKeys,
          actionRender: (row, config, dom) => [dom.save, dom.cancel],
        }}
      />
    </>
  );
};
