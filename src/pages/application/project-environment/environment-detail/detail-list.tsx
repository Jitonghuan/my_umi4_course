import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Select, Button, Table, Space, Divider, Popconfirm, Modal, Tag } from 'antd';
import { history, useLocation } from 'umi';
import { getRequest } from '@/utils/request';
import { queryAppsList, queryProjectEnvList } from '../service';
import { useRemoveApps, useAddAPPS } from '../hook';
import './index.less';

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
export default function DetailList(props: any) {
  let location: any = useLocation();
  const { dataInfo, onSpin, stopSpin, opt, isUpdata = false, cancelUpdate = () => { } } = props;
  const [projectEnvInfo, setProjectEnvInfo] = useState<any>(location.state);
  const [formList] = Form.useForm();
  const [addAppForm] = Form.useForm();
  const [removeApps] = useRemoveApps(onSpin, stopSpin);
  const [addApps] = useAddAPPS();
  const [appsListData, setAppsListData] = useState<any>([]);
  const [projectEnvData, setProjectEnvData] = useState<any>([]);
  const [dataSource, setDataSource] = useState<any>([]);
  const [addAppsvisible, setAddAppsvisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>(0);
  const [selectedRows, setSelectedRows] = useState<DataType[]>([]);
  const [delLoading, setDelLoading] = useState<boolean>(false);
  const hasSelected = selectedRowKeys?.length > 0;
  const [display, setDisplay] = useState<boolean>(false);

  const queryCommonParamsRef = useRef<{ benchmarkEnvCode: string; projectEnvCode: string; whichApps: String }>({
    benchmarkEnvCode: projectEnvInfo?.benchmarkEnvCode,
    projectEnvCode: projectEnvInfo?.envCode,
    whichApps: 'alreadyAdd',
  });
  const queryProjectEnv = async (benchmarkEnvCode: string, envCode: string) => {
    await getRequest(queryProjectEnvList, { data: { benchmarkEnvCode, envCode } }).then((res) => {
      if (res?.success) {
        let data = res.data.dataSource;
        setProjectEnvData(data[0]);
      }
    });
  };
  const queryAppsListData = async (paramObj: any) => {
    // setLoading(true);
    onSpin();
    let canAddAppsData: any = []; //可选数据数组
    await getRequest(queryAppsList, {
      data: {
        benchmarkEnvCode: paramObj.benchmarkEnvCode,
        projectEnvCode: paramObj.projectEnvCode,
        appName: paramObj?.appName,
        appCode: paramObj?.appCode,
        appType: paramObj?.appType,
        whichApps: paramObj?.whichApps,
      },
    })
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
        if (!res?.success) {
          setDataSource([]);
        }
      })
      .finally(() => {
        // setLoading(false);
        cancelUpdate();
        stopSpin();
      });
  };
  const selectAppType = (appTypeValue: string) => {
    let queryObj = {
      benchmarkEnvCode: projectEnvInfo?.benchmarkEnvCode,
      projectEnvCode: projectEnvInfo?.envCode,
      appType: appTypeValue,
      whichApps: 'canAdd',
    };
    queryAppsListData(queryObj);
  };

  // 如果存在props中传过来的数据 说明是外层的 而不是路由跳转过来的
  useEffect(() => {
    if (dataInfo?.id || dataInfo?.id === '') {
      if (dataInfo.id === '') {
        setDataSource([]);
      } else if (opt === 'del') {
        return;
      } else {
        queryProjectEnv(dataInfo?.benchmarkEnvCode, dataInfo?.envCode);
        setProjectEnvInfo(dataInfo);
        queryCommonParamsRef.current = {
          benchmarkEnvCode: dataInfo?.benchmarkEnvCode,
          projectEnvCode: dataInfo?.envCode,
          whichApps: 'alreadyAdd',
        };
        setDisplay(true);
      }
    }
  }, [dataInfo]);

  useEffect(() => {
    const data: any = location.state;
    if (data) {
      queryProjectEnv(data?.benchmarkEnvCode, data?.envCode);
    }
  }, [location.state]);

  useEffect(() => {
    if (projectEnvInfo) {
      queryAppsListData(queryCommonParamsRef.current);
    }
  }, [projectEnvInfo]);

  useEffect(() => {
    if (isUpdata) {
      queryAppsListData(queryCommonParamsRef.current);
    }
  }, [isUpdata]);

  const ensureAdd = () => {
    addAppForm.validateFields().then((params) => {
      let editParamsObj = {
        projectEnvCode: projectEnvInfo?.envCode || '',
        appCodes: params.appCode || [],
      };
      addApps(editParamsObj)
        .then(() => {
          setAddAppsvisible(false);
        })
        .then(() => {
          queryAppsListData(queryCommonParamsRef.current);
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
    // setDelLoading(true);
    // onSpin();
    let appCodeArry: any = [];
    selectedRows.map((item: any) => {
      appCodeArry.push(item.appCode);
    });
    let removeParams = {
      projectEnvCode: projectEnvInfo?.envCode,
      appCodes: appCodeArry,
    };
    removeApps(removeParams)
      .then(() => {
        queryAppsListData(queryCommonParamsRef.current);
      })
      .finally(() => {
        // setDelLoading(false);
        stopSpin();
        setSelectedRowKeys(undefined);
      });
  };
  return (
    <div>
      <Divider />
      <div className="table-caption ">
        <div className="caption-left">
          <h3 style={{ marginRight: '10px' }}>项目环境已添加应用列表</h3>
          {display && dataInfo.envName && <Tag color="blue">{dataInfo.envName}</Tag>}
        </div>
        <div className="caption-right">
          <Button
            type="primary"
            onClick={() => {
              setAddAppsvisible(true);
              addAppForm.resetFields();
            }}
          >
            + 添加应用
          </Button>
        </div>
      </div>
      <div className="select-form">
        <Form
          layout="inline"
          form={formList}
          onFinish={(values: any) => {
            let queryObj = {
              benchmarkEnvCode: projectEnvInfo?.benchmarkEnvCode,
              projectEnvCode: projectEnvInfo?.envCode,
              appName: values.appName,
              appCode: values.appCode,
              appType: values.appType,
              whichApps: 'alreadyAdd',
            };
            queryAppsListData(queryObj);
          }}
          onReset={() => {
            formList.resetFields();

            queryAppsListData(queryCommonParamsRef.current);
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
                      search: `appCode=${record.appCode}&id=${record.id}&projectEnvCode=${projectEnvData.envCode}&projectEnvName=${projectEnvData.envName}&benchmarkEnvCode=${projectEnvInfo?.benchmarkEnvCode}`
                    });
                  }}
                >
                  部署
                </a>
                <Popconfirm
                  title="确定要删除该应用吗？"
                  onConfirm={() => {
                    let removeParams = {
                      projectEnvCode: projectEnvData.envCode,
                      appCodes: [record.appCode],
                    };
                    removeApps(removeParams).then(() => {
                      queryAppsListData(queryCommonParamsRef.current);
                    });
                  }}
                >
                  <a >删除</a>
                </Popconfirm>
              </Space>
            )}
          />
        </Table>
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
          <Form form={addAppForm}>
            <Form.Item label="应用类型：" name="appType" style={{ paddingLeft: 36 }}>
              <Select
                style={{ width: 320 }}
                options={appTypeOptions}
                allowClear
                placeholder="请选择前端/后端"
                showSearch
                onChange={selectAppType}
              ></Select>
            </Form.Item>
            <Form.Item
              label="选择应用："
              rules={[{ required: true, message: '请选择应用' }]}
              name="appCode"
              style={{ paddingLeft: 30 }}
            >
              <Select style={{ width: 320 }} options={appsListData} allowClear showSearch mode="multiple"></Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
