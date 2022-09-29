import React, { useRef, useState, useEffect,useMemo } from 'react';
import { EditableProTable } from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import { Button, Input, Form} from 'antd';
import {createServiceConfigTableColumns} from './schema'
import {
  useQueryParamList,
  useQueryDeliveryParamList,
  useSaveParam,
  useDeleteDeliveryParam,
  useQueryOriginList,
  useEditVersionParam,
  useQueryParamtypeList
} from '../../hooks';
import {DataSourceType} from '../editor-table-pro/schema'

export interface VersionDetailProps {
  currentTab: string;
  versionId: any;
  isEditable: boolean;
  initDataSource?: any;
}

export default (props: VersionDetailProps) => {
  const {  versionId, } = props;
  const actionRef = useRef<ActionType>();
  const [saveLoading, saveParam] = useSaveParam();
  const [paramtypeOptions, queryParamtypeList]=useQueryParamtypeList()
  const [editLoading, editVersionParam] = useEditVersionParam();
  const [originloading, originOptions, queryOriginList] = useQueryOriginList();
  const [delLoading, deleteDeliveryParam] = useDeleteDeliveryParam();
  const [tableLoading, tableDataSource, setDataSource, queryDeliveryParamList] = useQueryDeliveryParamList();
  const [loading, paramOptions, queryParamList] = useQueryParamList();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [type, setType] = useState<string>('');
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  const updateRow = (rowKey: string, row: any) => {
    form.setFieldsValue({ [rowKey]: row });
  };
  useEffect(() => {
    //获取参数来源组件
    queryOriginList(versionId);
    queryParamtypeList()
  }, []);
  useEffect(() => {
    //查询建站配置参数
    queryDeliveryParamList(versionId,"service");
  }, []);
  const serviceConfigColumns = useMemo(() => {
    return createServiceConfigTableColumns({
      type:type,
      paramOptions:paramOptions,
      originOptions:originOptions,
      paramtypeOptions:paramtypeOptions,
      onComChange: (value: any) => {
        queryParamList(versionId, value);
       
      },
      onParamChange:(config:any,value: any)=>{

        paramOptions.filter((item: any) => {
          if (item.value === value) {
            updateRow(config.recordKey, {
              ...form.getFieldsValue(config.recordKey),
              paramValue: item.paramValue,
            });
          }
        });
      },
      onEdit:(record:any,  action:any)=>{
        action?.startEditable?.(record.id);
        setType('edit');
        queryParamList(versionId, record.paramComponent);
      },
      onDelete:(record:any)=>{
        deleteDeliveryParam(record.id).then(() => {
          setDataSource(tableDataSource.filter((item: any) => item.id !== record.id));
        });
      }  
    }) as any;
  }, [type,originOptions,paramOptions,paramtypeOptions]);
  const handleSearch = () => {
    const param = searchForm.getFieldsValue();
    queryDeliveryParamList(versionId, param.paramName);
  };
  const tableChange = (values: any) => {
    setDataSource;
  };

  return (
    <>
      <div className="table-caption-application">
        <div className="caption-left">
          <Form layout="inline" form={searchForm}>
            <Form.Item name="paramComponent">
              <Input style={{ width: 220 }} placeholder="请输入"></Input>
            </Form.Item>
            <Form.Item>
              <Button onClick={handleSearch} type="primary">
                搜索
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="caption-right">
        </div>
      </div>
      <EditableProTable<DataSourceType>
        rowKey="id"
        actionRef={actionRef}
        loading={tableLoading}
        // recordCreatorProps={false}
        recordCreatorProps={{
          position: 'top',
          // newRecordType: 'dataSource',
          creatorButtonText: '新增配置',
          record: { id: (Math.random() * 1000000).toFixed(0) },
        }}
        pagination={false}
        scroll={{ y: window.innerHeight - 340 }}
        headerTitle="可编辑表格"
        // maxLength={5}
        // 关闭默认的新建按钮
        columns={serviceConfigColumns}
        value={tableDataSource}
        onChange={(values) => {
          tableChange(values);
        }}
        editable={{
          form,
          editableKeys,
          onSave: async (values) => {
            let value = form.getFieldsValue();
            let objKey = Object.keys(value);
            let params = value[objKey[0]];
            if (type !== 'edit') {
              await saveParam({ ...params, versionId }).then(() => {
                queryDeliveryParamList(versionId,"service");
              });
            } else if (type === 'edit') {
              editVersionParam({ ...params, id: parseInt(objKey[0]) }).then(() => {
                queryDeliveryParamList(versionId,"service");
              });
            }
          },
          onChange: setEditableRowKeys,
          actionRender: (row, config, dom) => [dom.save, dom.cancel],
        }}
      />
    </>
  );
};
