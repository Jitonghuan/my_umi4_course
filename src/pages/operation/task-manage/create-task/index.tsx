// 新增任务抽屉页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/10/25 18:30

import React from 'react';
import { history } from 'umi';
import { useEffect, useState } from 'react';
import { useAddTask, useUpdateTask } from '../hooks';
import { Input, Form, Select, Spin, Row, Button, Drawer, Switch, Divider, Col } from 'antd';
import { recordEditData, KVProps, jobContentProps } from '../type';
import EditorTable from '@cffe/pc-editor-table';
import AceEditor from '@/components/ace-editor';
import { TaskTypeOptions, RequestModeOptions, RequestMethodOptions } from './schema';
import './index.less';
// import { createEnv, appTypeList, updateEnv, queryNGList } from '../service';

export interface RecordEditDataProps {
  mode: EditorMode;
  initData?: recordEditData;
  envCode: any;
  onClose: () => any;
  onSave: () => any;
}

export default function addEnvData(props: RecordEditDataProps) {
  const [createTaskForm] = Form.useForm();
  const { mode, onClose, onSave, initData, envCode } = props;
  const [addLoading, addTaskManage] = useAddTask();
  const [updateLoading, updateTaskManage] = useUpdateTask();
  const [curTaskType, setCurTaskType] = useState<number>();
  const [curRequestMethod, setCurRequestMethod] = useState<string>('');
  const [isJobChangeOption, setIsJobChangeOption] = useState<number>(2); //是否封网
  const [isJobChecked, setIsJobChecked] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);

  useEffect(() => {
    if (mode === 'HIDE') return;

    if (initData && mode === 'EDIT') {
      let jobContent: jobContentProps = {};
      let labelList: KVProps[] = [];
      setIsEditable(true);
      if (initData.enable === 1) {
        setIsJobChecked(true);
      } else {
        setIsJobChecked(false);
      }
      // initData?.params
      if (initData?.jobContent) {
        jobContent = JSON.parse(initData?.jobContent || '');
        labelList = Object.keys(jobContent.params || {}).map((key) => ({
          key,
          value: jobContent.params?.[key],
        }));
      }
      setCurTaskType(initData?.jobType);
      setCurRequestMethod(jobContent?.method);
      createTaskForm.setFieldsValue({
        ...initData,
        enable: isJobChecked,
        ...jobContent,
        params: labelList,
      });
    }
    if (mode === 'ADD') {
      createTaskForm.resetFields();
    }

    return () => {
      setIsEditable(false);
    };
  }, [mode]);

  const handleSubmit = async () => {
    let param = await createTaskForm.validateFields();
    let jobTypeContent = {};
    if (param.jobType === 1) {
      Object.assign(jobTypeContent, {
        appCode: param?.appCode,
        envCode: param?.envCode,
        containers: param?.containers,
        command: param?.command,
      });
    }
    if (param.jobType === 2) {
      Object.assign(jobTypeContent, {
        nodeIp: param?.nodeIp,
        account: param?.account,
        password: param?.password,
        command: param?.command,
      });
    }
    if (param.jobType === 3) {
      let getParam: any = {};

      param?.params?.map((item: any) => {
        getParam[item.key] = item.value;
      });
      Object.assign(jobTypeContent, {
        url: param?.url,
        method: param?.method,
        body: param?.body,
        params: getParam,
      });
    }
    if (param.jobType === 4) {
      Object.assign(jobTypeContent, {
        host: param?.host,
        port: param?.port,
        account: param?.account,
        password: param?.password,
        databaseName: param?.databaseName,
        sql: param?.sql,
      });
    }

    let newJobTypeContent = JSON.stringify(jobTypeContent || {});
    let paramObj = {
      enable: isJobChangeOption,
      jobContent: newJobTypeContent,
      jobCode: param?.jobCode,
      jobName: param?.jobName,
      noticeType: param?.noticeType,
      timeExpression: param?.timeExpression,
      jobType: param?.jobType,
      Desc: param?.Desc,
    };
    if (mode === 'ADD') {
      addTaskManage(paramObj).then(() => {
        onSave();
      });
    } else if (mode === 'EDIT') {
      updateTaskManage(paramObj).then(() => {
        onSave();
      });
    }
  };

  //是否启用任务
  const isJobChange = (checked: boolean) => {
    if (checked === true) {
      setIsJobChecked(true);
      setIsJobChangeOption(1);
    } else {
      setIsJobChecked(true);
      setIsJobChangeOption(2);
    }
  };

  return (
    <Drawer
      visible={mode !== 'HIDE'}
      title={mode === 'EDIT' ? '修改任务' : '新增任务'}
      // onCancel={() => onClose()}
      onClose={() => onClose()}
      width={'50%'}
      footer={
        <div className="drawer-footer">
          <Button type="primary" onClick={handleSubmit} loading={addLoading || updateLoading}>
            保存
          </Button>
          <Button type="default" onClick={props.onClose}>
            取消
          </Button>
        </div>
      }
    >
      <Spin spinning={mode === 'EDIT' ? updateLoading : addLoading}>
        <div className="recordAdd">
          <Form
            labelCol={{ flex: '120px' }}
            form={createTaskForm}
            // onFinish={handleSubmit}
            onReset={() => {
              createTaskForm.resetFields();
            }}
          >
            <Form.Item label="任务名称" name="jobName" rules={[{ required: true, message: '这是必填项' }]}>
              <Input placeholder="请输入任务名称" style={{ width: '24vw' }}></Input>
            </Form.Item>
            <Form.Item label="任务Code" name="jobCode">
              <Input
                style={{ width: '24vw' }}
                placeholder="请输入任务Code(不要包含中文）"
                disabled={isEditable}
                // rules={[
                //   {
                //     required: true,
                //     message: '输入的任务Code里请不要包含中文',
                //     pattern: /^[^\u4e00-\u9fa5]*$/,
                //   }
                // ]}
              ></Input>
            </Form.Item>
            <Form.Item name="timeExpression" label="时间表达式" rules={[{ required: true, message: '这是必填项' }]}>
              <Input placeholder="请输入时间表达式" style={{ width: '24vw' }}></Input>
            </Form.Item>
            <Form.Item name="enable" label="是否启用" rules={[{ required: true, message: '这是必填项' }]}>
              <Switch onChange={isJobChange} checked={isJobChecked} />
            </Form.Item>
            <Form.Item name="noticeType" label="执行结果通知" rules={[{ required: true, message: '这是必填项' }]}>
              <Select style={{ width: 200 }} options={RequestModeOptions}></Select>
            </Form.Item>
            <Form.Item name="desc" label="备注：">
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
                <Row>
                  <Col span={11}>
                    <Form.Item label="appCode" name="appCode" rules={[{ required: true, message: '这是必填项' }]}>
                      <Select style={{ width: 190 }}></Select>
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item label="envCode" name="envCode" rules={[{ required: true, message: '这是必填项' }]}>
                      <Select style={{ width: 190 }}></Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="容器" name="containers" rules={[{ required: true, message: '这是必填项' }]}>
                  <Select style={{ width: '24vw' }}></Select>
                </Form.Item>
                {/* <Form.Item label="执行路径" name="execPath" rules={[{ required: true, message: '这是必填项' }]}>
                  <Input placeholder="请输入执行路径" style={{ width: '24vw' }}></Input>
                </Form.Item> */}
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
                  <Input.Password style={{ width: '24vw' }}></Input.Password>
                </Form.Item>
                {/* <Form.Item label="执行路径" name="execPath" rules={[{ required: true, message: '这是必填项' }]}>
                  <Input placeholder="请输入执行路径" style={{ width: '24vw' }}></Input>
                </Form.Item> */}
                <Form.Item label="command" name="command" rules={[{ required: true, message: '这是必填项' }]}>
                  <Input placeholder="请输入command" style={{ width: '24vw' }}></Input>
                </Form.Item>
              </>
            )}
            {/*-------------- 任务类型三接口调用任务---------------- */}
            {curTaskType === 3 && (
              <>
                <Form.Item label="接口URL" name="url" rules={[{ required: true, message: '这是必填项' }]}>
                  <Input style={{ width: '24vw' }}></Input>
                </Form.Item>
                <Form.Item label="请求方法" name="method" rules={[{ required: true, message: '这是必填项' }]}>
                  <Select
                    style={{ width: '24vw' }}
                    options={RequestMethodOptions}
                    onChange={(value) => {
                      setCurRequestMethod(value);
                    }}
                  ></Select>
                </Form.Item>
                {curRequestMethod === 'POST' && (
                  <Form.Item label="params" name="body" rules={[{ required: true, message: '这是必填项' }]}>
                    <AceEditor mode="json" height={280} />
                  </Form.Item>
                )}
                {curRequestMethod === 'GET' && (
                  <Form.Item label="query" name="params" rules={[{ required: true, message: '这是必填项' }]}>
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
                  <Input.Password style={{ width: '24vw' }}></Input.Password>
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
