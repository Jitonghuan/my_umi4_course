import React,{useState} from 'react';
import { Radio } from 'antd';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import type { RadioChangeEvent } from 'antd';
import ClusterBoard from './cluster-board';
import ClusterTopo from './cluster-topo'
export default function Dashboards(){
    const [value, setValue] = useState('cluster-board');
    const options = [
        { label: '集群看板', value: 'cluster-board' },
        { label: '集群拓扑', value: 'cluster-topo' }
      ];
      const onChange = ({ target: { value } }: RadioChangeEvent) => {
        setValue(value);
      };
    return(
        <PageContainer>
            <ContentCard>
            <Radio.Group size="middle" options={options} onChange={onChange} value={value} optionType="button" />
            {value==="cluster-board"&&<ClusterBoard/>}
            {value==="cluster-topo"&&<ClusterTopo/>}

            </ContentCard>
           

        </PageContainer>
    )
}