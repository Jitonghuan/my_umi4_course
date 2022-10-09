import React, { useRef, useState, useEffect, useMemo } from 'react';
import { EditableProTable } from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import type { TableRowSelection } from 'antd/es/table/interface';
import { Button, Input, Form, message } from 'antd';
import { createMiddlewareTableColumns } from './middle-ware-schema';
import { PlusOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-form';
import { createProTableColumns, DataSourceType } from './schema';
import {createAppProTableColumns} from './app-schema'
import { useQueryComponentOptions, useQueryComponentVersionOptions, useQueryVersionComponentList, useDeleteVersionComponent, useAddCompontent, } from '../../hooks';
import { useFrontbucketList, useBelongList, useNamespaceList, useBulkdelete,useEditComponent} from './hook'
import BatchAppDraw from '../batch-app-draw';
import BatchMiddlewareDraw from '../batch-middleware-draw';

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
  } = props;
  const [searchForm] = Form.useForm();
  const [addLoading, addComponent] = useAddCompontent();
  const [ componentVersionOptions, queryProductVersionOptions] = useQueryComponentVersionOptions();
  const [componentOptions, queryComponentOptions] = useQueryComponentOptions();
  const [loading, tableDataSource, setDataSource, queryVersionComponentList] = useQueryVersionComponentList();
  //useFrontbucketList
  const [bucketLoading, bucketsOption, queryFrontbucketList] = useFrontbucketList();
  //useBelongList
  const [belongLoading, belongOption, queryBelongList] = useBelongList();
  //useNamespaceList
  const [namespaceLoading, namespaceOption, queryNamespaceList] = useNamespaceList();
  const [delSelectLoading, bulkdelete] = useBulkdelete();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  //selectedRows
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [editLoading, editComponent]=useEditComponent()
  const [delLoading, deleteVersionComponent] = useDeleteVersionComponent();
  const actionRef = useRef<ActionType>();
  const ref = useRef<ProFormInstance>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [batchAddMode, setBatchAddMode] = useState<EditorMode>('HIDE');
  const [type, setType] = useState<string>('');
  const [curRecord,setCurRecord]=useState<any>({})
  const [batchMiddlewareMode, setBatchMiddlewareMode] = useState<EditorMode>('HIDE');
  const [form] = Form.useForm();
  const updateRow = (rowKey: string, row: any) => {
    form.setFieldsValue({ [rowKey]: row });
  };
  useEffect(() => {
    queryComponentOptions(currentTabType); //组件查询
    queryVersionComponentList(versionId, currentTab);
  }, [currentTab]);
  useEffect(() => {
    queryFrontbucketList();
    queryBelongList();

  }, [])

