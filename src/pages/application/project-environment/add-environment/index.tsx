// 项目环境管理新增编辑页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/02/14 10:30

import React from 'react';
import { ContentCard } from '@/components/vc-page-content';
import { history } from 'umi';
import { useState, useEffect } from 'react';
import { useCreateProjectEnv, useUpdateProjectEnv, useQueryAppsList, useEnvList } from '../hook';
import { Drawer, Input, Button, Form, Transfer, Select, Space } from 'antd';
import './index.less';

export interface EnvironmentListProps {
  mode?: EditorMode;
  initData?: any;
  onClose: () => any;
  onSave: () => any;
}

export default function EnvironmentEditor(props: EnvironmentListProps) {
  const [addEnvironmentForm] = Form.useForm();
  const children: any = [];
  const { mode, initData, onClose, onSave } = props;
  const [queryAppsList, appsListData] = useQueryAppsList();
  const [createProjectEnv] = useCreateProjectEnv();
  const [updateProjectEnv] = useUpdateProjectEnv();
  const [loading, envDataSource] = useEnvList();
  const [editDisabled, setEditDisabled] = useState<boolean>(false);
  const [ensureDisabled, setEnsureDisabled] = useState<boolean>(false);
  const canAddAppsData: any = [];
  const alreadyAddAppsData: any = [];
  const initialTargetKeys = canAddAppsData;
  // .filter((item:any) => +item.key > 10).map((item:any) => item.key);
  const [targetKeys, setTargetKeys] = useState(initialTargetKeys);
  const [selectedKeys, setSelectedKeys] = useState<any>([]);

  const onChange = (nextTargetKeys: any, direction: any, moveKeys: any) => {
    console.log('targetKeys:', nextTargetKeys);
    console.log('direction:', direction);
    console.log('moveKeys:', moveKeys);
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys: any, targetSelectedKeys: any) => {
    console.log('sourceSelectedKeys:', sourceSelectedKeys);
    console.log('targetSelectedKeys:', targetSelectedKeys);
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onScroll = (direction: any, e: any) => {
    console.log('direction:', direction);
    console.log('target:', e.target);
  };
  const handleOk = () => {
    let params = addEnvironmentForm.getFieldsValue();
    if (mode === 'ADD') {
      let addParamsObj = {
        benchmarkEnvCode: params.benchmarkEnvCode || '',
        projectEnvCode: params.envCode || '',
        projectEnvName: params.envName || '',
        mark: params.mark || '',
        relationApps: params.categoryCode || [],
      };
      createProjectEnv(addParamsObj).then(() => {
        onSave;
      });
    }
    if (mode === 'EDIT') {
      let editParamsObj = {
        projectEnvCode: params.envCode || '',
        mark: params.mark || '',
        relationApps: params.categoryCode || [],
      };
      updateProjectEnv(editParamsObj).then(() => {
        onSave;
      });
    }
  };

  useEffect(() => {
    if (!initData) {
      return;
    }

    if (mode === 'ADD') {
      addEnvironmentForm.resetFields();
    }
    if (mode === 'VIEW') {
      setEnsureDisabled(true);
    }
    if (mode === 'EDIT') {
      setEditDisabled(true);
    }
    if (mode !== 'HIDE') {
      if (appsListData.canAddApps) {
        appsListData.canAddApps?.map((item: any, index: number) => {
          canAddAppsData.push({
            key: index.toString(),
            title: item,
          });
        });
      }
      if (appsListData.alreadyAddApps) {
        appsListData.alreadyAddApps?.map((item: any, index: number) => {
          alreadyAddAppsData.push({
            key: index.toString(),
            title: item,
          });
        });
        setSelectedKeys(alreadyAddAppsData);
      }
      if (initData) {
        addEnvironmentForm.setFieldsValue({
          envName: initData?.envName,
          envCode: initData?.envCode,
          benchmarkEnvCode: initData?.benchmarkEnvCode,
          mark: initData?.mark,
        });
      }
    }
  }, []);
  console.log('canAddAppsData', canAddAppsData);
  const selectEnvCode = (value: any) => {
    queryAppsList(value);
  };
  const handleClose = () => {
    onClose();
    if (mode === 'ADD') {
      addEnvironmentForm.resetFields();
    }
  };
  return (
    <Drawer
      visible={mode !== 'HIDE'}
      title={mode === 'EDIT' ? '编辑项目环境' : mode === 'ADD' ? '新增项目环境' : '查看环境'}
      maskClosable={false}
      onClose={() => onClose()}
      width={'40%'}
      footer={
        <div className="drawer-environ-footer">
          <Space>
            <Button type="primary" onClick={handleOk} disabled={ensureDisabled}>
              确认
            </Button>
            <Button type="default" onClick={handleClose}>
              取消
            </Button>
          </Space>
        </div>
      }
    >
      <ContentCard className="tmpl-edits">
        <Form labelCol={{ flex: '120px' }} form={addEnvironmentForm}>
          <Form.Item label="项目环境名" name="envName">
            <Input style={{ width: 300 }} placeholder="单行输入" disabled={editDisabled}></Input>
          </Form.Item>
          <Form.Item label="项目环境CODE" name="envCode">
            <Input style={{ width: 300 }} placeholder="单行输入"></Input>
          </Form.Item>
          <Form.Item label="选择基准环境" name="benchmarkEnvCode">
            <Select
              style={{ width: 300 }}
              options={envDataSource}
              onChange={selectEnvCode}
              loading={loading}
              showSearch
              allowClear
              disabled={editDisabled}
            ></Select>
          </Form.Item>
          <Form.Item label="备注：" name="mark">
            <Input.TextArea style={{ width: '300px' }} placeholder="多行输入"></Input.TextArea>
          </Form.Item>
          <Form.Item label="选择应用" name="categoryCode">
            <Transfer
              dataSource={canAddAppsData}
              titles={['可添加应用', '已添加应用']}
              targetKeys={targetKeys}
              selectedKeys={selectedKeys}
              onChange={onChange}
              onSelectChange={onSelectChange}
              onScroll={onScroll}
              render={(item) => item.title || ''}
            />
          </Form.Item>
        </Form>
      </ContentCard>
    </Drawer>
  );
}
