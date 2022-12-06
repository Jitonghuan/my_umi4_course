import React, { useEffect, useState } from 'react';
import { Button, Form, message, Select, Checkbox, Drawer, Tree } from 'antd';
import { applyTemplate, graphTemplateList, queryRuleTemplatesList } from '../../service';
import UserSelector from '@/components/user-selector';
import { useEnvListOptions } from '@/pages/monitor/alarm-rules/hooks';
import './index.less';

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
  const { visible, onClose } = props;
  const [clusterEnvOptions, queryEnvCodeList] = useEnvListOptions();
  const [templatesList, setTemplatesList] = useState<any[]>([]);
  const [currentEnvType, setCurrentEnvType] = useState('');
  const [currentEnvCode, setCurrentEnvCode] = useState(''); // 环境code
  const [checkedList, setCheckedList] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);

  //获取模板列表
  const getTemplate = async () => {
    const res = await queryRuleTemplatesList();
    setTemplatesList(
      res?.data?.dataSource.map((v: any) => {
        return {
          ...v,
          label: v.name,
          title: v.name,
          key: v.id,
          value: v.id,
          isLeaf: true,
        };
      }),
    );
  };

  async function onConfirm() {
    const param = await form.validateFields();
    const res = await applyTemplate({
      envCode: currentEnvCode,
      devNotifiers: (param.devNotifiers || []).join(','),
      opsNotifiers: (param.opsNotifiers || []).join(','),
      monitorRuleTemplate: templatesList.filter((item: any) => checkedList.find((id: any) => id === item.id)),
    });
    if (res.success) {
      message.success('应用成功');
      onClose();
    }
  }

  const onChange = (list: any) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < templatesList.length);
    setCheckAll(list.length === templatesList.length);
  };

  const onSelect = (list: any) => {
    let ids = JSON.parse(JSON.stringify(checkedList));
    for (let i = 0; i < list.length; i++) {
      let index = ids.findIndex((id: any) => id === list[i]);
      if (index !== -1) {
        ids.splice(index, 1);
      } else {
        ids.push(list[i]);
      }
    }
    onChange(ids);
  };

  const onCheckAllChange = (e: any) => {
    let ids = [];
    if (e.target.checked) {
      for (let i = 0; i < templatesList.length; i++) {
        ids.push(templatesList[i].id);
      }
    }
    setCheckedList(ids);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  useEffect(() => {
    if (visible) {
      void getTemplate();
    }
  }, [visible]);

  return (
    <Drawer
      visible={visible}
      title="一键应用模版"
      width={500}
      maskClosable={false}
      onClose={onClose}
      className="apply-template-modal"
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
      <Form form={form} labelCol={{ flex: '80px' }}>
        <Form.Item label="环境" name="envCode">
          <Select
            style={{ width: '100px' }}
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
            style={{ width: '264px', marginLeft: '5px' }}
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
        <Form.Item label="报警模版">
          <div>
            <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
              全选
            </Checkbox>
            <Tree
              checkable
              switcherIcon={null}
              rootClassName="template-page"
              checkedKeys={checkedList}
              onCheck={(ids) => onChange(ids)}
              height={595}
              onSelect={(ids) => onSelect(ids)}
              treeData={templatesList}
            />
          </div>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ApplyTemplate;
