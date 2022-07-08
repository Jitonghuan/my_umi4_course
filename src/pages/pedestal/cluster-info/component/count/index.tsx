import './index.less'
import { STATUS_COLOR } from '../../type'
export default function Count(props: any) {
    const { data } = props;
    return (
        <div style={{ display: 'flex', marginLeft: '20px' }}>
            {data.map((item: any, index: number) => {
                return <div className='count-item' key={index} style={{ backgroundColor: `${STATUS_COLOR[item.status] || '#36cd50'}` }}></div>
            })}
            {/* {Array(23).fill(1).map((item, index) => {
                return <div className='count-item' key={index}></div>
            })} */}
        </div>
    )
}