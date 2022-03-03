// 项目环境管理
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/02/14 10:20

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Space, Popconfirm, Modal, Descriptions, Divider, Tag } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { PlusOutlined, DiffOutlined } from '@ant-design/icons';
import { getRequest } from '@/utils/request';
import { queryProjectEnvList, queryAppsList } from '../service';
import { ContentCard } from '@/components/vc-page-content';
import EnvironmentEditDraw from '../add-environment';
import { useRemoveApps, useUpdateProjectEnv, useAddAPPS } from '../hook';
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
interface DataType {
  key: React.Key;
  id: number;
  appName: string;
  appCode: string;
  appType: string;
}
export const appTypeOptions = [
  {
    label: '前端',
    value: 'frontend',
  },
  {
    label: '后端',
    value: 'backend',
  },
];
export default function EnvironmentList() {
  const projectEnvInfo: any = history.location.state;
  const { Option } = Select;
  const [formList] = Form.useForm();
  const [addAppForm] = Form.useForm();
  const [updateProjectEnv] = useUpdateProjectEnv();
  const [removeApps] = useRemoveApps();
  const [addApps] = useAddAPPS();
  const [enviroInitData, setEnviroInitData] = useState<EnvironmentEdit>();
  const [enviroEditMode, setEnviroEditMode] = useState<EditorMode>('HIDE');
  const [appsListData, setAppsListData] = useState<any>([]);
  const [projectEnvData, setProjectEnvData] = useState<any>([]);
  const [dataSource, setDataSource] = useState<any>([]);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [addAppsvisible, setAddAppsvisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>(0);
  const [selectedRows, setSelectedRows] = useState<DataType[]>([]);
  const [delLoading, setDelLoading] = useState<boolean>(false);
  const hasSelected = selectedRowKeys?.length > 0;
  const queryProjectEnv = async (benchmarkEnvCode: string, envCode: string) => {
    setListLoading(true);
    await getRequest(queryProjectEnvList, { data: { benchmarkEnvCode, envCode } })
      .then((res) => {
        if (res?.success) {
          let data = res.data.dataSource;
          setProjectEnvData(data[0]);
          setEnviroInitData(data[0]);
        }
      })
      .finally(() => {
        setListLoading(false);
      });
  };

  const queryAppsListData = async (
    benchmarkEnvCode: string,
    projectEnvCode: string,
    appName?: string,
    appCode?: string,
    appType?: string,
  ) => {
    setLoading(true);
    let canAddAppsData: any = []; //可选数据数组
    await getRequest(queryAppsList, { data: { benchmarkEnvCode, projectEnvCode, appName, appCode, appType } })
      .then((res) => {
        if (res?.success) {
          let data = res?.data;
          data.canAddApps?.map((item: any, index: number) => {
            canAddAppsData.push({
              value: item.appCode,
              label: item.appName,
            });
          });
          setAppsListData(canAddAppsData);
          if (data.alreadyAddApps) {
            setDataSource(data.alreadyAddApps);
          } else {
            setDataSource([]);
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    // if (projectEnvInfo.type === 'appDeploy') {
    queryProjectEnv(projectEnvInfo.benchmarkEnvCode, projectEnvInfo.envCode);
    queryAppsListData(projectEnvInfo.benchmarkEnvCode, projectEnvInfo.envCode);
    // }
    // if (projectEnvInfo.type === 'projectEnvironment') {
    //   queryProjectEnv(projectEnvInfo.benchmarkEnvCode, projectEnvInfo.envCode);
    //   queryAppsListData(projectEnvInfo.benchmarkEnvCode, projectEnvInfo.envCode);
    // }
  }, []);
  const ensureAdd = () => {
    addAppForm.validateFields().then((params) => {
      let editParamsObj = {
        projectEnvCode: projectEnvInfo.envCode || '',
        appCodes: params.appCode || [],
      };
      addApps(editParamsObj)
        .then(() => {
          setAddAppsvisible(false);
        })
        .then(() => {
          queryAppsListData(projectEnvInfo.benchmarkEnvCode, projectEnvInfo.envCode);
        });
    });
  };

  const onSelectChange = (currentSelectedRowKeys: React.Key[], currentSelectedRows: DataType[]) => {
    setSelectedRowKeys(currentSelectedRowKeys);
    setSelectedRows(currentSelectedRows);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const start = () => {
    setDelLoading(true);
    let appCodeArry: any = [];
    selectedRows.map((item: any) => {
      appCodeArry.push(item.appCode);
    });
    let removeParams = {
      projectEnvCode: projectEnvInfo.envCode,
      appCodes: appCodeArry,
    };
    removeApps(removeParams)
      .then(() => {
        queryAppsListData(projectEnvInfo.benchmarkEnvCode, projectEnvInfo.envCode);
      })
      .finally(() => {
        setDelLoading(false);
        setSelectedRowKeys(undefined);
      });
  };
  return (
    <PageContainer className="project-env-detail">
      <EnvironmentEditDraw
        mode={enviroEditMode}
        initData={enviroInitData}
        onClose={() => {
          setEnviroEditMode('HIDE');
        }}
        onSave={() => {
          setEnviroEditMode('HIDE');
          queryAppsListData(projectEnvInfo.benchmarkEnvCode, projectEnvInfo.envCode);
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
            <h3>项目环境已添加应用列表</h3>
          </div>
          <div className="caption-right">
            <Button
              type="primary"
              onClick={() => {
                setAddAppsvisible(true);
                addAppForm.resetFields();
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
            onFinish={(values: any) => {
              queryAppsListData(
                projectEnvInfo.benchmarkEnvCode,
                projectEnvInfo.envCode,
                values.appName,
                values.appCode,
                values.appType,
              );
            }}
            onReset={() => {
              formList.resetFields();
              queryAppsListData(projectEnvInfo.benchmarkEnvCode, projectEnvInfo.envCode);
            }}
          >
            <Form.Item label="应用名:" name="appName">
              <Input style={{ width: 190 }} />
            </Form.Item>
            <Form.Item label=" 应用CODE:" name="appCode">
              <Input placeholder="请输入应用CODE"></Input>
            </Form.Item>
            <Form.Item label=" 应用类型:" name="appType">
              <Select placeholder="请选择应用类型" options={appTypeOptions} style={{ width: 190 }}></Select>
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
          <div style={{ marginBottom: 8 }}>
            <Button type="primary" onClick={start} disabled={!hasSelected} loading={delLoading}>
              批量删除应用
            </Button>
            <span style={{ marginLeft: 8 }}>{hasSelected ? `选中 ${selectedRowKeys.length} 个应用` : ''}</span>
          </div>
          <Table rowKey="id" bordered dataSource={dataSource} loading={loading} rowSelection={rowSelection}>
            <Table.Column title="ID" dataIndex="id" width="4%" />
            <Table.Column title="应用名" dataIndex="appName" width="30%" />
            <Table.Column title="应用CODE" dataIndex="appCode" width="30%" />
            <Table.Column
              title="应用类型"
              dataIndex="appType"
              width="20%"
              render={(value, record: any, index) =>
                value === 'backend' ? (
                  <Tag color="geekblue">后端</Tag>
                ) : value === 'frontend' ? (
                  <Tag color="cyan">前端</Tag>
                ) : (
                  <Tag>{value}</Tag>
                )
              }
            />
            <Table.Column
              title="操作"
              width="16%"
              key="action"
              render={(_, record: any, index) => (
                <Space size="small">
                  <a
                    onClick={() => {
                      history.push({
                        pathname: `/matrix/application/environment-deploy/appDeploy`,
                        query: {
                          appCode: record.appCode,
                          id: record.id,
                          projectEnvCode: projectEnvData.envCode,
                          projectEnvName: projectEnvData.envName,
                          benchmarkEnvCode: projectEnvInfo.benchmarkEnvCode,
                        },
                      });
                    }}
                  >
                    部署
                  </a>
                  <Popconfirm
                    title="确定要删除该信息吗？"
                    onConfirm={() => {
                      let removeParams = {
                        projectEnvCode: projectEnvData.envCode,
                        appCodes: [record.appCode],
                      };
                      removeApps(removeParams).then(() => {
                        queryAppsListData(projectEnvInfo.benchmarkEnvCode, projectEnvInfo.envCode);
                      });
                    }}
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
                ensureAdd();
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
        <Form form={addAppForm} style={{ paddingLeft: 30 }}>
          <Form.Item label="选择应用：" rules={[{ required: true, message: '请选择应用' }]} name="appCode">
            <Select style={{ width: 320 }} options={appsListData} allowClear showSearch mode="multiple"></Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
}
