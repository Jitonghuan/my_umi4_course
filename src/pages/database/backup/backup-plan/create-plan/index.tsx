// article editor
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/15 14:50

import React, { useState, useEffect, useRef } from 'react';
import { Drawer, Form, Button, Select, Input, InputNumber,Checkbox,TimePicker } from 'antd';
import { useGetSchemaList } from '../../../account-manage/hook';
import { checkboxOption } from '../../schema';
import { useGetClusterList } from "../../../instance-list/hook";
import moment from 'moment';
import { useAddBackupPlan, useUpdateBackupPlan, CreateItems, useGetBackupTypeList } from '../../hook';

export interface CreateArticleProps {
  mode?: EditorMode;
  initData?: any;
  onClose: () => any;
  onSave: () => any;

}
const format = 'HH:mm';
export default function CreatePlan(props: CreateArticleProps) {
  const [addLoading, createBackupPlan] = useAddBackupPlan();
  const [updateLoading, updateBackupPlan] = useUpdateBackupPlan();
  const { mode, initData, onClose, onSave } = props;
  const [editForm] = Form.useForm();
  const [clusterLoading, clusterOptions, getClusterList] = useGetClusterList();
  const [typeLoading, typeOptions, getBackupTypeList] = useGetBackupTypeList()
  
  useEffect(() => {
    getBackupTypeList()
    getClusterList()
  }, [])
 

  useEffect(() => {
    if (mode === 'HIDE') return;
    if (mode !== 'ADD') {
      editForm.setFieldsValue({
       ...initData,
       backupTime:  initData?.backupTime ? moment( initData?.backupTime,format) : undefined,
       backupCycle:initData?.backupCycle?.split(',')
      });

    }

    return () => {

      editForm.resetFields();

    };
  }, [mode]);
  const handleSubmit = async() => {
    const params = await editForm.validateFields();
    if (mode === 'EDIT') {
     
      let backupObj= clusterOptions?.filter((item:any)=>item?.value===params?.clusterId)
     
      updateBackupPlan({
        ...params,
        backupCycle:params?.backupCycle?.join(','),
        id:initData?.id,
        backupTime:params.backupTime?.format('HH:mm'),
        clusterId:params?.clusterId,
        backupObj:backupObj[0]?.label,
      }).then(() => {
        onSave();
      });
    }
    if (mode === 'ADD') {
      createBackupPlan({
        ...params,
        backupTime:params.backupTime?.format('HH:mm'),
        backupCycle:params?.backupCycle?.join(','),
        clusterId:params?.clusterId?.value,
        backupObj:params?.clusterId?.label,
      
      }).then(() => {
        onSave();
      });
    }
  };


  
  return (
    <Drawer
      width={900}
      title={mode === 'EDIT' ? '编辑备份' : mode === 'VIEW' ? '查看备份' : '新增备份'}
      placement="right"
      visible={mode !== 'HIDE'}
      onClose={onClose}
      maskClosable={false}
      footer={
        <div className="drawer-footer">
          <Button type="primary"
            loading={addLoading || updateLoading}
            onClick={handleSubmit} >
            保存
          </Button>
          <Button type="default" onClick={onClose}>
            取消
          </Button>
        </div>
      }
    >
      <Form form={editForm} labelCol={{ flex: '120px' }}>
        <Form.Item label="名称" name="backupName" rules={[{ required: true, message: '请输入' }]}>
          <Input style={{ width: 420 }} placeholder="单行输入" />
        </Form.Item>
        <Form.Item label="备份类型" name="backupType" rules={[{ required: true, message: '请选择' }]}>
          <Select options={typeOptions} disabled={mode==="EDIT"} loading={typeLoading} showSearch allowClear style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="数据库集群" name="clusterId" rules={[{ required: true, message: '请选择' }]}>
          <Select options={clusterOptions} disabled={mode==="EDIT"} labelInValue loading={clusterLoading} showSearch allowClear  style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="备份周期" name="backupCycle" rules={[{ required: true, message: '请选择' }]}>
        <Checkbox.Group options={checkboxOption}  />
        </Form.Item>
        <Form.Item label="备份时间" name="backupTime" rules={[{ required: true, message: '请选择' }]}>
        <TimePicker  format={format} />
        </Form.Item>
        <Form.Item label="备份保留天数" name="storeTime">
          <InputNumber min={0} addonAfter="天" />
        </Form.Item>





      </Form>
    </Drawer>
  );
}
