/**
 * @description: 患者操作员纬度
 * @name {muxi.jth}
 * @time {2021/11/30 10:47}
 */

import React, { useEffect, useState } from 'react';
import { Form, Button, Card, Select, Input, Table, message, Divider, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import * as APIS from './service';
import appConfig from '@/app.config';
import { postRequest, getRequest } from '@/utils/request';
import { getCommonEnvCode } from '../../hook';
import './index.less';

export default function OperatorScheduling(props: any) {
  const { visable } = props;
  const [commonEnvCode, setCommonEnvCode] = useState<string>('');
  const [logger, setLogger] = useState<string>();
  const [clusterA_patientData, setClusterA_patientData] = useState<any[]>(
    localStorage.CLUSTERA_PATIENT_DATA ? JSON.parse(localStorage.CLUSTERA_PATIENT_DATA) : [],
  ); //A集群患者信息
  const [clusterB_patientData, setClusterB_patientData] = useState<any[]>(
    localStorage.CLUSTERB_PATIENT_DATA ? JSON.parse(localStorage.CLUSTERB_PATIENT_DATA) : [],
  ); //B集群患者信息
  const [clusterA_operatorData, setClusterA_operatorData] = useState<any[]>(
    localStorage.CLUSTERA_OPERATOR_DATA ? JSON.parse(localStorage.CLUSTERA_OPERATOR_DATA) : [],
  ); //A集群操作者信息
  const [clusterB_operatorData, setClusterB_operatorData] = useState<any[]>(
    localStorage.CLUSTERB_OPERATOR_DATA ? JSON.parse(localStorage.CLUSTERB_OPERATOR_DATA) : [],
  ); //B集群操作者信息

  const delClusterA_patient = (current: any) => {
    clusterA_patientData.map((item, index) => {
      if (item === current) {
        return clusterA_patientData.splice(index, 1);
      }
    });
    localStorage.CLUSTERA_PATIENT_DATA = JSON.stringify(clusterA_patientData);
    setClusterA_patientData(localStorage.CLUSTERA_PATIENT_DATA ? JSON.parse(localStorage.CLUSTERA_PATIENT_DATA) : []);
  };

  const delClusterB_patient = (current: any) => {
    clusterB_patientData.map((item, index) => {
      if (item === current) {
        return clusterB_patientData.splice(index, 1);
      }
    });
    localStorage.CLUSTERB_PATIENT_DATA = JSON.stringify(clusterB_patientData);
    setClusterB_patientData(localStorage.CLUSTERB_PATIENT_DATA ? JSON.parse(localStorage.CLUSTERB_PATIENT_DATA) : []);
  };

  const delClusterA_operator = (current: any) => {
    clusterA_operatorData.map((item, index) => {
      if (item === current) {
        return clusterA_operatorData.splice(index, 1);
      }
    });
    localStorage.CLUSTERA_OPERATOR_DATA = JSON.stringify(clusterA_operatorData);
    setClusterA_operatorData(
      localStorage.CLUSTERA_OPERATOR_DATA ? JSON.parse(localStorage.CLUSTERA_OPERATOR_DATA) : [],
    );
  };
  const delClusterB_operator = (current: any) => {
    clusterB_operatorData.map((item, index) => {
      if (item === current) {
        return clusterB_operatorData.splice(index, 1);
      }
    });

    localStorage.CLUSTERB_OPERATOR_DATA = JSON.stringify(clusterB_operatorData);
    setClusterB_operatorData(
      localStorage.CLUSTERB_OPERATOR_DATA ? JSON.parse(localStorage.CLUSTERB_OPERATOR_DATA) : [],
    );
  };
  const [form] = Form.useForm();
  const clusterA_patientColumns = [
    {
      title: '用户',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '备注',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      key: 'action',
      width: 50,
      render: (text: any, record: any) => (
        <a
          onClick={() => {
            delClusterA_patient(text);
          }}
        >
          <DeleteOutlined />
        </a>
      ),
    },
  ];
  const clusterB_patientColumns = [
    {
      title: '用户',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '备注',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      key: 'action',
      width: 50,
      render: (text: any, record: any) => (
        <a
          onClick={() => {
            delClusterB_patient(text);
          }}
        >
          <DeleteOutlined />
        </a>
      ),
    },
  ];

  const clusterA_operatorColumns = [
    {
      title: '操作员',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '备注',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      key: 'action',
      width: 50,
      render: (text: any, record: any) => (
        <a
          onClick={() => {
            delClusterA_operator(text);
          }}
        >
          <DeleteOutlined />
        </a>
      ),
    },
  ];
  const clusterB_operatorColumns = [
    {
      title: '操作员',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '备注',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      key: 'action',
      width: 50,
      render: (text: any, record: any) => (
        <a
          onClick={() => {
            delClusterB_operator(text);
          }}
        >
          <DeleteOutlined />
        </a>
      ),
    },
  ];

  //缓存数据
  const addUser = (params: any) => {
    form.validateFields().then(() => {
      if (params?.userCluster === 'cluster_a' && params?.userType === 'patient') {
        clusterA_patientData.push(params);
        localStorage.CLUSTERA_PATIENT_DATA = JSON.stringify(clusterA_patientData);
        setClusterA_patientData(localStorage.CLUSTERA_PATIENT_DATA ? JSON.parse(localStorage.CLUSTERA_PATIENT_DATA) : []);
      }
      if (params?.userCluster === 'cluster_b' && params?.userType === 'patient') {
        clusterB_patientData.push(params);
        localStorage.CLUSTERB_PATIENT_DATA = JSON.stringify(clusterB_patientData);
        setClusterB_patientData(localStorage.CLUSTERB_PATIENT_DATA ? JSON.parse(localStorage.CLUSTERB_PATIENT_DATA) : []);
      }
      if (params?.userCluster === 'cluster_a' && params?.userType === 'operator') {
        clusterA_operatorData.push(params);
        localStorage.CLUSTERA_OPERATOR_DATA = JSON.stringify(clusterA_operatorData);
        setClusterA_operatorData(
          localStorage.CLUSTERA_OPERATOR_DATA ? JSON.parse(localStorage.CLUSTERA_OPERATOR_DATA) : [],
        );
      }
      if (params?.userCluster === 'cluster_b' && params?.userType === 'operator') {
        clusterB_operatorData.push(params);
        localStorage.CLUSTERB_OPERATOR_DATA = JSON.stringify(clusterB_operatorData);
        setClusterB_operatorData(
          localStorage.CLUSTERB_OPERATOR_DATA ? JSON.parse(localStorage.CLUSTERB_OPERATOR_DATA) : [],
        );
      }
    })
  };
  //患者和操作员查询
  let arryAp: any = [];
  let arryAO: any = [];
  let arryBp: any = [];
  let arryBO: any = [];

  useEffect(() => {
    if (appConfig.IS_Matrix !== 'public') {
      getRequest(getCommonEnvCode).then((result) => {
        if (result?.success) {
          setCommonEnvCode(result.data);
          let currentEnvCode = result.data;
          getRequest(APIS.listClusterUser, { data: { envCode: currentEnvCode } }).then((resp) => {
            if (resp?.success) {
              let dataSource = resp?.data;
              dataSource.map((ele: any) => {
                if (ele?.userCluster === 'cluster_a' && ele?.userType === 'patient') {
                  let userType = ele?.userType;
                  let userCluster = ele?.userCluster;
                  let userId = ele?.userId;
                  let description = ele?.description;
                  arryAp.push({ userType, userCluster, userId, description });

                  localStorage.CLUSTERA_PATIENT_DATA = JSON.stringify(arryAp);
                }
                if (ele?.userCluster === 'cluster_b' && ele?.userType === 'patient') {
                  let userType = ele?.userType;
                  let userCluster = ele?.userCluster;
                  let userId = ele?.userId;
                  let description = ele?.description;
                  arryBp.push({ userType, userCluster, userId, description });
                  // clusterB_patientData.push({type,cluster,id})
                  localStorage.CLUSTERB_PATIENT_DATA = JSON.stringify(arryBp);
                }
                if (ele?.userCluster === 'cluster_a' && ele?.userType === 'operator') {
                  let userType = ele?.userType;
                  let userCluster = ele?.userCluster;
                  let userId = ele?.userId;
                  let description = ele?.description;
                  arryAO.push({ userType, userCluster, userId, description });
                  // clusterA_operatorData.push({type,cluster,id})
                  localStorage.CLUSTERA_OPERATOR_DATA = JSON.stringify(arryAO);
                }
                if (ele?.userCluster === 'cluster_b' && ele?.userType === 'operator') {
                  let userType = ele?.userType;
                  let userCluster = ele?.userCluster;
                  let userId = ele?.userId;
                  let description = ele?.description;
                  arryBO.push({ userType, userCluster, userId, description });
                  // clusterB_operatorData.push({type,cluster,id})

                  localStorage.CLUSTERB_OPERATOR_DATA = JSON.stringify(arryBO);
                }
              });
              setClusterA_patientData(arryAp);
              setClusterB_patientData(arryBp);
              setClusterA_operatorData(arryAO);
              setClusterB_operatorData(arryBO);
            }
          });
        }
      });
    }
  }, [visable]);

  useEffect(() => {
    return () => {
      localStorage.removeItem('CLUSTERB_OPERATOR_DATA');
      localStorage.removeItem('CLUSTERA_OPERATOR_DATA');
      localStorage.removeItem('CLUSTERB_PATIENT_DATA');
      localStorage.removeItem('CLUSTERA_PATIENT_DATA');
    };
  }, [visable]);

  //患者或操作员提交按钮
  let clusterAP: any = [];
  let clusterBP: any = [];
  let clusterAO: any = [];
  let clusterBO: any = [];
  clusterA_patientData.map((element: any) => {
    element['envCode'] = commonEnvCode;
    clusterAP.push(element);
    return clusterAP;
  });
  clusterB_patientData.map((element: any) => {
    element['envCode'] = commonEnvCode;
    clusterBP.push(element);
    return clusterBP;
  });
  clusterA_operatorData.map((element: any) => {
    element['envCode'] = commonEnvCode;
    clusterAO.push(element);
    return clusterAO;
  });
  clusterB_operatorData.map((element: any) => {
    element['envCode'] = commonEnvCode;
    clusterBO.push(element);
    return clusterBO;
  });
  let arryParams = clusterAP.concat(clusterBP, clusterAO, clusterBO);
  const addMultipleCluster = () => {
    postRequest(`${APIS.addMultipleClusterUser}?envCode=${commonEnvCode}`, { data: [...arryParams] }).then((res) => {
      if (res.success) {
        message.success({
          content: '调度成功！',
          className: 'custom-class',
          style: {
            marginTop: '20vh',
          },
        });
        // setLogger(res.data || '');
      } else {
        message.error({
          content: '调度失败！',
          className: 'custom-class',
          style: {
            marginTop: '20vh',
          },
        });
      }
    });
  };

  return (
    // <ContentCard className="page-scheduling" >
    <div className="site-card-border-less-wrapper">
      <div className="content-Card">
        <div className="leftCard">
          <Card title="操作" bordered={false} style={{ width: '24vw', height: 310, marginTop: 80 }}>
            <Form form={form} labelCol={{ flex: '80px' }} onFinish={addUser}>
              <Form.Item label="集群选择" name="userCluster">
                <Select>
                  <Select.Option key="cluster_a" value="cluster_a">
                    A集群
                  </Select.Option>
                  <Select.Option key="cluster_b" value="cluster_b">
                    B集群
                  </Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="人员选择" name="userType">
                <Select>
                  <Select.Option key="patient" value="patient">
                    用户
                  </Select.Option>
                  <Select.Option key="operator" value="operator">
                    操作员
                  </Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="ID" name="userId">
                <Input />
              </Form.Item>

              <Form.Item label="备注" name="description" rules={[{ required: true, message: '请备注用户信息' }]}>
                <Input />
              </Form.Item>

              <Form.Item style={{ marginTop: 40 }}>
                <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
                  添加
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
        <div className="RightCard" style={{ marginTop: 6 }}>
          <Card title="A集群" bordered={false}>
            <div className="clusterAFlex">
              <div style={{ height: '100%', overflow: 'auto' }}>
                {' '}
                <Table
                  columns={clusterA_patientColumns}
                  dataSource={clusterA_patientData}
                  pagination={false}
                  style={{ width: 330, height: 178 }}
                  bordered
                  scroll={{ y: window.innerHeight - 560 }}
                />
              </div>

              <div style={{ height: '100%', overflow: 'auto' }}>
                <Table
                  columns={clusterA_operatorColumns}
                  dataSource={clusterA_operatorData}
                  pagination={false}
                  style={{ width: 330, height: 178 }}
                  bordered
                  scroll={{ y: window.innerHeight - 560 }}
                />
              </div>
            </div>
          </Card>
          <Divider style={{ height: 10, marginTop: 0, marginBottom: 0 }} />
          <Card title="B集群" bordered={false}>
            <div className="clusterBFlex">
              <div style={{ height: '100%', overflow: 'auto' }}>
                <Table
                  columns={clusterB_patientColumns}
                  dataSource={clusterB_patientData}
                  pagination={false}
                  style={{
                    width: 330,
                    height: 178,
                    // height:window.innerHeight - 1050
                  }}
                  scroll={{ y: window.innerHeight - 560 }}
                  bordered
                />
              </div>
              <div style={{ height: '100%', overflow: 'auto' }}>
                <Table
                  columns={clusterB_operatorColumns}
                  dataSource={clusterB_operatorData}
                  pagination={false}
                  style={{
                    width: 330,
                    height: 178,
                    // height:window.innerHeight - 1050
                  }}
                  scroll={{ y: window.innerHeight - 560 }}
                  bordered
                />
              </div>
            </div>
          </Card>
          <div style={{ float: 'right', marginTop: 8 }}>
            <Button type="primary" onClick={addMultipleCluster}>
              提交
            </Button>
          </div>
        </div>
      </div>
      {/* <Modal
        visible={!!logger}
        title="同步日志"
        maskClosable={false}
        footer={false}
        onCancel={() => setLogger(undefined)}
        width={800}
      >
        <pre className="pre-block">{logger}</pre>
      </Modal> */}
    </div>
    // </ContentCard>
  );
}
