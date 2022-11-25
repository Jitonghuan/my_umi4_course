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
  const [iframeLoading, setIframeLoading] = useState<boolean>(false)
  // const { location } = history;
  // const { query } = location;
  const { graphName, url, fromPage, clusterName } = query as any;
  useEffect(() => {
    let graphUrl = '';
    if (url) {
      graphUrl = `${url}?kiosk=full`
    }
    setInfo({
      graphName, graphUrl, clusterName
    })
  }, [])

  const hideSlideMenu = () => {
    document?.getElementsByTagName("iframe")?.[0]?.contentWindow?.postMessage({ showMenu: false }, '*')
    setIframeLoading(true)
  }


  return (
    <PageContainer>
      <div style={{ backgroundColor: 'white', padding: '10px 10px 10px 10px', display: 'flex', alignItems: 'center' }}>
        <Button type='link' onClick={() => {
          if (fromPage === 'business') {
            history.push('/matrix/monitor/business')
          } else  if(fromPage==="network-dail"){
            history.push('/matrix/monitor/network-dail')
          }else{
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
      <div style={{ width: '100%', height: '100%', display: 'block' }} className="grafana-iframe-info">
        <iframe
          style={{ display: iframeLoading ? 'block' : 'none' }}
          className='grafana-iframe'
          id='grafana-iframe'
          name="grafana-iframe-detail"
          src={info?.graphUrl || ''}
          onLoad={hideSlideMenu}
        />
      </div>
    </PageContainer>
  )
}

export default BoardDetail
