// 查看日志
// @author JITONGHUAN <moyan@come-future.com>
// @create 2021/11/12 17:35

import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import { Select, Card, message, Form, Divider, Button } from 'antd';
import AceEditor from '@/components/ace-editor';
import { ContentCard } from '@/components/vc-page-content';
import * as APIS from '../deployInfo-content/service';
import { getRequest } from '@/utils/request';
import DetailContext from '@/pages/application/application-detail/context';
import './index.less';

export default function ViewLog(props: any) {
  const [viewLogform] = Form.useForm();
  const { appData } = useContext(DetailContext);
  const [log, setLog] = useState<string>();
  const [queryListContainer, setQueryListContainer] = useState<any>();
  const [currentContainer, setCurrentContainer] = useState<string>('');
  const { appCode, envCode, instName } = props.location.query;
  let currentContainerName = '';
  let resultLogData = '';
  let socket: any = null;

  useEffect(() => {
    socket = new WebSocket(`ws://47.101.65.157/zjgs/admin/websocket/zjic-obu-list`); //建立通道
    let dom = document?.getElementById('result-log');
    socket.onopen = () => {
      console.log(socket);
      message.success('WebSocket初次链接成功!');
    };

    socket.onmessage = (evt: any) => {
      // debugger
      if (dom) {
        // debugger
        let scroll = dom.scrollHeight;
        // dom.scrollTop = 20;
        dom.scrollTo(0, scroll);
      }
      //如果返回结果是字符串，就拼接字符串，或者push到数组，
      // console.log('======>',evt.data)
      // term.write(evt.data.data);
      // resultLogData=''
      resultLogData = resultLogData + evt.data;

      // console.log('..........',evt.data);
      // console.log('===111111111111111',resultLogData);
      setLog(resultLogData);
    };
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
        // let socket = new WebSocket(
        //   `ws://10.10.129.176:8080/v1/appManage/deployInfo/instance/ws?appCode=${appCode}&envCode=${envCode}&instName=${instName}&containerName=${currentContainerName}&action=shell`,
        // ); //建立通道

        //   socket.onopen = () => {
        //         console.log(socket);
        //         message.success('WebSocket初次链接成功!');
        //       };
        //   let dom = document?.getElementById('result-log');

        //   socket.onmessage =(evt:any)=> {
        //   if (dom) {
        //   dom.scrollTop = dom?.scrollHeight;
        //   }
        // //如果返回结果是字符串，就拼接字符串，或者push到数组，
        //  console.log('======>',evt.data)
        // // term.write(evt.data.data);
        // resultLogData+=evt.data;
        // console.log('===',resultLogData);
        // setLog(resultLogData)
        //  };
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
  };

  // useEffect(() => {
  //   socket.onopen = () => {
  //     console.log(socket);
  //     message.success('WebSocket链接成功!');
  //   };

  //   let dom = document?.getElementById('result-log');
  //   let resultLogData=''
  //   socket.onmessage =(evt)=> {
  //     if (dom) {
  //       dom.scrollTop = dom?.scrollHeight;
  //     }
  //     //如果返回结果是字符串，就拼接字符串，或者push到数组，
  //     console.log('======>',evt.data)
  //     // term.write(evt.data.data);
  //   };

  //   socket.onerror = () => {
  //     // term.writeln('webSocket 链接失败');
  //     message.warning('webSocket 链接失败');
  //   };
  // }, []);
  //回到顶部
  const scrollTop = () => {
    let dom = document?.getElementById('result-log');
    dom?.scrollTo(0, 0);
  };

  //回到底部
  const scrollBottom = () => {
    let dom = document?.getElementById('result-log');
    if (dom) {
      // debugger
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
        {/* <Divider/> */}
        <div id="result-log" className="result-log" style={{ color: 'white' }}>
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
