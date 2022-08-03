import { useMemo } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import './index.less';

export default function page(props: any) {
  const {
    continueList,
    clickLeft,
    clickRright,
    total = 10,
    pageIndex = 1,
    totalPage = 1,
    pageChange,
    defaultValue,
  } = props;
  const leftDisable = useMemo(() => pageIndex <= 1, [pageIndex]);
  const rightDisable = useMemo(() => totalPage == pageIndex, [pageIndex, totalPage]);
  const pageOptions = [
    { label: '20/页', value: 20 },
    { label: '50/页', value: 50 },
    { label: '全部', value: '' },
  ];
  return (
    <div className="flex-row">
      <div className="flex-center">
        共<span className="count">{total}</span>条，共{totalPage}页，当前在第<span className="count">{pageIndex}</span>
        页
      </div>
      <div onClick={leftDisable ? () => {} : clickLeft} className={`page-div ${leftDisable ? 'disable' : ''}`}>
        <LeftOutlined />
      </div>
      <div onClick={rightDisable ? () => {} : clickRright} className={`page-div ${rightDisable ? 'disable' : ''}`}>
        <RightOutlined />
      </div>
      <div style={{ marginLeft: '5px' }}>
        <Select options={pageOptions} defaultValue={defaultValue} onChange={pageChange} style={{ width: 80 }}></Select>
      </div>
    </div>
  );
}
