// 查看日志
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/11/12 17:04

import React, { useState, useEffect, useContext } from 'react';
import { Tabs, Select, Form } from 'antd';
import * as APIS from '../deployInfo-content/service';
import { getRequest } from '@/utils/request';
import { Terminal } from 'xterm';
import FELayout from '@cffe/vc-layout';
import { FitAddon } from 'xterm-addon-fit';
import { AttachAddon } from 'xterm-addon-attach';
import './index.less';

export default function AppDeployInfo(props: any) {
  const [viewLogform] = Form.useForm();
  const { appCode, envCode } = props.location.query;
  const instName = props.location.query.insName;
  const [queryListContainer, setQueryListContainer] = useState<any>();
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  let currentContainerName = '';
  useEffect(() => {
    getRequest(APIS.listContainer, { data: { appCode, envCode, instName } }).then((result) => {
      let data = result.data;
      if (result.success) {
        const listContainer = data.map((item: any) => ({
          value: item?.containerName,
          label: item?.containerName,
        }));
        currentContainerName = listContainer[0].value;
        console.log('currentContainerName', currentContainerName);
        viewLogform.setFieldsValue({ containerName: currentContainerName });
        setQueryListContainer(listContainer);
        initTerm();
      }
    });
  }, [appCode, envCode]);

  const initTerm = () => {
    let dom: any = document.getElementById('terminal');
    const term = new Terminal({
      rendererType: 'dom', //渲染类型
      rows: 100, //行数
      cols: 4, // 不指定行数，自动回车后光标从下一行开始
      convertEol: true, //启用时，光标将设置为下一行的开头
      scrollback: 50, //终端中的回滚量
      disableStdin: true, //是否应禁用输入。
      cursorStyle: 'block', //光标样式
      cursorBlink: true, //光标闪烁
      cursorWidth: 11,

      theme: {
        foreground: '#7e9192', //字体
        background: 'black', //背景色
        cursor: 'red', //设置光标
        // lineHeight: 16,
      },
    });
    term.open(dom);
    console.log('currentContainerName111', currentContainerName);

    let socket = new WebSocket(
      `ws://matrix-test.cfuture.shop/appManage/deployInfo/instance/ws?appCode=${appCode}&envCode=${envCode}&instName=${instName}&containerName=${currentContainerName}`,
    ); //建立通道
    term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
    term.writeln(`Welcome to matrix,${userInfo.userName}`);
    term.writeln('This is a local terminal emulation, without a real terminal in the back-end.');

    socket.onopen = () => {
      term.writeln('链接成功后');
      // 链接成功后
      //  initTerm()
    };
    // 初始化
    term._initialized = true;

    // socketOnClose();
    // socketOnOpen();
    // socketOnError();

    const attachAddon = new AttachAddon(socket);
    const fitAddon = new FitAddon();
    // fitAddon.activate;
    term.loadAddon(fitAddon);
    term.loadAddon(attachAddon);
    // const  socketOnOpen =()=>{

    //   term.loadAddon(attachAddon);
    //   const  socketOnOpen=()=>{
    //   socket.send('uname -a')
    //   socket.send('/n')
    //   //心跳机制
    //   // let   socketHeart = setInterval(()=>{
    //   //   socket.send('[ping]')},5000)
    //   // }
    // //   if(socketHeart){
    // //     clearInterval(socketHeart)
    // //   }
    // }}

    term.write('hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
    fitAddon.fit();
    console.log('.....', term._core);
    term.focus();
    term.onKey((e) => {
      //按ctrl键不走这里
      const printable = !e.domEvent.altKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey;
      //当用户按下enter键时触发，13表示enter按键的keyCode编码
      if (e.domEvent.keyCode === 13) {
        term.write('\r\n~$ ');
      } else if (e.domEvent.keyCode === 8) {
        // back 删除的情况
        if (term._core.buffer.x > 2) {
          //\b的含义是，将光标从当前位置向前（左）移动一个字符（遇到\n或\r则停止移动），并从此位置开始输出后面的字符（空字符\0和换行符\n除外）。
          term.write('\b \b');
        }
      } else if (printable) {
        term.write(e.key);
        socket.send(e.key); //向后台发送信息
      }
      console.log(1, 'print', e.key);
    });

    //接收到的消息 打印在shell面板上
    socket.onmessage = function (evt) {
      term.write(evt.data.data);
    };

    socket.onerror = () => {
      term.writeln('webSocket 链接失败');
    };

    //关闭页面会自动断开socket
    // socket.onclose = () => {
    //   term.writeln('close socket')
    // }
  };

  const selectListContainer = (getContainer: string) => {
    currentContainerName = getContainer;
  };

  return (
    <div className="loginShell">
      <div style={{ paddingBottom: '2%', marginRight: 18 }}>
        <Form form={viewLogform} layout="inline">
          <span style={{ color: 'gray' }}>选择容器： </span>
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
      <div id="terminal" className="xterm" style={{ height: '100%', width: '100%' }}></div>
    </div>
  );
}
