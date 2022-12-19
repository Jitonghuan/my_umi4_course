
import React, { useEffect, useState,useMemo } from 'react';
import { Form, Button, Select, Input, Table, message, Divider} from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import * as APIS from '../../service';
import appConfig from '@/app.config';
import { queryClusterUserList } from '../hooks'
import { queryCommonEnvCode } from '../../dashboards/cluster-board/hook';
import { postRequest} from '@/utils/request';
import {userClusterOptions,userTypeOptions} from './type';
import {createClusterBTableColumns,createClusterATableColumns} from './schema'
import './index.less';

export default function UserScheduling(props: any) {
  const [envCode, setEnvCode] = useState<string>("")
  const [form] = Form.useForm();
  const [ensureLoading,setEnsureLoading]=useState<boolean>(false)
  const [clusterA_patientData, setClusterA_patientData] = useState<any[]>(
    localStorage.CLUSTERA_PATIENT_DATA ? JSON.parse(localStorage.CLUSTERA_PATIENT_DATA) : [],
  ); //A集群用户信息
  const [clusterB_patientData, setClusterB_patientData] = useState<any[]>(
    localStorage.CLUSTERB_PATIENT_DATA ? JSON.parse(localStorage.CLUSTERB_PATIENT_DATA) : [],
  ); //B集群用户信息
  
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
  const getClusterUserList = (envCode: string) => {
    queryClusterUserList(envCode).then((resp) => {
        if (resp?.success) {
            let dataSource = resp?.data;
            dataSource.map((ele: any) => {
              if (ele?.userCluster === 'cluster_a' && ele?.userType === 'patient') {
                let userType = ele?.userType;
                let userCluster = ele?.userCluster;
                let userId = ele?.userId;
                let description = ele?.description;
                arryAp.push({ userType, userCluster, userId, description });
                try {
                    localStorage.CLUSTERA_PATIENT_DATA = JSON.stringify(arryAp);
                    
                } catch (error) {
                    
                }
               
              }
              if (ele?.userCluster === 'cluster_b' && ele?.userType === 'patient') {
                let userType = ele?.userType;
                let userCluster = ele?.userCluster;
                let userId = ele?.userId;
                let description = ele?.description;
                arryBp.push({ userType, userCluster, userId, description });
                try {
                    localStorage.CLUSTERB_PATIENT_DATA = JSON.stringify(arryBp);
                    
                } catch (error) {
                    
                }
                
              }
          
            });
            setClusterA_patientData(arryAp);
            setClusterB_patientData(arryBp);
          


        }})

  }
 
  const delClusterA_patient = (current: any,delIndex:number) => {
    try {
    clusterA_patientData.map((item, index) => {
      if (delIndex == index) {
       
        clusterA_patientData.splice(index, 1);
        localStorage.CLUSTERA_PATIENT_DATA = JSON.stringify(clusterA_patientData);
        setClusterA_patientData(localStorage.CLUSTERA_PATIENT_DATA ? JSON.parse(localStorage.CLUSTERA_PATIENT_DATA) : []);
        
      }
    });
   
       
    } catch (error) {
        
    }
   
  };
  

  const delClusterB_patient = (current: any,delIndex:number) => {
   
    try {
      clusterB_patientData.map((item, index) => {
        if (delIndex === index) {
           clusterB_patientData.splice(index, 1);
           localStorage.CLUSTERB_PATIENT_DATA = JSON.stringify(clusterB_patientData);
           setClusterB_patientData(localStorage.CLUSTERB_PATIENT_DATA ? JSON.parse(localStorage.CLUSTERB_PATIENT_DATA) : []);
        }
      });
       
        
    } catch (error) {
        
    }
   
  };

 
  const clusterA_userColumns = useMemo(() => {
    return createClusterATableColumns({
      onDetele: ( record: any,index:number) => {
        delClusterA_patient(record,index);
       
      },

    }) as any;
  }, [clusterA_patientData]);
  const clusterB_userColumns  = useMemo(() => {
    return createClusterBTableColumns({
      onDetele: (record: any,index:number) => {
        delClusterB_patient(record,index);
      },

    }) as any;
  }, [clusterB_patientData]);


  //缓存数据
  const addUser = (params: any) => {
    form.validateFields().then(() => {
      if (params?.userCluster === 'cluster_a' && params?.userType === 'patient') {
          try {
            clusterA_patientData.push(params);
            localStorage.CLUSTERA_PATIENT_DATA = JSON.stringify(clusterA_patientData);
           
            setClusterA_patientData(localStorage.CLUSTERA_PATIENT_DATA ? JSON.parse(localStorage.CLUSTERA_PATIENT_DATA) : []);
           
              
          } catch (error) {
            console.log("error",error)
              
          }
       
      }
      if (params?.userCluster === 'cluster_b' && params?.userType === 'patient') {
          try {
            clusterB_patientData.push(params);
            localStorage.CLUSTERB_PATIENT_DATA = JSON.stringify(clusterB_patientData);
            setClusterB_patientData(localStorage.CLUSTERB_PATIENT_DATA ? JSON.parse(localStorage.CLUSTERB_PATIENT_DATA) : []);
              
          } catch (error) {
              
          }
       
      }
    
    })
  };
  //患者和操作员查询
  let arryAp: any = [];
 
  let arryBp: any = [];
 

  useEffect(() => {
    // if (appConfig.IS_Matrix !== 'public') {
        getEnvCode()
    // }
    return () => {
        localStorage.removeItem('CLUSTERB_PATIENT_DATA');
        localStorage.removeItem('CLUSTERA_PATIENT_DATA');
      };
  }, []);

  

  const addMultipleCluster = () => {
    setEnsureLoading(true)

  //用户提交按钮
  let clusterAP: any = [];
  let clusterBP: any = [];
  
  clusterA_patientData.map((element: any) => {
    element['envCode'] = envCode;
    clusterAP.push(element);
    return clusterAP;
  });
  clusterB_patientData.map((element: any) => {
    element['envCode'] = envCode;
    clusterBP.push(element);
    return clusterBP;
  });
 
  let arryParams = clusterAP.concat(clusterBP);
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
    }).finally(()=>{
      setEnsureLoading(false)
    });
  };

  return (
    <ContentCard className="user-page">
    <div className="user-action">
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
    <div className="user-table">
      <div>
      <div><h3>A集群</h3></div>
      <Table
        columns={clusterA_userColumns}
        dataSource={clusterA_patientData}
        pagination={false}
        bordered
        scroll={{ y: window.innerHeight - 460,x:'100%' }}
        />

      </div>
      <div style={{marginLeft:10}}>
      <div><h3>B集群</h3></div>
      <Table
        columns={clusterB_userColumns}
        dataSource={clusterB_patientData}
        pagination={false}
        scroll={{ y: window.innerHeight - 460,x:'100%' }}
        bordered
        />

      </div>
   
   
    </div>
    <div className="user-submit">
        <Button type="primary" onClick={addMultipleCluster} loading={ensureLoading}>
             {ensureLoading ? "切流中..." : "提交"}
       </Button>

    </div>
  </ContentCard>
  
  );
}
