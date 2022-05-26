import React, { useEffect, useState } from 'react';
import { Button, Input } from '@cffe/h2o-design';
import { CloseSquareOutlined } from '@ant-design/icons';

import './index.less';

type IOption = {
  label: string;
  value: string | number;
};

export interface IProps {
  onChange?: (opt: IOption[]) => void;
}

export type IRenderRowProps = {
  /** 唯一键 */
  rowKey: number;
  /** 设置数据 */
  setData: (rowKey: number, str: string, field: string) => void;
  /** 删除数据 */
  delData: (rowKey: number) => void;
};

function RenderRow(props: IRenderRowProps) {
  const { rowKey, setData, delData } = props;

  return (
    <div className="fe-end-enum-rows">
      <Input placeholder="label" onChange={(e) => setData(rowKey, e.target.value, 'label')} />
      ：
      <Input placeholder="value" onChange={(e) => setData(rowKey, e.target.value, 'value')} />
      <CloseSquareOutlined className="fe-end-enum-rows-delete" onClick={() => delData(rowKey)} />
    </div>
  );
}

export type IRow = any[];

/**
 * 按钮组件
 * @description 这是一个按钮组件
 * @author author
 * @version 1.0.0
 * @create 2021-01-05 16:17
 */
const ArrayComponent = (props: IProps) => {
  const { onChange } = props;

  const [rows, setRows] = useState([] as IRow);

  const setData = (key: number, str: string, field = 'label') => {
    if (!rows[key]) {
      rows[key] = {};
    }

    rows[key][field] = str;

    setRows(rows);
  };

  const delData = (rowKey: number) => {
    if (rowKey >= rows.length) {
      return;
    }

    setRows(rows.splice(rowKey, 1));
  };

  useEffect(() => {
    onChange && onChange(rows);
  }, [rows]);

  return (
    <div>
      {rows.map((el, idx) => (
        <RenderRow key={idx} rowKey={idx} setData={setData} delData={delData} />
      ))}
      <Button onClick={() => setRows(rows.concat({}))}>添加</Button>
    </div>
  );
};

export default ArrayComponent;
