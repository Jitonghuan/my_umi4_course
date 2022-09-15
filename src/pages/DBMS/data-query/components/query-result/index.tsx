import React, { useState,useEffect,forwardRef,Component,useMemo,useRef,useImperativeHandle} from 'react';
import {  Tabs,Form,Space,Button,Select,message,Table } from 'antd';
export default forwardRef(function QueryResult(props:any,ref:any){
    const { TabPane } = Tabs;
    useImperativeHandle(ref, () => ({
        addQueryResult: () => {add()},
        queryResultItems:items,
        queryResultActiveKey:activeKey
        


    }))

    const initialItems = [
      
        {
          label: '查询历史',
          children:  <div>
            <Table></Table>
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
        newPanes.push({ label: '查询结果', children: 'Content of new Tab', key: newActiveKey,closable: true, });
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
       >
        {items?.map((item: any) => (
         <TabPane tab={item.label} key={item.key} closable={item?.closable} >
           {item.children}
         </TabPane>
         ))}
         </Tabs>

    )
})