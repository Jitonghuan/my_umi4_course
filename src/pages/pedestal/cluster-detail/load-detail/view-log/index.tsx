// 查看日志
// @author JITONGHUAN <moyan@come-future.com>
// @create 2021/11/12 17:35

import React, { useState, useEffect, useContext, useRef, useMemo, useLayoutEffect } from 'react';
import { Select, message, Form, Tag, Button, Checkbox } from '@cffe/h2o-design';
import { AnsiUp } from 'ansi-up';
import appConfig from '@/app.config';
import { history } from 'umi';
import { FeContext } from '@/common/hooks';
import { getResourceList } from '../../service';

import './index.less';

export default function ViewLog(props: any) {
  const [viewLogform] = Form.useForm();
  const { name, clusterCode, namespace, containerName, clusterName } = props?.location?.query || {};
  const [log, setLog] = useState<string>('');
  const { matrixConfigData } = useContext(FeContext);
  const [container, setContainer] = useState<any>([]);
  const [currentContainer, setCurrentContainer] = useState<string>('');
  const logData = useRef<string>('');
  let ansi_up = new AnsiUp();
  let ws = useRef<WebSocket>();
  let scrollBegin = useRef<boolean>(true);
  useEffect(() => {
    if (!currentContainer && container && container.length) {
      setCurrentContainer(container[0].value);
      viewLogform.setFieldsValue({ containerName: container[0].value });
      ws.current = new WebSocket(
        // `${matrixConfigData.wsPrefixName}/v1/appManage/deployInfo/instance/ws?instName=${name}&containerName=${container[0].value}&clusterCode=${clusterCode}&namespace=${namespace}&action=watchContainerLog&tailLine=200`,
        window.location.href?.includes('gushangke')
          ? `ws://matrix-api.gushangke.com/v1/appManage/deployInfo/instance/ws?instName=${name}&containerName=${container[0].value}&clusterCode=${clusterCode}&namespace=${namespace}&action=watchContainerLog&tailLine=200`
          : `${matrixConfigData.wsPrefixName}/v1/appManage/deployInfo/instance/ws?instName=${name}&containerName=${container[0].value}&clusterCode=${clusterCode}&namespace=${namespace}&action=watchContainerLog&tailLine=200`,
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
  }, [container]);
  useEffect(() => {
    if (clusterCode && name && namespace && !containerName) {
      getResourceList({ clusterCode, resourceName: name, namespace, resourceType: 'pods' }).then((res) => {
        if (res?.success) {
          const { items } = res?.data || {};
          if (items && items[0]) {
            const containerData = (items[0]?.info?.containers || []).map((item: any) => ({
              label: item.name,
              value: item.name,
            }));
            if (containerData.length) {
              setContainer(containerData);
            }
          }
        }
      });
    }
    if (containerName) {
      setContainer([{ value: containerName, label: containerName }]);
    }
  }, [clusterCode, name, namespace]);

  useLayoutEffect(() => { }, []);

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
          ? `ws://matrix-api.gushangke.com/v1/appManage/deployInfo/instance/ws?instName=${name}&containerName=${getContainer}&clusterCode=${clusterCode}&namespace=${namespace}&action=watchContainerLog&tailLine=200`
          : `${matrixConfigData.wsPrefixName}/v1/appManage/deployInfo/instance/ws?instName=${name}&containerName=${getContainer}&clusterCode=${clusterCode}&namespace=${namespace}&action=watchContainerLog&tailLine=200`,
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
  const closeSocket = () => {
    if (ws.current) {
      ws.current.close();
      history.goBack();
    }
  };

  return (
    <div className="loginShellContent" style={{ height: '100%', paddingLeft: 16, paddingRight: 16, paddingTop: 6 }}>
      <div className="flex-space-between">
        <div >
          <Form form={viewLogform} layout="inline">
            <pre style={{ lineHeight: '32px' }}>选择容器： </pre>
            <Form.Item name="containerName">
              <Select style={{ width: 220 }} options={container} onChange={selectListContainer}></Select>
            </Form.Item>
          </Form>
        </div>
        <div style={{ marginTop: '5px' }}>
          当前集群：<Tag color="geekblue">{clusterName}</Tag>
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
  );
}
