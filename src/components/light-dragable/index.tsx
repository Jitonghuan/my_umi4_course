import React, { useState} from 'react';
import {  Tabs,Form,Space,Button } from 'antd';
import {RightCircleFilled,LeftCircleFilled} from '@ant-design/icons'
import './index.less';
export interface Iprops{
    // resizeIcon:React.ReactNode;
    leftContent:React.ReactNode|JSX.Element;//左边元素
    rightContent:React.ReactNode|JSX.Element;//右边元素
    showIcon:boolean;//是否显示Icon；
    initWidth?:number;//左边内容初始宽度；
    least?:number//左边内容可以拖拽的最小宽度；
    dataChangeinitWidth?:number
}

export default function ResizeLayout(props:Iprops) {
    const {leftContent,rightContent,showIcon=true,initWidth=150,least=150,dataChangeinitWidth} =props
    const [siderWidth, setSiderWidth] = useState<any>(
       //@ts-ignore
      dataChangeinitWidth?dataChangeinitWidth: parseInt(localStorage.getItem('siderWidth')) ? parseInt(localStorage.getItem('siderWidth')):initWidth
       
      // parseInt(localStorage.getItem('siderWidth')) || initWidth,
    );
    const [dragging, setDragging] = useState(false);
    const [startPageX, setStartPageX] = useState(0);
    const [close, setClose] = useState(false);
    const pxWidth = `${siderWidth}px`;
    const handleMouseDown = (event:any) => {
      setStartPageX(event.pageX);
      setDragging(true);
    };
    const handleMouseMove = (event:any) => {
      const currentSiderWidth = siderWidth + event.pageX - startPageX;
    //   setSiderWidth(currentSiderWidth>150?currentSiderWidth:150);
    //小于150px|最小宽度，则是最小宽度
    //大于1080px。则是1080
    //setSiderWidth(currentSiderWidth)
      setSiderWidth(currentSiderWidth<least?least:currentSiderWidth>1080?1080:currentSiderWidth);
      setStartPageX(event.pageX);
    
   
    };
    const handleMouseUp = () => {
      setDragging(false);
      localStorage.setItem('siderWidth', siderWidth);
    };
    const onIconClick=(e:any)=>{
      e.stopPropagation();
     
      setClose(!close);

//debugger
      setSiderWidth(close?initWidth:least)
      setStartPageX(e.pageX);
      setDragging(false);
    }
    return (
     
        <div className="dragger-layout-page" style={{ paddingLeft: pxWidth }}>
        <div className="dragger-sider" style={{ width: pxWidth }}>
         {leftContent}
        </div>
        <div className="dragger-container">
        {rightContent}
        </div>
        <div
          className="sider-resizer"
          style={{ left: pxWidth }}
          onMouseDown={handleMouseDown}
        >
         {/* {showIcon&& <RightCircleFilled  onClick={(e)=>{ onIconClick(e)}} style={{color:'#3591ff',fontSize:26,position:"absolute",zIndex:9999}}/>} */}
         {showIcon&&close ? (
                <RightCircleFilled  onClick={onIconClick} style={{color:'#3591ff',fontSize:16,position:"absolute",zIndex:9999}} />
              ) : (
                <LeftCircleFilled  onClick={onIconClick} style={{color:'#3591ff',fontSize:16,position:"absolute",zIndex:9999}} />
              )}
          
          {dragging && (
            <div
              className="resize-mask"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            />
            
          )}
        </div>
      </div>

     

    );
  }
  