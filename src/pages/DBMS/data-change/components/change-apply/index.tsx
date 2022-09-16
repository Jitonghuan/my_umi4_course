import React, { useState,useEffect,Component,useMemo,useRef,} from 'react';
import {  Tabs,Form,Space,Button,Select,message } from 'antd';
import {RightCircleFilled,InsertRowAboveOutlined,ZoomInOutlined} from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import LightDragable from "@/components/light-dragable";
import ChangeForm from "./_components/change-form";
import RightContent from "./_components/right-content"
// import './index.less';
const { TabPane } = Tabs;
export default function ResizeLayout() {
  
  const leftContent=useMemo(()=>{
    return(
      <>
      <ChangeForm/>
      </>
    )
  },[])
    
    const rightContent=useMemo(()=>{
      return(
        <>
        <RightContent/>
        </>
      )
    },[]);
   
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
  