//createAppProTableColumns
  const middleColumns = useMemo(() => {
    return createMiddlewareTableColumns({
      nameOnchange: (param, config: any) => {
        queryProductVersionOptions(param.value, currentTabType);
        queryNamespaceList(param.label)
        componentOptions.filter((item: any) => {
          if (item.label === param.label) {
            updateRow(config.recordKey, {
              ...form.getFieldsValue(config.recordKey),
              componentDescription: item.componentDescription,
              componentDependency: item.componentDependency,
              componentReleaseName: item.label,

            });
          }
        });

      },
      onEdit:(text: React.ReactNode, record: any, _: any, action: any)=>{
        action?.startEditable?.(record.id);
        setType('edit');
        setCurRecord(record)
        queryNamespaceList(record.label)
      },
     
      onDelete: async (record) => {
        if (isEditable) {
          message.info('已发布不可以删除!');
        } else {
          deleteVersionComponent(record.id).then(() => {
            setDataSource(tableDataSource.filter((item: any) => item.id !== record.id));
          });
        }
      },
      componentOptions,
      componentVersionOptions,
      namespaceOption,
    

    }) as any;
  }, [componentOptions, componentVersionOptions, namespaceOption,]);


  const appColumns = useMemo(() => {

    return createAppProTableColumns({
      componentOptions,
      componentVersionOptions,
      onEdit:(text: React.ReactNode, record: any, _: any, action: any)=>{
        action?.startEditable?.(record.id);
        setType('edit');
        setCurRecord(record)
      },
      onDelete: async (text: React.ReactNode, record: any, _: any, action: any) => {
        if (isEditable) {
          message.info('已发布不可以删除!');
        } else {
          deleteVersionComponent(record.id).then(() => {
            setDataSource(tableDataSource.filter((item: any) => item.id !== record.id));
          });
        }
      },
      onChange: (param: any, config: any) => {
        queryProductVersionOptions(param.value, currentTabType);
        componentOptions.filter((item: any) => {
          if (item.label === param.label) {
            updateRow(config.recordKey, {
              ...form.getFieldsValue(config.recordKey),
              componentDescription: item.componentDescription,
            });
          }
        });

      },

    }) as any;
  }, [componentOptions, componentVersionOptions,]);

  const columns = useMemo(() => {

    return createProTableColumns({
      currentTabType: currentTabType,
      componentOptions,
      componentVersionOptions,
      bucketsOption,
      belongOption,
      bucketLoading,
      belongLoading,
      onEdit:(text: React.ReactNode, record: any, _: any, action: any)=>{
        action?.startEditable?.(record.id);
        setType('edit');
        setCurRecord(record)
      },
      onDelete: async (text: React.ReactNode, record: any, _: any, action: any) => {
        if (isEditable) {
          message.info('已发布不可以删除!');
        } else {
          deleteVersionComponent(record.id).then(() => {
            setDataSource(tableDataSource.filter((item: any) => item.id !== record.id));
          });
        }
      },
      onChange: (param: any, config: any) => {
        queryProductVersionOptions(param.value, currentTabType);
        componentOptions.filter((item: any) => {
          if (item.label === param.label) {
            updateRow(config.recordKey, {
              ...form.getFieldsValue(config.recordKey),
              componentDescription: item.componentDescription,
            });
          }
        });

      },

    }) as any;
  }, [currentTabType, componentOptions, componentVersionOptions, bucketsOption, belongOption, belongLoading]);


  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: any) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(selectedRows)
  };
  const rowSelection: TableRowSelection<DataSourceType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const search = () => {
    const value = searchForm.getFieldsValue();
    queryVersionComponentList(versionId, currentTab, value.componentName);
  };
  return (
    <>
      <BatchMiddlewareDraw
        mode={batchMiddlewareMode}
        versionId={versionId}
        componentOptions={componentOptions}
        onClose={() => setBatchMiddlewareMode('HIDE')}
        onSave={() => {
          queryVersionComponentList(versionId, currentTab);
          setBatchMiddlewareMode('HIDE');
          searchForm.resetFields();
        }}

      />
      <BatchAppDraw
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
                      ? '请输入中间件名称' : currentTabType === 'front'
                        ? '请输入前端资源名称'
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
          {currentTabType === 'app' && (
            <Button
              type="primary"
              disabled={isEditable}
              icon={<PlusOutlined />}
              style={{ marginRight: 12 }}
              onClick={() => setBatchAddMode('ADD')}
            >
              添加应用
            </Button>
          )}
          {currentTabType === 'middleware' && (
            <Button
              type="primary"
              disabled={isEditable}
              icon={<PlusOutlined />}
              style={{ marginRight: 12 }}
              onClick={() => setBatchMiddlewareMode('ADD')}
            >
              批量添加中间件
            </Button>
          )}
        </div>
      </div>
      <EditableProTable<DataSourceType>
        rowKey="id"
        actionRef={actionRef}
        formRef={ref}
        headerTitle="可编辑表格"
        loading={loading}
        rowSelection={rowSelection}
        // tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => (
        //  <>
        //  </>
        // )}
        // maxLength={5}
        // 关闭默认的新建按钮
        // recordCreatorProps={false}
        recordCreatorProps={{
          position: 'top',
          // newRecordType: 'dataSource',
          creatorButtonText: '新增组件',
          record: { id: (Math.random() * 1000000).toFixed(0) },
        }}
        columns={currentTabType === 'middleware' ? middleColumns :currentTabType === 'app' ?appColumns: columns}
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
            if(type==="edit"){
              await  editComponent({
                id:curRecord?.id,
                ...params,
                componentName: params.componentName.label,
                componentType: currentTab,
                productLine:curRecord?.productLine,
               
              
      
              }).then(() => {
                queryVersionComponentList(versionId, currentTab);
              });

            }else if(type!=="edit"){
              
              await addComponent({
                versionId,
                ...params,
                componentName: params.componentName.label,
                componentType: currentTab,
               

              }).then(() => {
                queryVersionComponentList(versionId, currentTab);
              });
            }
          },
          onChange: setEditableRowKeys,
          actionRender: (row, config, dom) => [dom.save, dom.cancel],
        }}
      />
      <p className="compontents-delete-button">
        <Button onClick={() => {
        let ids: any = []
        selectedRows?.map((ele: any) => {
          ids.push(ele?.id)
        })
        bulkdelete(ids).then(() => {
          selectedRowKeys?.map((ele) => {
            setDataSource(tableDataSource.filter((item: any) => item.id !== ele));
          })

        })
      }}>删除选中</Button></p>
    </>
  );
};
