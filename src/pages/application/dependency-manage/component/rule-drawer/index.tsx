// 编辑依赖规则
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/6/20 15:09

import React from 'react';
import { useState, useEffect } from 'react';
import { Drawer, Input, Button, Form, Select, message, Switch, DatePicker, Space,Checkbox } from 'antd';
import { addRule, updateRule } from '../../service'
import Icon, { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { operatorOption, operatorLessOption, operatorGreaterOption, levelOption } from '../../schema';
import moment from 'moment';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

export interface IProps {
  mode?: EditorMode;
  initData: any;
  envData: any;
  onClose?: () => any;
  onSave?: () => any;
}

export default function RuleDrawer(props: any) {
  const { mode, onClose, onSave, initData, envData } = props;
  const [form] = Form.useForm();
  const [isChecked, setisChecked] = useState<boolean>(false);
  const [isEnableChangeOption, setisEnableChangeOption] = useState<number>(0);
  const [viewEditable, setViewEditable] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [check,setCheck]=useState<boolean>(false)
  

  const splitMap: any = {
    gt: '>',
    ge: '>=',
    lt: '<',
    le: '<=',
    eq: '=',
    ne: '!=',
  };
  const splitReverseMap: any = {
    '>': 'gt',
    '>=': 'ge',
    '<': 'lt',
    '<=': 'le',
    '=': 'eq',
    '!=': 'ne',
  };
  const getInitVersionRange=(initData?:any)=>{
   // if(Object.keys(initData)?.length<1) return
    if(Object.keys(initData)?.length>0){
      let item1 = '';
      let version1 = '';
      let item2 = '';
      let version2 = '';
      let versionRange = initData?.versionRange?.includes(',')
        ? initData?.versionRange?.split(',')
        : [initData?.versionRange];
      if (versionRange) {
        if (initData?.versionRange?.includes(',') && versionRange.length === 2) {
          setShowMore(true);
        }
        versionRange?.map((ele: any, index: any) => {
          if (index == 1) {
            item2 = ele?.split('@')[0];
            version2 = ele?.split('@')[1];
          } else {
            item1 = ele?.split('@')[0];
            version1 = ele?.split('@')[1];
          }
        });
        form.setFieldsValue({
           versionRangeOne: splitMap[item1] ,
           versionRangeTwo: version1,
           versionRangeThree: splitMap[item2] ,
           versionRangeFour: version2

          });
       
      }

    }

  }
  useEffect(() => {
    if (mode === 'HIDE') return;
    if (mode === 'VIEW') {
      setViewEditable(true);
    }
    if (mode === 'EDIT' || mode === 'VIEW') {
      if (initData) {
        getInitVersionRange(initData)
        let curEnvCode = initData?.envCode?.split(',');

        form.setFieldsValue({
          ruleName: initData?.ruleName,
          groupId: initData?.groupId,
          artifactId: initData?.artifactId,
          envCode: curEnvCode[0] === '' ? undefined : curEnvCode,
          checkLevel: initData?.checkLevel,
          blockTime: moment(initData?.blockTime, 'YYYY-MM-DD'),
          isDependency:initData?.isDependency==="NotMust"?false:true,
        });
        setCheck(initData?.isDependency==="NotMust"?false:true)
        setisChecked(initData?.isEnable === 0 ? false : true);
        setisEnableChangeOption(initData?.isEnable);
      }
    } else {
      // setIsDisabled(false);
    }

    return () => {
      form.resetFields();
      setisChecked(false);
      setisEnableChangeOption(0);
      setViewEditable(false);
      setShowMore(false);
      setCheck(false)
    };
  }, [mode]);
  useEffect(()=>{
    if(check===true&&mode==="ADD"){
      form.setFieldsValue({ versionRangeOne: "ge",
      versionRangeTwo: "0.0.0"
     });
    
    
    }
    if(mode==="EDIT"&&check===false){
      getInitVersionRange(initData)
      
    

    }
   
  },[check,mode])

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

  const handleSubmit = async () => {
    const values = await form.validateFields();
    let curEnvCode = '';
    let curEnvCodeString = '';
    values?.envCode?.map((item: any, index: number) => {
      let envCodeString = `${item},`;
      curEnvCodeString = curEnvCodeString + envCodeString;
    });

    curEnvCode = curEnvCodeString.substring(0, curEnvCodeString.length - 1);

    let versionRangeStringFirst: string = '';
    let versionRangeStringSecond: string = '';
    if (values?.versionRangeTwo && values?.versionRangeOne) {
      if (mode === 'EDIT') {
        versionRangeStringFirst =
          (splitReverseMap[values?.versionRangeOne] || values?.versionRangeOne) + '@' + values?.versionRangeTwo;
      }
      if (mode === 'ADD') {
        versionRangeStringFirst = values?.versionRangeOne + '@' + values?.versionRangeTwo;
      }
    }
    if (values?.versionRangeThree && values?.versionRangeFour) {
      if (mode === 'ADD') {
        versionRangeStringSecond = values?.versionRangeThree + '@' + values?.versionRangeFour;
      }
      if (mode === 'EDIT') {
        versionRangeStringSecond =
          (splitReverseMap[values?.versionRangeThree] || values?.versionRangeThree) + '@' + values?.versionRangeFour;
      }
    }

    let paramsObj = {
      isEnable: isEnableChangeOption,
      versionRange:
        versionRangeStringSecond !== ''
          ? versionRangeStringFirst + ',' + versionRangeStringSecond
          : versionRangeStringFirst,
      artifactId: values?.artifactId,
      blockTime: moment(values?.blockTime).format('YYYY-MM-DD'),
      checkLevel: values?.checkLevel,
      envCode: curEnvCode,
      groupId: values?.groupId,
      ruleName: values?.ruleName,
      isDependency:check?"Must":"NotMust"
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
      title={mode === 'EDIT' ? '编辑规则' : mode === 'VIEW' ? '查看规则' : '新增规则'}
      maskClosable={false}
      onClose={onClose}
      width={'50%'}
      footer={
        <div className="drawer-footer">
          <Button type="default" onClick={onClose}>
            取消
          </Button>
          <Button type="primary" onClick={handleSubmit} disabled={viewEditable}>
            保存
          </Button>
        </div>
      }
    >
      <div className="creat-rule">
        <Form form={form}  labelCol={{ flex: '160px' }} onFinish={handleSubmit}>
          <Form.Item label="规则名称：" name="ruleName" rules={[{ required: true, message: '这是必填项' }]}>
            <Input style={{ width: 400 }} placeholder="请输入规则名称" disabled={viewEditable}></Input>
          </Form.Item>

          <Form.Item label="groupId：" name="groupId" rules={[{ required: true, message: '这是必填项' }]}>
            <Input
              style={{ width: 400 }}
              placeholder="请输入groupId"
              disabled={mode === 'VIEW' ? viewEditable : mode === 'EDIT'}
            ></Input>
          </Form.Item>

          <Form.Item label="artifactId：" name="artifactId" rules={[{ required: true, message: '这是必填项' }]}>
            <Input
              style={{ width: 400 }}
              placeholder="请输入artifactId"
              disabled={mode === 'VIEW' ? viewEditable : mode === 'EDIT'}
            ></Input>
          </Form.Item>

          <Form.Item label="校验环境：" name="envCode">
            <Select
              style={{ width: 400 }}
              options={envData}
              allowClear
              showSearch
              disabled={viewEditable}
              mode="multiple"
            ></Select>
          </Form.Item>
          <Form.Item label="必须引入依赖包" valuePropName="checked" name="isDependency" initialValue={false} rules={[{ required: true, message: '这是必填项' }]}>
          <Checkbox onChange={(e: CheckboxChangeEvent)=>{
            setCheck(e.target.checked)
            }} defaultChecked={false}></Checkbox>
          
          </Form.Item>
          <Form.Item label="版本范围：">
            <Space>
              <Form.Item name="versionRangeOne" rules={[{ required: true, message: '这是必填项' }]}>
                <Select
                  style={{ width: 150 }}
                  placeholder="请选择"
                  disabled={viewEditable}
                  options={showMore ? operatorGreaterOption : operatorOption}
                ></Select>
              </Form.Item>
              <Form.Item name="versionRangeTwo" rules={[{ required: true, message: '这是必填项' }]}>
                <Input style={{ width: 249 }} placeholder="请输入版本号" disabled={viewEditable} />
              </Form.Item>
              <Form.Item>
                <PlusCircleOutlined
                  style={{ marginLeft: '5px' }}
                  disabled={viewEditable}
                  onClick={() => {
                    if (!viewEditable) {
                      setShowMore(true);
                      let value = form.getFieldValue('versionRangeOne');

                      if (value !== 'gt' && value !== 'ge') {
                        form.setFieldsValue({
                          versionRangeOne: '',
                        });
                      }
                    }
                  }}
                />
              </Form.Item>
            </Space>
            {showMore && (
              <p>
                <Space>
                  <Form.Item name="versionRangeThree">
                    <Select
                      style={{ width: 150 }}
                      placeholder="请选择"
                      options={operatorLessOption}
                      disabled={viewEditable}
                    ></Select>
                  </Form.Item>
                  <Form.Item name="versionRangeFour">
                    <Input style={{ width: 249 }} placeholder="请输入版本号" disabled={viewEditable}></Input>
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
              </p>
            )}
          </Form.Item>
          <Form.Item label="升级截止日期：" name="blockTime" rules={[{ required: true, message: '这是必填项' }]}>
            <DatePicker format="YYYY-MM-DD" disabled={viewEditable} />
          </Form.Item>
          <Form.Item label="校验级别：" name="checkLevel" rules={[{ required: true, message: '这是必填项' }]}>
            <Select style={{ width: 400 }} options={levelOption} disabled={viewEditable}></Select>
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
