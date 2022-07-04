import './index.less'
export default function Count(props: any) {
    const { count } = props;
    return (
        <div style={{ display: 'flex', marginLeft: '20px' }}>
            {Array(23).fill(1).map((item, index) => {
                return <div className='count-item' key={index}></div>
            })}
        </div>
    )
}