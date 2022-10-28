import React, { useState, useCallback, useEffect, useContext, useMemo } from 'react';
import { Form, Input, Select, Button ,Space,Table} from 'antd';
import {RedoOutlined} from '@ant-design/icons'
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import { createTableColumns } from './schema';
import PageContainer from '@/components/page-container';
import {getNacosNamespaces} from './hook'
import './index.less'
export default function namespace(){
    useEffect(()=>{
       
    },[])
    const getTableSource=()=>{
        getNacosNamespaces("").then(()=>{

        })
    }
    const columns = useMemo(() => {
        return createTableColumns({
          onEdit: (record, index) => {
            
          },
          onView: (record, index) => {
            
          },
          onDelete:(record, index)=>{

          }
         
        }) as any;
      }, []);
    return(<>
    
     <ContentCard >
     <div className="namespace-table">
                    <div className="namespace-table-header">
                        <h3>命名空间列表</h3>
                        <Space>
                           
                            <Button type="primary">+新建命名空间</Button>
                            <Button type="primary" ghost><RedoOutlined />刷新</Button>
                            
                        </Space>
                  </div>
                  <Table  columns={columns} dataSource={[]} bordered/>
                

              

                </div>
     </ContentCard >
    </>)
}