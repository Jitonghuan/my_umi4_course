import React, { useState,  useMemo,useRef ,useEffect,useCallback} from 'react';
import { Tabs, Button,Table, Tooltip,message,Row,Col,Tag,Card,Spin} from 'antd';
import ConfigModal from './config-modal';
import {useCreatePackageInde,} from '../../../hook';
import { getRequest, postRequest } from '@/utils/request';
import { queryIndentInfoApi, generateIndentConfig, getPackageStatus } from '../../../../service';
import './index.less';
// "online", 在线包
// "offline",离线包
// "onlineComponent",在线组件包
// "offlineComponent",离线组件包
interface Iprops{
    indentId:number
}
export default function StationDeploy(props:Iprops){
    const {indentId}=props;
    const [indentConfigInfo, setIndentConfigInfo] = useState<any>("");
    const [configInfoLoading, setConfigInfoLoading] = useState<boolean>(false);
    const [editVisable,setEditVisable] = useState<boolean>(false);
    const [downloading, createPackageInde] = useCreatePackageInde();
    useEffect(()=>{
        if(!indentId) return
        queryIndentConfigInfo(indentId)
    },[indentId])
    const getConfigInfo = () => {
        queryIndentConfigInfo(indentId)
      };
    
    const queryIndentConfigInfo = useCallback(async (id: number) => {
        setConfigInfoLoading(true);
        try {
          await postRequest(`${generateIndentConfig}?id=${id}`)
            .then((res) => {
              if (res.success) {
                setIndentConfigInfo(res.data || '');
              } else {
                return;
              }
            })
            .finally(() => {
              setConfigInfoLoading(false);
            });
        } catch (error) {
          console.log(error);
        }
      },[]);
      const downLoadIndent = (packageType:string) => {
        createPackageInde(indentId,packageType);
        
      };
      
    
    return (<div className="station-deploy-content" >
        <ConfigModal 
        configInfoLoading={configInfoLoading} 
        indentConfigInfo={indentConfigInfo}  
        indentId={indentId}
        onSave={()=>{setEditVisable(false);  queryIndentConfigInfo(indentId)}}
        onClose={()=>{setEditVisable(false);}}
        visible={editVisable}

        />
        <div >
            <span style={{display:'flex'}}>
                <b>建站配置：</b> 
                <Tag color="cyan" onClick={()=>{setEditVisable(true)}}>编辑</Tag> &nbsp; &nbsp;
                <Spin spinning={configInfoLoading} ><Tag color="geekblue"  onClick={getConfigInfo}  >重新生成</Tag></Spin>
            </span>
        </div>
        <div style={{paddingTop:16}}>
            <p><b>出包部署:</b></p>
            <Row gutter={18}>
                <Col span={6}>
                    <Card style={{ width: 280 }} title="在线包" extra={<a >生成</a>} >
                       不含镜像
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={{ width: 280 }} title="全量包"  extra={<a >生成</a>} >
                        含底座、组件以及镜像
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={{ width: 280 }} title="组件包" extra={<a >生成</a>} >
                       不包含底座
                    </Card>
                </Col>
            </Row>

        </div>
       </div>)
}