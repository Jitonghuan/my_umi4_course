import React, { useMemo, useState,useEffect } from 'react';
import { Input, Button, Table, Space, Tooltip,Spin,Tag } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import AceEditor from '@/components/ace-editor';
import { debounce } from 'lodash';
import './index.less'
interface Iprops{
    dataSource:any;
    originData:any;
    infoLoading:boolean
    setDataSource:any;

}

export default function ModifySql(props:Iprops) {
    const {dataSource,originData,infoLoading,setDataSource}=props;
    const [total,setTotal]=useState<number>(0)
    const [modalData, setModalData] = useState<any>([]);
    const filter = debounce((value) => filterData(value), 500)

    const filterData = (value: string) => {
        if (!value) {
            setDataSource(originData);
            return;
        }
        const data = JSON.parse(JSON.stringify(dataSource));
        const afterFilter: any = [];
        data?.forEach((item: any) => {
            if (item.appCode?.indexOf(value) !== -1) {
                afterFilter.push(item);
            }
        });

        setDataSource(afterFilter);
    }
    useEffect(()=>{
        if(dataSource?.length>0){
            let sum=0
            let data:any=[]
            dataSource?.map((item:any)=>{
                sum= sum+item?.sqlInfo;
                if (Object.keys(item?.sql)?.length > 0) {

                    for (const key in item?.sql) {
                        if (Object.prototype.hasOwnProperty.call(item?.sql, key)) {
                            const element = item?.sql[key];
                            data.push({
                                label: key,
                                value: element,
                                appCode:item?.appCode
                            })
        
                        }
                    }
        
                }
               


            })
            setTotal(sum)
            setModalData(data)



        }else{
            setTotal(0)
            setModalData([])

        }


    },[JSON.stringify(dataSource)])
    
    
    // const columns = [
    //     {
    //         title: '所属应用',
    //         dataIndex: 'id',
    //         width: 120,
    //     },
    //     {
    //         title: 'SQL内容',
    //         dataIndex: 'id',
    //     },
    // ]
    return (
        <>
            <div className='table-top'>
                <div className='flex-space-between'>
                    <Space>
                        <span>SQL总数：{total}</span>
                    </Space>
                    <div>
                        <Tooltip title='请根据应用CODE进行搜索 ' placement="top">
                            <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
                        </Tooltip>
                        搜索：
                        <input
                            style={{ width: 200 }}
                            placeholder='输入内容进行查询过滤'
                            className="ant-input ant-input-sm"
                            onChange={(e) => {
                                  filter(e.target.value)
                            }}
                        ></input>
                    </div>
                </div>
            </div>

            <div className="sql-content">
                <Spin spinning={infoLoading}>
                {modalData?.map((item:any)=>{
                          return(
                              <div style={{marginTop:10}}>
                                    <p className="version-title-content">
                                        <Space size="large">
                                       <span> <span>版本号：</span><Tag color="pink">{item?.label}</Tag></span>
                                       <span> <span>应用CODE：</span><Tag color="green">{item?.appCode}</Tag></span>

                                        </Space>
                                        
                                        </p>
                                   <div>
                                   <AceEditor mode="sql" defaultValue={item?.value} height={200} readOnly />

                                   </div>
                                   {/* <Divider /> */}
                              </div>
                          )

                      })}

                </Spin>
                    
                  </div>
                {/* </div> */}
            {/* <Table
                dataSource={[]}
                // loading={loading || updateLoading}
                bordered
                rowKey="id"
                // pagination={{
                //     pageSize: pageSize,
                //     total: total,
                //     current: pageIndex,
                //     showSizeChanger: true,
                //     onShowSizeChange: (_, next) => {
                //         setPageIndex(1);
                //         setPageSize(next);
                //     },
                //     onChange: (next) => {
                //         setPageIndex(next)
                //     }
                // }}
                pagination={false}
                columns={columns}
            ></Table> */}
        </>
    )
}