import { useState } from 'react';
import {
    FileTextOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';

export default function OperateBtn() {
    const [visible, setVisbible] = useState<Boolean>(false);
    const toLogDetail = () => {

    }
    return (
        <div className='operate-btn'>
            <a style={{}} onClick={() => { toLogDetail }}>
                <FileTextOutlined />
                {/* 查看日志 */}
            </a>
        </div>
    )
}
