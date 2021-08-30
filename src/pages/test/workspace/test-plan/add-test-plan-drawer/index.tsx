import React, { useState, useEffect, useContext } from 'react';
import { getRequest, postRequest } from '@/utils/request';
import { createTestPlan, modifyTestPlan, getManagerList, getProjectTreeData } from '../../service';
import { Form, Button, Table, Input, Select, Space, Drawer, message, Cascader } from 'antd';
import EditorTable from '@cffe/pc-editor-table';
import FELayout from '@cffe/vc-layout';
import moment from 'moment';
import './index.less';
import _ from 'lodash';

export default function AddTestPlanDrawer(props: any) {
  const { plan, visible, setVisible, updateTable, projectList } = props;
  const userInfo = useContext(FELayout.SSOUserInfoContext);

  const [phaseCollection, setPhaseCollection] = useState<any[]>([]);
  const [manageList, setManageList] = useState<string[]>([]);
  const [projectTreeData, setProjectTreeData] = useState<any[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    void getRequest(getManagerList).then((res) => {
      void setManageList(res.data.usernames);
    });

    void getRequest(getProjectTreeData).then((res) => {
      const Q = [...res.data];
      while (Q.length) {
        const cur = Q.shift();
        cur.label = cur.name;
        cur.value = cur.id;
        cur.children && Q.push(...cur.children);
      }
      void setProjectTreeData(res.data);

      console.log(res.data);
    });
  }, []);

  useEffect(() => {
    if (visible) {
      if (plan) {
        void form.setFieldsValue(plan);
        void setPhaseCollection(
          plan?.phaseCollection?.map((item: any) => ({
            ...item,
            startTime: moment(item.startTime),
            endTime: moment(item.endTime),
          })),
        );
      } else {
        void form.resetFields();
        void setPhaseCollection([]);
      }
    }
  }, [visible]);

  const handleSave = async () => {
    const formData = form.getFieldsValue();
    const requestParams = {
      ...formData,
      projectId: +formData.projectId,
      demandId: formData.demandId.join('/'),
      phaseCollection: phaseCollection.map((item) => ({
        ...item,
        startTime: item.startTime.format('YYYY-MM-DD HH:mm:ss'),
        endTime: item.endTime.format('YYYY-MM-DD HH:mm:ss'),
      })),
      createUser: userInfo.userName,
    };
    void (await postRequest(createTestPlan, { data: requestParams }));
    void updateTable();
    void setVisible(false);
    void message.success('新增计划成功');
  };

  const handleEdit = async () => {
    const formData = form.getFieldsValue();
    const requestParams = {
      ...formData,
      phaseCollection: phaseCollection.map((item) => ({
        ...item,
        id: item.id === undefined ? -1 : item.id,
        startTime: item.startTime.format('YYYY-MM-DD HH:mm:ss'),
        endTime: item.endTime.format('YYYY-MM-DD HH:mm:ss'),
      })),
      projectId: +formData.projectId,
      demandId: formData.demandId.join('/'),
      modifyUser: userInfo.userName,
      id: plan.id,
    };
    void (await postRequest(modifyTestPlan, { data: { ...requestParams } }));
    void updateTable();
    void setVisible(false);
    void message.success('编辑计划成功');
  };

  const handleCancel = () => {
    void setVisible(false);
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
    labelAlign: 'left' as 'left',
  };

  return (
    <Drawer
      className="test-workspace-test-plan-add-test-plan-drawer"
      visible={visible}
      width="650"
      title={plan ? '编辑计划' : '新增计划'}
      onClose={() => setVisible(false)}
    >
      <Form {...layout} form={form}>
        <Form.Item label="计划名称" name="name">
          <Input placeholder="请输入计划名称" />
        </Form.Item>
        <Form.Item label="业务所属" name="projectId">
          <Select placeholder="请选择" allowClear>
            {projectList.map((item: any) => (
              <Select.Option value={item.id}>{item.categoryName}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="项目/需求" name="demandId">
          <Cascader placeholder="请选择" options={projectTreeData} onChange={(val) => console.log(val)} />
        </Form.Item>
        <Form.Item label="关联任务" name="jiraTask">
          <Input placeholder="请输入关联任务" />
        </Form.Item>
        <Form.Item label="计划说明" name="description">
          <Input.TextArea placeholder="请输入用例前置条件" />
        </Form.Item>
        <Form.Item label="测试阶段">
          <EditorTable
            value={phaseCollection}
            onChange={setPhaseCollection}
            creator={{ record: { name: '', head: '', startTime: '', endTime: '' } }}
            columns={[
              { title: '测试阶段', dataIndex: 'name', required: true },
              {
                title: '负责人',
                dataIndex: 'head',
                fieldType: 'select',
                valueOptions: manageList.map((item) => ({ label: item, value: item })),
                fieldProps: { placeholder: '请选择', showSearch: true, optionFilterProp: 'label' },
                colProps: { width: 140 },
                required: true,
              },
              {
                title: '开始时间',
                dataIndex: 'startTime',
                required: true,
                fieldType: 'date',
                fieldProps: { showTime: true },
              },
              {
                title: '结束时间',
                dataIndex: 'endTime',
                required: true,
                fieldType: 'date',
                fieldProps: { showTime: true },
              },
            ]}
          />
        </Form.Item>
      </Form>
      <div className="btn-container">
        <Button type="primary" onClick={plan ? handleEdit : handleSave}>
          保存
        </Button>
        <Button className="ml-12" type="primary" onClick={handleCancel}>
          取消
        </Button>
      </div>
    </Drawer>
  );
}
