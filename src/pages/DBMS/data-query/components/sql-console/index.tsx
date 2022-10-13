import React, { useState,useEffect,Component,useMemo,useRef,forwardRef,useImperativeHandle,useCallback} from 'react';
import {  Tabs,Form,Space,Button,Select,message } from 'antd';
import MonacoSqlEditor from '@/components/monaco-sql-editor';
import './index.less'
interface Iprops{
  tableFields:any;
  querySqlResult:(params:{sqlContent:string,sqlType:string})=>any
  sqlLoading:boolean;
  initSqlValue:string;
  firstInitSqlValue:string;
  implementDisabled:boolean
}
export default  forwardRef(function SqlConsole(props:Iprops,ref:any){
  const {tableFields,querySqlResult,initSqlValue,firstInitSqlValue,implementDisabled}=props
    const { TabPane } = Tabs;
    useImperativeHandle(ref, () => ({
        addSqlConsole: add,
        sqlConsoleItems:items,
        sqlConsoleActiveKey:activeKey
        


    }))
    useEffect(()=>{
      if(firstInitSqlValue){
       
        setActiveKey(defaultPanes[0].key)
        setItems(defaultPanes)

      }

    },[firstInitSqlValue])

    const defaultPanes =
      new Array(1).fill(null).map((_, index) => {
        const id = String(index + 1);
        console.log("接收默认",firstInitSqlValue)
        return { label: `SQL console `, 
        children: 
        <MonacoSqlEditor 
        isSqlExecuteBtn={true} 
        isSqlBueatifyBtn={true} 
        isSqlExecutePlanBtn={true} 
        tableFields={tableFields} 
        initValue={firstInitSqlValue||"select * from user limit 10"}
        subChange={(params:{sqlContent:string,sqlType:string})=>querySqlResult(params)}
        implementDisabled={implementDisabled}
       
        />, 
        key: id };
      });
    const [activeKey, setActiveKey] = useState(defaultPanes[0].key);
    const [items, setItems] = useState(defaultPanes);
    const newTabIndex = useRef(0);
  
    const onChange = (key: string) => {
      setActiveKey(key);
    };
  
    const add =useMemo(() => {
      // debugger
      if(initSqlValue&&initSqlValue!==""){
        // debugger
        const newActiveKey = `newTab${newTabIndex.current++}`;
      
        let tabArry=[...items, { label: 'SQL console ', children: 'New Tab Pane', key: newActiveKey }]
        if(tabArry.length<11){
          setItems([...items, { label: 'SQL console ', children:
           <MonacoSqlEditor 
           isSqlExecuteBtn={true} 
           isSqlBueatifyBtn={true} 
           isSqlExecutePlanBtn={true} 
           tableFields={tableFields} 
           initValue={initSqlValue}
           subChange={(params:{sqlContent:string,sqlType:string})=>querySqlResult(params)}
           />, key: newActiveKey }]);
         
          setActiveKey(newActiveKey);
    
        }else if(tabArry.length>10){
          message.info("您已经打开太多页面，请关闭一些吧！")
    
        }

      }
     
    },[initSqlValue])
  
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
        add;
      } else {
        remove(targetKey);
      }
    };
    
    return(
        <Tabs
        size="small"
        // animated={{ inkBar: true, tabPane: false }}
         hideAdd
         onChange={onChange}
         activeKey={activeKey}
        //  tabPosition="top"
         type="editable-card"
         className="sql-console-tabs"
         onEdit={onEdit}
        
         // items={items}
       >
        {items?.map((item: any) => (
         <TabPane tab={item.label} key={item.key} >
           {item.children}
         </TabPane>
         ))}
         </Tabs>

    )
})