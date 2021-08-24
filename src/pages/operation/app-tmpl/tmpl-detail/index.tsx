// 上下布局页面 详情页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/23 17:20

import React from 'react';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { history } from 'umi';
import request, { postRequest, getRequest, putRequest, delRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import * as APIS from '../service';
import EditorTable from '@cffe/pc-editor-table';
import AceEditor from '@/components/ace-editor';
import { Table, Input, Button, Form, Row, Col, Select, Space } from 'antd';
import './index.less';
// import * as APIS from './service';

export default function DemoPageTb(porps: any) {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [count, setCount] = useState<any>([0]);
  const [createTmplForm] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string[]>([]); //编辑
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]); //每一行数据
  const children: any = [];
  const { TextArea } = Input;
  const [tmplDetail, setTmplDetail] = useState<any>();
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  const [templateTypes, setTemplateTypes] = useState<string>(); //模版类型
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [appCategoryCode, setAppCategoryCode] = useState<string>(); //应用分类获取到的值
  const [tmplConfigurable, setTmplConfigurable] = useState<any[]>([]);
  const [isDisabled, setIsdisabled] = useState<any>();

  const handleAdd = () => {
    setCount(count + 1);
  };
  const clickChange = () => {};

  useEffect(() => {
    tmplDetialResult(templateCode);

    const flag = porps.history.location.query.type;
    if (flag == 'info') {
      setIsdisabled(true);
    } else {
      setIsdisabled(false);
    }
  }, []);
  //进入页面加载信息
  const templateCode: string = porps.history.location.query.templateCode;
  const tmplDetialResult = (templateCode: string) => {
    getRequest(APIS.tmplList, { data: { templateCode } }).then((res: any) => {
      if (res.success) {
        const tmplresult = res.data.dataSource[0];

        let envCode = tmplresult.envCode;
        if (envCode == '') {
          envCode = [];
        }
        setTemplateTypes(tmplresult.templateType);
        let arr = [];
        let jvm = '';

        for (const key in tmplresult.tmplConfigurableItem) {
          if (key === 'jvm') {
            jvm = tmplresult.tmplConfigurableItem[key];
          } else {
            arr.push({
              key: key,
              value: tmplresult.tmplConfigurableItem[key],
            });
          }
        }
        setTmplConfigurable(arr);
        createTmplForm.setFieldsValue({
          templateType: tmplresult.templateType,
          templateName: tmplresult.templateName,
          templateValue: tmplresult.templateValue,
          appCategoryCode: tmplresult.appCategoryCode,
          envCodes: envCode,
          jvm: jvm,
        });
      }
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

  return (
    <MatrixPageContent className="tmpl-detail">
      <ContentCard>
        <Form form={createTmplForm}>
          <Row>
            <Col span={6}>
              <Form.Item label="模版类型：" name="templateType" rules={[{ required: true, message: '这是必选项' }]}>
                <Select showSearch style={{ width: 150 }} disabled={isDisabled} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="模版名称：" name="templateName" rules={[{ required: true, message: '这是必填项' }]}>
                <Input style={{ width: 220 }} placeholder="请输入" disabled={isDisabled}></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginTop: '20px' }}>
            <Col span={10}>
              <div style={{ fontSize: 18 }}>模版详情：</div>

              <Form.Item name="templateValue" rules={[{ required: true, message: '这是必填项' }]}>
                {/* <TextArea rows={18} disabled={isDisabled} /> */}
                <AceEditor mode="yaml" height={600} readOnly />
              </Form.Item>
            </Col>
            <Col span={10} offset={2}>
              <div style={{ fontSize: 18 }}>可配置项：</div>
              <Table dataSource={tmplConfigurable} bordered>
                <Table.Column title="Key" dataIndex="key" width="10%" />
                <Table.Column title="缺省值" dataIndex="value" width="20%" ellipsis />
              </Table>
              {templateTypes == 'deployment' && <span>JVM参数:</span>}

              {templateTypes == 'deployment' && (
                <Form.Item name="jvm">
                  <AceEditor mode="yaml" height={300} />
                </Form.Item>
              )}
              <Form.Item
                label="选择默认应用分类："
                labelCol={{ span: 8 }}
                name="appCategoryCode"
                style={{ marginTop: '80px' }}
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
                  mode="multiple"
                  allowClear
                  style={{ width: 220 }}
                  placeholder="Please select"
                  // defaultValue={['a10', 'c12']}
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
              <Button
                type="ghost"
                htmlType="reset"
                onClick={() =>
                  history.push({
                    pathname: 'tmpl-list',
                  })
                }
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit" disabled={isDisabled}>
                提交
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </ContentCard>
    </MatrixPageContent>
  );
}
