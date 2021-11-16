// 查看日志
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/11/12	17:04

import React, { useState, useEffect, useContext } from 'react';
import { Tabs, Select, Form,Divider ,Button} from 'antd';
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
  const instName = props.location.query.instName;
  const [queryListContainer, setQueryListContainer] = useState<any>();
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  let currentContainerName = '';
  useEffect(() => {
   
    if(appCode&&envCode&&instName){
      getRequest(APIS.listContainer, { data: { appCode, envCode, instName } }).then((result) => {
        let data = result.data;
        if (result.success) {
          const listContainer = data.map((item: any) => ({
            value: item?.containerName,
            label: item?.containerName,
          }));
          currentContainerName = listContainer[0].value;
          viewLogform.setFieldsValue({ containerName: currentContainerName });
          setQueryListContainer(listContainer);
          initWS();
        }
      });

    }
  }, [appCode, envCode]);

  const initWS = () => {
    let dom: any  = document.getElementById('terminal')
    let socket = new WebSocket(
      `ws://47.101.65.157/zjg/admin/websocket/zjic-obu-list`,
    ); //建立通道

    socket.onopen = () => {
      const term = new Terminal({
        altClickMovesCursor:true,
        rendererType: 'canvas', //渲染类型
        // yrows: 100, //行数
        rows:40,
        cols: 100, // 不指定行数，自动回车后光标从下一行开始
        convertEol: true, //启用时，光标将设置为下一行的开头
        disableStdin: false, //是否应禁用输入。
        cursorStyle: 'block', //光标样式
        cursorBlink: true, //光标闪烁
        // cursorWidth: 11,

        theme: {
          foreground: '#7e9192', //字体
          background: 'black', //背景色
          cursor: 'white', //设置光标
          // lineHeight: 16,
        },
      });
      const attachAddon = new AttachAddon(socket);
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.loadAddon(attachAddon);
      term.open(dom);
      term.write('欢迎使用 \x1B[1;3;31mMATRIX\x1B[0m: ');
      term.writeln('WebSocket链接成功');
      fitAddon.fit();
      // window.addEventListener('resize', handleResize()); //监听窗口大小改变
      
      window.addEventListener('resize', function() {
        // 变化后需要做的事
        
        fitAddon.fit();
        
  
        
    })
  
      term.focus();
      // term.onKey((e) => {
      //   let sendJSON = {
      //     'operation':'stdin',
      //     'data':e.key
      //   }
      //   socket.send(JSON.stringify(sendJSON))
      // });

      // term.onData((data)=>{
      //   let sendJSON = {
      //     'operation':'stdin',
      //     'data':data
      //   }
      //   console.log("json:",sendJSON)
      //   socket.send(JSON.stringify(sendJSON))
      // })

      socket.onerror = () => {
        term.writeln('webSocket 链接失败');
      };
      term.onResize((cols,rows)=>{
        console.log("cols,rows:",cols,rows)
      })
    };
  }

  const  handleResize =(fie:any)  => {
    fie.fit();
  }


  //监听窗口变化
// const [collapsed,setCollapsed]=useState<boolean>(false);
//   const  handleClientW = (width:any,num:any)=>{
//     if(width < num){
//       setCollapsed(true)
//     }else{
//       setCollapsed(false)
//     }
//   }



  // useEffect(()=>{
  //   // window.addEventListener('resize', handleResize); //监听窗口大小改变
  //   // let clientW = document.documentElement.clientWidth;//获取窗口可见区域的高度
  //   // handleClientW(clientW,1040);
    
  // },[])
   
    //关闭页面时注销掉监听事件
  useEffect(()=>{
    return()=>{window.removeEventListener('resize',handleResize);}
  },[])


  const selectListContainer = (getContainer: string) => {
    currentContainerName = getContainer;
  };

  return (
    <div className="loginShell" >
      <div style={{ paddingBottom: '1%',paddingTop:'1%' }} >
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
      {/* <Divider/> */}
      <div id="terminal" className="xterm" style={{  width: '100%',backgroundColor: '#060101'}}>
      </div>
     
    </div>
  );
}
