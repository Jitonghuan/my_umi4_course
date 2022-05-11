import { useState } from 'react';
import { Tag, Tooltip, Pagination, Empty } from 'antd';
import './index.less';

export default function LeftList(props: any) {
  const [activeItem, setActiveItem] = useState<any>();
  const { listData } = props;
  return listData.length !== 0 ? (
    <div className="left-list-wrapper">
      {listData?.map((item: any) => (
        <div
          className={`list-item ${item?.key === activeItem?.key ? 'list-item-active' : ''}`}
          onClick={() => {
            setActiveItem(item);
          }}
        >
          <Tooltip title={item?.traceID}>
            <div className="item-traceId">{item?.endpointNames[0]}</div>
          </Tooltip>
          <div className="item-message">
            {' '}
            <Tag color="default">{item?.duration}ms</Tag>
            {item?.start}
          </div>
        </div>
      ))}
      <div className="list-page">
        <Pagination defaultCurrent={1} total={20} size="small" showQuickJumper />
      </div>
    </div>
  ) : (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ width: '100%', overflow: 'hidden' }} />
  );
}
