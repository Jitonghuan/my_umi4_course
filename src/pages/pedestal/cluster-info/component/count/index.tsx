import './index.less'
import { STATUS_COLOR } from '../../type'
export default function Count(props: any) {
    const { data } = props;
    return (
        <div className='count-wrapper' style={{ display: 'flex', marginLeft: '20px' }}>
            {data?.map((item: any, index: number) => {
                return <div className='count-item' key={index} style={{ backgroundColor: `${STATUS_COLOR[item.status] || '#d2c4c4'}` }}></div>
            })}
        </div>
    )
}