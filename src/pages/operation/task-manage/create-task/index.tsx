// 新增任务抽屉页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/10/25 18:30

import { useEffect, useState } from 'react';
import ReactCron from '@/components/qnn-react-cron';
import {
  useAddTask,
  useUpdateTask,
  queryAppList,
  useQueryAppEnvData,
  useQueryListContainer,
  useQueryNodeList,
  useQueryClusterList,
} from '../hooks';
import { Input, Form, Select, Spin, Row, Button, Drawer, Switch, Divider, Col, Checkbox, Tag } from 'antd';
import { recordEditData, KVProps, jobContentProps } from '../type';
import { QuestionCircleOutlined, EditOutlined } from '@ant-design/icons';
import EditorTable from '@cffe/pc-editor-table';
import AceEditor from '@/components/ace-editor';
import { TaskTypeOptions, RequestModeOptions, RequestMethodOptions } from './schema';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import './index.less';
import IpModal from './ip-modal'

export interface RecordEditDataProps {
  mode: EditorMode;
  initData?: recordEditData;
  onClose: () => any;
  onSave: () => any;
}

export default function addEnvData(props: RecordEditDataProps) {
  const [createTaskForm] = Form.useForm();
  const { mode, onClose, onSave, initData } = props;
  const [addLoading, addTaskManage] = useAddTask();
  const [updateLoading, updateTaskManage] = useUpdateTask();
  const [loading, appEnvDataSource, queryAppEnvData] = useQueryAppEnvData();
  const [containerLoading, containerNameOption, getListContainer] = useQueryListContainer();
  const [clusterListloading, clusterOption, getClusterList] = useQueryClusterList();
  const [nodeNameLoading, nodeNameOption, getNodeNameList] = useQueryNodeList();
  const [curTaskType, setCurTaskType] = useState<number>();
  const [curRequestMethod, setCurRequestMethod] = useState<string | undefined>('');
  const [isJobChangeOption, setIsJobChangeOption] = useState<number>(2);
  const [isJobChecked, setIsJobChecked] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [viewEditable, setViewEditable] = useState<boolean>(false);
  const [appList, setAppList] = useState<any[]>([]);
  const [checked, setChecked] = useState<boolean>(false);
  const [isEditPassword, setIsEditPassword] = useState<boolean>(false);
  const [firstModify, setFirstModify] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [optType, setOptType] = useState<string>('');
  const [initPassWord, setInitPassWord] = useState<string | undefined>('');
  const [curTimeExpress, setCurTimeExpress] = useState<string>('');
  const [limitsLength, setLimitsLength] = useState<number>();
  const [ipListVisible, setIpListVisible] = useState<boolean>(false);
  const [ipList, setIpList] = useState<any>([])

  useEffect(() => {
    queryAppList().then((resp) => {
      setAppList(
        resp.map((el: any) => {
          return {
            ...el,
            key: el.value,
            value: el.label,
          };
        }),
      );
    });
  }, []);
  useEffect(() => {
    getClusterList();
    if (initData && mode !== 'ADD') {
      const clusterName = createTaskForm.getFieldValue('clusterName');
      getNodeNameList(clusterName);
    }
  }, []);

  useEffect(() => {
    if (mode === 'HIDE') return;
    if (mode === 'VIEW') {
      setViewEditable(true);
      setIsEditable(true);
    }
    if (mode === 'ADD') {
      createTaskForm.resetFields();
      setIpList([])
    }
    if (initData && mode !== 'ADD') {
      // let jobContent: jobContentProps = {};
      let jobContent: any = {}
      let labelList: KVProps[] = [];
      setIsEditable(true);
      setFirstModify(true);

      if (initData.enable === 1) {
        setIsJobChecked(true);
        setIsJobChangeOption(1);
      } else {
        setIsJobChecked(false);
        setIsJobChangeOption(2);
      }
      // initData?.params
      if (initData?.jobContent) {
        jobContent = JSON.parse(initData?.jobContent || '');
        labelList = Object.keys(jobContent.params || {}).map((key) => ({
          key,
          value: jobContent.params?.[key],
        }));
      }
      if (mode === 'VIEW') {
        setLimitsLength(labelList.length);
      }
      setIpList(jobContent?.nodeIps?.map((item: any) => ({ ip: item })) || []);
      setCurTaskType(initData?.jobType);
      setCurRequestMethod(jobContent?.method);
      setInitPassWord(jobContent?.password);
      createTaskForm.setFieldsValue({
        ...initData,
        enable: isJobChecked,
        ...jobContent,
        nodeIps: (jobContent?.nodeIps || []).join(';'),
        params: labelList,
      });
    }

    return () => {
      setIsEditable(false);
      setCurTaskType(undefined);
      setViewEditable(false);
      setCurRequestMethod('');
      setOptType('');
      setFirstModify(false);
      setChecked(false);
      setIsEditPassword(false);
      setLimitsLength(undefined);
    };
  }, [mode]);

  useEffect(() => {
    const ipValue = createTaskForm.getFieldValue('nodeIps');
    if (ipValue && mode !== 'ADD') {
      setIpList(ipValue.split(';').map((item: any) => ({ ip: item })) || [])
    }
  }, [createTaskForm.getFieldValue('nodeIps'), mode])

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
        nodeIps: param?.nodeIps.split(';'),
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
    if (param.jobType === 5) {
      Object.assign(jobTypeContent, {
        image: param?.image,
        command: param?.command,
      });
    }
    if (param.jobType === 6) {
      Object.assign(jobTypeContent, {
        clusterName: param?.clusterName,
        nodes: param?.nodes,
        command: param?.command,
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
      desc: param?.desc,
    };
    if (mode === 'ADD') {
      addTaskManage(paramObj).then(() => {
        onSave();
      });
    } else if (mode === 'EDIT') {
      updateTaskManage({
        createUser: initData?.createUser,
        gmtCreate: initData?.gmtCreate,
        gmtModify: initData?.gmtModify,
        id: initData?.id,
        lastExecStatus: initData?.lastExecStatus,
        modifyUser: initData?.modifyUser,
        editPwd: checked,

        ...paramObj,
      }).then(() => {
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
      setIsJobChecked(false);
      setIsJobChangeOption(2);
    }
  };

  const checkAppCode = (appCode: string) => {
    queryAppEnvData({ appCode });
    createTaskForm.setFieldsValue({
      envCode: '',
      containers: [],
    });
  };

  const checkEnvCode = (envCode: string) => {
    const appCode = createTaskForm.getFieldsValue()?.appCode;
    getListContainer({ appCode, envCode });
    createTaskForm.setFieldsValue({
      containers: [],
    });
  };
  const checkPassWord = (e: CheckboxChangeEvent) => {
    setChecked(e.target.checked);
    setIsEditPassword(true);

    if (!e.target.checked) {
      createTaskForm.setFieldsValue({ password: initPassWord });
      setOptType('');
    } else {
      createTaskForm.setFieldsValue({ password: '' });
      setOptType('check');
    }
  };
  const submitCluster = (clusterName: string) => {
    getNodeNameList(clusterName);
    createTaskForm.setFieldsValue({
      nodes: undefined,
    });
  };

  return (
    <>
      <ReactCron
        visible={visible}
        onCancle={() => {
          setVisible(false);
        }}
        curTimeExpress={(express: string) => {
          setCurTimeExpress(express);
          createTaskForm.setFieldsValue({
            timeExpression: express,
          });
        }}
      />
      <IpModal
        visible={ipListVisible}
        data={ipList}
        handleCancel={() => { setIpListVisible(false) }}
        handleSubmit={(data: any) => {
          const dataList = data.map((item: any) => item.ip)
          createTaskForm.setFieldsValue({ nodeIps: dataList.join(';') });
          setIpListVisible(false);
        }}
      />
      <Drawer
        visible={mode !== 'HIDE'}
        title={mode === 'EDIT' ? '修改任务' : mode === 'VIEW' ? '查看任务' : '新增任务'}
        onClose={() => onClose()}
        width={'50%'}
        footer={
          <div className="drawer-footer">
            <Button type="primary" onClick={handleSubmit} loading={addLoading || updateLoading} disabled={viewEditable}>
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
                <Input placeholder="请输入任务名称" style={{ width: '20vw' }} disabled={viewEditable}></Input>
              </Form.Item>
              <Form.Item label="任务Code" name="jobCode" rules={[{ required: true, message: '这是必填项' }]}>
                <Input
                  style={{ width: '20vw' }}
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

              <Row>
                <Form.Item name="timeExpression" label="时间表达式" rules={[{ required: true, message: '这是必填项' }]}>
                  <Input placeholder="请输入时间表达式" style={{ width: '20vw' }} disabled={viewEditable}></Input>
                </Form.Item>
                {mode !== 'VIEW' && (
                  <span style={{ marginTop: 4 }}>
                    <Tag
                      color="geekblue"
                      onClick={() => {
                        setVisible(true);
                      }}
                    >
                      生成时间表达式
                    </Tag>
                  </span>
                )}
              </Row>

              <Form.Item
                name="enable"
                label="是否启用"
                rules={[{ required: true, message: '这是必填项' }]}
                initialValue={isJobChecked}
              >
                <Switch onChange={isJobChange} checked={isJobChecked} disabled={viewEditable} />
              </Form.Item>
              <Form.Item name="noticeType" label="执行结果通知" rules={[{ required: true, message: '这是必填项' }]}>
                <Select style={{ width: 200 }} options={RequestModeOptions} disabled={viewEditable}></Select>
              </Form.Item>

              <Form.Item name="jobType" label="任务类型" rules={[{ required: true, message: '这是必填项' }]}>
                <Select
                  style={{ width: 200 }}
                  options={TaskTypeOptions}
                  onChange={(value) => {
                    setCurTaskType(value);
                  }}
                  disabled={mode === 'EDIT' ? isEditable : viewEditable}
                ></Select>
              </Form.Item>
              <Divider />
              {/* ------------任务类型一容器命令任务---------- */}
              {curTaskType === 1 && (
                <>
                  <Row>
                    <Col span={11}>
                      <Form.Item label="appCode" name="appCode" rules={[{ required: true, message: '这是必填项' }]}>
                        <Select
                          style={{ width: 190 }}
                          disabled={viewEditable}
                          options={appList}
                          onChange={checkAppCode}
                          allowClear
                          showSearch
                        ></Select>
                      </Form.Item>
                    </Col>
                    <Col span={11}>
                      <Form.Item label="envCode" name="envCode" rules={[{ required: true, message: '这是必填项' }]}>
                        <Select
                          style={{ width: 190 }}
                          disabled={viewEditable}
                          options={appEnvDataSource}
                          onChange={checkEnvCode}
                          allowClear
                          showSearch
                          loading={loading}
                        ></Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item label="容器" name="containers" rules={[{ required: true, message: '这是必填项' }]}>
                    <Select
                      style={{ width: '20vw' }}
                      disabled={viewEditable}
                      options={containerNameOption}
                      loading={containerLoading}
                      allowClear
                      showSearch
                      mode="multiple"
                    ></Select>
                  </Form.Item>
                  <Form.Item label="command" name="command" rules={[{ required: true, message: '这是必填项' }]}>
                    <Input.TextArea
                      placeholder="请输入command"
                      style={{ width: '20vw' }}
                      disabled={viewEditable}
                    ></Input.TextArea>
                  </Form.Item>
                </>
              )}

              {/* ------------任务类型二节点命令任务---------- */}
              {curTaskType === 2 && (
                <>
                  <div style={{ display: 'flex' }}>
                    <Form.Item label="节点IPs" name="nodeIps" style={{ width: '100%' }} rules={[{ required: true, message: '这是必填项' }]} tooltip={{
                      title: '请确保该IP组存在相同的账号密码或公钥文件',
                      icon: <QuestionCircleOutlined />,
                    }} >
                      <Input style={{ width: '18vw' }} disabled></Input>
                    </Form.Item>
                    {mode !== 'VIEW' && <EditOutlined
                      style={{ marginLeft: '10px', paddingTop: '10px' }}
                      onClick={() => {
                        setIpListVisible(true)
                      }}
                    />}
                  </div>
                  <Form.Item label="账号" name="account" rules={[{ required: true, message: '这是必填项' }]}>
                    <Input style={{ width: '20vw' }} disabled={viewEditable}></Input>
                  </Form.Item>
                  {mode === 'EDIT' && (
                    <Form.Item valuePropName="checked" label="是否修改密码">
                      <Checkbox onChange={checkPassWord} checked={checked}></Checkbox>
                    </Form.Item>
                  )}

                  {optType === 'check' ? (
                    <Form.Item
                      label="密码"
                      name="password"
                      tooltip={{
                        title: '密码为空需确保机器节点存在ops主机公钥文件，否则会导致任务失败',
                        icon: <QuestionCircleOutlined />,
                      }}
                    >
                      <Input.Password
                        style={{ width: '20vw' }}
                        placeholder=""
                        disabled={optType === 'check' ? !isEditPassword : viewEditable}
                      ></Input.Password>
                    </Form.Item>
                  ) : (
                    <>
                      <Form.Item
                        label="密码"
                        name="password"
                        tooltip={{
                          title: '密码为空需确保机器节点存在ops主机公钥文件，否则会导致任务失败',
                          icon: <QuestionCircleOutlined />,
                        }}
                      >
                        <Input.Password
                          style={{ width: '20vw' }}
                          placeholder=""
                          disabled={optType === 'check' ? !isEditPassword : firstModify}
                          visibilityToggle={false}
                        ></Input.Password>
                      </Form.Item>
                    </>
                  )}
                  <Form.Item label="command" name="command" rules={[{ required: true, message: '这是必填项' }]}>
                    <Input.TextArea
                      placeholder="请输入command"
                      style={{ width: '20vw' }}
                      disabled={viewEditable}
                    ></Input.TextArea>
                  </Form.Item>
                </>
              )}
              {/*-------------- 任务类型三接口调用任务---------------- */}
              {curTaskType === 3 && (
                <>
                  <Form.Item label="接口URL" name="url" rules={[{ required: true, message: '这是必填项' }]}>
                    <Input style={{ width: '20vw' }} disabled={viewEditable}></Input>
                  </Form.Item>
                  <Form.Item label="请求方法" name="method" rules={[{ required: true, message: '这是必填项' }]}>
                    <Select
                      disabled={viewEditable}
                      style={{ width: '20vw' }}
                      options={RequestMethodOptions}
                      onChange={(value) => {
                        setCurRequestMethod(value);
                      }}
                    ></Select>
                  </Form.Item>
                  {curRequestMethod === 'POST' && (
                    <Form.Item label="body" name="body">
                      <AceEditor mode="json" height={280} readOnly={viewEditable} />
                    </Form.Item>
                  )}
                  {curRequestMethod === 'GET' && (
                    <Form.Item label="params" name="params">
                      <EditorTable
                        readOnly={viewEditable}
                        limit={limitsLength}
                        columns={[
                          { title: 'KEY', dataIndex: 'key', colProps: { width: 90 } },
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
                    <Input style={{ width: '20vw' }} disabled={viewEditable}></Input>
                  </Form.Item>
                  <Form.Item label="端口" name="port" rules={[{ required: true, message: '这是必填项' }]}>
                    <Input style={{ width: '20vw' }} disabled={viewEditable}></Input>
                  </Form.Item>
                  <Form.Item label="用户名" name="account" rules={[{ required: true, message: '这是必填项' }]}>
                    <Input style={{ width: '20vw' }} disabled={viewEditable}></Input>
                  </Form.Item>
                  {mode === 'EDIT' && (
                    <Form.Item valuePropName="checked" label="是否修改密码">
                      <Checkbox onChange={checkPassWord} checked={checked}></Checkbox>
                    </Form.Item>
                  )}
                  {optType === 'check' ? (
                    <Form.Item label="密码" name="password" rules={[{ required: true, message: '这是必填项' }]}>
                      <Input.Password
                        style={{ width: '20vw' }}
                        disabled={optType === 'check' ? !isEditPassword : viewEditable}
                      ></Input.Password>
                    </Form.Item>
                  ) : (
                    <Form.Item label="密码" name="password" rules={[{ required: true, message: '这是必填项' }]}>
                      <Input.Password
                        style={{ width: '20vw' }}
                        disabled={optType === 'check' ? !isEditPassword : firstModify}
                        visibilityToggle={false}
                      ></Input.Password>
                    </Form.Item>
                  )}

                  <Form.Item label="数据库名" name="databaseName" rules={[{ required: true, message: '这是必填项' }]}>
                    <Input style={{ width: '20vw' }} disabled={viewEditable}></Input>
                  </Form.Item>
                  <Form.Item label="SQL" name="sql" rules={[{ required: true, message: '这是必填项' }]}>
                    <Input.TextArea style={{ width: '20vw' }} disabled={viewEditable}></Input.TextArea>
                  </Form.Item>
                </>
              )}
              {/* ------------任务类型五新容器命令任务---------- */}
              {curTaskType === 5 && (
                <>
                  <Form.Item label="镜像" name="image" rules={[{ required: true, message: '这是必填项' }]}>
                    <Input.TextArea
                      placeholder="请输入镜像"
                      style={{ width: '20vw' }}
                      disabled={viewEditable}
                    ></Input.TextArea>
                  </Form.Item>

                  <Form.Item label="command" name="command" rules={[{ required: true, message: '这是必填项' }]}>
                    <Input.TextArea
                      placeholder="请输入command"
                      style={{ width: '20vw' }}
                      disabled={viewEditable}
                    ></Input.TextArea>
                  </Form.Item>
                </>
              )}
              {/* ------------任务类型六K8S节点命令任务---------- */}
              {curTaskType === 6 && (
                <>
                  <Form.Item label="集群名称" name="clusterName" rules={[{ required: true, message: '这是必填项' }]}>
                    <Select
                      style={{ width: '20vw' }}
                      allowClear
                      showSearch
                      options={clusterOption}
                      loading={clusterListloading}
                      onChange={submitCluster}
                      disabled={viewEditable}
                    />
                  </Form.Item>
                  <Form.Item label="节点名称" name="nodes" rules={[{ required: true, message: '这是必填项' }]}>
                    <Select
                      style={{ width: '20vw' }}
                      disabled={viewEditable}
                      options={nodeNameOption}
                      loading={nodeNameLoading}
                      mode="multiple"
                      showSearch
                      allowClear
                    ></Select>
                  </Form.Item>

                  <Form.Item label="command" name="command" rules={[{ required: true, message: '这是必填项' }]}>
                    <Input.TextArea
                      placeholder="请输入command"
                      style={{ width: '24vw' }}
                      disabled={viewEditable}
                    ></Input.TextArea>
                  </Form.Item>
                </>
              )}

              {/* ------------------------备注------------------------ */}

              <Form.Item name="desc" label="备注：">
                <Input.TextArea
                  placeholder="请输入备注"
                  style={{ width: '20vw', height: 80 }}
                  disabled={viewEditable}
                ></Input.TextArea>
              </Form.Item>
            </Form>
          </div>
        </Spin>
      </Drawer>
    </>
  );
}
