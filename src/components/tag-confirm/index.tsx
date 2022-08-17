import { CloseOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import './index.less'

export default function TagConfirm(props: any) {
    const { content, title, onConfirm, color = '#e9f7ee', fontColor = '#2a7a56', borderColor = '#bce0d0', style } = props;
    return (
        <span style={{ backgroundColor: color, border: `1px solid ${borderColor}`, ...style }} className='confirm-tag'>
            <span style={{ marginRight: '10px', color: fontColor }}> {content}</span>
            <Popconfirm title={title} onConfirm={onConfirm}>
                <CloseOutlined style={{ fontSize: '10px', color: 'grey' }} />
            </Popconfirm>
        </span>
    )
}