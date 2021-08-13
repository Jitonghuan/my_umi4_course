// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

// import { clusterBLineChart } from './formatter';
import React, { useEffect, useMemo } from 'react';
import { Table } from 'antd';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import { history } from 'umi';
import { getRequest, putRequest } from '@/utils/request';
// import { useContext, useState, useEffect, useRef } from 'react';
import * as APIS from '../service';
import EditorTable from '@cffe/pc-editor-table';
import AceEditor from '@/components/ace-editor';
import { Drawer, Input, Button, Form, Row, Col, Select, Space } from 'antd';
// import './index.less';
const { ColorContainer } = colorUtil.context;

export interface ChartCaseListProps {
  data: any;
  loading?: boolean;
}
export default function ClusterTable(props: ChartCaseListProps) {
  const { data, loading } = props;
  // console.log('ssssss',data);
  const countList: object[] = [];
  // const [histogramData, lastloading,loadHistogram] = useABHistogram();
  for (var i in data) {
    let dataSource = {
      name: i,
      count: data[i],
    };
    countList.push(dataSource);
  }
  const columns = [
    {
      title: '分类',
      dataIndex: 'name',
      key: 'name',
      width: '100px',
    },
    {
      title: '访问量',
      dataIndex: 'count',
      key: 'count',

      width: '80px',
      sorter: {
        compare: (a: any, b: any) => a.count - b.count,
      },
    },
  ];
  // useEffect(() => {

  //   loadHistogram();
  // }, []);

  const onChange = (filters: any, sorter: any, extra: any) => {};

  return (
    <Drawer className="tmpl-detail" onClose={onDrawClose} visible={showDrawVisible}>
      {/* <MatrixPageContent className="tmpl-detail"> */}
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
                <AceEditor mode="yaml" height={600} />
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
                  // mode="multiple"
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
                保存编辑
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </ContentCard>
      {/* </MatrixPageContent> */}
    </Drawer>
  );
}
