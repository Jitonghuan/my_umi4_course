import React, { useState,useEffect,forwardRef,Component,useMemo,useRef,useImperativeHandle} from 'react';
import {  Tabs,Form,Space,Button,Select,message,Input,Alert,Divider } from 'antd';
import './index.less'
export default function ChangeForm(){
      return(<>
         <Form layout="vertical">
              <Form.Item>
                <Select  placeholder="在线变更"/>
    
              </Form.Item>

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
              <Form.Item>
              <Input  placeholder="上线理由"/>
              </Form.Item>
              <Form.Item>
              <Select  placeholder="执行方式"/>
              </Form.Item>
              <Form.Item>
              <Select  placeholder="选择时间"/>
              </Form.Item>
              <Form.Item>
              <Select  placeholder="关联发布计划"/>
              </Form.Item>
           </Form>
           <Divider/>
           <Alert 
             message="说明" 
             type="info" 
             showIcon 
             description={
             <div className="info-alert">
               <p>  
                1.多条SQL, 请用英文分号隔开。
               </p>
               <p>2.请不要编写对数据库不友好的SQL，以免影响线上业务运行。</p>
               <p>3. 表结构变更和数据订尽量分别提工单。</p>
               <p>4. <b>离线变更</b>指的是发布sql到不同外网的环境。</p>
               <p>5. <b>在线变更</b>指的是发布sql到当前环境</p>


             </div>}

           />
        </>
      )
}