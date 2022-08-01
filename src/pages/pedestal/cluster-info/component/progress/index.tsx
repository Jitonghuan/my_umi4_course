import { Progress } from 'antd';
import { useMemo } from 'react'

export default function ProgressComponent(props: any) {
    const { percent } = props;
    const color = useMemo(() => percent > 80 ? '#d0c669' : '#65ca75', [percent])
    return <Progress percent={percent} size="small" strokeWidth={20} showInfo={false} style={{ width: '30%' }} trailColor='#ededed' strokeColor={`${color}`} />
}