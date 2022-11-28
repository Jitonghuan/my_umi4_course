import React,{useState,useEffect} from 'react';
import { Radio,Button } from 'antd';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import type { RadioChangeEvent } from 'antd';
import ClusterBoard from './cluster-board';
import ClusterTopo from './cluster-topo'
import './index.less'
export default function Dashboards(){
    const [value, setValue] = useState('cluster-board');
    const [count,setCount]=useState<number>(0)
    const options = [
        { label: '集群看板', value: 'cluster-board' },
        { label: '集群拓扑', value: 'cluster-topo' }
      ];
      const onChange = ({ target: { value } }: RadioChangeEvent) => {
        setValue(value);
      };
      const refresh=()=>{
        setCount(count=>count+1)

      }
      useEffect(()=>{
        return()=>{
          setCount(0)
        }
      },[])
      
    return(
        <PageContainer className="cluster-recovery-dashboard">
            <ContentCard>
              <div className="cluster-recovery-dashboard-header">
              <Radio.Group size="middle" options={options} onChange={onChange} value={value} optionType="button" />
              {value==="cluster-board"&&<Button type="primary" onClick={refresh}>刷新数据</Button>}

              </div>
            
            {value==="cluster-board"&&<ClusterBoard count={count}/>}
            {value==="cluster-topo"&&<ClusterTopo/>}

            </ContentCard>
           

        </PageContainer>
    )
}