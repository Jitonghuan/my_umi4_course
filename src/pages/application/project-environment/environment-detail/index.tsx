// 项目环境管理
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/02/14 10:20

import React, { useState, useCallback, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Table,
  Space,
  Popconfirm,
  message,
  Modal,
  Descriptions,
  Badge,
  Divider,
  Drawer,
} from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { PlusOutlined, DiffOutlined } from '@ant-design/icons';
import { getRequest } from '@/utils/request';
import { queryProjectEnvList, queryAppsList } from '../service';
import { ContentCard } from '@/components/vc-page-content';
import EnvironmentEditDraw from '../add-environment';
import { useCreateProjectEnv, useUpdateProjectEnv, useEnvList } from '../hook';
import './index.less';

/** 编辑页回显数据 */
export interface EnvironmentEdit extends Record<string, any> {
  id: number;
  envName: string;
  envCode: string;
  relEnvs: string;
  categoryCode: string;
  envTypeCode: string;
  mark: string;
}
export default function EnvironmentList() {
  const projectEnvInfo: any = history.location.state;
  console.log('projectEnvInfo', projectEnvInfo);
  const { Option } = Select;
  const [formList] = Form.useForm();
  const [addAppForm] = Form.useForm();
  const [updateProjectEnv] = useUpdateProjectEnv();
  const [enviroInitData, setEnviroInitData] = useState<EnvironmentEdit>();
  const [enviroEditMode, setEnviroEditMode] = useState<EditorMode>('HIDE');
  const [appsListData, setAppsListData] = useState<any>([]);
  const [projectEnvData, setProjectEnvData] = useState<any>([]);
  const [dataSource, setDataSource] = useState<any>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageTotal, setPageTotal] = useState<number>(0);
  const [env, setEnv] = useState<string>('');
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [addAppsvisible, setAddAppsvisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const queryProjectEnv = async (benchmarkEnvCode: string, envCode: string) => {
    setListLoading(true);
    await getRequest(queryProjectEnvList, { data: { benchmarkEnvCode, envCode } })
      .then((res) => {
        if (res?.success) {
          let data = res.data.dataSource;
          setProjectEnvData(data[0]);
          setEnv(data.envCode);
        }
      })
      .finally(() => {
        setListLoading(false);
      });
  };

  const queryAppsListData = async (benchmarkEnvCode: string, projectEnvCode: string) => {
    setLoading(true);
    let canAddAppsData: any = []; //可选数据数组
    await getRequest(queryAppsList, { data: { benchmarkEnvCode, projectEnvCode } })
      .then((res) => {
        if (res?.success) {
          let data = res?.data;
          if (data.canAddApps) {
            setDataSource(data.canAddApps);
            data.canAddApps?.map((item: any, index: number) => {
              canAddAppsData.push({
                value: item.appCode,
                label: item.appName,
              });
            });
            setAppsListData(canAddAppsData);
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (projectEnvInfo.type === 'appDeploy') {
      queryProjectEnv(projectEnvInfo.benchmarkEnvCode, projectEnvInfo.envCode);
      queryAppsListData(projectEnvInfo.benchmarkEnvCode, projectEnvInfo.envCode);
    }
    if (projectEnvInfo.type === 'projectEnvironment') {
      queryProjectEnv(projectEnvInfo.benchmarkEnvCode, projectEnvInfo.envCode);
      queryAppsListData(projectEnvInfo.benchmarkEnvCode, projectEnvInfo.envCode);
    }
  }, []);
  const ensureAdd = () => {
    addAppForm.validateFields().then((params) => {
      let editParamsObj = {
        projectEnvCode: params.envCode || '',
        mark: params.mark || '',
        relationApps: params.appCode || [],
      };
      updateProjectEnv(editParamsObj).then(() => {
        setAddAppsvisible(false);
      });
    });
  };
  return (
    <PageContainer className="project-env-detail">
      <EnvironmentEditDraw
        mode={enviroEditMode}
        initData={enviroInitData}
        onClose={() => {
          setEnviroEditMode('HIDE');
          //   loadListData({ pageIndex: 1, pageSize: 20 });
        }}
        onSave={() => {
          setEnviroEditMode('HIDE');
        }}
      />

      <ContentCard>
        <div className="table-caption">
          <div className="caption-left">
            <h3>项目详情</h3>
          </div>
          <div className="caption-right">
            <Button
              type="primary"
              onClick={() => {
                setEnviroEditMode('EDIT');
                console.log(2);
              }}
            >
              <DiffOutlined />
              编辑
            </Button>
          </div>
        </div>
        <div>
          <Descriptions
            bordered
            column={2}
            labelStyle={{ color: '#5F677A', textAlign: 'right', whiteSpace: 'nowrap', width: 175 }}
          >
            <Descriptions.Item label="项目环境名">{projectEnvData.envName}</Descriptions.Item>
            <Descriptions.Item label="项目环境CODE">{projectEnvData.envCode}</Descriptions.Item>
            <Descriptions.Item label="基准环境CODE">{projectEnvData.relEnvs}</Descriptions.Item>
            <Descriptions.Item label="环境大类">{projectEnvData.envTypeCode}</Descriptions.Item>
            <Descriptions.Item label="备注" span={3}>
              {projectEnvData.mark || '--'}
            </Descriptions.Item>
          </Descriptions>
        </div>
        <Divider />
        <div className="table-caption">
          <div className="caption-left">
            <h3>项目环境应用列表</h3>
          </div>
          <div className="caption-right">
            <Button
              type="primary"
              onClick={() => {
                setAddAppsvisible(true);
              }}
            >
              <PlusOutlined />
              添加应用
            </Button>
          </div>
        </div>
        <div className="select-form">
          <Form
            layout="inline"
            form={formList}
            onFinish={(values: any) => {}}
            onReset={() => {
              formList.resetFields();
            }}
          >
            <Form.Item label="应用名：" name="envName">
              <Input style={{ width: 150 }} />
            </Form.Item>
            <Form.Item label=" 应用CODE" name="envCode">
              <Input placeholder="请输入应用CODE"></Input>
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
        </div>
        <div>
          <Table
            rowKey="id"
            bordered
            dataSource={dataSource}
            loading={loading}
            // pagination={{
            //   current: pageIndex,
            //   total: pageTotal,
            //   pageSize,
            //   showSizeChanger: true,
            //   onShowSizeChange: (_, size) => {
            //     setPageSize(size);
            //     setPageIndex(1);
            //   },
            //   showTotal: () => `总共 ${pageTotal} 条数据`,
            // }}
          >
            <Table.Column title="ID" dataIndex="id" width="4%" />
            <Table.Column title="应用名" dataIndex="appName" width="20%" ellipsis />
            <Table.Column title="应用CODE" dataIndex="appCode" width="20%" ellipsis />
            <Table.Column title="应用类型" dataIndex="appType" width="20%" ellipsis />
            <Table.Column
              title="操作"
              width="18%"
              key="action"
              render={(_, record: any, index) => (
                <Space size="small">
                  <a
                    onClick={() => {
                      history.push(`/matrix/application/environment-deploy?appCode=${record.appCode}&id=${record.id}`);
                      setEnviroInitData(record);
                    }}
                  >
                    部署
                  </a>
                  <Popconfirm
                    title="确定要删除该信息吗？"
                    // onConfirm={() => {
                    //   deleteProjectEnv(record?.envCode).then(() => {
                    //     queryProjectEnv({
                    //       pageIndex: 1,
                    //       // pageSize: pageSize,
                    //     });
                    //   });
                    // }}
                  >
                    <a style={{ color: 'red' }}>删除</a>
                  </Popconfirm>
                </Space>
              )}
            />
          </Table>
        </div>
      </ContentCard>
      <Modal
        title="添加应用"
        visible={addAppsvisible}
        onCancel={() => {
          setAddAppsvisible(false);
        }}
        maskClosable={false}
        footer={
          <div className="drawer-footer">
            <Button
              type="primary"
              onClick={() => {
                ensureAdd;
              }}
            >
              确认
            </Button>
            <Button
              type="default"
              onClick={() => {
                setAddAppsvisible(false);
              }}
            >
              取消
            </Button>
          </div>
        }
      >
        <Form form={addAppForm}>
          <Form.Item label="选择应用：" rules={[{ required: true, message: '请选择应用' }]} name="appCode">
            <Select style={{ width: 400 }} options={appsListData} allowClear showSearch mode="multiple"></Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
}
