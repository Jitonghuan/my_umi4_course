
import React, { useState,useEffect} from 'react';
import {  Tabs,Form,Space,Button } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import VCPermission from '@/components/vc-permission';
import AceEditor from '@/components/ace-editor';
import './index.less'
const { TabPane } = Tabs;
export default function AuthorityManage(){

    return(<PageContainer className="configuration-page">
         <Tabs
        activeKey="goincepyion"
      >
        <TabPane tab="goincepyion配置" key="goincepyion">
        {/* <VCPermission code={window.location.pathname} isShowErrorPage > */}
        <Form>
           
            <Form.Item>
            <AceEditor mode="yaml" height={window.innerHeight - 190}/>
            </Form.Item>
            <Form.Item style={{display:'flex',justifyContent:'flex-end'}}>
                <Space>
                    <Button type="primary">提交变更</Button>
                    <Button>取消</Button>
                </Space>
                
            </Form.Item>

        </Form>
       

        {/* </VCPermission> */}
        
        </TabPane>
      
      </Tabs>

    </PageContainer>)
}
