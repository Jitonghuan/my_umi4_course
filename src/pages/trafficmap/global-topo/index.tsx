/*
 * @Author: shixia.ds
 * @Date: 2021-11-17 16:07:16
 * @Description: 全局拓扑页面
 */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Form, Select, Button, DatePicker, message, Switch } from 'antd';
import { PlusCircleOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';
import moment from 'moment';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import Topo from './Topo';
import DragWrapper from './_component/DragWrapper';
import RedLineModal from './_component/RedLineModal';
import { IAppInfo } from '../interface';
import { useEnvOptions } from '../hooks';
import { getAppMonitorInfo } from '../service';
import './index.less';

const globalTopo: React.FC = () => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const frameRef = useRef<any>();
  const [formTmpl] = Form.useForm();
  const [appInfoList, setAppInfoList] = useState<IAppInfo[]>([]);

  const [appIdList, setAppIdList] = useState<string[]>([]);
  const [isRedLineVisible, setIsRedLineVisible] = useState<boolean>(false);

  const [clickId, setClickId] = useState<string>('');
  const [selectTime, setSelectTime] = useState(moment().subtract(1, 'minutes'));
  console.log(selectTime);
  const [selectEnv, setSelectEnv] = useState('hbos-dev');
  const [isMock, setIsMock] = useState(false);
  const [envOptions] = useEnvOptions();

  const TopoRef = useRef<any>();

  useEffect(() => {
    clickId && onAppClick(clickId);
  }, [clickId]);

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

  const onAppClick = async (id: string) => {
    let appIdx = appIdList.findIndex((item: any) => item == id);
    if (appIdx == -1) {
      const idArray = appIdList;
      idArray.push(id);
      setAppIdList(idArray);
      const array: any[] = appInfoList.slice(0);
      const res = await getAppMonitorInfo({
        envCode: selectEnv,
        timeStart: moment().subtract(6, 'minutes').format('YYYY-MM-DD HH:mm'), //"2022-01-25 15:22",
        timeEnd: moment().subtract(1, 'minutes').format('YYYY-MM-DD HH:mm'),
        appCode: id,
      });

      const init = {
        http: {
          data: [],
          xAxis: [],
        },
      };

      const data1 = res.data.qpss.reduce(
        (acc: any, item: any) => {
          if (!acc[item.reqType]) return;
          acc[item.reqType].data.push(item.qps);
          acc[item.reqType].xAxis.push(item.time);
          return acc;
        },
        { ...init },
      );
      const requests = {
        data: [
          {
            data: data1.http.data,
            name: 'http',
            type: 'line',
            color: '#4BA2FF',
          },
        ],
        xAxis: data1.http.xAxis,
      };

      const data2 = res.data.rts.reduce(
        (acc: any, item: any) => {
          acc.rts.data.push(item.rt);
          acc.rts.xAxis.push(item.time);
          return acc;
        },
        {
          rts: {
            data: [],
            xAxis: [],
          },
        },
      );
      const averageResponseTime = {
        data: [
          {
            data: data2.rts.data,
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
        xAxis: data2.rts.xAxis,
      };

      const xAxis: any[] = [];
      const data3 = res.data.httpResps.reduce(
        (acc: any, item: any) => {
          Object.keys(acc).forEach((key) => {
            acc[key].data.push(item[key]);
          });
          xAxis.push(item.time);
          return acc;
        },
        {
          HTTP200: { data: [], type: 'line', color: '#4BA2FF', name: '200' },
          HTTP2XX: { data: [], type: 'line', color: '#5C61F3', name: '2XX' },
          HTTP3XX: { data: [], type: 'line', color: '#FFCB30', name: '3XX' },
          HTTP4XX: { data: [], type: 'line', color: '#F66A51', name: '4XX' },
          HTTP5XX: { data: [], type: 'line', color: '#DC143C', name: '5XX' },
        },
      );

      const responseCodes: any = {
        data: [],
        xAxis: xAxis,
      };
      Object.values(data3).forEach((item: any) => {
        responseCodes.data.push(item);
      });

      array.push({
        id: id,
        name: 'app:' + id,
        chartData: {
          requests,
          averageResponseTime,
          responseCodes,
        },
      });

      setAppInfoList(array);
    } else {
      message.info('窗口已经存在');
    }
  };

  const onNodeClick = useCallback((id: string) => {
    setClickId(id);
  }, []);

  const onRedLineClick = useCallback((id: string) => {
    console.log('redline', id);
  }, []);

  const onRedLineSelect = useCallback((record) => {
    setSelectTime(moment(record.time));
  }, []);

  return (
    <PageContainer className="global-topo">
      <FilterCard style={{ backgroundColor: '#F7F8FA' }}>
        <Form layout="inline" form={formTmpl} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Form.Item label="环境：" name="envCode">
            <Select
              options={envOptions}
              defaultValue={selectEnv}
              onChange={(env) => {
                setSelectEnv(env);
              }}
              showSearch
              style={{ width: 140 }}
            />
          </Form.Item>
          <Form.Item label="时间：" initialValue={selectTime}>
            <DatePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              value={selectTime}
              onChange={(value, dateString) => {
                setSelectTime(value || moment());
              }}
            />
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
                {isFullScreen ? '退出全屏' : '全屏查看'}
              </Button>
              使用mock数据：
              <Switch checked={isMock} onChange={setIsMock} />
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
                selectTime={selectTime}
                selectEnv={selectEnv}
                isMock={isMock}
                setIsMock={setIsMock}
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
        envCode={selectEnv}
        handleCancel={() => {
          setIsRedLineVisible(false);
        }}
        onRedLineSelect={onRedLineSelect}
      />
    </PageContainer>
  );
};

export default globalTopo;
