/*
 * @Author: shixia.ds
 * @Date: 2021-11-17 16:07:16
 * @Description: 全局拓扑页面
 */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Form, Select, Button, DatePicker, message } from 'antd';
import { PlusCircleOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import Topo from './Topo';
import DragWrapper from './_component/DragWrapper';
import RedLineModal from './_component/RedLineModal';
import { IAppInfo } from '../interface';
import './index.less';

const dataDemo = {
  requests: {
    data: [
      {
        data: ['9', '9', '9', '9', '9', '9', '9'],
        name: 'http',
        type: 'line',
      },
      {
        data: ['10', '10', '10', '10', '10', '10', '10'],
        name: 'dubbo',
        type: 'line',
      },
    ],
    xAxis: ['2021-10-24', '2021-10-31', '2021-11-07', '2021-11-14', '2021-11-21', '2021-11-28', '2021-11-29'],
  },
  averageResponseTime: {
    data: [
      {
        data: ['9', '9', '9', '9', '9', '9', '9'],
        name: 'hbos/hbos-osc',
        type: 'line',
        color: 'rgba(101,159,235,1)',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(101,159,235,0.2)',
            },
            {
              offset: 1,
              color: 'rgba(101,159,235,0)',
            },
          ]),
        },
      },
    ],
    xAxis: ['2021-10-24', '2021-10-31', '2021-11-07', '2021-11-14', '2021-11-21', '2021-11-28', '2021-11-29'],
  },
  responseCodes: {
    data: [
      {
        data: ['9', '9', '9', '9', '9', '9', '9'],
        name: '200',
        type: 'line',
      },
      {
        data: ['3', '4', '5', '7', '9', '3', '1'],
        name: '300',
        type: 'line',
      },
      {
        data: ['6', '7', '8', '9', '4', '3', '5'],
        name: '400',
        type: 'line',
      },

      {
        data: ['4', '5', '3', '3', '3', '6', '2'],
        name: '500',
        type: 'line',
      },
    ],
    xAxis: ['2021-10-24', '2021-10-31', '2021-11-07', '2021-11-14', '2021-11-21', '2021-11-28', '2021-11-29'],
  },
};

const globalTopo: React.FC = () => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const frameRef = useRef<any>();
  const [formTmpl] = Form.useForm();
  const [appInfoList, setAppInfoList] = useState<IAppInfo[]>([
    // {
    //   id: '1',
    //   name: 'app1',
    //   chartData: dataDemo,
    // },
    // {
    //   id: '2',
    //   name: 'app2',
    //   chartData: dataDemo,
    // },
  ]);

  const [appIdList, setAppIdList] = useState<string[]>([]);
  const [isRedLineVisible, setIsRedLineVisible] = useState<boolean>(false);
  const [redLineList, setRedLineList] = useState<any[]>(['1', '2']);
  const [clickId, setClickId] = useState<string>('');

  const TopoRef = useRef<any>();

  const expandAll = () => {
    TopoRef?.current?.expandAll();
  };

  const handleFullScreen = useCallback(() => {
    if (isFullScreen) {
      setIsFullScreen(false);
      document.exitFullscreen();
    } else {
      setIsFullScreen(true);
      frameRef.current?.requestFullscreen();
    }
  }, [isFullScreen]);

  const deleteModal = (app: IAppInfo) => {
    if (app.id == clickId) setClickId('');
    const idx = appInfoList.findIndex((item) => item.id == app.id);
    const idIdx = appIdList.findIndex((item) => item == app.id);
    if (idx !== -1) {
      let newAppInfoList = JSON.parse(JSON.stringify(appInfoList));
      let newAppIdList = JSON.parse(JSON.stringify(appIdList));
      newAppIdList.splice(idIdx, 1);
      newAppInfoList.splice(idx, 1);
      setAppIdList(newAppIdList);
      setAppInfoList(newAppInfoList);
    }
  };

  const onAppClick = (id: string) => {
    let appIdx = appIdList.findIndex((item: any) => item == id);
    if (appIdx == -1) {
      const idArray = appIdList;
      idArray.push(id);
      setAppIdList(idArray);

      const array = appInfoList.slice(0);
      array.push({
        id: id,
        name: 'app' + id,
        chartData: dataDemo,
      });

      setAppInfoList(array);
    } else {
      message.info('窗口已经存在');
    }
  };

  const onNodeClick = useCallback((id: string) => {
    setClickId(id);
  }, []);

  useEffect(() => {
    clickId && onAppClick(clickId);
  }, [clickId]);

  const onRedLineClick = useCallback((id: string) => {
    console.log('redline', id);
  }, []);

  return (
    <PageContainer className="global-topo">
      <FilterCard style={{ backgroundColor: '#F7F8FA' }}>
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
        <div className="topo-header">
          <div className="content-header">
            <div className="env-name">浙一生产环境</div>
            <div className="action-bar">
              <Button
                type="default"
                icon={<PlusCircleOutlined />}
                onClick={() => {
                  setIsRedLineVisible(true);
                }}
              >
                红线追踪
              </Button>
              <Button type="default" icon={<PlusCircleOutlined />} onClick={expandAll}>
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
        </div>

        <ContentCard style={{ backgroundColor: '#F7F8FA' }}>
          <div style={{ marginBottom: '10px' }} id="topo-box" className="topo-box">
            <div className="graph-box" style={{ position: 'relative' }}>
              {/**
               * DragWrapper:可拖拽弹窗组件
               * Topo:拓扑图
               */}
              <DragWrapper appInfoList={appInfoList} deleteModal={deleteModal} />
              <Topo
                // isFullScreen={isFullScreen}
                onNodeClick={onNodeClick}
                onRedLineClick={onRedLineClick}
                ref={TopoRef}
              />
            </div>
          </div>
        </ContentCard>
      </div>
      {/**
       * 红线追踪弹窗
       */}
      <RedLineModal
        visible={isRedLineVisible}
        redLineList={redLineList}
        handleCancel={() => {
          setIsRedLineVisible(false);
        }}
      />
    </PageContainer>
  );
};

export default globalTopo;
