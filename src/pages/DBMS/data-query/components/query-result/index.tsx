import React, { useState, useEffect, forwardRef, useCallback, useMemo, useRef, useImperativeHandle } from 'react';
import { Tabs, Card, Table } from 'antd';
import { createTableColumns } from './schema';
import { useQueryLogsList } from '../../../common-hook';
import './index.less'
interface Iprops {
  sqlResult: any;
  errorMsg: string;
  sqlLoading: boolean;
  formRef: any;
  costTime: string;
  sqlConsoleActiveKey:string;
  sqlConsoleItems:any;
  nextKey:string;
  queryTableFields: (params: any) => any;
  copyAdd: (sqlContent: string, tableCode?: string) => any;

}
export default forwardRef(function QueryResult(props: Iprops, ref: any) {
  const { sqlResult, sqlLoading, formRef, queryTableFields,nextKey, copyAdd,sqlConsoleActiveKey, errorMsg, costTime ,sqlConsoleItems} = props;
  const [logsloading, pageInfo, logsSource, setLogsSource, setPageInfo, queryLogsList] = useQueryLogsList();

  const disabled = useRef<boolean>(false)

  const action = (value: boolean) => {
    disabled.current = value
  }

  const { TabPane } = Tabs;
  const columns = useMemo(() => {
    return createTableColumns(
      {
        disabled: disabled.current,


        onCopy: (record, index) => {

          action(true)

          if (formRef) {

            formRef.current.setFieldsValue({
              ...record
            })
            queryTableFields({
              ...record
            })
          }

          copyAdd(record?.sqlContent, record?.tableCode)
        },

      }
    ) as any;
  }, [
    disabled.current
  ]
  )

  const sqlResultSource = sqlResult ? JSON.parse(sqlResult || "{}") : []
  useImperativeHandle(ref, () => ({
    addQueryResult: () => { add() },
    queryResultItems: items,
    queryResultActiveKey: activeKey,
    action: (value: boolean) => action(value)
  }))
  useEffect(() => {
    queryLogsList()
  }, [])
  useEffect(() => {
    // if (logsSource?.length > 0) {
    setActiveKey(initialItems[0].key)
    setItems(initialItems)

    // }

  },
    [logsSource, logsloading, pageInfo, disabled.current])
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
      children: <div>
        <Table
          columns={columns}
          dataSource={logsSource}
          loading={logsloading}
          scroll={{ x: '100%' }}
          bordered
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
  function findValue(arr:any, checkKey:string, value:any){
    let Tvalue = null;
     // 如果是初始值的1和1，返回该对象，可以新增
    if( arr.length===1&&arr[0][checkKey]==="1"&& value==="1"){
      debugger
         
         
         Tvalue = arr[0];
         // 如果不是初始值的1和1，且能匹配到key值，则不可以新增，返回null
     }
     if(arr.length>1){
       let newArr=arr.slice(0)
      // newArr.splice(0,1)
       let  result= newArr .findIndex((item:any) => {
        return item.key ===  value;//return v.id ===  '9'  返回-1
      });
      console.log("result",result,value)
      if(result!==-1){
        Tvalue =  null; 
      }else{
        Tvalue = arr[0];
      }
    
     }
  
    return Tvalue;
}
  const add =() => {
   
    const newPanes = [...items];
    console.log("----queryResultItems----",newPanes,"---sqlConsoleItems--",sqlConsoleItems)
    console.log("nextKey",nextKey)
     let Tvalue=findValue(newPanes,"key",sqlConsoleActiveKey==="1"?sqlConsoleActiveKey:nextKey)
     if(Tvalue){
       debugger
       const newActiveKey = `newTab${newTabIndex.current++}`;
      newPanes.push(
        {
          label: '查询结果', children:
            errorMsg ? <div>
  
              <Card title="Error" size="small">
                <p>{errorMsg}</p>
              </Card>
  
            </div> :
              <div>
                <p style={{ paddingLeft: 10 }}>查询时间：{`${costTime} sec`}</p>
                <Table dataSource={sqlResultSource} loading={logsloading} bordered scroll={{ x: '100%' }} >
                  {sqlResultSource?.length > 0 && (
                    Object.keys(sqlResultSource[0])?.map((item: any) => {
                      return (
                        <Table.Column title={item} dataIndex={item} key={item} />
                      )
                    })
  
                  )}
                </Table>
              </div>, key: newActiveKey, closable: true,
        });
       setItems(newPanes);
       setActiveKey(newActiveKey);
       
     }else{
      setItems(newPanes);
      setActiveKey(activeKey);
     }
   
    
    
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

  return (
    <div style={{ paddingBottom: 38 }}>
      <Tabs
        size="small"
        hideAdd
        onChange={onChange}
        activeKey={activeKey}
        type="editable-card"
        className="query-result-tabs"
        onEdit={onEdit}
        // items={items}
        tabBarExtraContent={
          <div className="tabs-extra">
            {activeKey === "1" && <a onClick={() => {
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
    </div>
  )
})