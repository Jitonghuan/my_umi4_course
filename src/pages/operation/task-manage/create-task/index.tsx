// 新增任务抽屉页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/10/25 18:30

import React from 'react';
import { history } from 'umi';
import { useEffect, useState } from 'react';
import { useAddDnsManage, useUpdateDnsManage } from '../hooks';
import { Input, Form, Select, Spin, Row, Button, Drawer, Switch, Divider } from 'antd';
import { recordEditData } from '../index';
import EditorTable from '@cffe/pc-editor-table';
import AceEditor from '@/components/ace-editor';
import { TaskTypeOptions, RequestModeOptions, RequestMethodOptions } from './schema';
// import { createEnv, appTypeList, updateEnv, queryNGList } from '../service';

export interface RecordEditDataProps {
  mode: EditorMode;
  initData?: recordEditData;
  envCode: any;
  onClose: () => any;
  onSave: () => any;
}

export default function addEnvData(props: RecordEditDataProps) {
  const [createRecordForm] = Form.useForm();
  const { mode, onClose, onSave, initData, envCode } = props;
  const [addLoading, addDnsManage] = useAddDnsManage();
  const [updateLoading, updateDnsManage] = useUpdateDnsManage();
  const [curTaskType, setCurTaskType] = useState<number>();
  const [curRequestMethod, setCurRequestMethod] = useState<string>('');

  useEffect(() => {
    if (mode === 'HIDE') return;

    if (initData && mode === 'EDIT') {
      createRecordForm.setFieldsValue({
        ...initData,
      });
    }
    if (mode === 'ADD') {
      createRecordForm.resetFields();
    }
  }, [mode]);

  const handleSubmit = () => {
    let param = createRecordForm.getFieldsValue();
    if (mode === 'ADD') {
      let paramObj = { envCode: envCode.envCode, status: '0', ...param };
      addDnsManage(paramObj).then(() => {
        onSave();
      });
    } else if (mode === 'EDIT') {
      let paramObj = { envCode: envCode.envCode, id: initData?.id, status: initData?.status, ...param };
      updateDnsManage(paramObj).then(() => {
        onSave();
      });
    }
  };

  return (
    <Drawer
      visible={mode !== 'HIDE'}
      title={mode === 'EDIT' ? '修改记录' : '添加记录'}
      // onCancel={() => onClose()}
      onClose={() => onClose()}
      width={'50%'}
      footer={
        <div className="drawer-footer">
          <Button type="primary" onClick={handleSubmit}>
            保存
          </Button>
          <Button type="default" onClick={props.onClose}>
            取消
          </Button>
        </div>
      }
      // footer={[
      //   <Button type="primary" onClick={() => onClose()} loading={mode === 'EDIT' ? updateLoading : addLoading}>
      //     取消
      //   </Button>,
      //   <Button
      //     type="primary"
      //     key="submit"
      //     onClick={handleSubmit}
      //     loading={mode === 'EDIT' ? updateLoading : addLoading}
      //   >
      //     确定
      //   </Button>,
      // ]}
    >
      <Spin spinning={mode === 'EDIT' ? updateLoading : addLoading}>
        <div className="recordAdd">
          <Form
            labelCol={{ flex: '120px' }}
            form={createRecordForm}
            // onFinish={handleSubmit}
            onReset={() => {
              createRecordForm.resetFields();
            }}
          >
            <Form.Item label="任务名称" name="jobCode" rules={[{ required: true, message: '这是必填项' }]}>
              <Input placeholder="请输入任务名称" style={{ width: '24vw' }}></Input>
            </Form.Item>
            <Form.Item label="任务Code" name="jobName">
              <Input style={{ width: '24vw' }} placeholder="请输入任务Code"></Input>
            </Form.Item>
            <Form.Item name="timeExpression" label="时间表达式" rules={[{ required: true, message: '这是必填项' }]}>
              <Input placeholder="请输入时间表达式" style={{ width: '24vw' }}></Input>
            </Form.Item>
            <Form.Item name="enable" label="是否启用" rules={[{ required: true, message: '这是必填项' }]}>
              <Switch />
            </Form.Item>
            <Form.Item name="noticeType" label="执行结果通知" rules={[{ required: true, message: '这是必填项' }]}>
              <Select style={{ width: 200 }} options={RequestModeOptions}></Select>
            </Form.Item>
            <Form.Item name="Desc" label="备注：">
              <Input.TextArea placeholder="请输入备注" style={{ width: '24vw', height: 80 }}></Input.TextArea>
            </Form.Item>
            <Form.Item name="jobType" label="任务类型" rules={[{ required: true, message: '这是必填项' }]}>
              <Select
                style={{ width: 200 }}
                options={TaskTypeOptions}
                onChange={(value) => {
                  setCurTaskType(value);
                }}
              ></Select>
            </Form.Item>
            <Divider />
            {/* ------------任务类型一容器命令任务---------- */}
            {curTaskType === 1 && (
              <>
                <p style={{ width: '100%', display: 'flex' }}>
                  <Form.Item label="appCode" name="appCode" rules={[{ required: true, message: '这是必填项' }]}>
                    <Select style={{ width: 180 }}></Select>
                  </Form.Item>
                  <Form.Item label="envCode" name="envCode" rules={[{ required: true, message: '这是必填项' }]}>
                    <Select style={{ width: 180 }}></Select>
                  </Form.Item>
                </p>

                <Form.Item label="容器" name="containers" rules={[{ required: true, message: '这是必填项' }]}>
                  <Select style={{ width: '24vw' }}></Select>
                </Form.Item>
                <Form.Item label="执行路径" name="execPath" rules={[{ required: true, message: '这是必填项' }]}>
                  <Input placeholder="请输入执行路径" style={{ width: '24vw' }}></Input>
                </Form.Item>
                <Form.Item label="command" name="command" rules={[{ required: true, message: '这是必填项' }]}>
                  <Input placeholder="请输入command" style={{ width: '24vw' }}></Input>
                </Form.Item>
              </>
            )}

            {/* ------------任务类型二节点命令任务---------- */}
            {curTaskType === 2 && (
              <>
                <Form.Item label="节点Ip" name="nodeIp" rules={[{ required: true, message: '这是必填项' }]}>
                  <Input style={{ width: '24vw' }}></Input>
                </Form.Item>
                <Form.Item label="账号" name="account" rules={[{ required: true, message: '这是必填项' }]}>
                  <Input style={{ width: '24vw' }}></Input>
                </Form.Item>
                <Form.Item label="密码" name="password" rules={[{ required: true, message: '这是必填项' }]}>
                  <Input style={{ width: '24vw' }}></Input>
                </Form.Item>
                <Form.Item label="执行路径" name="execPath" rules={[{ required: true, message: '这是必填项' }]}>
                  <Input placeholder="请输入执行路径" style={{ width: '24vw' }}></Input>
                </Form.Item>
                <Form.Item label="command" name="command" rules={[{ required: true, message: '这是必填项' }]}>
                  <Input placeholder="请输入command" style={{ width: '24vw' }}></Input>
                </Form.Item>
              </>
            )}
            {/*-------------- 任务类型三接口调用任务---------------- */}
            {curTaskType === 3 && (
              <>
                <Form.Item label="接口URL" name="url" rules={[{ required: true, message: '这是必填项' }]}>
                  <Input style={{ width: 200 }}></Input>
                </Form.Item>
                <Form.Item label="请求方法" name="method" rules={[{ required: true, message: '这是必填项' }]}>
                  <Select
                    style={{ width: 200 }}
                    options={RequestMethodOptions}
                    onChange={(value) => {
                      setCurRequestMethod(value);
                    }}
                  ></Select>
                </Form.Item>
                {curRequestMethod === 'POST' && (
                  <Form.Item label="params" rules={[{ required: true, message: '这是必填项' }]}>
                    <AceEditor mode="json" height={280} />
                  </Form.Item>
                )}
                {curRequestMethod === 'GET' && (
                  <Form.Item label="query" name="" rules={[{ required: true, message: '这是必填项' }]}>
                    <EditorTable
                      columns={[
                        { title: 'Key', dataIndex: 'key', colProps: { width: 90 } },
                        {
                          title: 'VALUE',
                          dataIndex: 'value',
                          colProps: { width: 90 },
                        },
                      ]}
                    />
                  </Form.Item>
                )}
              </>
            )}

            {/* ------------任务类型四数据库SQL任务---------- */}
            {curTaskType === 4 && (
              <>
                <Form.Item label="主机" name="host" rules={[{ required: true, message: '这是必填项' }]}>
                  <Input style={{ width: '24vw' }}></Input>
                </Form.Item>
                <Form.Item label="端口" name="port" rules={[{ required: true, message: '这是必填项' }]}>
                  <Input style={{ width: '24vw' }}></Input>
                </Form.Item>
                <Form.Item label="用户名" name="account" rules={[{ required: true, message: '这是必填项' }]}>
                  <Input style={{ width: '24vw' }}></Input>
                </Form.Item>
                <Form.Item label="密码" name="password" rules={[{ required: true, message: '这是必填项' }]}>
                  <Input style={{ width: '24vw' }}></Input>
                </Form.Item>
                <Form.Item label="数据库名" name="databaseName" rules={[{ required: true, message: '这是必填项' }]}>
                  <Input style={{ width: '24vw' }}></Input>
                </Form.Item>
                <Form.Item label="SQL" name="sql" rules={[{ required: true, message: '这是必填项' }]}>
                  <Input style={{ width: '24vw' }}></Input>
                </Form.Item>
              </>
            )}
          </Form>
        </div>
      </Spin>
    </Drawer>
  );
}
