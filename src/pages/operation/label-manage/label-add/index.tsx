// 标签管理新增页/编辑页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/12/03 17:30

import React from 'react';
import { ContentCard } from '@/components/vc-page-content';
import { history } from 'umi';
import { getRequest, putRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import EditorTable from '@cffe/pc-editor-table';
import AceEditor from '@/components/ace-editor';
import { Drawer, Input, Button, Form, Row, Col, Select, Space, message } from 'antd';

export interface TmplListProps {
  mode?: EditorMode;
  //   initData?: TmplEdit;
  onClose?: () => any;
  onSave?: () => any;
}

export default function TaskEditor(props: TmplListProps) {
  const [count, setCount] = useState<any>([0]);
  const [createTmplForm] = Form.useForm();
  const children: any = [];
  //   const { mode, initData, onClose, onSave } = props;
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  const [templateTypes, setTemplateTypes] = useState<any[]>([]); //模版类型
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [source, setSource] = useState<any[]>([]);
  const [isDisabled, setIsdisabled] = useState<any>();
  const [isDeployment, setIsDeployment] = useState<string>();
  //   const templateCode = initData?.templateCode;
  const handleChange = (next: any[]) => {
    setSource(next);
  };

  const handleAdd = () => {
    setCount(count + 1);
  };
  const clickChange = () => {};

  //加载模版类型下拉选择
  const selectTmplType = () => {};
  //加载应用分类下拉选择
  const selectCategory = () => {};

  // 查询环境
  const changeAppCategory = (categoryCode: string) => {
    //调用接口 查询env
    setEnvDatas([]);
  };
  //保存编辑模版

  const createTmpl = (value: any) => {
    let envCodesArry = [];
    if (Array.isArray(value?.envCodes)) {
      envCodesArry = value?.envCodes;
    } else {
      envCodesArry = [value?.envCodes];
    }
    const tmplConfigurableItem = value?.tmplConfigurableItem?.reduce((prev: any, el: any) => {
      prev[el.key] = el?.value;
      return prev;
    }, {} as any);
  };

  const changeTmplType = (value: any) => {
    setIsDeployment(value);
  };
  return (
    <Drawer width={'40%'}>
      <ContentCard className="label-edit">
        <Form form={createTmplForm} onFinish={createTmpl} labelCol={{ flex: '120px' }}>
          <Form.Item label="标签名称" name="templateType" rules={[{ required: true, message: '这是必选项' }]}>
            <Select
              showSearch
              style={{ width: 150 }}
              options={templateTypes}
              disabled={isDisabled}
              onChange={changeTmplType}
            />
          </Form.Item>

          <Form.Item label="标签备注" name="templateName" rules={[{ required: true, message: '这是必填项' }]}>
            <Input style={{ width: 220 }} placeholder="请输入" disabled={isDisabled}></Input>
          </Form.Item>
          <Form.Item name="默认环境" rules={[{ required: true, message: '这是必填项' }]}>
            <AceEditor mode="yaml" height={700} />
          </Form.Item>
          <Form.Item>
            <Space size="small" style={{ marginTop: '50px', float: 'right' }}>
              <Button
                type="ghost"
                htmlType="reset"
                //   onClick={onClose}
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit" disabled={isDisabled}>
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </ContentCard>
    </Drawer>
  );
}
