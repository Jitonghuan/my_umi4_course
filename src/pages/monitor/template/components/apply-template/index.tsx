import React, {useEffect, useState} from 'react';
import { Button, Drawer, Form, message, Select, Checkbox, Divider, Input } from 'antd';
import { applyTemplate, graphTemplateList } from '../../service';
import UserSelector from '@/components/user-selector';
import { useEnvListOptions } from '@/pages/monitor/alarm-rules/hooks';
const CheckboxGroup = Checkbox.Group;


interface IProps {
  visible: boolean;
  onClose: () => void;
  param?: any;
}

const envTypeData = [
  {
    label: 'DEV',
    value: 'dev',
  },
  {
    label: 'TEST',
    value: 'test',
  },
  {
    label: 'PRE',
    value: 'pre',
  },
  {
    label: 'PROD',
    value: 'prod',
  },
]; //环境大类

const ApplyTemplate = (props: IProps) => {
  const {visible, onClose} = props;
  const [clusterEnvOptions, queryEnvCodeList] = useEnvListOptions();
  const [templatesList, setTemplatesList] = useState([]);
  const [currentEnvType, setCurrentEnvType] = useState('');
  const [currentEnvCode, setCurrentEnvCode] = useState(''); // 环境code
  const [form] = Form.useForm();

  //获取模板列表
  const getTemplate = async () => {
    const res = await graphTemplateList();
    setTemplatesList(
      res?.data?.dataSource.map((v: any) => {
        return {
          ...v,
          label: v.name,
          title: v.name,
          key: v.id,
          value: v.id,
          isLeaf: true
        };
      }),
    );
  }

  async function onConfirm() {
    const param = await form.validateFields();
    const res = await applyTemplate({
      envCode: currentEnvCode,
      devNotifiers: (param.devNotifiers || []).join(','),
      opsNotifiers: (param.opsNotifiers || []).join(','),
      monitorRuleTemplate: templatesList.filter((item: any) => param.monitorRuleTemplate.find((id: any) => id === item.id))
    })
    if (res.success) {
      message.success('应用成功');
      onClose();
    }
  }

  useEffect(() => {
    if (visible) {
      void getTemplate();
    }
  }, [visible])

  return (
    <Drawer
      visible={visible}
      title="一键应用模版"
      width={500}
      maskClosable={false}
      onClose={onClose}
      footer={
        <div className="drawer-footer">
          <Button type="primary" onClick={onConfirm}>
            保存
          </Button>
          <Button type="default" onClick={onClose}>
            取消
          </Button>
        </div>
      }
    >
      <Form form={form} labelCol={{flex: '150px'}}>
        <Form.Item label="环境" name="envCode">
          <Select
            style={{width: '100px'}}
            options={envTypeData}
            value={currentEnvType}
            placeholder="分类"
            onChange={(value) => {
              setCurrentEnvType(value);
              setCurrentEnvCode('');
              void queryEnvCodeList(value);
            }}
            allowClear
          />
          <Select
            style={{width: '160px', marginLeft: '5px'}}
            options={clusterEnvOptions}
            placeholder="环境名称"
            onChange={(value) => {
              setCurrentEnvCode(value);
            }}
            value={currentEnvCode}
            allowClear
          />
        </Form.Item>
        <Form.Item label="开发通知人" name="devNotifiers">
          <UserSelector />
        </Form.Item>
        <Form.Item label="运维通知人" name="opsNotifiers">
          <UserSelector />
        </Form.Item>
        <Form.Item label="报警模版" name="monitorRuleTemplate">
          <Select
            allowClear
            showSearch
            filterOption={(input, option) => {
              // @ts-ignore
              return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }}
            mode="multiple"
            options={templatesList}
          />
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default ApplyTemplate;
