import React, { useEffect, useState } from 'react';
import PageContainer from '@/components/page-container';
import { Spin } from 'antd';
interface IProps {
  url: string;
}

const BoardDetail = (props: IProps) => {
  const { url } = props;
  const [iframeLoading, setIframeLoading] = useState<boolean>(false);

  const hideSlideMenu = () => {
    document?.getElementsByTagName('iframe')?.[0]?.contentWindow?.postMessage({ showMenu: false }, '*');
    setTimeout(() => {
      setIframeLoading(true);
    }, 800);
  };

  useEffect(() => {
    setIframeLoading(false);
  }, [url]);

  return (
    <PageContainer style={{ padding: 0 }}>
      <div style={{ width: '100%', height: '100%', display: 'block' }} className="grafana-iframe-info">
        <Spin spinning={!iframeLoading} />
        <iframe
          className="grafana-iframe"
          id="grafana-iframe"
          name="grafana-iframe-detail"
          style={{ visibility: iframeLoading ? 'initial' : 'hidden' }}
          src={url || ''}
          frameBorder="0"
          onLoad={hideSlideMenu}
        />
      </div>
    </PageContainer>
  );
};

export default BoardDetail;
