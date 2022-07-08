/*
 * @Author: shixia.ds
 * @Date: 2021-11-17 16:07:16
 * @Description: 全局拓扑页面
 */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Form, Select, Button, DatePicker, message, Switch } from 'antd';
import { PlusCircleOutlined, FullscreenOutlined, FullscreenExitOutlined, MinusCircleOutlined, ConsoleSqlOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';
import moment from 'moment';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import Topo from './Topo';
import Graph from '../global-topo/_component/Topo';
import DragWrapper from './_component/DragWrapper';
import RedLineModal from './_component/RedLineModal';
import { IAppInfo } from '../interface';
import { useEnvOptions } from '../hooks';
import { getAppMonitorInfo } from '../service';
import { getEnvs } from '.././service';

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
  const [refreshFrequency, setRefreshFrequency] = useState<string>('infinity');

  const [selectEnv, setSelectEnv] = useState('');
  const [selectEnvName, setSelectEnvName] = useState('');
  const [isMock, setIsMock] = useState(false);
  const [isExpand, setIsExpand] = useState(true); // true显示全屏展开  false显示全屏收起。
  const [envOptions, setEnvOptions] = useState<any>([]);
  const [showEyes, setShowEyes] = useState<any>(false);
  // const [envOptions]: any[][] = useEnvOptions();

  const TopoRef = useRef<any>();

  useEffect(() => {
    clickId && onAppClick(clickId);
  }, [clickId]);



  useEffect(() => {
    if (envOptions?.length) {
      setSelectEnv(envOptions[0]?.value);
      setSelectEnvName(envOptions[0]?.label);
    }
  }, [envOptions]);

  //获取环境列表
  useEffect(() => {
    getEnvs().then((res: any) => {
      if (res && res.success) {
        const data = res?.data?.envs.map((item: any) => ({ label: item.envName, value: item.envCode }));
        setEnvOptions(data);
      }
    });
  }, []);

  const expandAll = useCallback(() => {
    if (isExpand) {
      TopoRef?.current?.expandAll();
    } else {
      TopoRef?.current?.collapseAll();
    }
  }, [isExpand]);

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
        name: id,
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

  const onRedLineSelect = useCallback((record: any) => {
    setSelectTime(moment(record.time));
  }, []);

  return (
    <PageContainer className="global-topo">
      <FilterCard style={{ backgroundColor: '#F7F8FA' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>环境：</div>
            <Select
              options={envOptions}
              value={selectEnv}
              onChange={(env, option: any) => {
                setSelectEnv(env);
                setSelectEnvName(option.label || env);
                setSelectTime(moment().subtract(1, 'minutes'));
                setRefreshFrequency('infinity');
                setShowEyes(false);
              }}
              showSearch
              style={{ width: 140 }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>时间：</div>
              <DatePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                value={selectTime}
                onChange={(value, dateString) => {
                  setSelectTime(value || moment());
                  setRefreshFrequency('infinity');
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '10px' }}>
              <div>是否自动刷新：</div>
              <Select style={{ width: '100px' }} value={refreshFrequency} onChange={setRefreshFrequency}>
                <Select.Option value="1">1min</Select.Option>
                <Select.Option value="5">5min</Select.Option>
                <Select.Option value="infinity">不刷新</Select.Option>
              </Select>
            </div>
          </div>
        </div>
      </FilterCard>

      <div style={{ height: '100%' }} ref={frameRef}>
        <div className="topo-header">
          <div className="content-header">
            <div className="env-name">{selectEnvName}</div>
            <div className="action-bar">
              <Button icon={showEyes ? <EyeInvisibleOutlined /> : <EyeOutlined />} onClick={() => { setShowEyes(!showEyes) }}>
                {showEyes ? '关闭放大镜' : '启用放大镜'}
              </Button>
              <Button
                type="default"
                icon={<PlusCircleOutlined />}
                onClick={() => {
                  setIsRedLineVisible(true);
                }}
              >
                红线追踪
              </Button>
              {/* <Button
                type="default"
                icon={isExpand ? <PlusCircleOutlined /> : <MinusCircleOutlined />}
                onClick={expandAll}
              >
                {isExpand ? '全部展开' : '全部收起'}
              </Button> */}
              <Button
                type="default"
                icon={isFullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                onClick={handleFullScreen}
              >
                {isFullScreen ? '退出全屏' : '全屏查看'}
              </Button>
              {/* 使用mock数据：
              <Switch checked={isMock} onChange={setIsMock} /> */}
            </div>
          </div>
        </div>

        <ContentCard style={{ backgroundColor: '#F7F8FA', height: 'calc(100% - 60px)' }}>
          <div style={{ marginBottom: '10px' }} id="topo-box" className="topo-box">
            <div className="graph-box" style={{ position: 'relative' }}>
              {/**
               * DragWrapper:可拖拽弹窗组件
               * Topo:拓扑图
               */}
              {/* <Topo
                // isFullScreen={isFullScreen}
                onNodeClick={onNodeClick}
                onRedLineClick={onRedLineClick}
                ref={TopoRef}
                selectTime={selectTime}
                selectEnv={selectEnv}
                refreshFrequency={refreshFrequency}
                isMock={isMock}
                setIsMock={setIsMock}
                setIsExpand={setIsExpand}
                setSelectTime={setSelectTime}
              /> */}
              <Graph
                ref={TopoRef}
                selectTime={selectTime}
                selectEnv={selectEnv}
                onNodeClick={onNodeClick}
                onRedLineClick={onRedLineClick}
                refreshFrequency={refreshFrequency}
                setIsExpand={setIsExpand}
                setSelectTime={setSelectTime}
                showEyes={showEyes}
              ></Graph>
              <DragWrapper appInfoList={appInfoList} deleteModal={deleteModal} />
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
