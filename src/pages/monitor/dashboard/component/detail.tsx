import React, { useState } from 'react';
import PageContainer from '@/components/page-container';
interface IProps {
  url: string;
}

const BoardDetail = (props: IProps) => {
  const { url } = props;
  const [iframeLoading, setIframeLoading] = useState<boolean>(false);

  const hideSlideMenu = () => {
    document?.getElementsByTagName('iframe')?.[0]?.contentWindow?.postMessage({ showMenu: false }, '*');
    setIframeLoading(true);
  };

  return (
    <PageContainer style={{ padding: 0 }}>
      <div style={{ width: '100%', height: '100%', display: 'block' }} className="grafana-iframe-info">
        <iframe
          className="grafana-iframe"
          id="grafana-iframe"
          name="grafana-iframe-detail"
          style={{ display: iframeLoading ? 'block' : 'none' }}
          src={url || ''}
          frameBorder="0"
          onLoad={hideSlideMenu}
        />
      </div>
    </PageContainer>
  );
};

export default BoardDetail;
