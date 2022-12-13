import { useState, useContext, useRef, useEffect } from 'react';
import { Modal, message } from 'antd';
import {
    FileTextOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import { FeContext } from '@/common/hooks';
import { AnsiUp } from 'ansi-up';
import './index.less';
import DetailContext from '@/pages/application/application-detail/context';

export interface Iprops {
    visible: boolean,
    onClose: any,
    taskCode: string,
    instanceCode: string,
    taskName: string
}
export default function ViewLogModal(props: any) {
    const { visible, onClose, taskCode, instanceCode, taskName } = props;
    const { appData } = useContext(DetailContext);
    const [log, setLog] = useState<string>('');
    let ws = useRef<WebSocket>();
    let scrollBegin = useRef<boolean>(true);
    const logData = useRef<string>('');
    let ansi_up = new AnsiUp();
    const { matrixConfigData } = useContext(FeContext);

    useEffect(() => {
        if (visible && appData?.appCode) {
            ws.current = new WebSocket(
                window.location.href?.includes('gushangke')
                    ? `ws://matrix-api.gushangke.com/v2/releaseManage/deploy/ws?taskCode=${taskCode}&instanceCode=${instanceCode}&reqType=taskLog`
                    : `ws://10.10.129.36:8080/v2/releaseManage/deploy/ws?taskCode=${taskCode}&instanceCode=${instanceCode}&reqType=taskLog`,
            ); //建立通道
            let dom: any = document?.getElementById('publich-result-log-modal');
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
                    // scrollBottom();
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
        if (!visible) {
            logData.current = '';
            setLog('');
            if (ws.current) {
                ws.current.close();
            }
        }
    }, [visible, appData])

    //回到底部
    const scrollBottom = () => {
        let dom = document?.getElementById('publich-result-log-modal');
        if (dom) {
            let scroll = dom.scrollHeight;
            dom.scrollTo(0, scroll);
            scrollBegin.current = true;
        }
    };

    return (
        <Modal
            visible={visible}
            className='view-log-modal'
            width={1000}
            title={
                <div className='flex-space-between title-section'>
                    <div className='modal-title'>
                        <h4>{taskCode || '--'}</h4>
                        <span>{taskName || '--'}</span>
                    </div>
                    <div className='modal-title'>
                        <h4>{appData?.appCode || '--'}</h4>
                        <span>{appData?.appName || '--'}</span>
                    </div>
                </div>
            }
            onCancel={onClose}
            footer={null}
        >
            <div
                id="publich-result-log-modal"
                className="publich-result-log-modal"
                style={{
                    whiteSpace: 'pre-line',
                    padding: 8,
                    lineHeight: 2,
                    fontSize: 14,
                    // color: '#12a182',
                    wordBreak: 'break-word',
                }}
            >
                {log}
            </div>
        </Modal>
    )
}
