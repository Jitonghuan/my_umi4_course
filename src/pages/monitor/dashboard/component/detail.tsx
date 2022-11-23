import React, { useState, useEffect } from 'react'
import PageContainer from '@/components/page-container';
interface IProps {
  url: string;
}

const BoardDetail = (props: IProps) => {
  const { url } = props;

  const hideSlideMenu = () => {
    document?.getElementsByTagName("iframe")?.[0]?.contentWindow?.postMessage({ showMenu: false }, '*')
  }


  return (
    <PageContainer>
      <div style={{ width: '100%', height: '100%', display: 'block' }} className="grafana-iframe-info">
        <iframe
          className='grafana-iframe'
          id='grafana-iframe'
          name="grafana-iframe-detail"
          src={url || ''}
          frameBorder="0"
          onLoad={hideSlideMenu}
        />
      </div>
    </PageContainer>
  )
}

export default BoardDetail
