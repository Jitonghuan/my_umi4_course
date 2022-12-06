import React,{useState} from 'react';
import { Button,Input } from 'antd';
import {QuestionCircleOutlined} from '@ant-design/icons'
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import './index.less'
export default function ClusterTopo(){
    return(<PageContainer>
       <div  className="cluster-topo">
        <span></span>
        <span>
            <Button type="primary">流量模拟</Button>  <QuestionCircleOutlined />
           <span style={{marginLeft:16}}><Input.Search  addonBefore="ID"  style={{width:240}}/></span> 
        </span> 
    </div>

    </PageContainer>)

}