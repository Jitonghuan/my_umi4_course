import React, { useState, useEffect, useContext } from 'react';
import { ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import HeaderTabs from '../_components/header-tabs';
import FELayout from '@cffe/vc-layout';
import {
  Select,
  Input,
  Switch,
  Button,
  Table,
  Form,
  Space,
  Popconfirm,
  message,
  Cascader,
  Typography,
  Tooltip,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getRequest, postRequest } from '@/utils/request';
import { getProjects, getBugList, deleteBug } from '../service';
import { bugTypeEnum, bugStatusEnum, bugPriorityEnum } from '../constant';
import AddBugDrawer from './add-bug-drawer';
import moment from 'moment';
import * as HOOKS from '../hooks';
import './index.less';

export default function BugManage(props: any) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [bugList, setBugList] = useState<any>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [bugTotal, setBugTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  // const [projectList, setProjectList] = useState<any[]>([]);
  const [addBugDrawerVisible, setAddBugDrawerVisible] = useState(false);
  const [bugReadOnly, setBugReadOnly] = useState<boolean>(false);
  const [curBugInfo, setCurBugInfo] = useState<any>();
  const [projectTreeData] = HOOKS.useProjectTreeData();
  const [formData, setFormData] = useState<any>({ justMe: true });
  const [form] = Form.useForm();

  const updateBugList = async (_pageIndex: number = pageIndex, _pageSuze: number = pageSize, _formData = formData) => {
    const formData = _formData;
    void setLoading(true);
    const requestParams = {
      ...formData,
      pageIndex: _pageIndex,
      pageSize: _pageSuze,
      justMe: formData.justMe ? userInfo.userName : undefined,
      projectId: formData.demandId?.[0] && +formData.demandId[0],
      demandId: formData.demandId?.[1] && +formData.demandId[1],
      subDemandId: formData.demandId?.[2] && +formData.demandId[2],
    };
    const res = await getRequest(getBugList, { data: requestParams });
    const { pageIndex, pageSize, total } = res.data.pageInfo;
    void setBugList(res.data.dataSource);
    void setPageIndex(pageIndex);
    void setPageSize(pageSize);
    void setBugTotal(total);
    void setLoading(false);
  };

  useEffect(() => {
    void form.setFieldsValue({ justMe: true });
  }, []);

  useEffect(() => {
    void updateBugList(pageIndex, pageSize);
  }, [pageIndex, pageSize, formData.justMe]);

  const handleAddBugBtnClick = () => {
    void setCurBugInfo(undefined);
    void setAddBugDrawerVisible(true);
    void setBugReadOnly(false);
  };

  const handleModifyBugBtnClick = (record: any) => {
    void setCurBugInfo(record);
    void setAddBugDrawerVisible(true);
    void setBugReadOnly(false);
  };

  const handleSeeBugBtnClick = (record: any) => {
    void setCurBugInfo(record);
    void setAddBugDrawerVisible(true);
    void setBugReadOnly(true);
  };

  const handleConfirmDelete = (id: number) => {
    // const loadFinish = message.loading('正在删除中');
    void postRequest(deleteBug, { data: { id } }).then(() => {
      // void loadFinish();
      void message.success('删除成功');
      void updateBugList();
    });
  };

  const StatusTag = (props: any) => {
    const { color, bgColor, children } = props;
    return (
      <div className="status-tag" style={{ color, background: bgColor }}>
        {children}
      </div>
    );
  };

  const handleFilterPropJustMeChange = (val: boolean) => {
    const nexFormData = { ...formData, justMe: val };
    void setFormData(nexFormData);
  };

  const handleFilterDataList = (data: any) => {
    void setFormData(data);
    void updateBugList(1, pageSize, data);
  };

  return (
    <PageContainer className="test-workspace-bug-manage">
      <HeaderTabs activeKey="bug-manage" history={props.history} />
      <ContentCard>
        <div className="search-header">
          <Form layout="inline" form={form} onFinish={handleFilterDataList} onReset={() => handleFilterDataList({})}>
            {/* <Form.Item label="所属" name="business">
              <Select className="w-100" placeholder="请选择" allowClear>
                {projectList.map((item) => (
                  <Select.Option value={item.id} key={item.id}>
                    {item.categoryName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item> */}
            <Form.Item label="项目/需求" name="demandId">
              <Cascader
                expandTrigger="hover"
                changeOnSelect
                className="demandId-cascader"
                placeholder="请选择"
                options={projectTreeData}
              />
            </Form.Item>
            <Form.Item label="标题" name="name">
              <Input placeholder="请输入标题" />
            </Form.Item>
            <Form.Item label="状态" name="status">
              <Select className="w-100" placeholder="请选择" allowClear options={bugStatusEnum}></Select>
            </Form.Item>
            <Form.Item label="优先级" name="priority">
              <Select className="w-60" placeholder="请选择" allowClear>
                {bugPriorityEnum.map((title, index) => (
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
              <Switch onChange={handleFilterPropJustMeChange} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="reset">
                重置
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="bug-table-container">
          <div className="add-bug-btn-container">
            {/* <span className="bug-table-title">Bug列表</span> */}
            <Button type="primary" onClick={handleAddBugBtnClick}>
              <PlusOutlined />
              新增Bug
            </Button>
          </div>
          <Table
            rowKey="id"
            className="bug-table"
            dataSource={bugList}
            pagination={{
              pageSize,
              current: pageIndex,
              total: bugTotal,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (next) => setPageIndex(next),
              onShowSizeChange: (_, next) => setPageSize(next),
            }}
            loading={loading}
          >
            <Table.Column title="ID" dataIndex="id" />
            <Table.Column
              title="标题"
              dataIndex="name"
              render={(title, record) => (
                <Tooltip placement="topLeft" title={title}>
                  <Typography.Text
                    style={{ maxWidth: '220px', cursor: 'pointer', color: '#033980' }}
                    ellipsis={{ suffix: '' }}
                    onClick={() => handleSeeBugBtnClick(record)}
                  >
                    {title}
                  </Typography.Text>
                </Tooltip>
              )}
            />
            <Table.Column title="类型" dataIndex="bugType" render={(type) => bugTypeEnum[type]} />
            <Table.Column title="优先级" dataIndex="priority" render={(priority) => bugPriorityEnum[priority]} />
            <Table.Column
              title="状态"
              dataIndex="status"
              render={(status) => (
                <StatusTag color={bugStatusEnum[status].color} bgColor={bugStatusEnum[status].backgroundColor}>
                  {bugStatusEnum[status].label}
                </StatusTag>
              )}
            />
            <Table.Column title="创建人" dataIndex="createUser" />
            <Table.Column title="经办人" dataIndex="agent" />
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
                  <Popconfirm title="确定要删除吗" onConfirm={() => handleConfirmDelete(record.id)}>
                    <Button type="link">删除</Button>
                  </Popconfirm>
                </Space>
              )}
            />
          </Table>
        </div>
        <AddBugDrawer
          visible={addBugDrawerVisible}
          setVisible={setAddBugDrawerVisible}
          readOnly={bugReadOnly}
          bugId={curBugInfo?.id}
          updateBugList={updateBugList}
          projectTreeData={projectTreeData}
        />
      </ContentCard>
    </PageContainer>
  );
}
