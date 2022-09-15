
import React, { useState,useEffect,Component} from 'react';
import {  Tabs,Form,Space,Button } from 'antd';
import PageContainer from '@/components/page-container';
import Draggable from 'react-draggable'; 
import './index.less'
export default function DataQuery(){
    const [initialLeftBoxWidth,setInitialLeftBoxWidth]=useState<any>(150);// 左边区块初始宽度
    const [leftBoxWidth,setLeftBoxWidth]=useState<number>(150);// 左边区块初始宽度
    const [leftBoxMinWidth,setLeftBoxMinWidth]=useState<any>(100);// 左边区块最小宽度
    const [leftBoxMaxWidth,setLeftBoxMaxWidth]=useState<any>(300);// 左边区块最大宽度
    const [dragBoxBackground,setDragBoxBackground]=useState<any>('green');//拖拽盒子的背景色
   
    const onDrag=(ev:any, ui:any)=>{
       
    const newLeftBoxWidth = ui.x + initialLeftBoxWidth;
    setLeftBoxWidth(newLeftBoxWidth);
    setDragBoxBackground( '#FFB6C1')

   

    }
    const onDragStop=()=>{
        setDragBoxBackground('transparent')
    }
  
    return(<PageContainer className="page-dragger" isFlex>
        {/* 左边 */}
        <div className="left-content-dragger" style={{width:leftBoxWidth}} >
          <h3 style={{paddingLeft: 20}}>目录</h3>
          <ul className="left-content-dragger-ul">
            <li>目录1</li>
            <li>目录2</li>
            <li>目录3</li>
            <li>这是个非常长非常长非常长的目录</li>
          </ul>
          <Draggable 
            axis="x"
            defaultPosition={{ x: 0, y: 0 }}
            bounds={{ left: leftBoxMinWidth - initialLeftBoxWidth, right: leftBoxMaxWidth - initialLeftBoxWidth }}
            onDrag={onDrag}
            onStop={onDragStop}>
            <div className="draggable-box" style={{left:initialLeftBoxWidth-5,background:dragBoxBackground}}></div>
          </Draggable>
        </div>
        {/* 右边 */}
        <div className="right-content-dragger" style={{width:`calc(100% - ${leftBoxWidth+220}px)`,left:initialLeftBoxWidth+225,}} >
          {/* <h3>这里是内容块</h3> */}
          <span>这里是内容块</span>
        </div>


        

    </PageContainer>)
}