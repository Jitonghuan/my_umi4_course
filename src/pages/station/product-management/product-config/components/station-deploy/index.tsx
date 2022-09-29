import React, { useState,  useEffect,useCallback} from 'react';
import {Space,Row,Col,Tag,Card,Spin} from 'antd';
import ConfigModal from './config-modal';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {useCreatePackageInde,} from '../../../hook';
import {CopyOutlined} from '@ant-design/icons'
import { postRequest } from '@/utils/request';
import {  generateIndentConfig,} from '../../../../service';
import {getPackageList} from './hook';
import {STATUS_TYPE,PACKAGE_STATUS_TYPE} from './schema'
import './index.less';

interface Iprops{
    indentId:number
}

export default function StationDeploy(props:Iprops){
    const {indentId}=props;
    const [indentConfigInfo, setIndentConfigInfo] = useState<any>("");
    const [configInfoLoading, setConfigInfoLoading] = useState<boolean>(false);
    const [editVisable,setEditVisable] = useState<boolean>(false);
    const [downloading, createPackageInde] = useCreatePackageInde();
    const [packageInfo,setPackageInfo]=useState<any>([])
    
    useEffect(()=>{
        if(!indentId) return
        queryIndentConfigInfo(indentId)
        getPackageListInfo()
    },[indentId])
    const getPackageListInfo=()=>{
      getPackageList(indentId).then((res)=>{
        if(res?.success){
          setPackageInfo(res?.data)
        }
      })
     
    }
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
           
               
                  {packageInfo?.map((element:any)=>{
                    return<>
                     <Col span={6}>
                       <Card style={{ width: 280 }} title={STATUS_TYPE[element?.indentPackageType]?.text||""} extra={<Space><CopyToClipboard text={element?.indentPackageUrl||""}><a>复制链接<CopyOutlined /></a></CopyToClipboard>
                       <Spin spinning={downloading}>
                       <a onClick={()=>{
                         downLoadIndent(element?.indentPackageType)
                       }}>生成</a>

                       </Spin>
                      </Space>} >
                     

                      <p style={{display:'flex',justifyContent:"space-between"}}><span>  {STATUS_TYPE[element?.indentPackageType]?.image||""}</span><span><Tag color={PACKAGE_STATUS_TYPE[element?.indentPackageStatus]?.color||"gold"}>{PACKAGE_STATUS_TYPE[element?.indentPackageStatus]?.text||""}</Tag></span></p>
                     {element?.errMessage&&(<p style={{width:"100%"}}><span>错误信息：</span><span style={{width:'100%',display:"flex",textOverflow:"ellipsis",whiteSpace:"nowrap",overflowX:"scroll",}}>{element?.errMessage}</span></p>)}  
                       </Card>
                     </Col>        
                    </>
                  })}         
            </Row>

        </div>
       </div>)
}