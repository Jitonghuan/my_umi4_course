// import './index.less';
import { useState } from 'react';
import { Tag, Tooltip, Pagination } from 'antd';
import './index.less';

export default function LeftList(props: any) {
  const [activeItem, setActiveItem] = useState<any>();
  const { listData } = props;
  return (
    <div className="left-list-wrapper">
      {listData?.map((item: any) => (
        <div
          className={`list-item ${item?.id === activeItem?.id ? 'list-item-active' : ''}`}
          onClick={() => {
            setActiveItem(item);
          }}
        >
          <Tooltip title={item?.traceID}>
            <div className="item-traceId">{item?.traceID}</div>
          </Tooltip>
          <div className="item-message">
            {' '}
            <Tag color="default">{item?.duration}ms</Tag>
            {item?.time}
          </div>
        </div>
      ))}
      <div className="list-page">
        <Pagination defaultCurrent={1} total={50} size="small" showQuickJumper />
      </div>
    </div>
  );
}
