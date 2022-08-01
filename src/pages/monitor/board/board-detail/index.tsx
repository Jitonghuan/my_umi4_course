import React, { useState, useEffect } from 'react'
import PageContainer from '@/components/page-container';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { history } from 'umi';
import './index.less'

interface BoardInfo {
  graphName: string;
  url: string;
}

const BoardDetail = () => {
  const [info, setInfo] = useState<BoardInfo | undefined>()
  useEffect(() => {
    const { location } = history;
    const { query } = location;
    const { graphName, url } = query as any;

    console.log(query);
    setInfo({
      graphName, url
    })
  }, [])

  return (
    <PageContainer>
      <div style={{ backgroundColor: 'white', padding: '10px 10px 10px 10px', display: 'flex', alignItems: 'center' }}>
        <Button type='link' onClick={() => { history.push('/matrix/monitor/panel') }}>
          <LeftOutlined /> 返回
        </Button>
        <div>
          {info?.graphName}
        </div>
      </div >
      <div style={{ width: '100%', height: '100%', display: 'block' }}>
        <iframe className='grafana-iframe' src={'https://grafana.seenew.info/d/232HBsRVz/test1'} />
      </div>
    </PageContainer>
  )
}

export default BoardDetail
