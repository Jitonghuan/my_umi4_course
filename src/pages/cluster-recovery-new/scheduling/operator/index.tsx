import React, { useEffect, useState,useMemo } from 'react';
import { Form, Button, Card, Select, Input, Table, message, Divider, Modal } from 'antd';
import appConfig from '@/app.config';
import * as APIS from '../../service';
import { ContentCard } from '@/components/vc-page-content';
import { postRequest } from '@/utils/request';
import { queryClusterUserList } from '../hooks'
import { queryCommonEnvCode } from '../../dashboards/cluster-board/hook';
import {userClusterOptions,userTypeOptions} from './type';
import {createClusterBTableColumns,createClusterATableColumns} from './schema'
import './index.less';

export default function OperatorScheduling() {
  const [form] = Form.useForm();
  const [envCode, setEnvCode] = useState<string>("")
  const [ensureLoading, setEnsureLoading] = useState<boolean>(false)
  const [clusterA_operatorData, setClusterA_operatorData] = useState<any[]>(
    localStorage.CLUSTERA_OPERATOR_DATA ? JSON.parse(localStorage.CLUSTERA_OPERATOR_DATA) : [],
  ); //A集群操作者信息
  const [clusterB_operatorData, setClusterB_operatorData] = useState<any[]>(
    localStorage.CLUSTERB_OPERATOR_DATA ? JSON.parse(localStorage.CLUSTERB_OPERATOR_DATA) : [],
  ); //B集群操作者信息


  const delClusterA_operator = (current: any,delIndex:number) => {
    clusterA_operatorData.map((item, index) => {
      if (delIndex == index) {
        clusterA_operatorData.splice(index, 1);
      }
    });
    try {
      localStorage.CLUSTERA_OPERATOR_DATA = JSON.stringify(clusterA_operatorData);
      setClusterA_operatorData(
        localStorage.CLUSTERA_OPERATOR_DATA ? JSON.parse(localStorage.CLUSTERA_OPERATOR_DATA) : [],
      );
      
    } catch (error) {
      
    }
   
  };
  const delClusterB_operator = (current: any,delIndex:number) => {
    clusterB_operatorData.map((item, index) => {
      if (delIndex == index) {
      clusterB_operatorData.splice(index, 1);
      }
    });
    try {
      localStorage.CLUSTERB_OPERATOR_DATA = JSON.stringify(clusterB_operatorData);
      setClusterB_operatorData(
        localStorage.CLUSTERB_OPERATOR_DATA ? JSON.parse(localStorage.CLUSTERB_OPERATOR_DATA) : [],
      );
      
    } catch (error) {
      
    }

   
  };
  
  const getEnvCode = () => {
    queryCommonEnvCode().then((res: any) => {
      if (res?.success) {
        setEnvCode(res?.data)
        let envCode = res?.data
        if (envCode) {
          getClusterUserList(envCode)
        }

      } else {
        setEnvCode("")
      }

    })
  }
  const clusterA_operatorColumns = useMemo(() => {
    return createClusterATableColumns({
      onDetele: (record: any,index:number) => {
        delClusterA_operator(record,index);
       
      },

    }) as any;
  }, [clusterA_operatorData]);
  const clusterB_operatorColumns = useMemo(() => {
    return createClusterBTableColumns({
      onDetele: (record: any,index:number) => {
        delClusterB_operator(record,index);
      },

    }) as any;
  }, [clusterB_operatorData]);

  //缓存数据
  const addUser = (params: any) => {
    form.validateFields().then(() => {
      if (params?.userCluster === 'cluster_a' && params?.userType === 'operator') {
        clusterA_operatorData.push(params);
        try {
          localStorage.CLUSTERA_OPERATOR_DATA = JSON.stringify(clusterA_operatorData);
          setClusterA_operatorData(
            localStorage.CLUSTERA_OPERATOR_DATA ? JSON.parse(localStorage.CLUSTERA_OPERATOR_DATA) : [],
          );
          
        } catch (error) {
          
        }
       
      }
      if (params?.userCluster === 'cluster_b' && params?.userType === 'operator') {
        clusterB_operatorData.push(params);
        try {
          localStorage.CLUSTERB_OPERATOR_DATA = JSON.stringify(clusterB_operatorData);
          setClusterB_operatorData(
            localStorage.CLUSTERB_OPERATOR_DATA ? JSON.parse(localStorage.CLUSTERB_OPERATOR_DATA) : [],
          );
          
        } catch (error) {
          
        }
       
      }
    })
  };

  const getClusterUserList = (envCode: string) => {

    queryClusterUserList(envCode).then((resp) => {
      if (resp?.success) {
        //患者和操作员查询
        let arryAO: any = [];
        let arryBO: any = [];

        let dataSource = resp?.data;
        dataSource.map((ele: any) => {
          if (ele?.userCluster === 'cluster_a' && ele?.userType === 'operator') {
            let userType = ele?.userType;
            let userCluster = ele?.userCluster;
            let userId = ele?.userId;
            let description = ele?.description;
            arryAO.push({ userType, userCluster, userId, description });
            try {
              localStorage.CLUSTERA_OPERATOR_DATA = JSON.stringify(arryAO);
              
            } catch (error) {
              
            }
            
          }
          if (ele?.userCluster === 'cluster_b' && ele?.userType === 'operator') {
            let userType = ele?.userType;
            let userCluster = ele?.userCluster;
            let userId = ele?.userId;
            let description = ele?.description;
            arryBO.push({ userType, userCluster, userId, description });
            try {
              localStorage.CLUSTERB_OPERATOR_DATA = JSON.stringify(arryBO);
              
            } catch (error) {
              
            }

            
          }
        });

        setClusterA_operatorData(arryAO);
        setClusterB_operatorData(arryBO);
      }
    });

  }



  useEffect(() => {
    // if (appConfig.IS_Matrix !== 'public') {


    // }
    getEnvCode()
    return () => {
      localStorage.removeItem('CLUSTERB_OPERATOR_DATA');
      localStorage.removeItem('CLUSTERA_OPERATOR_DATA');

    };
  }, []);



  const addMultipleCluster = () => {
    setEnsureLoading(true)

    //操作员提交按钮
    let clusterAO: any = [];
    let clusterBO: any = [];

    clusterA_operatorData.map((element: any) => {
      element['envCode'] = envCode;
      clusterAO.push(element);
      return clusterAO;
    });
    clusterB_operatorData.map((element: any) => {
      element['envCode'] = envCode;
      clusterBO.push(element);
      return clusterBO;
    });
    let arryParams = clusterAO.concat(clusterBO);
    postRequest(`${APIS.addMultipleClusterUser}?envCode=${envCode}`, { data: [...arryParams] }).then((res) => {
      if (res.success) {
        message.success({
          content: '调度成功！',
          className: 'custom-class',
          style: {
            marginTop: '20vh',
          },
        });
      } else {
        message.error({
          content: '调度失败！',
          className: 'custom-class',
          style: {
            marginTop: '20vh',
          },
        });
      }
    }).finally(() => {
      setEnsureLoading(false)
    });
  };

  return (
    <ContentCard className="operator-page">
      <div className="operate-action">
      <Form form={form} labelCol={{ flex: '80px' }} onFinish={addUser}>
        <Form.Item label="集群选择" name="userCluster">
          <Select style={{width:400}} options={userClusterOptions} />
        </Form.Item>
        <Form.Item label="人员选择" name="userType">
          <Select  style={{width:400}} options={userTypeOptions} />
        </Form.Item>
        <Form.Item label="ID" name="userId" rules={[{ required: true, message: '请填写ID' }]}>
          <Input  style={{width:400}} />
        </Form.Item>
        <Form.Item label="备注" name="description" rules={[{ required: true, message: '请备注用户信息' }]}>
          <Input placeholder="请备注用户信息"  style={{width:400}} />
        </Form.Item>
        <Form.Item style={{marginBottom:10}}>
          <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
            添加
          </Button>
        </Form.Item>
      </Form>

      </div>
      <Divider style={{marginTop:0}}/>
      <div className="operate-table">
        <div>
          <div><h3>A集群</h3></div>
        <Table
          columns={clusterA_operatorColumns}
          dataSource={clusterA_operatorData}
          pagination={false}
          bordered
          scroll={{ y: window.innerHeight - 460,x:'100%' }}
          />

        </div>
        <div style={{marginLeft:10}}>
        <div><h3>B集群</h3></div>
        <Table
          columns={clusterB_operatorColumns}
          dataSource={clusterB_operatorData}
          pagination={false}
          scroll={{ y: window.innerHeight - 460,x:'100%' }}
          bordered
          />

        </div>
     
     
      </div>
      <div className="operate-submit">
          <Button type="primary" onClick={addMultipleCluster} loading={ensureLoading}>
               {ensureLoading ? "切流中..." : "提交"}
         </Button>

      </div>
    </ContentCard>

  );
}
