// 上下布局页面 应用模版页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/23 14:20

import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Space, Popconfirm, message, Tag } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { getRequest, delRequest } from '@/utils/request';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import * as APIS from '../service';
import EnvironmentEditDraw from './add-environment';
/** 应用开发语言(后端) */
export type AppDevelopLanguage = 'java' | 'golang' | 'python';
export const appDevelopLanguageOptions: IOption<AppDevelopLanguage>[] = [
  { label: 'GOLANG', value: 'golang' },
  { label: 'JAVA', value: 'java' },
  { label: 'PYTHON', value: 'python' },
];
/** 编辑页回显数据 */
export interface TmplEdit extends Record<string, any> {
  templateCode: string;
  templateType: string;
  templateName: string;
  tmplConfigurableItem: object;
  appCategoryCode: any;
  envCodes: string;
  templateValue: string;
  languageCode: string;
  remark: string;
}
export default function Launch() {
  const { Option } = Select;
  const [enviroEditMode, setEnviroEditMode] = useState<EditorMode>('HIDE');

  return (
    <PageContainer>
      <EnvironmentEditDraw
        mode={enviroEditMode}
        // initData={tmplateData}
        onClose={() => setEnviroEditMode('HIDE')}
        // onSave={saveEditData}
      />
      <FilterCard>
        <Form
          layout="inline"
          //   form={formTmpl}
          //   onFinish={(values: any) => {
          //     queryList({
          //       ...values,
          //       pageIndex: 1,
          //       pageSize: 20,
          //     });
          //   }}
          //   onReset={() => {
          //     formTmpl.resetFields();
          //     queryList({
          //       pageIndex: 1,
          //       // pageSize: pageSize,
          //     });
          //   }}
        >
          <Form.Item label="默认分类：" name="appCategoryCode">
            <Select showSearch style={{ width: 110 }} />
          </Form.Item>
          <Form.Item label="环境大类：" name="envCode">
            <Select allowClear showSearch style={{ width: 120 }} />
          </Form.Item>
          <Form.Item label="基准环境：" name="templateType">
            <Select showSearch allowClear style={{ width: 120 }} />
          </Form.Item>
          <Form.Item label="环境名：" name="languageCode">
            <Select showSearch allowClear style={{ width: 100 }} />
          </Form.Item>
          <Form.Item label=" 环境CODE" name="templateName">
            <Input placeholder="请输入模版名称"></Input>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="ghost" htmlType="reset">
              重置
            </Button>
          </Form.Item>
        </Form>
      </FilterCard>
      <ContentCard>
        <div className="table-caption">
          <div className="caption-left">
            <h3>项目环境列表</h3>
          </div>
          <div className="caption-right">
            <Button type="primary" onClick={() => setEnviroEditMode('ADD')}>
              <PlusOutlined />
              新增项目环境
            </Button>
          </div>
        </div>
        <div>
          <Table rowKey="id" bordered>
            <Table.Column title="ID" dataIndex="id" width="4%" />
            <Table.Column title="环境名" dataIndex="templateName" width="20%" ellipsis />
            <Table.Column title="环境CODE" dataIndex="languageCode" width="8%" ellipsis />
            <Table.Column title="基准环境" dataIndex="templateType" width="8%" ellipsis />
            <Table.Column title="默认分类" dataIndex="appCategoryCode" width="8%" ellipsis />
            <Table.Column
              title="环境大类"
              dataIndex="envCode"
              width="16%"
              render={(current) => (
                <span>
                  {current?.map((item: any) => {
                    return (
                      <span style={{ marginLeft: 4, marginTop: 2 }}>
                        <Tag color={'green'}>{item}</Tag>
                      </span>
                    );
                  })}
                </span>
              )}
            />
            <Table.Column title="备注" dataIndex="remark" width="18%" ellipsis />
            <Table.Column
              title="操作"
              dataIndex="gmtModify"
              width="18%"
              key="action"
              render={(_, record: TmplEdit, index) => (
                <Space size="small">
                  <a
                    onClick={() =>
                      history.push({
                        pathname: 'tmpl-detail',
                        query: {
                          type: 'info',
                          templateCode: record.templateCode,
                          languageCode: record?.languageCode,
                        },
                      })
                    }
                  >
                    查看 {record.lastName}
                  </a>

                  <a
                  //   onClick={() => handleEditTask(record, index)}
                  >
                    编辑
                  </a>
                  <Popconfirm
                    title="确定要删除该信息吗？"
                    //   onConfirm={() => handleDelItem(record)}
                  >
                    <a style={{ color: 'red' }}>删除</a>
                  </Popconfirm>
                </Space>
              )}
            />
          </Table>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
