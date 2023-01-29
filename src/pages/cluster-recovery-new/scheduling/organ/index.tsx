
import React, { useCallback, useEffect, useState } from 'react';
import { Form, Radio, Button, Modal, message,Spin,Space } from 'antd';
import { ArrowRightOutlined,ThunderboltOutlined } from '@ant-design/icons';
import { ContentCard } from '@/components/vc-page-content';
import {  useClusterSource } from '../hooks';
import * as APIS from '../../service';
import { postRequest} from '@/utils/request';
import './index.less';
import { queryCommonEnvCode } from '../../dashboards/cluster-board/hook';
export default function TrafficScheduling() {
  const [editField] = Form.useForm();
  const [sourceData,optionLoading,getOptionData] = useClusterSource();
  const [pending, setPending] = useState(false);
  const [envCode,setEnvCode]=useState<string>("")
  const getEnvCode=()=>{
    queryCommonEnvCode().then((res:any)=>{
      if(res?.success){
        setEnvCode(res?.data)
        let envCode=res?.data
        if(envCode){
            getOptionData(envCode)
        }
       
      }else{
        setEnvCode("")
      }

    })
  }
  useEffect(()=>{
    getEnvCode()
  },[])


  const handleSubmit = useCallback(async () => {
    const values = await editField.validateFields();
    let ip = '';
    let paramArry: any = [];
    // if (appConfig.IS_Matrix !== 'public') { 
          sourceData.map((item: any, index:number) => {
            for (const key in values) {
              const element = values[key];
              if (element === 'cluster_a' && key === item.name) {
                ip = item?.options[0].ip;
                paramArry.push({
                  envCode,
                  cluster: 'cluster_a',
                  hospitalDistrictCode: item.name,
                  hospitalDistrictName: item?.title,
                  ip: ip,
                  flowMark:item?.flowMark,
                });
              }

              if (element === 'cluster_b' && key === item.name) {
                ip = item?.options[1].ip;
                paramArry.push({
                  envCode,
                  cluster: 'cluster_b',
                  hospitalDistrictCode: item.name,
                  hospitalDistrictName: item?.title,
                  ip: ip,
                  flowMark:item?.flowMark,
                });
              }
            }
        });
    // }

    Modal.confirm({
      title: '操作确认',
      content: (
        <div className="schedule-confirm-content">
          <h4>请确认即将调度的内容：</h4>
          {sourceData.map((item: any, index:number) => (
            <p key={index}>
              {item.title} <ArrowRightOutlined />
              <b>{item.options?.find((n: any) => n.value === values[item.name])?.label}</b>
            </p>
          ))}
        </div>
      ),
      okText: '我已确认无误',
      cancelText: '取消',
      onOk: async () => {
        setPending(true);
        try {
          const result = await postRequest(`${APIS.switchCluster}?envCode=${envCode}`, {
            data: paramArry,
          });
          //setLogger(result.data || '');
          if (result.success) {
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
        } finally {
          setPending(false);
        }
      },
    });
  }, [editField, sourceData]);

  const handleReset = useCallback(() => {
    editField.setFieldsValue({});
  }, [editField]);
  const checkout=(type:string)=>{
    const names= (sourceData||[])?.map((group:any, index:number) => (group?.name!||""))
     if(names?.length>0){
      names?.map((item:string)=>{
        editField.setFieldValue(item,type)
      })
    }
   
  }

  return (
    <ContentCard className="page-scheduling">
      <div className="table-caption">
        <div className="caption-left">
        <h3>请选择调度：</h3>
        </div>
        <div className="caption-right">
          <Space>
            <Button type="primary" disabled={sourceData?.length<1} onClick={()=>{checkout('cluster_a')}}><ThunderboltOutlined />一键切换至A集群</Button>
            <Button type="primary" disabled={sourceData?.length<1}  onClick={()=>{checkout('cluster_b')}}><ThunderboltOutlined />一键切换至B集群</Button>
          </Space>
          
          </div>
      </div>
      
      <Form form={editField}>
        <div className="zone-card-group">
          {sourceData.map((group:any, index:number) => (
              <Spin spinning={optionLoading}>
                   <div className="zone-card" key={index}>
              <h4>{group.title}</h4>
              
              <Form.Item
                name={group.name}
                rules={[{ required: true, message: '请选择集群' }]}
                initialValue={group.nowDisPatchCluster}
              >
                <Radio.Group options={group.options} size="large" defaultValue={group.nowDisPatchCluster} />
              </Form.Item>
            </div>

              </Spin>
           
          ))}
        </div>
        <div className="action-group">
          <Button type="primary" loading={pending} size="large" disabled={sourceData?.length<1}  onClick={handleSubmit}>
            开始调度
          </Button>
          <Button hidden type="default" size="large" onClick={handleReset} style={{ marginLeft: 12 }}>
            重置
          </Button>
        </div>
      </Form>
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
    </ContentCard>
  );
}
