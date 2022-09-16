
import React, { useState,useEffect,forwardRef,Component,useMemo,useRef,useImperativeHandle} from 'react';
import {  Tabs,Form,Space,Button,Select,message,Table, } from 'antd';
import {createTableColumns} from './schema';
import './index.less'
export default function RightContent(){
    const columns = useMemo(() => {
        return createTableColumns() as any;
      }, []);
    return(<div className="data-change-right-content">
      <div className="container-top"></div>
      <div className="container-bottom">
      <Tabs
        activeKey="check-result"
        type="card"
      >
        <Tabs.TabPane tab="检测结果" key="check-result">
        <Table columns={columns}/>
        
        </Tabs.TabPane>
      
      </Tabs>

     

      </div>


    </div>)
}