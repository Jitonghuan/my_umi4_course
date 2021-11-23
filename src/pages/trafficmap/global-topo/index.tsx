/*
 * @Author: shixia.ds
 * @Date: 2021-11-17 16:07:16
 * @Description:
 */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Form, Input, Select, Button, DatePicker } from 'antd';
import { PlusCircleOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import Topo from './Topo';
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

  const frameRef = useRef<any>();
  const [formTmpl] = Form.useForm();

  useEffect(() => {}, []);

  const handleFullScreen = useCallback(() => {
    if (isFullScreen) {
      setIsFullScreen(false);
      document.exitFullscreen();
    } else {
      setIsFullScreen(true);
      frameRef.current?.requestFullscreen();
    }
  }, [isFullScreen]);

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
      <div style={{ height: '100%' }} ref={frameRef}>
        <ContentCard>
          <section style={{ marginBottom: '10px' }} id="topo-box" ref={frameRef}>
            <div className="content-header">
              <h3>浙一生产环境</h3>
              <div className="action-bar">
                <Button type="default" icon={<PlusCircleOutlined />}>
                  红线追踪
                </Button>
                <Button type="default" icon={<PlusCircleOutlined />}>
                  全部展开
                </Button>
                <Button
                  type="default"
                  icon={isFullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                  onClick={handleFullScreen}
                >
                  全屏查看
                </Button>
              </div>
            </div>
            <div className="graph-box">
              <Topo />
            </div>
          </section>
        </ContentCard>
      </div>
    </PageContainer>
  );
};

export default globalTopo;
