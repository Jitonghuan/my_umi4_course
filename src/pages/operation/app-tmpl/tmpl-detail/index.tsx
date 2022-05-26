// 上下布局页面 详情页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/23 17:20

import React from 'react';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import { history } from 'umi';
import request, { getRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import * as APIS from '../service';
import AceEditor from '@/components/ace-editor';
import { Table, Input, Button, Form, Row, Col, Select, Space } from '@cffe/h2o-design';
import './index.less';

export default function DemoPageTb(porps: any) {
  const [count, setCount] = useState<any>([0]);
  const [createTmplForm] = Form.useForm();
  const children: any = [];
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  const [templateTypes, setTemplateTypes] = useState<string>(); //模版类型
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [appCategoryCode, setAppCategoryCode] = useState<string>(); //应用分类获取到的值
  const [tmplConfigurable, setTmplConfigurable] = useState<any[]>([]);
  const [isDisabled, setIsdisabled] = useState<any>();
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
  const languageCode = porps.history.location.query.languageCode;
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
          languageCode: tmplresult?.languageCode,
          remark: tmplresult.remark,
        });
      }
    });
  };

  return (
    <PageContainer className="tmpl-detail">
      <ContentCard>
        <Form form={createTmplForm}>
          <Row>
            <div>
              <Form.Item label="模版类型：" name="templateType" rules={[{ required: true, message: '这是必选项' }]}>
                <Select showSearch style={{ width: 150 }} disabled={isDisabled} />
              </Form.Item>
            </div>
            <div style={{ paddingLeft: 12 }}>
              <Form.Item label="模版语言：" name="languageCode" rules={[{ required: true, message: '这是必选项' }]}>
                <Select showSearch style={{ width: 150 }} disabled={true} />
              </Form.Item>
            </div>
            <div style={{ paddingLeft: 12 }}>
              <Form.Item label="模版名称：" name="templateName" rules={[{ required: true, message: '这是必填项' }]}>
                <Input style={{ width: 220 }} placeholder="请输入" disabled={isDisabled}></Input>
              </Form.Item>
            </div>
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
              <Table dataSource={tmplConfigurable} bordered pagination={false}>
                <Table.Column title="Key" dataIndex="key" width="10%" />
                <Table.Column title="缺省值" dataIndex="value" width="20%" ellipsis />
              </Table>
              {templateTypes == 'deployment' && languageCode === 'java' && <span>JVM参数:</span>}

              {templateTypes == 'deployment' && languageCode === 'java' && (
                <Form.Item name="jvm">
                  <AceEditor mode="yaml" height={300} />
                </Form.Item>
              )}
              <Form.Item
                label="选择默认应用分类："
                labelCol={{ span: 8 }}
                name="appCategoryCode"
                style={{ marginTop: '30px' }}
              >
                <Select showSearch style={{ width: 220 }} options={categoryData} disabled={isDisabled} />
              </Form.Item>

              <Form.Item label="选择默认环境：" labelCol={{ span: 8 }} name="envCodes">
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: 220 }}
                  onChange={clickChange}
                  options={envDatas}
                  disabled={isDisabled}
                >
                  {children}
                </Select>
              </Form.Item>

              <div style={{ fontSize: 18, marginTop: 20 }}>备注：</div>
              <Form.Item name="remark">
                <Input.TextArea placeholder="请输入" style={{ width: 660, height: 220 }}></Input.TextArea>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Space size="small" style={{ float: 'right' }}>
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
    </PageContainer>
  );
}
