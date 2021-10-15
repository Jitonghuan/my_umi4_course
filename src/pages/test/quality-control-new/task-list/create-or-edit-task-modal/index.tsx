import React, { useState, useEffect, useContext } from 'react';
import { Modal, Form, Select, Checkbox, DatePicker, Input, Switch } from 'antd';
import * as HOOKS from '../../hooks';
import * as APIS from '../../service';
import { getRequest, postRequest, putRequest } from '@/utils/request';
import FELayout from '@cffe/vc-layout';
import moment from 'moment';

interface ICreateOrEditTaskModal {
  visible: boolean;
  readOnly?: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  task?: any;
  setTask: React.Dispatch<React.SetStateAction<any>>;
  handleSearch: () => void;
}

export default function CreateOrEditTaskModal(props: ICreateOrEditTaskModal) {
  const { visible, setVisible, task, setTask, handleSearch } = props;
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const isCreate = task === undefined;

  const [appCategoryOptions] = HOOKS.useAppCategoryOptions();

  const [appCodeOptions, setAppCodeOptions] = useState<IOption[]>();
  const [appBranchOptions, setAppBranchOptions] = useState<IOption[]>();
  const [readOnly, setReadOnly] = useState<boolean | undefined>(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (!isCreate) {
      setReadOnly(true);
      const taskItems = [];
      if (task.utSwitch) taskItems.push('utSwitch');
      if (task.sonarSwitch) taskItems.push('sonarSwitch');
      form.setFieldsValue({ ...task, taskItems, expireTime: moment(task.expireTime) });
    } else {
      setReadOnly(false);
      form.resetFields();
    }
  }, [visible, isCreate]);

  const handleOk = () => {
    const formData = form.getFieldsValue();
    const requestParams = {
      ...formData,
      utSwitch: formData.taskItems?.includes('utSwitch') ? 1 : 0,
      sonarSwitch: formData.taskItems?.includes('sonarSwitch') ? 1 : 0,
      noticeSwitch: formData.noticeSwitch ? 1 : 0,
      expireTime: moment(formData.expireTime).format('YYYY-MM-DD HH:mm:ss'),
      currentUser: userInfo.userName,
    };
    delete requestParams.taskItems;

    console.log('requestParams :>> ', requestParams);
    if (!isCreate) {
      delete requestParams.categoryCode;
      delete requestParams.appCode;
      delete requestParams.branchName;

      updateTaskForm(requestParams);
    } else {
      handleTaskForm(requestParams);
    }
  };

  const handleTaskForm = (taskform: any) => {
    postRequest(APIS.operateTask, { data: taskform }).then((res) => {
      setVisible(false);
      setTask(undefined);
      handleSearch();
    });
  };

  const updateTaskForm = (taskform: any) => {
    putRequest(`${APIS.operateTask}/${task.id}`, { data: taskform }).then((res) => {
      setVisible(false);
      setTask(undefined);
      handleSearch();
    });
  };

  const getAppCodeByCategory = (value: any) => {
    getRequest(APIS.getAppInfoList, { data: { appCategoryCode: value } }).then((res) => {
      const source = res.data.dataSource.map((item: any) => ({
        label: item.appCode,
        value: item.appCode,
        data: item,
      }));
      setAppCodeOptions(source);
    });
  };

  const getAppBranch = (value: any) => {
    getRequest(APIS.getAppBranch, { data: { appCode: value } }).then((res) => {
      const source = res.data.dataSource.map((item: any) => ({
        label: item.branchName,
        value: item.branchName,
        data: item,
      }));
      setAppBranchOptions(source);
    });
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => {
        setVisible(false);
        setTask(undefined);
      }}
      onOk={handleOk}
      title={isCreate ? '新建任务' : '编辑任务'}
      maskClosable={false}
    >
      <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item label="应用分类" name="categoryCode">
          <Select
            options={appCategoryOptions}
            onChange={(value) => {
              getAppCodeByCategory(value);
            }}
            disabled={readOnly}
          />
        </Form.Item>
        <Form.Item label="应用code" name="appCode">
          <Select
            options={appCodeOptions}
            onChange={(value) => {
              getAppBranch(value);
            }}
            disabled={readOnly}
          />
        </Form.Item>
        <Form.Item label="代码分支" name="branchName">
          <Select options={appBranchOptions} disabled={readOnly} />
        </Form.Item>
        <Form.Item label="任务项" name="taskItems">
          <Checkbox.Group>
            <Checkbox value="utSwitch">单元测试</Checkbox>
            <Checkbox value="sonarSwitch">代码扫描</Checkbox>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item label="过期时间" name="expireTime">
          <DatePicker showTime />
        </Form.Item>
        <Form.Item label="触发策略" name="strategy">
          <Input placeholder="支持cron语法" />
        </Form.Item>
        <Form.Item label="负责人" name="owner">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="钉钉提醒" name="noticeSwitch" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
}
