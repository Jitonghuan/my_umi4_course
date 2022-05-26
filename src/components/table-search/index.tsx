import React from 'react';
import { Table, Card } from '@cffe/h2o-design';
import Form from './form';
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
  splitLayout = true,
  ...rest
}) => {
  columns?.forEach((v) => {
    if (!v.render) {
      v.render = (text) => text || '';
    }
  });

  if (splitLayout === false) {
    return (
      <ContentCard>
        <Form form={form} {...rest} />
        <div className="extra-node-box" style={{ marginTop: 20 }}>
          {showTableTitle ? <b style={{ fontSize: '16px' }}>{tableTitle}</b> : null}
          <>{extraNode}</>
        </div>
        <Table className={className} columns={columns} {...rest} rowKey={rest.rowKey || 'id'} />
      </ContentCard>
    );
  }

  return (
    <>
      <FilterCard className="antd-card-form" bodyStyle={{ paddingBottom: 12 }}>
        <Form form={form} {...rest} />
      </FilterCard>
      <ContentCard>
        <div className="extra-node-box">
          {showTableTitle ? <b style={{ fontSize: '16px' }}>{tableTitle}</b> : null}
          <>{extraNode}</>
        </div>
        <Table className={className} columns={columns} {...rest} rowKey={rest.rowKey || 'id'} />
      </ContentCard>
    </>
  );
};

export default TableSearch;
