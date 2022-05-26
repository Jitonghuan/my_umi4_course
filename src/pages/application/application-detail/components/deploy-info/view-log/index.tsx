// 查看日志
// @author JITONGHUAN <moyan@come-future.com>
// @create 2021/11/12 17:35

import React, { useState, useEffect, useContext, useRef, useMemo, useLayoutEffect } from 'react';
import { Select, message, Form, Tag, Button, Checkbox } from '@cffe/h2o-design';
import { ContentCard } from '@/components/vc-page-content';
import { AnsiUp } from 'ansi-up';
import appConfig from '@/app.config';
import { history } from 'umi';
import * as APIS from '../deployInfo-content/service';
import { getRequest } from '@/utils/request';
import DetailContext from '@/pages/application/application-detail/context';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import './index.less';

export default function ViewLog(props: any) {
  const [viewLogform] = Form.useForm();
  const { appData } = useContext(DetailContext);
  const [log, setLog] = useState<string>('');
  const [queryListContainer, setQueryListContainer] = useState<any>();
  const [currentContainer, setCurrentContainer] = useState<string>('');
  const [previous, setPrevious] = useState<boolean>(false);
  const { appCode, envCode, instName, viewLogEnvType, optType, containerName } = props.location.query;
  const { infoRecord } = props.location.state;
  const logData = useRef<string>('');
  let currentContainerName = '';
  let ansi_up = new AnsiUp();
  let ws = useRef<WebSocket>();
  let scrollBegin = useRef<boolean>(true);

  useLayoutEffect(() => {
    getRequest(APIS.listContainer, { data: { appCode, envCode, instName: instName } }).then((result) => {
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
        } else {
          currentContainerName = listContainer[0].value;
          viewLogform.setFieldsValue({ containerName: currentContainerName });
          setCurrentContainer(currentContainerName);
        }

        setQueryListContainer(listContainer);
        ws.current = new WebSocket(
          `${appConfig.wsPrefix}/v1/appManage/deployInfo/instance/ws?appCode=${appCode}&envCode=${envCode}&instName=${instName}&containerName=${currentContainerName}&previous=${previous}&action=watchContainerLog&tailLine=200`,
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
    });
  }, []);

  const selectListContainer = (getContainer: string) => {
    // currentContainerName = getContainer;
    setCurrentContainer(getContainer);
    if (ws.current) {
      ws.current.close();
      logData.current = '';
      setLog(logData.current);
      scrollBegin.current = true;
      ws.current = new WebSocket(
        `${appConfig.wsPrefix}/v1/appManage/deployInfo/instance/ws?appCode=${appCode}&envCode=${envCode}&instName=${instName}&containerName=${getContainer}&previous=${previous}&action=watchContainerLog&tailLine=200`,
      ); //建立通道
      ws.current.onopen = () => {
        message.success('更换容器，WebSocket链接成功!');
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
        `${appConfig.wsPrefix}/v1/appManage/deployInfo/instance/ws?appCode=${appCode}&envCode=${envCode}&instName=${instName}&containerName=${currentContainer}&previous=${e.target.checked}&action=watchContainerLog&tailLine=200`,
      ); //建立通道
      if (e.target.checked) {
        ws.current.onopen = () => {
          message.success('已切换至以前的容器，WebSocket链接成功!');
        };
      } else {
        ws.current.onopen = () => {
          message.success('切换至当前容器，WebSocket链接成功!');
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
          pathname: `/matrix/application/detail/container-info`,
          query: {
            appCode: appCode,
            envCode: envCode,
            viewLogEnvType: viewLogEnvType,
          },
          state: {
            appCode: appCode,
            envCode: envCode,
            viewLogEnvType: viewLogEnvType,
            infoRecord: infoRecord,
            id: appData?.id,
          },
        });
      } else {
        history.push({
          pathname: `/matrix/application/detail/deployInfo`,
          query: {
            appCode: appCode,
            id: id + '',
            viewLogEnv: envCode,
            type: 'viewLog_goBack',
            viewLogEnvType: viewLogEnvType,
          },
        });
      }
    }
    // history.goBack({envCode});
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
                <Select style={{ width: 120 }} options={queryListContainer} onChange={selectListContainer}></Select>
              </Form.Item>

              {/* <span style={{paddingRight:3}}><h3>{appData?.appCode},{appData?.appName}</h3> </span> */}
            </Form>
          </div>
          <div className="caption-right">
            <span>
              当前环境：<Tag color="geekblue">{envCode}</Tag>
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

        <div style={{ height: 30, textAlign: 'center', position: 'relative' }}>
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
