// article editor
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/15 14:50

import React, { useState, useEffect, useRef } from 'react';
import { Drawer, Form, Button, Radio, Input, Switch } from 'antd';
import type { RadioChangeEvent } from 'antd';


type TabPosition = 'left' | 'right' | 'top' | 'bottom';
export interface ListDetailProps {
 
}

export default function CreateArticle(props: ListDetailProps) {
  const {  } = props;
  const [filterMode, setFilterMode] = useState<TabPosition>('top');
  
  const handleModeChange = (e: RadioChangeEvent) => {
    setFilterMode(e.target.value);
  };

  
 

  return (
   
        <div>
            <div>
            <Radio.Group onChange={handleModeChange} value={filterMode} style={{ marginBottom: 8 }}>
               <Radio.Button value="top">实例监控</Radio.Button>
               <Radio.Button value="left">JVM监控</Radio.Button>
               <Radio.Button value="left">调用信息</Radio.Button>
           </Radio.Group>

            </div>
            <div>

            </div>
        </div>

     
  
  );
}
