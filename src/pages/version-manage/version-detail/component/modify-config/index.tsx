import React, { useMemo, useState,useEffect } from 'react';
import { Input, Button, Table, Space, Tooltip,Spin,Tag,Pagination } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import AceEditor from '@/components/ace-editor';
import { debounce } from 'lodash';
interface Iprops{
    dataSource:any;
    originData:any;
    infoLoading:boolean
    setDataSource:any

}


export default function ModifyConfig(props:Iprops) {
    const [data, setData] = useState<any>([]);
    const {dataSource,originData,infoLoading,setDataSource}=props;
    const [visible, setVisible] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('')
    const [pageTotal, setPageTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(2);
  const [total,setTotal]=useState<number>(0)
  const [modalData, setModalData] = useState<any>([]);
    const columns = [
        {
            title: '所属应用',
            dataIndex: 'id',
            width: 120,
        },
        {
            title: '变更配置内容',
            dataIndex: 'id',
        },
    ]
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
                sum= sum+item?.configInfo;
                if (Object.keys(item?.config)?.length > 0) {

                    for (const key in item?.config) {
                        if (Object.prototype.hasOwnProperty.call(item?.config, key)) {
                            const element = item?.config[key];
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
            setPageTotal(sum)
            setModalData(data)



        }else{
            setTotal(0)
            setModalData([])
            setPageTotal(0)

        }


    },[JSON.stringify(dataSource)])
    //触发分页
  const pageSizeClick = (page: number, pageSize: number) => {
    let obj = {
      pageIndex: page,
      pageSize: pageSize,
    };
    setPageSize(pageSize);
  };

    return (
        <>
            <div className='table-top'>
                <div className='flex-space-between'>
                    <Space>
                        <span>配置总数：{total}</span>
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
                                        
                                        <span><label>版本号：</label><Tag color="pink">{item?.label}</Tag></span>
                                       <span> <label>应用CODE：</label><Tag  color="green">{item?.appCode}</Tag></span>

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

                  {total > 2 && (
                    <div className={`pagination-wrap`}>
                      <Pagination
                        pageSize={pageSize}
                        total={total}
                        // current={pageIndex}
                        // showSizeChanger={false}
                        // onShowSizeChange={(_, next) => {
                        //   setPageIndex(1);
                        //   setPageSize(next);
                        // }}

                        onChange={pageSizeClick}
                      />
                    </div>
                  )}
        </>
    )
}