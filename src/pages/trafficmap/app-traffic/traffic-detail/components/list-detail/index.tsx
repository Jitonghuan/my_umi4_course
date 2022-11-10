// article editor
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/15 14:50

import React, { useState, useEffect, useRef } from 'react';
import { Drawer, Form, Button, Radio, Input, Switch } from 'antd';
import type { RadioChangeEvent } from 'antd';
import CallInfo from './call-info';
import InstanceMonitor from './instance-monitor';
import JvmMonitor from './jvm-monitor';
import './index.less'


type TabPosition = 'instance' | 'jvm' | 'call' ;
export interface ListDetailProps {
 
}

export default function CreateArticle(props: ListDetailProps) {
  const {  } = props;
  const [filterMode, setFilterMode] = useState<TabPosition>('instance');
  
  const handleModeChange = (e: RadioChangeEvent) => {
    setFilterMode(e.target.value);
  };

  
 

  return (
   
        <div className="traffic-detail-right-content-wrap" >
            <div className="traffic-detail-right-content-header">
            <Radio.Group size="middle" onChange={handleModeChange} value={filterMode} style={{ marginBottom: 8 }}>
               <Radio.Button value="instance">实例监控</Radio.Button>
               <Radio.Button value="jvm">JVM监控</Radio.Button>
               <Radio.Button value="call">调用信息</Radio.Button>
           </Radio.Group>
              <span>test-application  |  10.100.2.0.32</span>

            </div>
            <div>
              {filterMode==="instance"&&<InstanceMonitor/>}
              {filterMode==="jvm"&&<JvmMonitor/>}
              {filterMode==="call"&&<CallInfo/>}

            </div>
        </div>

     
  
  );
}
