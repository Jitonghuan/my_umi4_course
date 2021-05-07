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
  ...rest
}) => {
  return (
    <>
      <FilterCard className="antd-card-form">
        <From {...rest} />
      </FilterCard>
      <ContentCard>
        <div className="extra-node-box">
          {showTableTitle ? <b style={{ fontSize: '16px' }}>{}</b> : null}
          <>{extraNode}</>
        </div>
        <Table {...rest} />
      </ContentCard>
    </>
  );
};

export default TableSearch;
