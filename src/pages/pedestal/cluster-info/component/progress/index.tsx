import { Progress } from 'antd';
import React from 'react';

export default function ProgressComponent(props: any) {
    const { percent } = props;
    return <Progress percent={percent} size="small" strokeWidth={20} showInfo={false} style={{ width: '150px' }} strokeColor='#36cd50' />
}