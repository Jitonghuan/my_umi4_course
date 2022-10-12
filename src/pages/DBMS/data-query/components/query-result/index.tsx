import React, { useState,useEffect,forwardRef,Component,useMemo,useRef,useImperativeHandle} from 'react';
import {  Tabs,Form,Space,Button,Select,message,Table } from 'antd';
import {createTableColumns} from './schema';
import {useQueryLogsList} from '../../../common-hook';
import './index.less'
interface Iprops{
  sqlResult:any;
  
  sqlLoading:boolean;
  
}
export default forwardRef(function QueryResult(props:Iprops,ref:any){
  const [logsloading, pageInfo, logsSource, setLogsSource, setPageInfo, queryLogsList] = useQueryLogsList();
  const {sqlResult,sqlLoading}=props;
  
    const { TabPane } = Tabs;
    const columns = useMemo(() => {
      return createTableColumns() as any;
    }, []);
   
    const sqlResultSource=sqlResult?JSON.parse(sqlResult||"{}"):[]
   
  
    // useEffect(()=>{
    //   if(sqlResultSource?.length>0){
    //     setActiveKey(initialItems[0].key)
    //     setItems(initialItems)

    //   }

    // },
    // [sqlResultSource,sqlLoading,])
   
    useImperativeHandle(ref, () => ({
        addQueryResult: () => {add()},
        queryResultItems:items,
        queryResultActiveKey:activeKey
        


    }))
    useEffect(()=>{
      queryLogsList()
    },[])
    useEffect(()=>{
      if(logsSource?.length>0){
        setActiveKey(initialItems[0].key)
        setItems(initialItems)

      }

    },
    [logsSource,logsloading,pageInfo])
    const pageSizeClick = (pagination: any) => {
      setPageInfo({
        pageIndex: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
      });
      let obj = {
        pageIndex: pagination.current,
        pageSize: pagination.pageSize,
      };
  
      queryLogsList({ ...obj });
    };

    const initialItems = [
      
        {
          label: '查询历史',
          children:  <div>
            <Table 
            columns={columns} 
            dataSource={logsSource} 
            loading={logsloading}  
            pagination={{
            current: pageInfo.pageIndex,
            total: pageInfo.total,
            pageSize: pageInfo.pageSize,
            showSizeChanger: true,
            showTotal: () => `总共 ${pageInfo.total} 条数据`,
            }}
            onChange={pageSizeClick}
          />
        
          </div>,
          key: '1',
          closable: false,
        },
      ];
    const [activeKey, setActiveKey] = useState(initialItems[0].key);
    const [items, setItems] = useState(initialItems);
    const newTabIndex = useRef(0);
  
    const onChange = (key: string) => {
      setActiveKey(key);
    };
   
    const add = () => {
        const newActiveKey = `newTab${newTabIndex.current++}`;
        const newPanes = [...items];
        newPanes.push(
          { label: '查询结果', children: <div>
        <Table dataSource={sqlResultSource} loading={sqlLoading}   scroll={{ x: '100%' }} >
          {sqlResultSource?.length>0&&(
            Object.keys(sqlResultSource[0])?.map((item:any)=>{
              return(
                <Table.Column title={item} dataIndex={item}   key={item}  />
              )
            })

          )}
        </Table>
      </div>, key: newActiveKey,closable: true, });
        setItems(newPanes);
        setActiveKey(newActiveKey);
    //     let length=newPanes.length;
    //       if(length<11){
    //         setItems(newPanes);
    //         setActiveKey(newActiveKey);
    //     }else if(length>10){
    //     message.info("您已经打开太多页面，请关闭一些吧！")
  
    //   }
       
      };
  
   
  
    const remove = (targetKey: string) => {
      const targetIndex = items.findIndex(pane => pane.key === targetKey);
      const newPanes = items.filter(pane => pane.key !== targetKey);
      if (newPanes.length && targetKey === activeKey) {
        const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
        setActiveKey(key);
      }
      setItems(newPanes);
    };
  
    const onEdit = (targetKey: any, action: 'add' | 'remove') => {
      if (action === 'add') {
        add();
      } else {
        remove(targetKey);
      }
    };
    
    return(
        <Tabs
        size="small"
         hideAdd
         onChange={onChange}
         activeKey={activeKey}
         type="editable-card"
         onEdit={onEdit}
         // items={items}
         tabBarExtraContent={
          <div className="tabs-extra">
          {activeKey==="1"&& <a onClick={()=>{
             queryLogsList()
            }}>刷新历史</a>} 
            </div>}
       >
        {items?.map((item: any) => (
         <TabPane tab={item.label} key={item.key} closable={item?.closable} >
           {item.children}
         </TabPane>
         ))}
         </Tabs>

    )
})