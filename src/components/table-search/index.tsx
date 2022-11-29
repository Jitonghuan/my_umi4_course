import React from 'react';
import { Table, Card } from 'antd';
import FormList from './form';
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
        {form ? <FormList form={form} {...rest} /> : null}
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
        <FormList form={form} {...rest} />
      </FilterCard>
      <ContentCard>
        {
          showTableTitle || extraNode ? (
            <div className="extra-node-box">
              {showTableTitle ? <b style={{ fontSize: '16px' }}>{tableTitle}</b> : null}
              <>{extraNode}</>
            </div>
          ) : null
        }

        <Table className={className} columns={columns} loading={!rest?.dataSource}  {...rest} rowKey={rest.rowKey || 'id'} />
      </ContentCard>
    </>
  );
};

export default TableSearch;
