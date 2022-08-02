// 登陆shell
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/11/12	17:04

import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { Select, Form, Button, Tag, message } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import { history } from 'umi';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { AttachAddon } from 'xterm-addon-attach';
import { FeContext } from '@/common/hooks';
import clusterContext from '../../context';
import { getResourceList } from '../../service';
import './index.less';

export default function ClusteLoginShell(props: any) {
    const [viewLogform] = Form.useForm();
    const { type, name, namespace, clusterCode, containerName } = props.location.query || {};
    const { matrixConfigData } = useContext(FeContext);
    const [container, setContainer] = useState<any>([]);
    const [selectContainer, setSelectContainer] = useState<any>('');
    const baseUrl = window.location.href?.includes('gushangke')
        ? `ws://matrix-api.gushangke.com/v1/appManage/deployInfo/instance/ws?action=shell&clusterCode=${clusterCode}`
        : `${matrixConfigData.wsPrefixName}/v1/appManage/deployInfo/instance/ws?action=shell&clusterCode=${clusterCode}`;
    const ws = useRef<WebSocket>();
    const term = useRef<any>();

    useEffect(() => {
        if (!selectContainer && container && container.length) {
            setSelectContainer(container[0].value)
            viewLogform.setFieldsValue({ containerName: container[0].value })
            if (!matrixConfigData?.wsPrefixName) {
                return;
            }
            initWS(container[0].value)
        }
    }, [container, matrixConfigData?.wsPrefixName]);

    const getUrl = useCallback((v: string) => {
        if (type === 'node') {
            return `${baseUrl}&nodeName=${name}`
        } else {
            return `${baseUrl}&instName=${name}&namespace=${namespace}&containerName=${v}`
        }
    }, [type, baseUrl])

    useEffect(() => {
        // 从pods跳转
        if (type === 'pods' && name && namespace && !containerName) {
            getResourceList({ clusterCode, resourceName: name, namespace, resourceType: 'pods' }).then((res) => {
                if (res?.success) {
                    const { items } = res?.data || {};
                    if (items && items[0]) {
                        let containerData = []
                        containerData = (items[0]?.info?.containers || [])
                            .filter((item: any) => item?.status === 'Running')
                            .map((item: any) => ({ label: item.name, value: item.name }))
                        setContainer(containerData)
                    }
                }

            })
        }
        // 从节点列表跳转
        if (type === 'node' && name) {
            if (!matrixConfigData?.wsPrefixName) {
                return;
            }
            initWS(getUrl(''))
        }
        // 从容器列表直接跳转过来
        if (type === 'pods' && containerName) {
            setContainer([{ value: containerName, label: containerName }])
        }
    }, [type, name, namespace, matrixConfigData?.wsPrefixName])

    const initWS = (value: string) => {
        let dom: any = document?.getElementById('terminal');
        ws.current = new WebSocket(getUrl(value)); //建立通道
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
            window.removeEventListener('resize', function () { });
        };
    }, []);
    const closeSocket = () => {
        if (ws.current) {
            ws.current.close();
            history.goBack();
        }
    };
    //选择容器
    const selectListContainer = (c: string) => {
        if (ws.current) {
            ws.current.close();
        }
        // currentContainerName = getContainer;
        setSelectContainer(c)
        ws.current = new WebSocket(getUrl(c)); //建立通道

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
        // <ContentCard noPadding className="viewLog">
        <div className="loginShell">
            <div style={{ paddingBottom: '6px', paddingTop: '6px', display: 'flex' }}>
                <div className="shell-caption">
                    <div className="caption-left">
                        {type !== 'node' && (
                            <Form form={viewLogform} layout="inline">
                                <span style={{ paddingLeft: 12 }}>选择容器： </span>
                                <Form.Item name="containerName">
                                    <Select
                                        style={{ width: 220 }}
                                        options={container}
                                        value={selectContainer}
                                        onChange={selectListContainer}
                                    ></Select>
                                </Form.Item>
                            </Form>
                        )}
                    </div>
                    <div className="caption-right">
                        <span>
                            {/* 当前集群：<Tag color="geekblue">{envCode}</Tag> */}
                        </span>
                    </div>
                </div>
            </div>
            <div id="terminal" className="xterm" style={{ width: '100%', maxHeight: "calc(100vh - 135px)", backgroundColor: '#060101' }}></div>
            <div style={{ height: 28, width: '100%', textAlign: 'center', marginTop: 4 }}>
                <span className="eventButton">
                    <Button type="primary" onClick={closeSocket}>
                        关闭
            </Button>
                </span>
            </div>
        </div>
        // </ContentCard>
    );
}
