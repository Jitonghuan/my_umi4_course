// 新增环境抽屉页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/10/25 18:30

import React from 'react';
import { history } from 'umi';
import { getRequest, postRequest, putRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import { Drawer, Input, Button, Form, Select, Space, message, Switch, Divider, Radio, Tag, Modal } from 'antd';

// import { createEnv, appTypeList, updateEnv, queryNGList } from '../service';

export interface EnvEditorProps {
  mode?: EditorMode;
  //   initData?: EnvEditData;
  onClose: () => any;
  //   onSave: () => any;
}

export default function addEnvData(props: EnvEditorProps) {
  const [createEnvForm] = Form.useForm();
  const { mode, onClose } = props;
  //   const { mode, onClose, onSave, initData } = props;
  const [checkedOption, setCheckedOption] = useState<number>(0); //是否启用nacos
  const [nacosChecked, setNacosChecked] = useState<boolean>(false);
  const [needApplyOption, setNeedApplyOption] = useState<number>(1); //是否启用发布审批
  const [needApplyChecked, setNeedApplyChecked] = useState<boolean>(false);
  //ngInstCode
  const [isBlockChangeOption, setIsBlockChangeOption] = useState<number>(0); //是否封网
  const [isBlockChecked, setIsBlockChecked] = useState<boolean>(false);
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [editEnvCode, setEditEnvCode] = useState<boolean>(false);

  //   useEffect(() => {
  //     // selectCategory();
  //   }, [mode]);

  //   useEffect(() => {
  //     if (mode === 'HIDE') return;
  //     queryNGlist();
  //     createEnvForm.resetFields();
  //     if (mode === 'VIEW') {
  //       setIsDisabled(true);
  //     } else {
  //       setIsDisabled(false);
  //     }
  //     if (mode === 'EDIT') {
  //       setEditEnvCode(true);
  //     }
  //     if (initData) {
  //       if (initData?.isBlock === 1) {
  //         setIsBlockChecked(true);
  //         setIsBlockChangeOption(1);
  //       } else {
  //         setIsBlockChecked(false);
  //         setIsBlockChangeOption(0);
  //       }

  //       if (initData?.useNacos === 1) {
  //         setNacosChecked(true);
  //         setCheckedOption(1);
  //       } else {
  //         setNacosChecked(false);
  //         setCheckedOption(0);
  //       }
  //       if (initData?.needApply === 0) {
  //         setNeedApplyChecked(true);
  //         setNeedApplyOption(0);
  //       } else {
  //         setNeedApplyChecked(false);
  //         setNeedApplyOption(1);
  //       }

  //       createEnvForm.setFieldsValue({
  //         ...initData,
  //         isBlock: isBlockChecked,
  //         useNacos: nacosChecked,
  //         needApply: needApplyChecked,
  //       });
  //     }
  //   }, [mode]);
  // 加载应用分类下拉选择
  //   const selectCategory = () => {
  //     getRequest(appTypeList).then((result) => {
  //       const list = (result.data.dataSource || []).map((n: any) => ({
  //         label: n.categoryName,
  //         value: n.categoryCode,
  //         data: n,
  //       }));
  //       setCategoryData(list);
  //     });
  //   };
  // 启用发布审批为0，不启用为1
  const handleNeedApplyChange = (checked: boolean) => {
    if (checked === true) {
      setNeedApplyChecked(true);
      setNeedApplyOption(0);
    } else {
      setNeedApplyChecked(false);
      setNeedApplyOption(1);
    }
  };
  //启用配置管理选择
  const handleNacosChange = (checked: boolean) => {
    if (checked === true) {
      setCheckedOption(1);
      setNacosChecked(true);
    } else {
      setCheckedOption(0);
      setNacosChecked(false);
    }
  };
  //是否封网
  const isBlockChange = (checked: boolean) => {
    if (checked === true) {
      setIsBlockChangeOption(1);
      setIsBlockChecked(true);
    } else {
      setIsBlockChangeOption(0);
      setIsBlockChecked(false);
    }
  };

  //查询NG实例
  const [ngInstOptions, setNgInstOptions] = useState<any>([]);

  return (
    <Modal
      visible={mode !== 'HIDE'}
      title={mode === 'EDIT' ? '修改记录' : mode === 'VIEW' ? '查看记录' : '添加记录'}
      //   // maskClosable={false}
      //   initData={initData}
      onCancel={() => onClose()}
      width={'30%'}
    >
      <div className="envAdd">
        <Form
          form={createEnvForm}
          layout="vertical"
          //   onFinish={handleSubmit}
          onReset={() => {
            createEnvForm.resetFields();
          }}
        >
          <Form.Item label="记录类型：" name="envTypeCode" rules={[{ required: true, message: '这是必填项' }]}>
            <Select style={{ width: '24vw' }}></Select>
          </Form.Item>
          <Form.Item label="主机记录：" name="envName" rules={[{ required: true, message: '这是必填项' }]}>
            <Input style={{ width: '24vw' }} placeholder="请输入环境名" disabled={isDisabled}></Input>
          </Form.Item>
          <Form.Item name="clusterName" label="记录值" rules={[{ required: true, message: '这是必填项' }]}>
            <Input placeholder="请输入记录值" style={{ width: '24vw' }} disabled={isDisabled}></Input>
          </Form.Item>
          <Form.Item name="mark" label="备注：">
            <Input.TextArea
              placeholder="请输入"
              style={{ width: '24vw', height: 80 }}
              disabled={isDisabled}
            ></Input.TextArea>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
