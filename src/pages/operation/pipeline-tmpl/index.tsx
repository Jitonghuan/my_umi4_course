import React, { useState, useEffect, useMemo } from 'react';
import { Input, Table, Form, Button, Space,Select } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import {tableSchema} from './schema';
export default function PipeLineTmpl(){
    // 表格列配置
  const tableColumns = useMemo(() => {
    return tableSchema({
      onEditClick: (record, index) => {
        
      },
      onViewClick: (record, index) => {
        
      },
      onDelClick: async (record, index) => {
      
      },
      onGetExecutionDetailClick: (record, index) => {
       
      },
    
    }) as any;
  }, []);

    return(
        <PageContainer>
            <FilterCard>
                <Form layout="inline">
                    <Form.Item label="应用类型">
                        <Select style={{width:220}} />

                    </Form.Item>
                    <Form.Item label="应用分类">
                    <Select style={{width:220}} />
                    </Form.Item>
                    <Form.Item label="应用语言">
                    <Select style={{width:220}} />
                    </Form.Item>
                    <Form.Item label="环境大类">
                    <Select style={{width:220}} />
                    </Form.Item>
                    <Form.Item label="模版类型">
                    <Select style={{width:220}} />
                    </Form.Item>
                    <Form.Item label="构建类型">
                    <Select style={{width:220}} />
                    </Form.Item>
                    <Form.Item label="模板名称">
                     <Input style={{width:220}}/>
                    </Form.Item>
                    <Form.Item >
                        <Button type="primary" htmlType="submit">查询</Button>
                        
                    </Form.Item>
                    <Form.Item>
                    <Button htmlType="reset">重置</Button>
                    </Form.Item>


                </Form>

            </FilterCard>
            <ContentCard>
                <div className="table-caption">
                    <div className="left-caption">
                        模版列表

                    </div>
                    <div className="right-caption">
                        <Button type="primary">新建模版</Button>

                    </div>
                </div>
                <Table columns={tableColumns} dataSource={[]}/>

            </ContentCard>
        </PageContainer>
    )
}