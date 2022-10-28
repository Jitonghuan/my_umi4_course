import React, { useState, useCallback, useEffect, useContext, useMemo } from 'react';
import { Form, Input, Select, Button ,Space,Table} from 'antd';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import { createTableColumns } from './schema';
import DetailContext from '../../context'

import PageContainer from '@/components/page-container';
import './index.less';

export default function Nacos() {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const {envCode} =useContext(DetailContext)
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
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
      };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
      };
      const hasSelected = selectedRowKeys.length > 0;
    
    return (<>
      
        <ContentCard >
            <div className="nacos-content-top-wrap">
                <div className="namespace-items">

                </div>

            </div>
            <div className="nacos-content-bottom-wrap">
                <div className="namesapce-title">
                    <span>Matrix开发测试环境</span><span> matrix-test</span>
                </div>
                <div className="search-form">
                    <Form layout="inline">
                        <Form.Item label="Data ID">
                            <Input placeholder="添加通配符'*'进行模糊查询" style={{width:220}}/>

                        </Form.Item>
                        <Form.Item>
                            <Input placeholder="添加通配符'*'进行模糊查询"  style={{width:220}}/>

                        </Form.Item>
                        <Form.Item>
                           <Input placeholder="请输入应用名"  style={{width:220}}/>
                        </Form.Item>
                        <Form.Item>
                            <Select placeholder="请选择标签"  style={{width:220}} />

                        </Form.Item>
                        <Form.Item>
                            <Button type="primary">查询</Button>
                            

                        </Form.Item>
                        <Form.Item>
                            <Button > 重置</Button>
                        </Form.Item>

                    </Form>

                </div>
                <div className="nacos-table">
                    <div className="nacos-table-header">
                        <h3>配置列表</h3>
                        <Space>
                            <Button type="primary" ghost>导出查询结果</Button>
                            <Button type="primary" ghost>导入配置</Button>
                            <Button type="primary">+新增配置</Button>
                        </Space>
                  </div>
                  <Table rowSelection={rowSelection} columns={columns} dataSource={[]} bordered/>
                  <div className="nacos-table-footer">
                      
                        <Space>
                            <Button danger>删除</Button>
                            <Button type="primary" >导出选中的配置</Button>
                            
                        </Space>
                </div>

              

                </div>
            </div>

        </ContentCard>
    </>)
}