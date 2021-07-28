// 上下布局页面 详情页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/23 17:20

import React from 'react';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { PlusOutlined } from '@ant-design/icons';
import request, { postRequest, getRequest, putRequest, delRequest } from '@/utils/request';
import { useContext, useState, useEffect, useRef } from 'react';
import * as APIS from '../service';
import EditorTable from '@cffe/pc-editor-table';
import { Table, Input, Button, Popconfirm, Form, Select, Space } from 'antd';
import { FormInstance } from 'antd/lib/form';
import './index.less';
// import * as APIS from './service';

export default function DemoPageTb() {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [count, setCount] = useState<any>([0]);
  const { Option } = Select;
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string[]>([]); //编辑
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]); //每一行数据
  const children: any = [];
  const { TextArea } = Input;
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  const [templateTypes, setTemplateTypes] = useState<any[]>([]); //模版类型
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [appCategoryCode, setAppCategoryCode] = useState<string>(); //应用分类获取到的值

  const handleAdd = () => {
    setCount(count + 1);
  };
  const clickChange = () => {};

  useEffect(() => {
    selectTmplType();
    selectCategory();
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

  return (
    <MatrixPageContent className="tmpl-detail">
      <ContentCard>
        <div>
          <Form layout="inline">
            <Form></Form>
            <Form.Item label=" 模版类型：" name="templateType">
              <Select showSearch style={{ width: 150 }} options={templateTypes} />
            </Form.Item>
            <Form.Item label=" 模版名称：" name="templateName">
              <Input style={{ width: 220 }} placeholder="请输入"></Input>
            </Form.Item>
          </Form>
        </div>
        <div className="content">
          <div className="leftTmpl">
            <div>模版详情：</div>
            <div className="tmpl">
              <TextArea rows={4} />
            </div>
          </div>
          <div className="rightTable">
            <div className="table">
              <div style={{ height: '50', fontSize: 18 }}>可配置项：</div>
              <Table bordered>
                <Table.Column title="Key" dataIndex="key" width="40%" />
                <Table.Column title="Value" dataIndex="value" width="50%" />
                <Table.Column title="操作" dataIndex="delete" width="10%" />
              </Table>
              <Button type="ghost" onClick={handleAdd} style={{ width: '100%' }} icon={<PlusOutlined />}>
                新增
              </Button>
            </div>
            <div className="form">
              <Form layout="horizontal" labelAlign="right">
                <Form.Item
                  label="选择默认应用分类："
                  labelCol={{ span: 8 }}
                  name="appCategoryCode"
                  rules={[{ required: true }]}
                >
                  {/* <span  className='select'>选择默认应用大类：</span> */}
                  <Select showSearch style={{ width: 220 }} options={categoryData} onChange={changeAppCategory} />
                </Form.Item>

                <Form.Item label="选择默认环境：" labelCol={{ span: 8 }} name="envCode">
                  <>
                    <Select
                      mode="multiple"
                      allowClear
                      style={{ width: 220 }}
                      placeholder="Please select"
                      // defaultValue={['a10', 'c12']}
                      onChange={clickChange}
                      options={envDatas}
                    >
                      {children}
                    </Select>
                  </>
                </Form.Item>
              </Form>
            </div>
            <Space size="small" style={{ marginTop: '50px', float: 'right' }}>
              <Button type="ghost" htmlType="reset">
                取消
              </Button>
              <Button type="primary">提交</Button>
            </Space>
          </div>
        </div>
      </ContentCard>
    </MatrixPageContent>
  );
}
