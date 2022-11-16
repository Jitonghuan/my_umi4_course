import { Avatar, Divider, List, Skeleton,Collapse,Button } from 'antd';
import React, { useEffect, useState,useContext } from 'react';
import DetailContext from '../context';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useGetSqlDdlInfo} from '../hook'

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
    loadMoreData();
  }, []);
  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  return (
    <div
      id="scrollableDiv"
      style={{
        height: "100%",
        overflow: 'auto',
        padding: '0 16px',
        border: '1px solid rgba(140, 140, 140, 0.35)',
      }}
    >
      <InfiniteScroll
        dataLength={data.length}
        next={loadMoreData}
        hasMore={data.length < 500}
        loader={<Skeleton paragraph={{ rows: 1 }}   />}
        endMessage={<Divider plain>--------已加载全部-------</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <List
          dataSource={data}
          // locale={{
          //   emptyText: "暂无数据"
          // }}
          renderItem={item => (
              <List.Item key={item.id}>
                  <Collapse  onChange={onChange} style={{width:"100%"}}>
                      <Panel header={item?.title} key={item.id} extra={<Button>刷新</Button>}>
                          <p>{""}</p>
                      </Panel>
                    
                  </Collapse>
                 
              </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  );
};

export default App;