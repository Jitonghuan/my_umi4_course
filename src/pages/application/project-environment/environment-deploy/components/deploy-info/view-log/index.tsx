// 查看日志
// @author JITONGHUAN <moyan@come-future.com>
// @create 2021/11/12 17:35

import React, { useState, useContext, useRef, useLayoutEffect } from 'react';
import { Select, message, Form, Tag, Button, Checkbox } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import { AnsiUp } from 'ansi-up';
import { history, useLocation } from 'umi';
import * as APIS from '../deployInfo-content/service';
import { getRequest } from '@/utils/request';
import DetailContext from '../../../context';
import { parse } from 'query-string';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { FeContext } from '@/common/hooks';
import './index.less';

export default function ViewLog(props: any) {
  const [previous, setPrevious] = useState<boolean>(false);
  let location: any = useLocation();
  const { infoRecord } = location?.state;
  const query: any = parse(location.search);
  const [viewLogform] = Form.useForm();
  const { appData, benchmarkEnvCode } = useContext(DetailContext);
  const [log, setLog] = useState<string>('');
  const [queryListContainer, setQueryListContainer] = useState<any>();
  const [currentContainer, setCurrentContainer] = useState<string>('');
  const { appCode, envCode, instName, projectEnvCode, projectEnvName, optType, containerName, deploymentName } = query;
  const logData = useRef<string>('');
  let currentContainerName = '';
  let ansi_up = new AnsiUp();
  let ws = useRef<WebSocket>();
  let scrollBegin = useRef<boolean>(true);
  const { matrixConfigData } = useContext(FeContext);

  useLayoutEffect(() => {
    if (Object.getOwnPropertyNames(infoRecord).length == 0) {
      return;
    }
    getRequest(APIS.listContainer, { data: { appCode, envCode: projectEnvCode, instName: instName } }).then(
      (result) => {
        let data = result.data;
        if (result.success) {
          const listContainer = data.map((item: any) => ({
            value: item?.containerName,
            label: item?.containerName,
          }));

          if (optType && optType === 'containerInfo') {
            currentContainerName = containerName;
            viewLogform.setFieldsValue({ containerName: containerName });
            setCurrentContainer(containerName);
            setQueryListContainer([
              {
                label: containerName,
                value: containerName,
              },
            ]);
          } else {
            currentContainerName = deploymentName;
            viewLogform.setFieldsValue({ containerName: currentContainerName });
            setCurrentContainer(currentContainerName);
            setQueryListContainer(listContainer);
          }
          ws.current = new WebSocket(
            window.location.href?.includes('gushangke')
              ? `ws://matrix-api.gushangke.com/v1/appManage/deployInfo/instance/ws?appCode=${appCode}&envCode=${projectEnvCode}&instName=${instName}&containerName=${currentContainerName}&previous=${previous}&action=watchContainerLog&tailLine=200`
              : `${matrixConfigData.wsPrefixName}/v1/appManage/deployInfo/instance/ws?appCode=${appCode}&envCode=${projectEnvCode}&instName=${instName}&containerName=${currentContainerName}&previous=${previous}&action=watchContainerLog&tailLine=200`,
          ); //建立通道
          let dom: any = document?.getElementById('result-log');
          ws.current.onmessage = (evt: any) => {
            if (dom) {
              // 获取滚动条到滚动区域底部的高度
              const scrollB = dom?.scrollHeight - dom?.scrollTop - dom?.clientHeight;
              let bottom = 0;
              if (scrollB) {
                // 计算滚动条到日志div底部的距离
                bottom = (scrollB / dom?.scrollHeight) * dom?.clientHeight;
              }
              //如果返回结果是字符串，就拼接字符串，或者push到数组，
              logData.current += evt.data;
              setLog(logData.current);
              let html = ansi_up.ansi_to_html(logData.current);
              dom.innerHTML = html;
              if (bottom <= 20) {
                dom.scrollTo(0, dom.scrollHeight);
              }
            }
          };
          ws.current.onerror = () => {
            message.warning('webSocket 链接失败');
          };
        }
      },
    );
  }, [projectEnvCode]);

  // 下载日志
  const downloadLog = () => {
    const element = document.createElement('a');
    const file = new Blob([log], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = '日志.txt';
    document.body.appendChild(element);
    element.click();
  };

  //回到顶部
  const scrollTop = () => {
    let dom = document?.getElementById('result-log');
    dom?.scrollTo(0, 0);
    scrollBegin.current = false;
  };

  //回到底部
  const scrollBottom = () => {
    let dom = document?.getElementById('result-log');
    if (dom) {
      let scroll = dom.scrollHeight;
      dom.scrollTo(0, scroll);
      scrollBegin.current = true;
    }
  };
  //清空屏幕
  const clearScreen = () => {
    logData.current = '';
    setLog(logData.current);
    scrollBegin.current = true;
  };
  //关闭页面
  const id = appData?.id;
  const closeSocket = () => {
    if (ws.current) {
      ws.current.close();
      if (optType && optType === 'containerInfo') {
        history.push({
          pathname: `/matrix/application/environment-deploy/container-info`,
          search: `appCode=${appCode}&projectEnvCode=${projectEnvCode}&projectEnvName=${projectEnvName}&benchmarkEnvCode=${benchmarkEnvCode}`
        },
          {
            infoRecord: {
              appCode: appCode,
              projectEnvCode: projectEnvCode,
              projectEnvName: projectEnvName,
              // viewLogEnvType: viewLogEnvType,
              infoRecord: infoRecord,
              id: appData?.id,
              benchmarkEnvCode: benchmarkEnvCode
            }
          },
        );
      } else {
        history.push({
          pathname: `/matrix/application/environment-deploy/deployInfo`,
          search: `appCode=${appCode}&projectEnvCode=${projectEnvCode}&projectEnvName=${projectEnvName}&viewLogEnv=${projectEnvCode}&id=${id + ""}&type=viewLog_goBack&benchmarkEnvCode=${benchmarkEnvCode}`
        });
      }
    }

    // history.goBack({envCode});
  };
  const selectListContainer = (getContainer: string) => {
    // currentContainerName = getContainer;
    setCurrentContainer(getContainer);
    if (ws.current) {
      ws.current.close();
      logData.current = '';
      setLog(logData.current);
      scrollBegin.current = true;
      ws.current = new WebSocket(
        window.location.href?.includes('gushangke')
          ? `ws://matrix-api.gushangke.com/v1/appManage/deployInfo/instance/ws?appCode=${appCode}&envCode=${projectEnvCode}&instName=${instName}&containerName=${getContainer}&previous=${previous}&previous=${previous}&action=watchContainerLog&tailLine=200`
          : `${matrixConfigData.wsPrefixName}/v1/appManage/deployInfo/instance/ws?appCode=${appCode}&envCode=${projectEnvCode}&instName=${instName}&containerName=${getContainer}&previous=${previous}&previous=${previous}&action=watchContainerLog&tailLine=200`,
      ); //建立通道
      ws.current.onopen = () => {
        message.success('更换容器成功!');
      };
      let dom: any = document?.getElementById('result-log');
      ws.current.onmessage = (evt: any) => {
        if (dom) {
          // 获取滚动条到滚动区域底部的高度
          const scrollB = dom?.scrollHeight - dom?.scrollTop - dom?.clientHeight;
          let bottom = 0;
          if (scrollB) {
            // 计算滚动条到日志div底部的距离
            bottom = (scrollB / dom?.scrollHeight) * dom?.clientHeight;
          }
          //如果返回结果是字符串，就拼接字符串，或者push到数组，
          logData.current += evt.data;
          setLog(logData.current);
          let html = ansi_up.ansi_to_html(logData.current);
          dom.innerHTML = html;
          if (bottom <= 20) {
            dom.scrollTo(0, dom.scrollHeight);
          }
        }
      };
      ws.current.onerror = () => {
        message.warning('webSocket 链接失败');
      };
    }
  };
  const onChange = (e: CheckboxChangeEvent) => {
    setPrevious(e.target.checked);
    if (ws.current) {
      ws.current.close();
      logData.current = '';
      setLog(logData.current);
      scrollBegin.current = true;
      ws.current = new WebSocket(
        window.location.href?.includes('gushangke')
          ? `ws://matrix-api.gushangke.com/v1/appManage/deployInfo/instance/ws?appCode=${appCode}&envCode=${projectEnvCode}&instName=${instName}&containerName=${currentContainer}&previous=${e.target.checked}&action=watchContainerLog&tailLine=200`
          : `${matrixConfigData.wsPrefixName}/v1/appManage/deployInfo/instance/ws?appCode=${appCode}&envCode=${projectEnvCode}&instName=${instName}&containerName=${currentContainer}&previous=${e.target.checked}&action=watchContainerLog&tailLine=200`,
      ); //建立通道
      if (e.target.checked) {
        ws.current.onopen = () => {
          message.success('已切换至以前的容器!');
        };
      } else {
        ws.current.onopen = () => {
          message.success('切换至当前容器!');
        };
      }

      let dom: any = document?.getElementById('result-log');
      ws.current.onmessage = (evt: any) => {
        if (dom) {
          // 获取滚动条到滚动区域底部的高度
          const scrollB = dom?.scrollHeight - dom?.scrollTop - dom?.clientHeight;
          let bottom = 0;
          if (scrollB) {
            // 计算滚动条到日志div底部的距离
            bottom = (scrollB / dom?.scrollHeight) * dom?.clientHeight;
          }
          //如果返回结果是字符串，就拼接字符串，或者push到数组，
          logData.current += evt.data;
          setLog(logData.current);
          let html = ansi_up.ansi_to_html(logData.current);
          dom.innerHTML = html;
          if (bottom <= 20) {
            dom.scrollTo(0, dom.scrollHeight);
          }
        }
      };
      ws.current.onerror = () => {
        message.warning('webSocket 链接失败');
      };
    }
  };

  return (
    <ContentCard noPadding className="viewLog">
      <div className="loginShellContent" style={{ height: '100%', paddingLeft: 16, paddingRight: 16, paddingTop: 6 }}>
        {/* <pre>查看日志{'>>>>'}</pre> */}
        <div className="log-caption">
          <div className="caption-left">
            <Form form={viewLogform} layout="inline">
              <pre>选择容器： </pre>
              <Form.Item name="containerName">
                <Select style={{ width: 220 }} options={queryListContainer} onChange={selectListContainer}></Select>
              </Form.Item>
              {/* <span style={{paddingRight:3}}><h3>{appData?.appCode},{appData?.appName}</h3> </span> */}
            </Form>
          </div>
          <div className="caption-right">
            <span>
              当前环境：<Tag color="geekblue">{projectEnvCode}</Tag>
            </span>
          </div>
        </div>

        <div
          id="result-log"
          className="result-log"
          style={{
            whiteSpace: 'pre-line',
            padding: 8,
            lineHeight: 2,
            fontSize: 16,
            color: '#12a182',
            wordBreak: 'break-word',
          }}
        >
          {log}
        </div>
        <div style={{ height: 30, textAlign: 'center' }}>
          <span style={{ position: 'absolute', left: 0 }}>
            <Checkbox onChange={onChange} />
            <b style={{ paddingLeft: 4 }}>以前的容器</b>
          </span>

          <span className="event-button">
            <Button type="primary" onClick={downloadLog}>
              下载日志
            </Button>
            <Button type="primary" onClick={scrollTop} style={{ marginLeft: 4 }}>
              回到顶部
            </Button>
            <Button type="primary" onClick={scrollBottom} style={{ marginLeft: 4 }}>
              回到底部
            </Button>
            <Button type="primary" onClick={clearScreen} style={{ marginLeft: 4 }}>
              清空屏幕
            </Button>
            <Button type="primary" onClick={closeSocket} style={{ marginLeft: 4 }}>
              关闭
            </Button>
          </span>
        </div>
      </div>
    </ContentCard>
  );
}
