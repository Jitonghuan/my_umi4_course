import React, { useState, useEffect, useContext } from 'react';
import { ContentCard } from '@/components/vc-page-content';
import MatrixPageContent from '@/components/matrix-page-content';
import HeaderTabs from '../_components/header-tabs';
import FELayout from '@cffe/vc-layout';
import { Select, Input, Switch, Button, Table, Form, Space } from 'antd';
import { getRequest } from '@/utils/request';
import { getProjects, getBugList } from '../service';
import moment from 'moment';
import './index.less';

const statusEnum = ['新建', '修复中', '已拒绝', '待验证', '重复打开', '已关闭', '延期解决'];
const bugTypeEnum = ['功能问题', '性能问题', '接口问题', 'UI界面问题', '易用性问题', '需求问题'];

export default function BugManage(props: any) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [bugList, setBugList] = useState<any>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [bugTotal, setBugTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [projectList, setProjectList] = useState<any[]>([]);
  const [addBugDrawerVisible, setAddBugDrawerVisible] = useState(true);
  const [form] = Form.useForm();

  const updateBugList = async (_pageIndex: number = pageIndex, _pageSuze: number = pageSize) => {
    const fromData = form.getFieldsValue();
    const requestParams = {
      ...fromData,
      pageIndex: _pageIndex,
      pageSize: _pageSuze,
      justMe: fromData.justMe ? userInfo.userName : undefined,
    };
    const res = await getRequest(getBugList, { data: requestParams });
    void setBugList(res.data.dataSource);
  };

  useEffect(() => {
    getRequest(getProjects).then((res) => {
      void setProjectList(res.data.dataSource);
    });
  }, []);

  return (
    <MatrixPageContent className="test-workspace-bug-manage">
      <HeaderTabs activeKey="bug-manage" history={props.history} />
      <ContentCard>
        <div className="search-header">
          <Form layout="inline" form={form}>
            <Form.Item label="所属" name="business">
              <Select className="w-100">
                {projectList.map((item) => (
                  <Select.Option value={item.id} key={item.id}>
                    {item.categoryName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="标题" name="bugName">
              <Input />
            </Form.Item>
            <Form.Item label="状态" name="status">
              <Select className="w-100">
                {statusEnum.map((title, index) => (
                  <Select.Option value={index} key={index}>
                    {title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="优先级" name="priority">
              <Select className="w-60">
                <Select.Option value="0">P0</Select.Option>
                <Select.Option value="1">P1</Select.Option>
                <Select.Option value="2">P2</Select.Option>
                <Select.Option value="3">P3</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="类型" name="bugType">
              <Select className="w-120">
                {bugTypeEnum.map((title, index) => (
                  <Select.Option value={index} key={index}>
                    {title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="只看我的" name="justMe" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={() => updateBugList(1)}>
                查询
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary">重置</Button>
            </Form.Item>
          </Form>
        </div>
        <div className="bug-table-container">
          <div className="add-bug-btn-container">
            <Button type="primary" onClick={() => setAddBugDrawerVisible(true)}>
              新建
            </Button>
          </div>
          <Table
            dataSource={bugList}
            pagination={{
              pageSize,
              current: pageIndex,
              total: bugTotal,
              onChange: (next) => setPageIndex(next),
              showSizeChanger: true,
              onShowSizeChange: (_, next) => {
                setPageIndex(1);
                setPageSize(next);
              },
            }}
            loading={loading}
          >
            <Table.Column title="ID" dataIndex="id" />
            <Table.Column title="标题" dataIndex="name" />
            <Table.Column title="类型" dataIndex="bugType" render={(type) => bugTypeEnum[type]} />
            <Table.Column title="优先级" dataIndex="priority" />
            <Table.Column title="状态" dataIndex="status" render={(status) => statusEnum[status]} />
            <Table.Column title="创建人" dataIndex="createUser" />
            <Table.Column title="经办人" dataIndex="modifyUser" />
            <Table.Column
              title="更新时间"
              dataIndex="gmtModify"
              render={(date) => moment(date).format('YYYY-MM-DD HH:mm:ss')}
            />
            <Table.Column
              title="操作"
              render={() => (
                <Space>
                  <Button type="link">删除</Button>
                </Space>
              )}
            />
          </Table>
        </div>
      </ContentCard>
    </MatrixPageContent>
  );
}
