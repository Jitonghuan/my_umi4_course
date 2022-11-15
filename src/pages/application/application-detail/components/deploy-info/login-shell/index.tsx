// 登陆shell
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/11/12	17:04

import React, { useState, useEffect, useContext, useRef } from 'react';
import { Select, Form, Button, Tag, message } from '@cffe/h2o-design';
import { ContentCard } from '@/components/vc-page-content';
import * as APIS from '../deployInfo-content/service';
import { getRequest } from '@/utils/request';
import DetailContext from '@/pages/application/application-detail/context';
import { history, useLocation} from 'umi';
import { parse } from 'query-string';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { AttachAddon } from 'xterm-addon-attach';
import { FeContext } from '@/common/hooks';
import './index.less';

export default function AppDeployInfo(props: any) {
  const [viewLogform] = Form.useForm();
  let location:any = useLocation();
  const query = parse(location.search);
  const { appData } = useContext(DetailContext);
  const { appCode, envCode, optType, containerName, deploymentName,viewLogEnvType } = query;
  const infoRecord:any=location.state?.infoRecord || {};
  const instName = query.instName;
  const [queryListContainer, setQueryListContainer] = useState<any>();
  const [previous, setPrevious] = useState<boolean>(false);
  const { matrixConfigData } = useContext(FeContext);
  let currentContainerName = '';
  const ws = useRef<WebSocket>();

  const term = useRef<any>();
  useEffect(() => {
    if (!instName) return;
  }, []);

  useEffect(() => {
    if (appCode && envCode) {
      getRequest(APIS.listContainer, { data: { appCode, envCode, instName } })
        .then((result) => {
          let data = result.data;
          if (result.success) {
            const listContainer = data.map((item: any) => ({
              value: item?.containerName,
              label: item?.containerName,
            }));
            if (optType && optType === 'containerInfo') {
              //@ts-ignore
              currentContainerName = containerName || '';
              viewLogform.setFieldsValue({ containerName: containerName });
              setQueryListContainer([
                {
                  label: containerName,
                  value: containerName,
                },
              ]);
            } else {
              //@ts-ignore
              currentContainerName = deploymentName || '';
              viewLogform.setFieldsValue({ containerName: currentContainerName });
              setQueryListContainer(listContainer);
            }
          }
        })
        .then(() => {
          initWS(false);
        });
    }
  }, [envCode]);

  const initWS = (previous?: boolean) => {
    let dom: any = document?.getElementById('terminal');
    ws.current = new WebSocket(
      window.location.href?.includes('gushangke')
        ? `ws://matrix-api.gushangke.com/v1/appManage/deployInfo/instance/ws?appCode=${appCode}&envCode=${envCode}&instName=${instName}&containerName=${currentContainerName}&previous=${previous}&action=shell`
        : `${matrixConfigData.wsPrefixName}/v1/appManage/deployInfo/instance/ws?appCode=${appCode}&envCode=${envCode}&instName=${instName}&containerName=${currentContainerName}&previous=${previous}&action=shell`,
    ); //建立通道

    //初始化terminal
    term.current = new Terminal({
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
    term.current.open(dom);
    const fitAddon = new FitAddon();
    term.current.loadAddon(fitAddon);
    fitAddon.fit();
    ws.current.onopen = () => {
      if (ws.current) {
        const attachAddon = new AttachAddon(ws.current);
        term.current.loadAddon(attachAddon);
        term.current.write('欢迎使用 \x1B[1;3;31mMATRIX\x1B[0m: ');
        term.current.writeln('WebSocket链接成功');
        let sendJson = {
          operation: 'resize',
          cols: term.current.cols,
          rows: term.current.rows,
        };
        ws.current.send(JSON.stringify(sendJson));
        term.current.focus();
        ws.current.onerror = () => {
          term.current.writeln('\n\x1B[1;3;31m WebSocket连接失败，请刷新页面重试\x1B[0m');
        };
      }
    };

    window?.addEventListener('resize', function () {
      if (ws.current) {
        // 变化后需要做的事
        // if (Number.isInteger(term.cols) && Number.isInteger(term.rows)) {
        //   fitAddon.fit()
        // } else {
        //   window.location.reload();
        // }
        try {
          fitAddon.fit();
        } catch (error) {
          window.location.reload();
        }
        let sendJson = {
          operation: 'resize',
          cols: term.current.cols,
          rows: term.current.rows,
        };
        ws.current.send(JSON.stringify(sendJson));
      }
    });
  };

  // 关闭页面时注销掉监听事件
  useEffect(() => {
    return () => {
      window.removeEventListener('resize', function () {});
    };
  }, []);
  const id = appData?.id;
  const closeSocket = () => {
    if (ws.current) {
      ws.current.close();
      //history.back();
      if (optType && optType === 'containerInfo') {
        history.push({
          pathname: `/matrix/application/detail/container-info`,
          search:`appCode=${appCode}&envCode=${envCode}&viewLogEnvType=${viewLogEnvType}`, 
         }, {
          infoRecord:{  appCode: appCode,
            envCode: envCode,
            viewLogEnvType: viewLogEnvType,
            infoRecord: infoRecord,
            id: appData?.id,
          } },
        );
      } else {
        history.push({
          pathname: `/matrix/application/detail/deployInfo`,
          search:`appCode=${appCode}&id=${id + ''}&viewLogEnv=${envCode}&viewLogEnvType=${viewLogEnvType}&type=viewLog_goBack`
         
        });
      }
    }
  };
  //选择容器
  const selectListContainer = (getContainer: string) => {
    if (ws.current) {
      ws.current.close();
    }
    currentContainerName = getContainer;
    ws.current = new WebSocket(
      window.location.href?.includes('gushangke')
        ? `ws://matrix-api.gushangke.com/v1/appManage/deployInfo/instance/ws?appCode=${appCode}&envCode=${envCode}&instName=${instName}&containerName=${currentContainerName}&previous=${previous}&action=shell`
        : `${matrixConfigData.wsPrefixName}/v1/appManage/deployInfo/instance/ws?appCode=${appCode}&envCode=${envCode}&instName=${instName}&containerName=${currentContainerName}&previous=${previous}&action=shell`,
    ); //建立通道

    ws.current.onopen = () => {
      message.success('已切换容器!');
      term.current.reset();
      if (ws.current) {
        const attachAddon = new AttachAddon(ws.current);
        term.current.loadAddon(attachAddon);
        term.current.write('欢迎使用 \x1B[1;3;31mMATRIX\x1B[0m: ');
        term.current.writeln('WebSocket链接成功');

        let sendJson = {
          operation: 'resize',
          cols: term.current.cols,
          rows: term.current.rows,
        };
        ws.current.send(JSON.stringify(sendJson));
        term.current.focus();
        ws.current.onerror = () => {
          term.current.writeln('\n\x1B[1;3;31m WebSocket连接失败，请刷新页面重试\x1B[0m');
        };

        //  term.current.writeln('欢迎使用 \x1B[1;3;31mMATRIX\x1B[0m: ');
        //  term.current.write('WebSocket链接成功');
      }
    };
  };

  return (
    <ContentCard noPadding className="viewLog">
      <div className="loginShell">
        <div style={{ paddingBottom: '6px', paddingTop: '6px', display: 'flex' }}>
          <div className="shell-caption">
            <div className="caption-left">
              <Form form={viewLogform} layout="inline">
                <span style={{ paddingLeft: 12 }}>选择容器： </span>
                <Form.Item name="containerName">
                  <Select
                    style={{ width: 220 }}
                    options={queryListContainer}
                    onChange={selectListContainer}
                    defaultValue={currentContainerName}
                  ></Select>
                </Form.Item>
              </Form>
            </div>
            <div className="caption-right">
              <span>
                当前环境：<Tag color="geekblue">{envCode}</Tag>
              </span>
            </div>
          </div>
        </div>
        <div id="terminal" className="xterm" style={{ width: '100%', backgroundColor: '#060101' }}></div>
        <div style={{ height: 28, width: '100%', textAlign: 'center', marginTop: 4 }}>
          <span className="eventButton">
            <Button type="primary" onClick={closeSocket}>
              关闭
            </Button>
          </span>
        </div>
      </div>
    </ContentCard>
  );
}
