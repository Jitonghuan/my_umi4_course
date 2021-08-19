import React, { useState, useEffect, useContext } from 'react';
import { ContentCard } from '@/components/vc-page-content';
import MatrixPageContent from '@/components/matrix-page-content';
import HeaderTabs from '../_components/header-tabs';
import FELayout from '@cffe/vc-layout';
import { Select, Input, Switch, Button, Table, Form, Space } from 'antd';
import { getRequest } from '@/utils/request';
import { getProjects, getBugList } from '../service';
import { bugTypeEnum, statusEnum, priorityEnum } from '../constant';
import AddBugDrawer from './add-bug-drawer';
import moment from 'moment';
import './index.less';

export default function BugManage(props: any) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [bugList, setBugList] = useState<any>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [bugTotal, setBugTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [projectList, setProjectList] = useState<any[]>([]);
  const [addBugDrawerVisible, setAddBugDrawerVisible] = useState(false);
  const [curBugInfo, setCurBugInfo] = useState<any>();
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
    void updateBugList();
  }, []);

  const handleAddBugBtnClick = () => {
    void setCurBugInfo(undefined);
    void setAddBugDrawerVisible(true);
  };

  const handleModifyBugBtnClick = (record: any) => {
    void setCurBugInfo(record);
    void setAddBugDrawerVisible(true);
  };

  return (
    <MatrixPageContent className="test-workspace-bug-manage">
      <HeaderTabs activeKey="bug-manage" history={props.history} />
      <ContentCard>
        <div className="search-header">
          <Form layout="inline" form={form}>
            <Form.Item label="所属" name="business">
              <Select className="w-100" placeholder="请选择" allowClear>
                {projectList.map((item) => (
                  <Select.Option value={item.id} key={item.id}>
                    {item.categoryName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="标题" name="bugName">
              <Input placeholder="请输入标题" />
            </Form.Item>
            <Form.Item label="状态" name="status">
              <Select className="w-100" placeholder="请选择" allowClear>
                {statusEnum.map((title, index) => (
                  <Select.Option value={index} key={index}>
                    {title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="优先级" name="priority">
              <Select className="w-60" placeholder="请选择" allowClear>
                {priorityEnum.map((title, index) => (
                  <Select.Option value={index} key={index}>
                    {title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="类型" name="bugType">
              <Select className="w-120" placeholder="请选择" allowClear>
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
            <Button type="primary" onClick={handleAddBugBtnClick}>
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
              render={(record) => (
                <Space>
                  <Button type="link" onClick={() => handleModifyBugBtnClick(record)}>
                    编辑
                  </Button>
                  <Button type="link">删除</Button>
                </Space>
              )}
            />
          </Table>
        </div>
        <AddBugDrawer
          visible={addBugDrawerVisible}
          setVisible={setAddBugDrawerVisible}
          projectList={projectList}
          bugInfo={curBugInfo}
          updateBugList={updateBugList}
        />
      </ContentCard>
    </MatrixPageContent>
  );
}
