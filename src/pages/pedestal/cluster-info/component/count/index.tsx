import './index.less';
import { STATUS_COLOR } from '../../type';
export default function Count(props: any) {
  const { data } = props;
  const getColor = (item: any) => {
    if (item?.nodeRole === 'master' && item.status && item.status[0] === 'health') {
      return '#658bdb';
    } else if (item.status && item.status[0] === 'health') {
      return '#58ce6b';
    } else {
      return STATUS_COLOR[item?.status[0]] || '#dae0da';
    }
  };
  return (
    <div className="count-wrapper" style={{ display: 'flex', marginLeft: '20px' }}>
      {data?.map((item: any, index: number) => {
        return <div className="count-item" key={index} style={{ backgroundColor: getColor(item) }}></div>;
      })}
    </div>
  );
}
