import { Avatar, Divider, List, Space,Collapse,Button } from 'antd';
import React, { useEffect, useState,useContext } from 'react';
import DetailContext from '../context';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useGetSqlDdlInfo} from '../hook'
import PanelDetail from './panel-detail'
import PageContainer from '@/components/page-container';
import { history, useLocation } from 'umi';
import { parse, stringify } from 'query-string';
import './index.less'

interface DataType {
  id: number,
  title: string,
  remark: string,
  userSsoName: string,
  userName: string,
  currentStatus:string,
  startTime: string,
  endTime: string,
  envCode: string,
  instanceId: number,
  instanceName: string,
  dbCode: string,
  runStartTime: string,
  runEndTime: string,
  syntaxType: string,
  sqlWfType:string,
  execTime: string,
  currentStatusDesc:string,
  allowTiming: boolean,
  parentWfId: number,
  envType: string
}
const { Panel } = Collapse;
const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType[]>([]);
  const { tabKey ,changeTabKey,parentWfId} = useContext(DetailContext);
  const [activePanel, setActivePanel] = useState<any>(undefined);
   const [count,setCount]=useState<number>(0)
  const [refreshKey,setRefreshKey]=useState<number>()
  let location = useLocation();
  const query = parse(location.search);
  useEffect(()=>{
    if(query?.curId&&query?.entry==="DDL"){
      setRefreshKey(Number(query?.curId))
      setActivePanel(Number(query?.curId))
     // setCount

    }

    
    
  },[])

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    //@ts-ignore
    useGetSqlDdlInfo({parentWfId:parentWfId,envType:tabKey}).then((data)=>{
      setData(data)

    }).finally(()=>{
      setLoading(false);
    })
  };

  useEffect(() => {
    if(parentWfId&&tabKey){
      loadMoreData();
    }
    return()=>{
      //setRefreshKey("")
    }

  }, []);
  const onChange = (key: any ) => {
    if (key) {
      
      setActivePanel(key)
    }else {
      setActivePanel('')
    }
  };

  return (
<PageContainer style={{margin:0}} className="content-detail">
      {/* {data.length>0?<>
      </>:<Empty/>} */}
    <div
      id="scrollableDiv"
      style={{
        overflow: 'auto',
        display: "flex",
        flexDirection: "column", 
        height: "100%"
      }}
    >
      <InfiniteScroll
        dataLength={data.length}
        next={loadMoreData}
        hasMore={data.length < 500}
        loader={false}
        endMessage={<Divider plain>--------已加载全部-------</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <List
          dataSource={data}
          loading={loading}
          renderItem={item => (
              <List.Item key={item.id}>
                  <Collapse  accordion activeKey={activePanel}  onChange={onChange} style={{width:"100%"}}  bordered={false}>
                      <Panel   header={<Space size="large"><span>工单号：{item?.id}</span><span>实例名：{item?.instanceName}</span></Space>} key={item.id} extra={<Button type="primary" onClick={(e)=>{
                       
                        e.stopPropagation();
                         setCount(count=>count+1)
                       
                        setRefreshKey(item.id)
                      }}>刷新</Button>}>
                         <div style={{height:"100%"}}>
                         <PanelDetail parentWfId={item.id} refreshKey={refreshKey} count={count}  tabKey={tabKey||""}/>
                           </div>
                      </Panel>
                     
                  </Collapse>
                 
              </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
    </PageContainer>
  );
};

export default App;