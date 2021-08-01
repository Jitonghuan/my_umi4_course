// 上下布局页面 应用模版
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/23 17:20

import React from 'react';
import { ContentCard } from '@/components/vc-page-content';
import { history } from 'umi';
import request, { postRequest, getRequest, putRequest, delRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import EditorTable from '@cffe/pc-editor-table';
import { Table, Input, Button, Row, Col, Form, Select, Space, message } from 'antd';
import './index.less';
import * as APIS from '../../../service';

export default function DemoPageTb(porps: any) {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [count, setCount] = useState<any>([0]);
  const [applicationForm] = Form.useForm();
  const [templateTypes, setTemplateTypes] = useState<any[]>([]); //模版类型
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [selectEnvData, setSelectEnvData] = useState<string>(); //下拉选择应用环境
  const [selectTmpl, setSelectTmpl] = useState<string>(); //下拉选择应用模版
  // const { Option } = Select;
  const { TextArea } = Input;
  const [source, setSource] = useState<any[]>([]);
  const handleAdd = () => {
    setCount(count + 1);
  };
  const handleChange = (next: any[]) => {
    setSource(next);
  };

  const clickChange = () => {};
  useEffect(() => {
    selectAppEnv();
  }, []);

  // 进入页面显示结果
  const appCode = porps.history.location.query.appCode;
  const templateType = porps.history.location.query.templateType;
  const envCode = porps.history.location.query.envCode;

  const showAppList = () => {
    getRequest(APIS.paramsList, { data: { appCode, templateType, envCode } }).then((result) => {
      //返回的的数据的结构与详情不一致有问题
      //  const applicationlist = result.data.dataSource[0]
      //  applicationForm.setFieldsValue({
      //   appEnvCode:applicationlist.envCode,
      //   tmplType: applicationlist.templateType,
      //   templateValue:applicationlist.templateValue,
      // });
      //底下是处理添加进表格的数据
      // let arr = []
      // for (const key in applicationlist.tmplConfigurableItem) {
      //       arr.push(
      //         {
      //           key:key,
      //           value:applicationlist.tmplConfigurableItem[key],
      //         }
      //       )
      // }
      // setSource(arr);
    });
  };

  //根据路由传参的应用分类加载应用环境下拉选择
  const selectAppEnv = () => {
    const categoryCode: string = porps.history.location.query.categoryCode;
    getRequest(APIS.envList, { data: { categoryCode } }).then((result) => {
      console.log('返回结果', result);
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
      showAppList();
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
    getRequest(APIS.paramsList, { data: { envCode: selectEnvData, templateType: selectTmpl } }).then((result) => {
      //返回的的数据的结构与详情不一致有问题
      // const list = result.data.dataSource[0];
      // applicationForm.setFieldsValue({
      //   templateValue:list.templateValue,
      // });
      // let arr = []
      // for (const key in applicationlist.tmplConfigurableItem) {
      //       arr.push(
      //         {
      //           key:key,
      //           value:applicationlist.tmplConfigurableItem[key],
      //         }
      //       )
      // }
      // setSource(arr);
    });
  };
  //编辑应用参数
  const setApplication = (value: any) => {
    const tmplConfigurableItem = value.tmplConfigurableItem.reduce((prev: any, el: any) => {
      prev[el.key] = el.value;
      return prev;
    }, {} as any);
    const templateValue = value.templateValue;
    putRequest(APIS.editParams, { data: { templateValue, tmplConfigurableItem } }).then((result) => {
      if (result.success) {
        message.success('提交成功！');
        history.push({
          pathname: 'tmpl-list',
        });
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
            <div>模版详情：</div>
            <Form.Item name="templateValue" rules={[{ required: true, message: '这是必填项' }]}>
              <TextArea rows={18} />
            </Form.Item>
          </Col>
          <Col span={10} offset={2}>
            <div style={{ fontSize: 18 }}>可配置项：</div>
            <Form.Item name="tmplConfigurableItem" rules={[{ required: true, message: '这是必填项' }]}>
              <EditorTable
                value={source}
                onChange={handleChange}
                columns={[
                  { title: 'Key', dataIndex: 'key', colProps: { width: 240 } },
                  {
                    title: 'Value',
                    dataIndex: 'value',
                    colProps: { width: 280 },
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Space size="small" style={{ float: 'right' }}>
            <Button type="ghost" htmlType="reset">
              取消
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
