import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Select, Button, DatePicker, Space, Popconfirm, message, Tag } from 'antd';
import { PlusCircleOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import { getRequest, delRequest } from '@/utils/request';
import { history } from 'umi';
import { addAPIPrefix } from '@/utils';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import './index.less';
export interface Item {
  id: string;
  templateName: string;
  templateCode: string;
  appCode: string;
  appVsersion: string;
  envCode: string;
  status?: number;
}

const globalTopo = () => {
  const [loading, setLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境

  const [formTmpl] = Form.useForm();

  type statusTypeItem = {
    tagText: string;
    buttonText: string;
    color: string;
    status: number;
  };

  useEffect(() => {}, []);

  return (
    <PageContainer className="global-topo">
      <FilterCard>
        <Form layout="inline" form={formTmpl} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Form.Item label="环境：" name="envCode">
            <Select options={envDatas} allowClear onChange={(n) => {}} showSearch style={{ width: 140 }} />
          </Form.Item>
          <Form.Item label="时间：" name="templateType">
            <DatePicker />
          </Form.Item>
        </Form>
      </FilterCard>
      <ContentCard>
        <div style={{ marginBottom: '10px' }} id="topo-box">
          <section className="content-header">
            <h3>浙一生产环境</h3>
            <div className="action-bar">
              <Button type="default" icon={<PlusCircleOutlined />}>
                红线追踪
              </Button>
              <Button type="default" icon={<PlusCircleOutlined />}>
                全部展开
              </Button>
              <Button type="default" icon={isFullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}>
                全屏查看
              </Button>
            </div>
          </section>
          <section className="graph-box"></section>
        </div>
      </ContentCard>
    </PageContainer>
  );
};

export default globalTopo;
