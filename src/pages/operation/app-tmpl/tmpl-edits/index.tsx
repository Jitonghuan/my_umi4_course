// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

// import { clusterBLineChart } from './formatter';
import React from 'react';
import { ContentCard } from '@/components/vc-page-content';
import { history } from 'umi';
import { getRequest, putRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import * as APIS from '../service';
import { EditorMode, TmplEdit } from '../tmpl-list';
import EditorTable from '@cffe/pc-editor-table';
import AceEditor from '@/components/ace-editor';
import { Drawer, Input, Button, Form, Row, Col, Select, Space } from 'antd';

export interface TmplListProps {
  mode?: EditorMode;
  initData?: TmplEdit;
  onClose?: () => any;
  onSave?: () => any;
}

export default function TaskEditor(props: TmplListProps) {
  const [count, setCount] = useState<any>([0]);
  const [createTmplForm] = Form.useForm();
  const [tmplConfigurable, setTmplConfigurable] = useState<any[]>([]); //可配置项
  const children: any = [];
  const { mode, initData, onClose, onSave, reload } = props;
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  const [templateTypes, setTemplateTypes] = useState<any[]>([]); //模版类型
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [appCategoryCode, setAppCategoryCode] = useState<string>(); //应用分类获取到的值
  const [source, setSource] = useState<any[]>([]);
  const [isDisabled, setIsdisabled] = useState<any>();
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
    const envCodes: string[] = [];
    envCodes.push(initData?.envCode);
    const initValues = {
      templateCode: initData?.templateCode,
      templateType: initData?.templateType,
      templateName: initData?.templateName,
      tmplConfigurableItem: initData?.tmplConfigurableItem, //tmplConfigurableItem
      appCategoryCode: initData?.appCategoryCode || '',
      envCodes: envCodes || [],
      templateValue: initData?.templateValue,
    };
    console.log('获取到的初始化数据：', initValues.envCodes);
    let arr = [];
    for (const key in initValues.tmplConfigurableItem) {
      arr.push({
        key: key,
        value: initValues.tmplConfigurableItem[key],
      });
    }
    createTmplForm.setFieldsValue({
      templateType: initValues.templateType,
      templateName: initValues.templateName,
      templateValue: initValues.templateValue,
      appCategoryCode: initValues.appCategoryCode,
      envCodes: initValues.envCodes,
      tmplConfigurableItem: arr,
    });
    changeAppCategory(initValues.appCategoryCode);
    // createTmplForm.setFieldsValue({initValues});
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
    setAppCategoryCode(categoryCode);
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
    // const templateCode: string = templateCode;
    const tmplConfigurableItem = value?.tmplConfigurableItem?.reduce((prev: any, el: any) => {
      prev[el.key] = el?.value;
      return prev;
    }, {} as any);
    putRequest(APIS.update, {
      data: {
        templateName: value.templateName,
        templateType: value.templateType,
        templateValue: value.templateValue,
        appCategoryCode: value.appCategoryCode || '',
        envCodes: value.envCodes || [],
        tmplConfigurableItem: tmplConfigurableItem || {},
        templateCode: templateCode,
      },
    })
      .then((resp: any) => {
        if (resp.success) {
          const datas = resp.data || [];
          setEnvDatas(datas.envCodes);
          history.push({
            pathname: 'tmpl-list',
          });
        }
      })
      .finally(() => {
        reload;
      });
  };
  return (
    <Drawer
      visible={mode !== 'HIDE'}
      title={mode === 'EDIT' ? '编辑模版' : ''}
      maskClosable={false}
      onClose={onClose}
      width={'70%'}
    >
      <ContentCard>
        <Form form={createTmplForm} onFinish={createTmpl}>
          <Row>
            <Col span={6}>
              <Form.Item label="模版类型：" name="templateType" rules={[{ required: true, message: '这是必选项' }]}>
                <Select showSearch style={{ width: 150 }} options={templateTypes} disabled={isDisabled} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="模版名称：" name="templateName" rules={[{ required: true, message: '这是必填项' }]}>
                <Input style={{ width: 220 }} placeholder="请输入" disabled={isDisabled}></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginTop: '20px' }}>
            <Col span={12}>
              <div style={{ fontSize: 18 }}>模版详情：</div>

              <Form.Item name="templateValue" rules={[{ required: true, message: '这是必填项' }]}>
                <AceEditor mode="yaml" height={700} />
              </Form.Item>
            </Col>

            <Col span={10} offset={2}>
              <div style={{ fontSize: 18 }}>可配置项：</div>
              <Form.Item name="tmplConfigurableItem">
                <EditorTable
                  columns={[
                    { title: 'Key', dataIndex: 'key', colProps: { width: 240 } },
                    {
                      title: '缺省值',
                      dataIndex: 'value',
                      colProps: { width: 280 },
                    },
                  ]}
                  disabled={isDisabled}
                />
              </Form.Item>
              <Form.Item
                label="选择默认应用分类："
                labelCol={{ span: 8 }}
                name="appCategoryCode"
                style={{ marginTop: '140px' }}
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
              <Button type="primary" htmlType="submit" onClick={() => onSave?.()} disabled={isDisabled}>
                保存编辑
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </ContentCard>
    </Drawer>
  );
}
