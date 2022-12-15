import React, { useEffect, useState } from 'react';
import PageContainer from '@/components/page-container';
import { Spin} from 'antd';
import {graphDashboard} from '../../service'
interface IProps {
  count:number
  envCode:string
}

const BoardDetail = (props: IProps) => {
  const { count,envCode } = props;
 
  const [iframeLoading, setIframeLoading] = useState<boolean>(false);
  const [url,setUrl]=useState<string>('')

  const hideSlideMenu = () => {
    document?.getElementsByTagName('iframe')?.[0]?.contentWindow?.postMessage({ showMenu: false }, '*');
    setTimeout(() => {
      setIframeLoading(true);
    }, 800);
  };

  const getClusterTopologyUrl=()=>{
    graphDashboard(envCode).then((res)=>{
      if(res?.success){
        setUrl(res?.data)

      }

    })
  }
  useEffect(()=>{
    if(envCode){
      getClusterTopologyUrl()
    }
    
  },[envCode,count])

  useEffect(() => {
    if(url){
      setIframeLoading(false);
    }
    
  }, [url]);

  
 

  return (
    <PageContainer style={{ padding: 0 }}>
      <div >
        {/* <span style={{display:"inline-block",float:"right"}}>
        <Tooltip title="请输入Ip或者Id，确认Ip或者Id的流量所在集群">
          <Tag color="#108ee9">流量模拟<QuestionCircleOutlined /></Tag>
        </Tooltip>
       <Input.Search addonBefore={selectBefore} style={{width:260}} onSearch={onSearch}></Input.Search>
        </span> */}
       
      </div>
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


