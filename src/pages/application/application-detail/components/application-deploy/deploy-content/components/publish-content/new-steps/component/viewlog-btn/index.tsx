import ViewLogModal from '../../view-log-modal';
import { useState } from 'react';
import {
    FileTextOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';

export default function OperateBtn() {
    const [visible, setVisbible] = useState<Boolean>(false);
    return (
        <div className='operate-btn'>
            <ViewLogModal visible={visible} onClose={() => { setVisbible(false) }} />
            <a style={{}} onClick={() => { setVisbible(true) }}>
                <FileTextOutlined />
                {/* 查看日志 */}
            </a>
            {/* <a style={{ paddingLeft: 4, color: 'red' }} onClick={() => { }}>
                <CloseCircleOutlined />
            </a> */}
        </div>
    )
}
