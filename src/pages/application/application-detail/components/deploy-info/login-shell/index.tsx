// 登陆shell
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/11/12	17:04

import React, { useState, useEffect } from 'react';
import { Select, Form, Button } from 'antd';
import * as APIS from '../deployInfo-content/service';
import { getRequest } from '@/utils/request';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { AttachAddon } from 'xterm-addon-attach';
import './index.less';

export default function AppDeployInfo(props: any) {
  const [viewLogform] = Form.useForm();
  const { appCode, envCode } = props.location.query;
  const instName = props.location.query.instName;
  const [queryListContainer, setQueryListContainer] = useState<any>();
  let currentContainerName = '';
  useEffect(() => {
    if (appCode && envCode && instName) {
      getRequest(APIS.listContainer, { data: { appCode, envCode, instName } })
        .then((result) => {
          let data = result.data;
          if (result.success) {
            const listContainer = data.map((item: any) => ({
              value: item?.containerName,
              label: item?.containerName,
            }));
            currentContainerName = listContainer[0].value;
            viewLogform.setFieldsValue({ containerName: currentContainerName });
            setQueryListContainer(listContainer);
          }
        })
        .finally(() => {
          initWS();
        });
    }
  }, [appCode, envCode]);

  const initWS = () => {
    let dom: any = document.getElementById('terminal');
    let socket = new WebSocket(
      // http://matrix-test.cfuture.shop/
      `ws://matrix-test.cfuture.shop/v1/appManage/deployInfo/instance/ws?appCode=${appCode}&envCode=${envCode}&instName=${instName}&containerName=${currentContainerName}&action=shell`,
    ); //建立通道
    //初始化terminal
    const term = new Terminal({
      altClickMovesCursor: true,
      rendererType: 'canvas', //渲染类型
      convertEol: true, //启用时，光标将设置为下一行的开头
      disableStdin: false, //是否应禁用输入。
      cursorStyle: 'block', //光标样式
      cursorBlink: true, //光标闪烁
      rightClickSelectsWord: true,
      scrollback: 800,

      theme: {
        foreground: '#7e9192', //字体
        background: 'black', //背景色
        cursor: 'white', //设置光标
      },
    });
    term.open(dom);
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    fitAddon.fit();
    socket.onopen = () => {
      const attachAddon = new AttachAddon(socket);
      term.loadAddon(attachAddon);
      term.write('欢迎使用 \x1B[1;3;31mMATRIX\x1B[0m: ');
      term.writeln('WebSocket链接成功');
      let sendJson = {
        operation: 'resize',
        cols: term.cols,
        rows: term.rows,
      };
      socket.send(JSON.stringify(sendJson));
      term.focus();
      socket.onerror = () => {
        term.writeln('webSocket 链接失败，请刷新页面');
      };
    };
    window?.addEventListener('resize', function () {
      // 变化后需要做的事
      fitAddon?.fit();
      let sendJson = {
        operation: 'resize',
        cols: term.cols,
        rows: term.rows,
      };
      socket.send(JSON.stringify(sendJson));
    });
  };

  // 关闭页面时注销掉监听事件
  useEffect(() => {
    return () => {
      window.removeEventListener('resize', function () {});
    };
  }, []);
  const closeSocket = () => {
    window.close();
  };
  //选择容器
  const selectListContainer = (getContainer: string) => {
    currentContainerName = getContainer;
    initWS();
  };

  return (
    <div className="loginShell">
      <div style={{ paddingBottom: '1%', paddingTop: '1%' }}>
        <Form form={viewLogform} layout="inline">
          <span>选择容器： </span>
          <Form.Item name="containerName">
            <Select
              style={{ width: 120 }}
              options={queryListContainer}
              onChange={selectListContainer}
              defaultValue={currentContainerName}
            ></Select>
          </Form.Item>
        </Form>
      </div>
      <div id="terminal" className="xterm" style={{ width: '100%', backgroundColor: '#060101' }}></div>
      <div style={{ height: 32, width: '100%', textAlign: 'center', position: 'absolute', marginTop: 4 }}>
        <span className="eventButton">
          <Button type="primary" onClick={closeSocket}>
            关闭
          </Button>
        </span>
      </div>
    </div>
  );
}
