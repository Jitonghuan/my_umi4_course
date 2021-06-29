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
  columns,
  form,
  ...rest
}) => {
  columns?.forEach((v) => {
    if (!v.render) {
      v.render = (text) => text || '';
    }
  });

  return (
    <>
      <FilterCard className="antd-card-form" bodyStyle={{ paddingBottom: 12 }}>
        <From form={form} {...rest} />
      </FilterCard>
      <ContentCard>
        <div className="extra-node-box">
          {showTableTitle ? <b style={{ fontSize: '16px' }}>{tableTitle}</b> : null}
          <>{extraNode}</>
        </div>
        <Table className={className} columns={columns} {...rest} />
      </ContentCard>
    </>
  );
};

export default TableSearch;
