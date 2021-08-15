// 上下布局页面 应用模版
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/23 17:20

import React from 'react';
import { ContentCard } from '@/components/vc-page-content';
import { history } from 'umi';
import request, { postRequest, getRequest, putRequest, delRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import AceEditor from '@/components/ace-editor';
import EditorTable from '@cffe/pc-editor-table';
import { Table, Input, Button, Row, Col, Form, Select, Space, message, InputNumber } from 'antd';
import './index.less';
import * as APIS from '../../../service';
import { copyScene } from '@/pages/test/autotest/service';

export default function DemoPageTb(porps: any) {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [count, setCount] = useState<any>([0]);
  const [applicationForm] = Form.useForm();
  const [templateTypes, setTemplateTypes] = useState<any[]>([]); //模版类型
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [selectEnvData, setSelectEnvData] = useState<string>(); //下拉选择应用环境
  const [selectTmpl, setSelectTmpl] = useState<string>(); //下拉选择应用模版
  const [applicationlist, setApplicationlist] = useState<any>([]); //获取到的结果
  const [inintDatas, setInintDatas] = useState<any>([]); //初始化的数据
  const [categoryCode, setCategoryCode] = useState<string>();
  const [id, setId] = useState<string>();
  const [tableData, setTableData] = useState<any>([]);
  const [isDisabled, setIsdisabled] = useState<any>();
  // const { Option } = Select;
  const { TextArea } = Input;
  const [source, setSource] = useState<any[]>([]);

  useEffect(() => {
    getApp().then((appCategoryCode) => {
      selectAppEnv(appCategoryCode);
    });
  }, []);

  // 进入页面显示结果
  const appCode = porps.history.location.query.appCode;
  const templateType = porps.history.location.query.templateType;
  const envCode = porps.history.location.query.envCode;
  const isClient = porps.history.location.query.isClient;
  const isContainClient = porps.history.location.query.isContainClient;
  const getApp = () => {
    return getRequest(APIS.paramsList, { data: { appCode, isClient, isContainClient } }).then((result) => {
      if (result.data.length > 0) {
        const app = result.data[0];
        const appCategoryCode = app.appCategoryCode;
        setId(app.id);
        setInintDatas(app);
        showAppList();
        return appCategoryCode;
      } else {
        debugger;
        message.error('应用模版为空');
      }
    });
  };

  //恢复初始化数据
  const inintData = () => {
    const templateType = porps.history.location.query.templateType;
    const envCode = porps.history.location.query.envCode;
    let arr1 = [];
    for (const key in inintDatas.tmplConfigurableItem) {
      arr1.push({
        key: key,
        value: inintDatas.tmplConfigurableItem[key],
      });
      applicationForm.setFieldsValue({
        appEnvCode: inintDatas.envCode,
        tmplType: inintDatas.templateType,
        value: inintDatas.value,
        tmplConfigurableItem: arr1,
      });
    }
  };

  const showAppList = () => {
    getRequest(APIS.paramsList, { data: { appCode, templateType, envCode } }).then((result) => {
      if (result.data.length > 0) {
        const applicationlist = result.data[0];
        setApplicationlist(applicationlist);
        let arr1 = [];
        for (const key in applicationlist.tmplConfigurableItem) {
          arr1.push({
            key: key,
            value: applicationlist.tmplConfigurableItem[key],
          });
        }
        setTableData(arr1);
        applicationForm.setFieldsValue({
          appEnvCode: applicationlist.envCode,
          tmplType: applicationlist.templateType,
          value: applicationlist.value,
          tmplConfigurableItem: arr1,
        });
        changeEnvCode(applicationlist.envCode);
        changeTmplType(applicationlist.templateType);
      } else {
        debugger;
        message.error('应用模版为空');
      }

      //底下是处理添加进表格的数据
      let arr = [];
      for (const key in applicationlist.tmplConfigurableItem) {
        arr.push({
          key: key,
          value: applicationlist.tmplConfigurableItem[key],
        });
      }
      setSource(arr);
    });
  };

  //根据应用分类加载应用环境下拉选择
  const selectAppEnv = (categoryCode: any) => {
    getRequest(APIS.envList, { data: { categoryCode } }).then((result) => {
      const list = result.data.dataSource.map((n: any) => ({
        value: n?.envCode,
        label: n?.envName,
        data: n,
      }));
      setEnvDatas(list);
      selectTmplType();
    });
  };
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
  //改变下拉选择后查询结果
  const changeEnvCode = (getEnvCode: string) => {
    setSelectEnvData(getEnvCode);
  };

  const changeTmplType = (getTmplType: string) => {
    setSelectTmpl(getTmplType);
  };
  //点击查询回调
  const queryTmpl = () => {
    // data里的参数是根据下拉选项来查询配置项和模版详情的
    getRequest(APIS.paramsList, {
      data: { envCode: selectEnvData || envCode, appCode, templateType: selectTmpl || {} },
    }).then((result) => {
      //返回的的数据的结构与详情不一致有问题
      // const list = result.data[0];
      const applicationlist = result.data[0];
      if (result.data.length !== 0) {
        let arr = [];
        for (const key in applicationlist.tmplConfigurableItem) {
          arr.push({
            key: key,
            value: applicationlist.tmplConfigurableItem[key],
          });
        }
        applicationForm.setFieldsValue({
          // templateValue:list.templateValue,
          tmplConfigurableItem: arr,
          appEnvCode: applicationlist.envCode,
          tmplType: applicationlist.templateType,
          value: applicationlist.value,
        });
        setSource(arr);
      } else {
        applicationForm.setFieldsValue({
          // templateValue:list.templateValue,
          tmplConfigurableItem: [],
          value: '',
        });
        message.error('您查看的应用模版不存在');
      }
    });
  };
  //编辑应用参数
  const setApplication = (values: any) => {
    const tmplConfigurableItem = values.tmplConfigurableItem.reduce((prev: any, el: any) => {
      prev[el.key] = el.value;
      return prev;
    }, {} as any);
    const value = values.value;
    putRequest(APIS.editParams, { data: { id, value, tmplConfigurableItem } }).then((result) => {
      if (result.success) {
        message.success('提交成功！');
        window.location.reload();
      }
    });
  };
  return (
    <ContentCard>
      <Form form={applicationForm} onFinish={setApplication}>
        <Row>
          <Col span={7}>
            <Form.Item label=" 应用环境：" name="appEnvCode">
              <Select showSearch style={{ width: 220 }} options={envDatas} onChange={changeEnvCode} />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item label=" 模版类型" name="tmplType">
              <Select showSearch style={{ width: 220 }} options={templateTypes} onChange={changeTmplType} />
            </Form.Item>
          </Col>
          <Col span={2}>
            <Button type="primary" onClick={queryTmpl}>
              查询
            </Button>
          </Col>
        </Row>
        <Row style={{ marginTop: '20px' }}>
          <Col span={10}>
            <div style={{ fontSize: 18 }}>模版详情：</div>
            <Form.Item name="value">
              {/* <TextArea rows={18} disabled /> */}
              <AceEditor mode="yaml" height={600} readOnly />
            </Form.Item>
          </Col>
          <Col span={10} offset={2}>
            <div style={{ fontSize: 18 }}>可配置项：</div>
            <Form.Item name="tmplConfigurableItem" rules={[{ required: true, message: '这是必填项' }]}>
              <EditorTable
                readOnly
                columns={[
                  { title: 'Key', dataIndex: 'key', fieldType: 'readonly', colProps: { width: 240 } },
                  {
                    title: 'Value',
                    dataIndex: 'value',
                    colProps: { width: 280 },
                    fieldProps: { readOnly: false },
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Space size="small" style={{ float: 'right' }}>
            <Button type="ghost" onClick={inintData}>
              重置
            </Button>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </ContentCard>
  );
}