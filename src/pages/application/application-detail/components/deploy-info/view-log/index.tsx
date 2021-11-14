// 查看日志
// @author JITONGHUAN <moyan@come-future.com>
// @create 2021/11/12 17:35

import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import { Select, Card, message, Form } from 'antd';
import AceEditor from '@/components/ace-editor';
import { ContentCard } from '@/components/vc-page-content';
import * as APIS from '../deployInfo-content/service';
import { getRequest } from '@/utils/request';
import DetailContext from '@/pages/application/application-detail/context';
import './index.less';

export default function ViewLog(props: any) {
  const [viewLogform] = Form.useForm();
  const { appData } = useContext(DetailContext);
  const [queryListContainer, setQueryListContainer] = useState<any>();
  const [currentContainer, setCurrentContainer] = useState<string>('');
  const { appCode, envCode, insName } = props.location.query;
  let currentContainerName = '';
  let socket = new WebSocket(
    `ws://matrix-test.cfuture.shop/v1/appManage/deployInfo/instance/ws?appCode=${appData?.appCode}&envCode=${envCode}&instName=${insName}&containerName=${currentContainerName}`,
  ); //建立通道
  useEffect(() => {
    getRequest(APIS.listContainer, { data: { appCode, envCode, instName: insName } }).then((result) => {
      let data = result.data;
      if (result.success) {
        const listContainer = data.map((item: any) => ({
          value: item?.containerName,
          label: item?.containerName,
        }));
        currentContainerName = listContainer[0].value;
        console.log('currentContainerName', currentContainerName);
        viewLogform.setFieldsValue({ containerName: currentContainerName });
        setCurrentContainer(currentContainerName);
        setQueryListContainer(listContainer);
      }
    });
  }, [appCode, envCode]);
  const selectListContainer = (getContainer: string) => {
    currentContainerName = getContainer;
    setCurrentContainer(getContainer);
    socket.onclose = () => {
      message.info('关闭websocket!');
    };
    socket.onopen = () => {
      console.log(socket);
      message.success('更换容器，WebSocket链接成功!');
      // 链接成功后
      //  initTerm()
    };
  };

  useEffect(() => {
    socket.onopen = () => {
      console.log(socket);
      message.success('WebSocket链接成功!');
      // 链接成功后
      //  initTerm()
    };

    let dom = document?.getElementById('result-log');
    socket.onmessage = function (evt) {
      if (dom) {
        dom.scrollTop = dom?.scrollHeight;
      }
      //如果返回结果是字符串，就拼接字符串，或者push到数组，
      // term.write(evt.data.data);
    };

    socket.onerror = () => {
      // term.writeln('webSocket 链接失败');
      message.warning('webSocket 链接失败');
    };
  }, []);

  return (
    <ContentCard noPadding className="loginShell">
      <div style={{ backgroundColor: '#060101', height: '100%', color: 'white', paddingLeft: 16 }}>
        <pre>查看日志{'>>>>'}</pre>

        <Form form={viewLogform} layout="inline">
          <span style={{ color: 'white' }}>选择容器： </span>
          <Form.Item name="containerName">
            <Select style={{ width: 120 }} options={queryListContainer} onChange={selectListContainer}></Select>
          </Form.Item>
        </Form>
        <div id="result-log" className="result-log">
          gjgjhggjhghjghjgjgjhjghjghgjghjgjhgjjgjjgjgjggj
        </div>
      </div>
    </ContentCard>
  );
}
