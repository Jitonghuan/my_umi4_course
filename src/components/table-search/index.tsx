import React from 'react';
import { Table, Card } from 'antd';
import From from './form';
import { TableSearchProps } from './typing';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import './index.less';

const TableSearch: React.FC<TableSearchProps> = ({
  showTableTitle,
  extraNode,
  style,
  className,
  tableTitle,
  ...rest
}) => {
  return (
    <>
      <FilterCard className="antd-card-form" bodyStyle={{ paddingBottom: 12 }}>
        <From {...rest} />
      </FilterCard>
      <ContentCard>
        <div className="extra-node-box">
          {showTableTitle ? (
            <b style={{ fontSize: '16px' }}>{tableTitle}</b>
          ) : null}
          <>{extraNode}</>
        </div>
        <Table className={className} {...rest} />
      </ContentCard>
    </>
  );
};

export default TableSearch;
