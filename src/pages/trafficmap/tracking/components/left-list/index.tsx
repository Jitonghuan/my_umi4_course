import { useState, useEffect } from 'react';
import { Tag, Tooltip, Pagination, Empty, Spin } from 'antd';
import './index.less';
import { leftItem } from '../../type';
import { getListMonitor } from '@/pages/monitor/business/service';
import moment from '_moment@2.29.3@moment';

interface IProps {
  listData: leftItem[];
  changeItem: any;
  total: number;
  pageChange: any;
  loading: boolean;
}

export default function LeftList(props: IProps) {
  const { listData, changeItem, total, pageChange, loading } = props;
  const [activeItem, setActiveItem] = useState<leftItem>();
  const [current, setCurrent] = useState<number>(1);

  useEffect(() => {
    if (listData.length !== 0) {
      setActiveItem(listData[0]);
    }
  }, [listData]);

  useEffect(() => {
    changeItem(activeItem);
  }, [activeItem]);

  return listData.length !== 0 ? (
    <div className="left-list">
      <Spin spinning={loading}>
        <div className="left-list-wrapper">
          {listData?.map((item: leftItem) => (
            <div
              className={`list-item ${item?.key === activeItem?.key ? 'list-item-active' : ''}`}
              onClick={() => {
                setActiveItem(item);
              }}
            >
              <Tooltip title={item?.endpointNames[0]}>
                <div className="item-traceId">{item?.endpointNames[0]}</div>
              </Tooltip>
              <div className="item-message">
                {' '}
                <Tag color="default">{item?.duration}ms</Tag>
                {moment(Number(item?.start)).format('YYYY-MM-DD HH:mm:ss')}
                {/* {item?.start} */}
              </div>
            </div>
          ))}
        </div>
        <div className="list-page">
          <Pagination
            current={current}
            total={total}
            pageSize={20}
            size="small"
            showSizeChanger={false}
            onChange={(page, pageSize) => {
              setCurrent(page);
              pageChange({ pageIndex: page, pageSize });
            }}
          />
        </div>
      </Spin>
    </div>
  ) : (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ width: '100%', overflow: 'hidden' }} />
  );
}
