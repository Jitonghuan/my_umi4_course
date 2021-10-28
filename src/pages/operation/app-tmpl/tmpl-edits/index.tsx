// 应用模版编辑页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import React from 'react';
import { ContentCard } from '@/components/vc-page-content';
import { history } from 'umi';
import { getRequest, putRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import * as APIS from '../service';
import { TmplEdit } from '../tmpl-list';
import EditorTable from '@cffe/pc-editor-table';
import AceEditor from '@/components/ace-editor';
import { Drawer, Input, Button, Form, Row, Col, Select, Space, message } from 'antd';

export interface TmplListProps {
  mode?: EditorMode;
  initData?: TmplEdit;
  onClose?: () => any;
  onSave?: () => any;
}

export default function TaskEditor(props: TmplListProps) {
  const [count, setCount] = useState<any>([0]);
  const [createTmplForm] = Form.useForm();
  const children: any = [];
  const { mode, initData, onClose, onSave } = props;
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  const [templateTypes, setTemplateTypes] = useState<any[]>([]); //模版类型
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [source, setSource] = useState<any[]>([]);
  const [isDisabled, setIsdisabled] = useState<any>();
  const [isDeployment, setIsDeployment] = useState<string>();
  const templateCode = initData?.templateCode;
  const handleChange = (next: any[]) => {
    setSource(next);
  };

  const handleAdd = () => {
    setCount(count + 1);
  };
  const clickChange = () => {};

  useEffect(() => {
    if (mode === 'HIDE') return;
    createTmplForm.resetFields();
    //进入页面加载信息
    const initValues = {
      templateCode: initData?.templateCode,
      templateType: initData?.templateType,
      templateName: initData?.templateName,
      tmplConfigurableItem: initData?.tmplConfigurableItem,
      appCategoryCode: initData?.appCategoryCode || '',
      envCodes: initData?.envCode || [],
      templateValue: initData?.templateValue,
      remark: initData?.remark,
    };

    let arr = [];
    let jvm = '';

    for (const key in initValues.tmplConfigurableItem) {
      if (key === 'jvm') {
        jvm = initValues.tmplConfigurableItem[key];
      } else {
        arr.push({
          key: key,
          value: initValues.tmplConfigurableItem[key],
        });
      }
    }
    createTmplForm.setFieldsValue({
      templateType: initValues.templateType,
      templateName: initValues.templateName,
      templateValue: initValues.templateValue,
      appCategoryCode: initValues.appCategoryCode,
      envCodes: initValues.envCodes,
      jvm: jvm,
      tmplConfigurableItem: arr,
      remark: initValues?.remark,
    });
    changeAppCategory(initValues.appCategoryCode);
    setIsDeployment(initValues.templateType);
    selectTmplType();
    selectCategory();
  }, [mode]);

  //加载模版类型下拉选择
  const selectTmplType = () => {
    getRequest(APIS.tmplType).then((result) => {
      const list = (result.data || []).map((n: any) => ({
        label: n,
        value: n,
        data: n,
      }));
      setTemplateTypes(list);
    });
  };
  //加载应用分类下拉选择
  const selectCategory = () => {
    getRequest(APIS.appTypeList).then((result) => {
      const list = (result.data.dataSource || []).map((n: any) => ({
        label: n.categoryName,
        value: n.categoryCode,
        data: n,
      }));
      setCategoryData(list);
    });
  };

  // 根据应用分类查询环境
  const changeAppCategory = (categoryCode: string) => {
    //调用接口 查询env 参数就是appCategoryCode
    //setEnvDatas
    setEnvDatas([]);
    getRequest(APIS.envList, { data: { categoryCode } }).then((resp: any) => {
      if (resp.success) {
        const datas =
          resp?.data?.dataSource?.map((el: any) => {
            return {
              ...el,
              value: el?.envCode,
              label: el?.envName,
            };
          }) || [];
        setEnvDatas(datas);
      }
    });
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

    putRequest(APIS.update, {
      data: {
        templateName: value.templateName,
        templateType: value.templateType,
        templateValue: value.templateValue,
        jvm: value?.jvm,
        appCategoryCode: value.appCategoryCode || '',
        envCodes: envCodesArry,
        tmplConfigurableItem: tmplConfigurableItem || {},
        templateCode: templateCode,
        remark: value?.remark,
      },
    }).then((resp: any) => {
      if (resp.success) {
        const datas = resp.data || [];
        history.push({
          pathname: 'tmpl-list',
        });
        message.success('保存成功！');
        onSave?.();
      } else {
        message.error('保存失败');
      }
    });
  };

  const changeTmplType = (value: any) => {
    setIsDeployment(value);
  };
  return (
    <Drawer
      visible={mode !== 'HIDE'}
      title={mode === 'EDIT' ? '编辑模版' : ''}
      maskClosable={false}
      onClose={onClose}
      width={'70%'}
    >
      <ContentCard className="tmpl-edits">
        <Form form={createTmplForm} onFinish={createTmpl}>
          <Row>
            <Col span={7}>
              <Form.Item label="模版类型：" name="templateType" rules={[{ required: true, message: '这是必选项' }]}>
                <Select
                  showSearch
                  style={{ width: 150 }}
                  options={templateTypes}
                  disabled={isDisabled}
                  onChange={changeTmplType}
                />
              </Form.Item>
            </Col>
            <Col span={9} style={{ marginLeft: 10 }}>
              <Form.Item label="模版名称：" name="templateName" rules={[{ required: true, message: '这是必填项' }]}>
                <Input style={{ width: 220 }} placeholder="请输入" disabled={isDisabled}></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginTop: '20px' }}>
            <Col span={12}>
              <div style={{ fontSize: 15, color: '#696969' }}>模版详情：</div>

              <Form.Item name="templateValue" rules={[{ required: true, message: '这是必填项' }]}>
                <AceEditor mode="yaml" height={700} />
              </Form.Item>
            </Col>

            <Col span={10} offset={2}>
              <div style={{ fontSize: 15, color: '#696969' }}>可配置项：</div>
              <Form.Item name="tmplConfigurableItem">
                <EditorTable
                  value={source}
                  onChange={handleChange}
                  columns={[
                    { title: 'Key', dataIndex: 'key', colProps: { width: 240 } },
                    {
                      title: '缺省值',
                      dataIndex: 'value',
                      colProps: { width: 280 },
                    },
                  ]}
                />
              </Form.Item>
              <div style={{ fontSize: 15, color: '#696969', marginTop: 20 }}>备注：</div>
              <Form.Item name="remark">
                <Input.TextArea placeholder="请输入" style={{ width: 520 }}></Input.TextArea>
              </Form.Item>
              {isDeployment == 'deployment' ? <span>JVM参数:</span> : ''}
              {isDeployment == 'deployment' ? (
                <Form.Item name="jvm">
                  <AceEditor mode="yaml" height={300} />
                </Form.Item>
              ) : (
                ''
              )}
              <Form.Item
                label="选择默认应用分类："
                labelCol={{ span: 8 }}
                name="appCategoryCode"
                style={{ marginTop: '50px' }}
              >
                <Select
                  showSearch
                  style={{ width: 220 }}
                  options={categoryData}
                  onChange={changeAppCategory}
                  disabled={isDisabled}
                />
              </Form.Item>
              <Form.Item label="选择默认环境：" labelCol={{ span: 8 }} name="envCodes">
                <Select
                  allowClear
                  style={{ width: 220 }}
                  placeholder="请选择"
                  onChange={clickChange}
                  options={envDatas}
                  disabled={isDisabled}
                >
                  {children}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Space size="small" style={{ marginTop: '50px', float: 'right' }}>
              <Button type="ghost" htmlType="reset" onClick={onClose}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" disabled={isDisabled}>
                保存编辑
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </ContentCard>
    </Drawer>
  );
}
