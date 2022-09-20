import React, { useState,useEffect,Component,useMemo,useRef,} from 'react';
import {  Tabs,Form,Space,Button,Select,message } from 'antd';
import {RightCircleFilled,InsertRowAboveOutlined,ZoomInOutlined} from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import LightDragable from "@/components/light-dragable";
import QueryResult from "./components/query-result";
import SqlConsole from "./components/sql-console";

import './index.less';
const { TabPane } = Tabs;
export default function ResizeLayout() {
  const sqlConsoleRef = useRef<any>(null);
  const queryResultRef = useRef<any>(null);
  const addQueryResult = () => queryResultRef?.current?.addQueryResult();
  const addSqlConsole = () => sqlConsoleRef?.current?.addSqlConsole();
  const queryResultItems=queryResultRef?.current?.queryResultItems;
  const sqlConsoleItems=sqlConsoleRef?.current?.sqlConsoleItems;
  const queryResultActiveKey=queryResultRef?.current?.queryResultActiveKey;
  const sqlConsoleActiveKey=sqlConsoleRef?.current?.sqlConsoleActiveKey;

  const tableMap=()=>{
   return( ["table1","table2","table3","table4"]?.map((item:string)=>{
      return(
        <li className="schema-li-map" style={{listStyle:"none"}}><Space><ZoomInOutlined onClick={addQueryResult}  style={{color:'#3591ff'}} /><InsertRowAboveOutlined onClick={addSqlConsole} style={{color:"#6495ED",fontSize:16}}/><span>{item}</span></Space></li>
      )

    })
   )
  }
  const leftContent=useMemo(()=>{
    return(
      <>
      <div className="left-content-title">选择查询对象</div>
      <div className="left-content-form">
        <Form layout="vertical">
          <Form.Item>
            <Select  placeholder="选择环境"/>

          </Form.Item>
          <Form.Item>
          <Select  placeholder="选择实例"/>
          </Form.Item>
          <Form.Item>
          <Select  placeholder="选择库"/>
          </Form.Item>
          <Form.Item>
          <Select  placeholder="选择表"/>
          </Form.Item>
        </Form>
        {tableMap()}

      </div>
      </>
    )
  },[queryResultItems,sqlConsoleItems,queryResultActiveKey,sqlConsoleActiveKey])
    
    const rightContent=useMemo(()=>{
      return(
        <>
          <div className="container-top">
          <SqlConsole ref={sqlConsoleRef}/>
          
          </div>
          <div className="container-bottom">
            
            <QueryResult ref={queryResultRef} />
         
            
          </div>

        </>
      )
    },[queryResultItems,sqlConsoleItems,queryResultActiveKey,sqlConsoleActiveKey]);
   
    return (
      // <PageContainer>
        <LightDragable
        leftContent={leftContent}
        rightContent={rightContent}
        showIcon={false}
        initWidth={150}
        />
      // </PageContainer>
     

    );
  }
  