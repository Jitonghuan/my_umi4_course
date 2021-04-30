import React from 'react';
import { Table, Card } from 'antd';
import From from './form';
import { TableSearchProps } from './typing';
import './index.less';

const TableSearch: React.FC<TableSearchProps> = ({
  showTableTitle,
  extraNode,
  style,
  className,
  ...rest
}) => {
  return (
    <div style={style} className={className}>
      <Card bordered={false}>
        <From {...rest} />
      </Card>
      <Card bordered={false}>
        <div className="extra-node-box">
          {showTableTitle ? <b style={{ fontSize: '16px' }}>{}</b> : null}
          <>{extraNode}</>
        </div>
        <Table {...rest} />
      </Card>
    </div>
  );
};

export default TableSearch;
