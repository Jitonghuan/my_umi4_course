import React, { useEffect, useState } from 'react';
import PageContainer from '@/components/page-container';
import { Spin, Input, Select, Tag, Tooltip, Modal } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { getCurrentDistrictInfo } from '../service';
interface IProps {
  url: string;
}
const { Option } = Select;
const BoardDetail = (props: IProps) => {
  const { url } = props;
  const [infoType, setInfoType] = useState<string>('ip');
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
  const onSelect = (value: string) => {
    setInfoType(value);
  };
  const selectBefore = (
    <Select defaultValue="ip" className="select-before" onChange={onSelect}>
      <Option value="ip">IP</Option>
      <Option value="id">ID</Option>
    </Select>
  );

  const onSearch = (value: string) => {
    getCurrentDistrictInfo({
      infoType,
      key: value,
    }).then((res) => {
      if (res?.success) {
        Modal.info({
          title: res?.data || '',
          content: (
            <div>
              {/* <p>some messages...some messages...</p>
              <p>some messages...some messages...</p> */}
            </div>
          ),
          onOk() {},
        });
      }
    });
  };

  return (
    <PageContainer style={{ padding: 0 }}>
      {/* <div >
        <span style={{display:"inline-block",float:"right"}}>
        <Tooltip title="请输入Ip或者Id，确认Ip或者Id的流量所在集群">
          <Tag color="#108ee9">流量模拟<QuestionCircleOutlined /></Tag>
        </Tooltip>
       <Input.Search addonBefore={selectBefore} style={{width:260}} onSearch={onSearch}></Input.Search>
        </span>

      </div> */}
      <div
        style={{ width: '100%', height: '100%', display: 'block', paddingBottom: '100px' }}
        className="grafana-iframe-info"
      >
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
