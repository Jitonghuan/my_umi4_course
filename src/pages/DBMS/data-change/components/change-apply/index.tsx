import React, { useState,useEffect,Component,useMemo,useRef,} from 'react';
import {  Tabs,Form,Space,Button,Select,message } from 'antd';
import {RightCircleFilled,InsertRowAboveOutlined,ZoomInOutlined} from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import LightDragable from "@/components/light-dragable";
import ChangeForm from "./_components/change-form";
import RightContent from "./_components/right-content"
import {createSql} from './hook';
import moment from "moment";
// import './index.less';
const { TabPane } = Tabs;
interface querySqlItems{
  sqlContent?:string;
  dbCode?:string;
  tableCode?:string;
  title?:string;
  sqlWfType?:string;
  envCode?:string;
  instanceId?:number;
  runStartTime?:string;
  runEndTime?:string;
 

}
export default function ResizeLayout() {

  const [sqlLoading,setSqlLoading]=useState<boolean>(false);
  const changeFormRef = useRef(null) as any;
  //createItems
  const createItems=changeFormRef?.current?.createItems;
  

  const createSqlApply=(params:querySqlItems)=>{
    setSqlLoading(true)
   
    createSql({
      ...params,
      ...createItems,
      runEndTime:moment(createItems?.runEndTime).format('YYYY-MM-DD HH:mm:ss'),
      runStartTime:moment(createItems?.runStartTime).format('YYYY-MM-DD HH:mm:ss'),
    }).then((res)=>{
      if(res?.success){
       message.success("提交成功！")
       


      }else{
        return
      }

    }).finally(()=>{
      setSqlLoading(false)
    })
  }
  
  const leftContent=useMemo(()=>{
    return(
      <>
      <ChangeForm ref={changeFormRef}/>
      </>
    )
  },[createItems])
  
    const rightContent=useMemo(()=>{
      return(
        <>
        <RightContent tableFields={createItems?.tableFields} createItems={createItems} createSql={(params:{sqlContent:string})=>createSqlApply(params)}/>
        </>
      )
    },[createItems?.tableFields,createItems]);
   
    return (
      // <PageContainer>
        <LightDragable
        leftContent={leftContent}
        rightContent={rightContent}
        showIcon={false}
        initWidth={150}
        />
      //  </PageContainer>
     

    );
  }
  