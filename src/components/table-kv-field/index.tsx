// 键值对表格表单
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/02 08:18

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Table, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import VCCustomIcon from '@cffe/vc-custom-icon';
import './index.less';

export interface TableSourceItemProps extends Record<string, any> {
  key: string;
  value: string;
  desc?: string;
}

export interface TableFieldProps extends Record<string, any> {
  value?: Record<string, string>;
  onChange?: (next: Record<string, string>) => any;
}

export default function TableField(props: TableFieldProps) {
  const [dataSource, setDataSource] = useState<TableSourceItemProps[]>([]);
  const valueRef = useRef<Record<string, string>>();

  useEffect(() => {
    if (valueRef.current === props.value) return;
    if (!props.value) return;
    valueRef.current = props.value;

    const next: TableSourceItemProps[] = Object.keys(props.value).map(
      (key) => ({
        key: key,
        value: props.value ? props.value[key] : '',
      }),
    );

    setDataSource(next);
  }, [props.value]);

  const handleAddLine = (e: React.SyntheticEvent<HTMLElement>) => {
    e && e.preventDefault();
    e && e.stopPropagation();
    // props?.onChange();
    const nextValue = {
      ...props.value,
    };
  };

  const handleDelLine = (index: number) => {};

  return (
    <div className="table-kv-field">
      <Table bordered dataSource={dataSource}>
        <Table.Column
          dataIndex="key"
          title="key"
          render={() => <Input placeholder="key" />}
        />
        <Table.Column
          dataIndex="value"
          title="value"
          render={() => <Input placeholder="value" />}
        />
        <Table.Column
          title="操作"
          width={80}
          render={(_, record, index) => (
            <a onClick={() => handleDelLine(index)}>
              <VCCustomIcon type="icondelete" fontSize="16px" />
            </a>
          )}
        />
      </Table>
      <a className="table-kv-addline" onClick={handleAddLine}>
        <PlusOutlined /> 新增
      </a>
    </div>
  );
}
