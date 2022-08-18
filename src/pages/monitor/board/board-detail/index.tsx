import React, { useState, useEffect } from 'react'
import PageContainer from '@/components/page-container';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { history,useLocation } from 'umi';
import { parse } from 'query-string';
import './index.less'

interface BoardInfo {
  graphName: string;
  graphUrl: string;
  clusterName: string | undefined;
}

const BoardDetail = () => {
  let location:any = useLocation();
  const query :any= parse(location.search);
  const [info, setInfo] = useState<BoardInfo | undefined>();
  // const { location } = history;
  // const { query } = location;
  const { graphName, url, fromPage, clusterName } = query as any;
  useEffect(() => {
    let graphUrl = '';
    if (url) {
      graphUrl = `${url}?kiosk=tv`
    }
    setInfo({
      graphName, graphUrl, clusterName
    })
  }, [])

  return (
    <PageContainer>
      <div style={{ backgroundColor: 'white', padding: '10px 10px 10px 10px', display: 'flex', alignItems: 'center' }}>
        <Button type='link' onClick={() => {
          if (fromPage === 'business') {
            history.push('/matrix/monitor/business')
          } else {
            history.push('/matrix/monitor/panel')
          }
        }}>
          <LeftOutlined /> 返回
        </Button>
        <div>
          {info?.clusterName && (
            <div>所属集群：{info.clusterName}</div>
          )}
        </div>
      </div >
      <div style={{ width: '100%', height: '100%', display: 'block' }}>
        <iframe className='grafana-iframe' src={info?.graphUrl || ''} />
      </div>
    </PageContainer>
  )
}

export default BoardDetail
