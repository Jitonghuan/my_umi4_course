import { Collapse, Drawer, Button, message, } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import DailForm from './dail-form';
import './index.less'
import { createNetworkProbe, CreateNeworkProbeItems, updateNetworkProbe, UpdateNeworkProbeItems } from './hook'
const { Panel } = Collapse;


interface Iprops {
  mode: EditorMode;
  onSave: (clusterName:string) => any;
  onClose: () => any;
  curRecord: any;
}
export default function EditDail(props: Iprops) {
  const { mode, curRecord, onSave, onClose } = props;
  const formDetailRef = useRef<any>(null);
  const createFormRef = () => formDetailRef?.current?.createFormRef;
  const getData = () => formDetailRef?.current?.getData();
  const [loading, setLoading] = useState<boolean>(false)
  const handleSubmit = () => {
    const payload = createFormRef()?.current?.getFieldsValue();
    let dataParams: any = {}
    if (payload?.probeType === "Http") {
      //如果类型是http配置格式：
      let configObj = {}

      if (getData()?.headersData?.length > 0) {

        const headersList = (getData()?.headersData || []).reduce((prev: any, curr: any) => {
          prev[curr.httpKey] = curr.httpValue;
          return prev;
        }, {} as Record<string, any>);
        configObj = {
          headers: headersList,


        }
      }
      if (getData()?.username && getData()?.password) {
      
        let username = getData()?.username
        Object.assign(configObj, { basicAuth: {
          username,
          password:getData()?.password
        } })

      }



      dataParams = {
        ...payload,
        // clusterName:payload?.clusterName,
        // probeInterval:payload?.probeInterval,
        // probeName:payload?.probeName,
        // probeType:payload?.probeType,
        // probeUrl: payload?.probeUrl, 
        probeTimeout: `${payload?.probeTimeout}s`,
        probeConfig: JSON.stringify(configObj)
      }
    }

    
    if (payload?.probeType === "Tcp") {
      const queryResponseList = (payload?.queryResponse || []).reduce((prev: any, curr: any) => {
        prev[curr.expect] = curr.send;
        return prev;
      }, {} as Record<string, any>);

      dataParams = {
        ...payload,
        probeTimeout: `${payload?.probeTimeout}s`,
        probeConfig: JSON.stringify({ queryResponse: queryResponseList })
      }
    }
  
    
    let dnsConfig={}
    if (payload?.probeType === "Dns") {
      dnsConfig={
       dnsType:payload?.dnsType,
        dnsProtocol:payload?.dnsProtocol,
        dnsServer: payload?.dnsServer, 
       

     }
     dataParams = {
      ...payload,
      probeTimeout: `${payload?.probeTimeout}s`,
      probeConfig: JSON.stringify(dnsConfig)

    }

    }
    if (payload?.probeType !== "Tcp" && payload?.probeType !== "Http"&&payload?.probeType !== "Dns") {
      dataParams = {
        ...payload,
        probeTimeout: `${payload?.probeTimeout}s`,

      }

    }

    setLoading(true)
    if (mode === "ADD") {
      createNetworkProbe(dataParams).then((resp) => {
        if (resp?.success) {
          const payload = createFormRef()?.current?.getFieldsValue();
          onSave(payload?.clusterName)
          message.success("创建成功！")

        }

      }).finally(() => {
        setLoading(false)
      })


    }
    if (mode === "EDIT") {
      updateNetworkProbe({ ...dataParams, id: curRecord?.id, status: curRecord?.status, graphUrl: curRecord?.graphUrl, }).then((resp) => {
        if (resp?.success) {
          const payload = createFormRef()?.current?.getFieldsValue();
          onSave(payload?.clusterName)
          message.success("创建成功！")

        }

      }).finally(() => {
        setLoading(false)
      })


    }

  }

  return (
  <>
   
    <Drawer
      title={mode === "ADD" ? "拨测新增" : "拨测编辑"}
      visible={mode !== 'HIDE'}
      width={"60%"}
      onClose={onClose}
      footer={ <div className="drawer-footer">
      <Button type="primary" loading={loading} onClick={handleSubmit} >
        保存
      </Button>
      <Button type="default" onClick={onClose}>
        取消
      </Button>
    </div>}
      destroyOnClose

    >
    
    <DailForm ref={formDetailRef} mode={mode} curRecord={curRecord} />
       


      

    </Drawer>
</>
  );
}

