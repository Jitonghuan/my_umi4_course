import { Avatar, Divider, List, Skeleton,Collapse } from 'antd';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

interface DataType {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  nat: string;
}
const { Panel } = Collapse;
const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType[]>([]);

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    fetch('https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo')
      .then(res => res.json())
      .then(body => {
        setData([...data, ...body.results]);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
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
        hasMore={data.length < 50}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        endMessage={<Divider plain>--------已加载全部-------</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <List
          dataSource={data}
          renderItem={item => (
              <List.Item key={item.email}>
                  <Collapse  onChange={onChange} style={{width:"100%"}}>
                      <Panel header="This is panel header 1" key="1">
                          <p>{""}</p>
                      </Panel>
                      <Panel header="This is panel header 2" key="2">
                          <p>{""}</p>
                      </Panel>
                      <Panel header="This is panel header 3" key="3">
                          <p>{""}</p>
                      </Panel>
                  </Collapse>
                  {/* <List.Item.Meta
                avatar={<Avatar src={item.picture.large} />}
                title={<a href="https://ant.design">{item.name.last}</a>}
                description={item.email}
              />
              <div>Content</div> */}
              </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  );
};

export default App;