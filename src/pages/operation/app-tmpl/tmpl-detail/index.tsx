// 上下布局页面 详情页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/23 17:20

import React from 'react';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import request, { postRequest, getRequest, putRequest, delRequest } from '@/utils/request';
import { useContext, useState, useEffect, useRef } from 'react';
import * as APIS from '../service';
import EditorTable from '@cffe/pc-editor-table';
import { Table, Input, Button, Popconfirm, Form, Row, Col, Select, Space } from 'antd';
import { FormInstance } from 'antd/lib/form';
import './index.less';
import { values } from '_@types_lodash@4.14.171@@types/lodash';
// import * as APIS from './service';

export default function DemoPageTb(porps: any) {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [count, setCount] = useState<any>([0]);
  const { Option } = Select;
  const [createTmplForm] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string[]>([]); //编辑
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]); //每一行数据
  const children: any = [];
  const { TextArea } = Input;
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  const [templateTypes, setTemplateTypes] = useState<any[]>([]); //模版类型
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [appCategoryCode, setAppCategoryCode] = useState<string>(); //应用分类获取到的值
  const [source, setSource] = useState<any[]>([]);
  const [isDisabled, setIsdisabled] = useState<any>();
  const handleChange = (next: any[]) => {
    setSource(next);
  };

  const handleAdd = () => {
    setCount(count + 1);
  };
  const clickChange = () => {};

  useEffect(() => {
    selectTmplType();
    selectCategory();
    console.log('pppppppp', porps);

    const flag = porps.history.location.query.type;
    if (flag == 'info') {
      setIsdisabled(true);
    } else {
      setIsdisabled(false);
    }
  }, []);

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
  //提交模版
  const createTmpl = (value: any) => {
    //  const tmplConfigurableItem = new Map(value.tmplConfigurableItem.map((el:any)=> [el.key,el.value]))
    const tmplConfigurableItem = value.tmplConfigurableItem.reduce((prev: any, el: any) => {
      prev[el.key] = el.value;
      return prev;
    }, {} as any);
    postRequest(APIS.create, {
      data: {
        templateName: value.templateName,
        templateType: value.templateType,
        templateValue: value.templateValue,
        appCategoryCode: value.appCategoryCode,
        envCodes: value.envCodes,
        tmplConfigurableItem,
      },
    }).then((resp: any) => {
      if (resp.success) {
        const datas = resp.data || [];
        setEnvDatas(datas);
        history.push({
          pathname: 'tmpl-list',
        });
      }
    });
  };

  return (
    <MatrixPageContent className="tmpl-detail">
      <ContentCard>
        <Form form={createTmplForm} onFinish={createTmpl}>
          <Row>
            <Col span={6}>
              <Form.Item label="模版类型：" name="templateType" rules={[{ required: true, message: '这是必选项' }]}>
                <Select showSearch style={{ width: 150 }} options={templateTypes} disabled={isDisabled} />
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
                <TextArea rows={18} disabled={isDisabled} />
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
                      title: '缺省值',
                      dataIndex: 'value',
                      colProps: { width: 280 },
                    },
                    // { title: '操作', dataIndex: 'action', colProps: { render: () => '删除', width: 150 }},
                  ]}
                  disabled={isDisabled}
                />
              </Form.Item>
              <Form.Item
                label="选择默认应用分类："
                labelCol={{ span: 8 }}
                name="appCategoryCode"
                rules={[{ required: true }]}
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
              <Form.Item
                label="选择默认环境："
                labelCol={{ span: 8 }}
                name="envCodes"
                rules={[{ required: true, message: '这是必选项' }]}
              >
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
              <Button type="ghost" htmlType="reset">
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
