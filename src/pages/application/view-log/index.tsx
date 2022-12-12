import React, { useState, useEffect, useRef, useContext } from 'react';
import { Form, Button, Select, message, Modal } from 'antd';
import { FeContext } from '@/common/hooks';
import { AnsiUp } from 'ansi-up';
import { history, useLocation, Outlet } from 'umi';
import { parse, stringify } from 'query-string';

export default function ViewLog(props: any) {
    const query: any = parse(location.search);
    // const { location, children } = props;
    const { taskCode = '', instanceCode = '' } = query || {};
    const [log, setLog] = useState<string>('');
    let ws = useRef<WebSocket>();
    let scrollBegin = useRef<boolean>(true);
    const logData = useRef<string>('');
    let ansi_up = new AnsiUp();
    const { matrixConfigData } = useContext(FeContext);

    useEffect(() => {
        if (taskCode && instanceCode) {
            ws.current = new WebSocket(
                window.location.href?.includes('gushangke')
                    ? `ws://matrix-api.gushangke.com/v2/releaseManage/deploy/ws?taskCode=${taskCode}&instanceCode=${instanceCode}&reqType=taskLog`
                    : `${matrixConfigData.wsPrefixName}/v2/releaseManage/deploy/ws?taskCode=${taskCode}&instanceCode=${instanceCode}&reqType=taskLog`,
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

    }, [taskCode, instanceCode])

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

    const closeSocket = () => {
        if (ws.current) {
            ws.current.close();
        }
        history.back();
    };
    return (
        <div>
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

    )
}