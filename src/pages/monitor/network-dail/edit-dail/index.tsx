import { Collapse, Drawer,Button,message, } from 'antd';
import React,{useState,useRef,useEffect} from 'react';
import DailForm from './dail-form';
import AlarmConfig from './alarm-config'
import './index.less'
import {
    MinusCircleOutlined,
    PlusOutlined
  } from '@ant-design/icons';
import {createNetworkProbe,CreateNeworkProbeItems} from './hook'
const { Panel } = Collapse;


interface Iprops {
    mode: EditorMode;
    onSave:()=>any;
    onClose:()=>any;
}
export default function EditDail(props: Iprops) {
    const { mode,onSave,onClose } = props;
    const formDetailRef = useRef<any>(null);
    const createFormRef = () => formDetailRef?.current?.createFormRef;
    const [loading,setLoading]=useState<boolean>(false)
    useEffect(()=>{
       // const labelList: any[] = Object.keys(initData.labels || {}).map((key) => ({
      //   key,
      //   value: initData.labels?.[key],
      // }));
    },[])
    
    const handleSubmit=()=>{  
      const payload=createFormRef()?.current?.getFieldsValue();
      console.log("payload",payload)
      let labels:any=[]
      // if(payload?.probeType==="Http"){
      //    labels = (payload?.headers || []).reduce((prev:any, curr:any) => {
      //     prev[curr.httpKey] = curr.httpValue;
      //     return prev;
      //   }, {} as Record<string, any>);

      // }
    
        console.log("-----",labels)

        let dataParams:any={}
        if(payload?.probeType==="Http"){
           //如果类型是http配置格式：
      dataParams={
        ...payload,
        probeTimeout:`${payload?.probeTimeout}s`,
        probesConfig:payload?.probesConfig==="headers"?JSON.stringify({headers:payload?.headers}):JSON.stringify({
          basicAuth:[
            { username:payload?.username},
            {password:payload?.password}
          ]
        })
      }
     }
     if(payload?.probeType==="Tcp"){
      dataParams={
        ...payload,
        probeTimeout:`${payload?.probeTimeout}s`,
        probesConfig:JSON.stringify({queryResponse:payload?.queryResponse})
      }
     }
     if(payload?.probeType!=="Tcp"&&payload?.probeType!=="Http"){
      dataParams={
        ...payload,
        probeTimeout:`${payload?.probeTimeout}s`,
        
      }

     }
     
      setLoading(true)
      createNetworkProbe(dataParams).then((resp)=>{
        if(resp?.success){
          onSave()
          message.success("创建成功！")

        }

      }).finally(()=>{
        setLoading(false)
      })

    }

    return (
        <Drawer 
           title={mode === "ADD" ? "拨测新增" : "拨测编辑"} 
           visible={mode !== 'HIDE'} 
           width={"60%"}
           onClose={onClose}
           footer={null}
           
           >
            <Collapse bordered={false} defaultActiveKey={['1']} collapsible={"icon"}>
                <Panel header={
                <div className="target-item"><h3>网络拨测编辑</h3>
                   <Button type="primary" loading={loading} onClick={handleSubmit}>保存</Button>
                </div>} key="1">
                <DailForm ref={formDetailRef} mode={mode}  />
                   
                </Panel>
                <Panel header={<div className="target-item">
                    <h3>报警监控

                   </h3>
                    <Button
                      type="primary"
                      ghost
                      disabled={false}
                      onClick={(e) => {
                        e.stopPropagation();
                        // setRulesType('add');
                        // setRulesVisible(true);
                      }}
                      icon={<PlusOutlined />}
                    >
                      新增报警
                    </Button>
                    </div>} key="2">
                    <AlarmConfig />
                   
                </Panel>


            </Collapse>

        </Drawer>

    );
}

