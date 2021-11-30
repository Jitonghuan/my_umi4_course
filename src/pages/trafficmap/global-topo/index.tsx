/*
 * @Author: shixia.ds
 * @Date: 2021-11-17 16:07:16
 * @Description:
 */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Form, Modal, Select, Button, DatePicker, List } from 'antd';
import { PlusCircleOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import Topo from './Topo';
import DragWrapper from './_component/DragWrapper';
import './index.less';
import * as echarts from 'echarts';
import RedLineModal from './_component/RedLineModal';

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
interface IAppInfo {
  id: string;
  name: string;
  chartData: {
    requests: {
      data: IChartData[];
      xAxis: string[];
    };
    averageResponseTime: {
      data: IChartData[];
      xAxis: string[];
    };
    responseCodes: {
      data: IChartData[];
      xAxis: string[];
    };
  };
}
interface IChartData {
  data: string[];
  name: string;
  type: string;
}

const globalTopo = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [envDatas, setEnvDatas] = useState<any[]>([]); //环境
  const [number, setNumber] = useState([1, 2]);
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

  const [isRedLineVisible, setIsRedLineVisible] = useState(false);
  const [redLineList, setRedLineList] = useState<any[]>(['1', '2']);
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

  const deleteModal = (app: IAppInfo) => {
    console.log(app);
    const idx = appInfoList.findIndex((item) => item.id == app.id);
    if (idx !== -1) {
      let newAppInfoList = JSON.parse(JSON.stringify(appInfoList));
      newAppInfoList.splice(idx, 1);
      setAppInfoList(newAppInfoList);
    }
  };

  const onAppClick = (id: string) => {
    console.log('id', id);
  };

  const onRedLineClick = (id: string) => {
    console.log('redline', id);
  };

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
          <section style={{ marginBottom: '10px' }} id="topo-box" className="topo-box" ref={frameRef}>
            <div className="content-header">
              <h3>浙一生产环境</h3>
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
            <div className="graph-box" style={{ position: 'relative' }}>
              <DragWrapper number={number} appInfoList={appInfoList} deleteModal={deleteModal} />
              <Topo isFullScreen={isFullScreen} onAppClick={onAppClick} onRedLineClick={onRedLineClick} />
            </div>
          </section>
        </ContentCard>
      </div>
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
