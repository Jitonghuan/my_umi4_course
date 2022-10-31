import React, { useState, useCallback, useEffect, useContext, useMemo } from 'react';
import { Form, Input, Select, Button ,Space,Table,Spin,Empty} from 'antd';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import { createTableColumns } from './schema';
import DetailContext from '../../context';
import {getNacosNamespaces} from '../namespace/hook';

import PageContainer from '@/components/page-container';
import './index.less';

export default function Nacos() {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const {envCode} =useContext(DetailContext);
    const [namespaces,setNamespaces]=useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [curNamespace,setCurNamespace]=useState<string>("");
    const [curData,setCurData]=useState<any>({});
    const [isClick, setIsClick] = useState<number>();
    useEffect(() => {
        if(envCode){
            getTableSource()
        }
       
    
      }, [envCode])
    const getTableSource = () => {
        setLoading(true)
        getNacosNamespaces(envCode || "").then((res) => {
          let data = res?.slice(0)
          let typeIndex = -1
          data?.map((ele: any, index: number) => {
            if (ele?.type === 0) {
              typeIndex = index
            }
          })
          if (typeIndex !== -1) {
            res.splice(typeIndex, 1)
            setNamespaces([data[typeIndex], ...res])
            console.log("[data[typeIndex]",[data[typeIndex]])
           setCurNamespace(data[typeIndex]?.namespaceShowName)
           setIsClick(data[typeIndex]?.namespaceShowName);
           setCurData(data[typeIndex])
          } else {
            setNamespaces(res)
            setCurNamespace(res[0]?.namespaceShowName)
            setCurData(res[0])
            setIsClick(res[0]?.namespaceShowName);
          }
        }).finally(() => {
          setLoading(false)
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
                    <Spin spinning={loading}>
                        {namespaces?.map((item:any)=>{
                            return(
                                <>
                                <span 
                                 key={item?.namespaceShowName}
                                 className={item?.namespaceShowName === isClick ? 'all-namespaces__onClick' : "all-namespaces__unClick"}
                                 onClick={()=>{
                                    setIsClick(item?.namespaceShowName);
                                    setCurNamespace(item?.namespaceShowName)
                                    setCurData(item)
                                 }}
                                 >{item?.namespaceShowName}</span>
                                <span style={{marginLeft:10}}>|</span>
                                </>
                            )

                        })}

                    </Spin>

                </div>

            </div>
            {!curNamespace&&(
                 <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"请先选择namespace"} />
            )}
            {curNamespace&&(<>
                <div className="nacos-content-bottom-wrap">
                <div className="namesapce-title">
                    <span>{curData?.namespaceShowName}</span><span> {curData?.namespaceId}</span>
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
            </>)}

        </ContentCard>
    </>)
}