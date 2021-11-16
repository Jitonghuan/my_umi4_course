// 查看日志
// @author JITONGHUAN <moyan@come-future.com>
// @create 2021/11/12 17:35

import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import { Select, Card, message, Form, Divider, Button } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import { AnsiUp } from 'ansi-up';
import * as APIS from '../deployInfo-content/service';
import { getRequest } from '@/utils/request';
import DetailContext from '@/pages/application/application-detail/context';
import './index.less';

export default function ViewLog(props: any) {
  const [viewLogform] = Form.useForm();
  const { appData } = useContext(DetailContext);
  const [log, setLog] = useState<string>('');
  const [queryListContainer, setQueryListContainer] = useState<any>();
  const [currentContainer, setCurrentContainer] = useState<string>('');
  const { appCode, envCode, instName } = props.location.query;
  let currentContainerName = '';
  let resultLogData = '';
  let socket: any = null;
  let ansi_up = new AnsiUp();

  useEffect(() => {
    getRequest(APIS.listContainer, { data: { appCode, envCode, instName: instName } }).then((result) => {
      let data = result.data;
      if (result.success) {
        const listContainer = data.map((item: any) => ({
          value: item?.containerName,
          label: item?.containerName,
        }));
        currentContainerName = listContainer[0].value;
        // console.log('currentContainerName', currentContainerName);
        viewLogform.setFieldsValue({ containerName: currentContainerName });
        setCurrentContainer(currentContainerName);
        setQueryListContainer(listContainer);
        let socket = new WebSocket(
          `ws://10.10.129.129:8080/v1/appManage/deployInfo/instance/ws?appCode=${appCode}&envCode=${envCode}&instName=${instName}&containerName=${currentContainerName}&action=watchContainerLog&tailLine=200`,
        ); //建立通道

        socket.onopen = () => {
          console.log(socket);
          message.success('WebSocket初次链接成功!');
        };
        let dom = document?.getElementById('result-log');
        socket.onmessage = (evt: any) => {
          if (dom) {
            let scroll = dom?.scrollHeight;
            dom.scrollTo(0, scroll);
          }
          //如果返回结果是字符串，就拼接字符串，或者push到数组，
          resultLogData = resultLogData + evt.data;
          setLog(resultLogData);
          let html = ansi_up.ansi_to_html(resultLogData);
          if (dom) {
            dom.innerHTML = html;
          }
        };
        socket.onerror = () => {
          // term.writeln('webSocket 链接失败');
          message.warning('webSocket 链接失败');
        };
      }
    });
  }, []);

  const selectListContainer = (getContainer: string) => {
    currentContainerName = getContainer;
    setCurrentContainer(getContainer);
    socket.onclose = () => {
      message.info('关闭websocket!');
    };

    socket.onopen = () => {
      // console.log(socket);
      message.success('更换容器，WebSocket链接成功!');
    };
    let dom = document?.getElementById('result-log');
    socket.onmessage = (evt: any) => {
      if (dom) {
        let scroll = dom?.scrollHeight;
        dom.scrollTo(0, scroll);
      }
      //如果返回结果是字符串，就拼接字符串，或者push到数组，
      resultLogData = resultLogData + evt.data;
      setLog(resultLogData);
      let html = ansi_up.ansi_to_html(resultLogData);
      if (dom) {
        dom.innerHTML = html;
      }
    };
    socket.onerror = () => {
      message.warning('webSocket 链接失败');
    };
  };

  //回到顶部
  const scrollTop = () => {
    let dom = document?.getElementById('result-log');
    dom?.scrollTo(0, 0);
  };

  //回到底部
  const scrollBottom = () => {
    let dom = document?.getElementById('result-log');
    if (dom) {
      let scroll = dom.scrollHeight;
      // dom.scrollTop = 20;
      dom.scrollTo(0, scroll);
    }
  };
  //清空屏幕
  const clearSreen = () => {
    resultLogData = '';
    // log =''
    setLog(resultLogData);
    // console.log('log',resultLogData)
  };

  return (
    <ContentCard noPadding className="loginShell">
      <div className="loginShellContent" style={{ height: '100%', paddingLeft: 16, paddingRight: 16, paddingTop: 6 }}>
        {/* <pre>查看日志{'>>>>'}</pre> */}

        <Form form={viewLogform} layout="inline">
          <pre>选择容器： </pre>
          <Form.Item name="containerName">
            <Select style={{ width: 120 }} options={queryListContainer} onChange={selectListContainer}></Select>
          </Form.Item>
        </Form>
        <div
          id="result-log"
          className="result-log"
          style={{ whiteSpace: 'pre-line', lineHeight: 2, fontSize: 14, color: '#0a944f', wordBreak: 'break-word' }}
        >
          {log}
        </div>
        <div style={{ height: 30, textAlign: 'center' }}>
          <span className="eventButton">
            <Button type="primary" onClick={scrollTop}>
              回到顶部
            </Button>
            <Button type="primary" onClick={scrollBottom} style={{ marginLeft: 4 }}>
              回到底部
            </Button>
            <Button type="primary" onClick={clearSreen} style={{ marginLeft: 4 }}>
              清空屏幕
            </Button>
          </span>
        </div>
      </div>
    </ContentCard>
  );
}
