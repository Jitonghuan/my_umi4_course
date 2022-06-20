// 编辑依赖规则
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/6/20 15:09

import React from 'react';
import { useState, useEffect } from 'react';
import { Drawer, Input, Button, Form, Select, message, Switch, DatePicker, Space } from 'antd';
import { addRule, updateRule } from '../../service';
import { fetchEnvList } from '@/pages/application/_components/application-editor/service';
import Icon, { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { operatorOption, operatorLessOption, operatorGreaterOption } from '../../schema';
import moment from 'moment';

export interface IProps {
  mode?: EditorMode;
  initData: any;
  onClose?: () => any;
  onSave?: () => any;
}

const levelOption = [
  { label: '警告', value: 'warning' },
  { label: '阻断', value: 'block' },
];

export default function RuleDrawer(props: any) {
  const { mode, onClose, onSave, initData } = props;
  const [form] = Form.useForm();
  const [envData, setEnvData] = useState<any>([]);
  const [isChecked, setisChecked] = useState<boolean>(false);
  const [isEnableChangeOption, setisEnableChangeOption] = useState<number>(0);
  const [viewEditable, setViewEditable] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);

  useEffect(() => {
    if (mode === 'HIDE') return;
    if (mode === 'ADD') {
      form.resetFields();
    }
    if (mode === 'EDIT') {
      // setIsDisabled(true);
    } else {
      // setIsDisabled(false);
    }
    if (initData) {
      form.setFieldsValue({
        ...initData,
      });
    }
  }, [mode]);

  useEffect(() => {
    getEnvData();
  }, []);
  //是否启用任务
  const isEnableChange = (checked: boolean) => {
    if (checked === true) {
      setisChecked(true);
      setisEnableChangeOption(1);
    } else {
      setisChecked(false);
      setisEnableChangeOption(0);
    }
  };
  // 获取环境列表
  async function getEnvData() {
    const res = await fetchEnvList({
      pageIndex: 1,
      pageSize: 1000,
    });
    setEnvData(res || []);
  }

  const handleSubmit = async () => {
    const values = await form.validateFields();

    let versionRangeArry: any = [];
    if (values?.versionRangeTwo && values?.versionRangeOne) {
      versionRangeArry.push(values?.versionRangeOne + '@' + values?.versionRangeTwo);
    }
    if (values?.versionRangeThree && values?.versionRangeFour) {
      versionRangeArry.push(values?.versionRangeThree + '@' + values?.versionRangeFour);
    }

    console.log('versionRangeArry', versionRangeArry);
    let paramsObj = {
      isEnable: values?.isEnable ? 1 : 0,
      versionRange: versionRangeArry,
      artifactId: values?.artifactId,
      blockTime: values?.blockTime,
      checkLevel: values?.checkLevel,
      envCode: values?.envCode,
      groupId: values?.groupId,
      ruleName: values?.ruleName,
    };
    const res = await (mode === 'ADD' ? addRule({ ...paramsObj }) : updateRule({ ...paramsObj, id: initData?.id }));
    if (res && res.success) {
      message.success(`${mode === 'ADD' ? '新增' : '编辑'}成功`);
      onSave?.();
    }
  };
  return (
    <Drawer
      visible={mode !== 'HIDE'}
      title={mode === 'EDIT' ? '编辑规则' : '新增规则'}
      maskClosable={false}
      onClose={onClose}
      width={'40%'}
      footer={
        <div className="drawer-footer">
          <Button type="default" onClick={onClose}>
            取消
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            保存
          </Button>
        </div>
      }
    >
      <div className="creat-rule">
        <Form form={form} labelCol={{ flex: '120px' }} onFinish={handleSubmit}>
          <Form.Item label="规则名称：" name="ruleName" rules={[{ required: true, message: '这是必填项' }]}>
            <Input style={{ width: 400 }} placeholder="请输入规则名称"></Input>
          </Form.Item>

          <Form.Item label="groupId：" name="groupId" rules={[{ required: true, message: '这是必填项' }]}>
            <Input style={{ width: 400 }} placeholder="请输入groupId" disabled={mode === 'EDIT'}></Input>
          </Form.Item>

          <Form.Item label="artifactId：" name="artifactId" rules={[{ required: true, message: '这是必填项' }]}>
            <Input style={{ width: 400 }} placeholder="请输入artifactId" disabled={mode === 'EDIT'}></Input>
          </Form.Item>

          <Form.Item label="校验环境：" name="envCode">
            <Select style={{ width: 400 }} options={envData} allowClear showSearch></Select>
          </Form.Item>
          <Form.Item label="版本范围：">
            <Space>
              <Form.Item name="versionRangeOne">
                <Select
                  style={{ width: 150 }}
                  placeholder="请选择"
                  options={showMore ? operatorGreaterOption : operatorOption}
                ></Select>
              </Form.Item>
              <Form.Item name="versionRangeTwo">
                <Input style={{ width: 249 }} placeholder="请按照 1.0.0 的格式输入" />
              </Form.Item>
              <Form.Item>
                <PlusCircleOutlined
                  style={{ marginLeft: '5px' }}
                  onClick={() => {
                    setShowMore(true);
                  }}
                />
              </Form.Item>
            </Space>
            {showMore && (
              <Space>
                <Form.Item name="versionRangeThree">
                  <Select style={{ width: 150 }} placeholder="请选择" options={operatorLessOption}></Select>
                </Form.Item>
                <Form.Item name="versionRangeFour">
                  <Input style={{ width: 249 }} placeholder="请按照 1.0.0 的格式输入"></Input>
                </Form.Item>
                <Form.Item>
                  <MinusCircleOutlined
                    style={{ marginLeft: '5px' }}
                    onClick={() => {
                      setShowMore(false);
                    }}
                  />
                </Form.Item>
              </Space>
            )}
          </Form.Item>
          <Form.Item label="升级截止日期：" name="blockTime" rules={[{ required: true, message: '这是必填项' }]}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="校验级别：" name="checkLevel" rules={[{ required: true, message: '这是必填项' }]}>
            <Select style={{ width: 400 }} options={levelOption}></Select>
          </Form.Item>
          <Form.Item
            name="isEnable"
            label="是否启用"
            rules={[{ required: true, message: '这是必填项' }]}
            initialValue={isChecked}
          >
            <Switch onChange={isEnableChange} checked={isChecked} disabled={viewEditable} />
          </Form.Item>
        </Form>
      </div>
    </Drawer>
  );
}
