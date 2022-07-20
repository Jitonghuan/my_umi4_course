import { Pie } from '@ant-design/plots';
import './index.less'

export default function CardList(props: any) {
    const { width = 150, height = 100, showPie = false } = props;
    const itemHeight = height / 3;
    const data = [{ value: 123 / 256, type: 'hha' }, { value: (256 - 123) / 256, type: 'xiixi' }]
    const config: any = {
        width: 60,
        height: 60,
        angleField: 'value',
        colorField: 'type',
        radius: 0.9,
        data,
        legend: false,
        label: false,
    }
    return (
        <div className={`flex-column card-wrapper`} style={{ width, height }}>
            <div style={{ flex: '1', fontSize: '16px', height: itemHeight }}>
                机器数
                <div >
                    <div style={{ textAlign: showPie ? 'left' : 'center', lineHeight: '40px' }}>123/256C</div>
                    {showPie && <Pie style={{ float: 'right', marginTop: `-${config.height + 10}px` }} {...config}></Pie>}
                </div>

            </div>
            {/* <div className='flex-center' style={{ height: itemHeight }}>
                <div style={{ marginRight: '20px' }}>123/256C</div>
                {showPie && <Pie {...config}></Pie>}
            </div> */}
            <a className='flex-end' style={{ fontSize: '13px' }}>变化趋势</a>
        </div>
    )

}