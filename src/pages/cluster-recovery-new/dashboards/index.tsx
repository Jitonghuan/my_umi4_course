import React,{useState,useEffect} from 'react';
import { Radio,Button,Tag,Tooltip,Input,Select,Modal } from 'antd';
import PageContainer from '@/components/page-container';
import {QuestionCircleOutlined} from '@ant-design/icons';
import { ContentCard } from '@/components/vc-page-content';
import type { RadioChangeEvent } from 'antd';
import {queryCommonEnvCode } from './cluster-board/hook';
import ClusterBoard from './cluster-board';
import ClusterTopo from './cluster-topo'
import {getCurrentDistrictInfo} from '../service'
import './index.less'
const { Option } = Select;
export default function Dashboards(){
    const [value, setValue] = useState('cluster-board');
    const [count,setCount]=useState<number>(0)
    const [envCode,setEnvCode]=useState<string>("")
    const [infoType,setInfoType]=useState<string>("ip")
    const options = [
        { label: '流量看板', value: 'cluster-board' },
        { label: '流量拓扑', value: 'cluster-topo' }
      ];
      const onChange = ({ target: { value } }: RadioChangeEvent) => {
        setValue(value);
      };
      const refresh=()=>{
        setCount(count=>count+1)

      }
     
  const getEnvCode=()=>{
    queryCommonEnvCode().then((res:any)=>{
      if(res?.success){
        setEnvCode(res?.data)
        let envCode=res?.data
       
      }else{
        setEnvCode("")
      }

    })
  }

      useEffect(()=>{
        getEnvCode()
        return()=>{
          setCount(0)
        }
      },[])
      const onSelect=(value: string)=>{
        setInfoType(value)
      }
    
      const selectBefore = (
        <Select defaultValue="ip" className="select-before" onChange={onSelect}>
          <Option value="ip">IP</Option>
          <Option value="id">ID</Option>
        </Select>
      );
    
      const onSearch = (value: string) => {

        getCurrentDistrictInfo({
          infoType,
          key:value
    
        }).then((res)=>{
          if(res?.success){
            Modal.info({
              title: res?.data||"",
              content: (
                <div>
                  {/* <p>some messages...some messages...</p>
                  <p>some messages...some messages...</p> */}
                </div>
              ),
              onOk() {},
            });
    
          }
    
        })
        
      }
      
    return(
        <PageContainer className="cluster-recovery-dashboard">
            <ContentCard>
              <div className="cluster-recovery-dashboard-header">
              <Radio.Group size="middle" options={options} onChange={onChange} value={value} optionType="button" />
              {value==="cluster-board"&&
              <Button type="primary" onClick={refresh}>刷新数据</Button>
            }
            {value==="cluster-topo"&&<div>
            <span style={{display:"inline-block"}}>
        <Tooltip title="请输入Ip或者Id，确认Ip或者Id的流量所在集群">
          <Tag color="geekblue">流量模拟<QuestionCircleOutlined /></Tag>
        </Tooltip>
       <Input.Search addonBefore={selectBefore} style={{width:260}} onSearch={onSearch}></Input.Search>
        </span>
              </div>}


              </div>
            
            {value==="cluster-board"&&<ClusterBoard count={count} envCode={envCode}/>}
            {value==="cluster-topo"&&<ClusterTopo count={count}  envCode={envCode}/>}

            </ContentCard>
           

        </PageContainer>
    )
}