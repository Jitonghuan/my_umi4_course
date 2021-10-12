import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Table, Input, Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';

import './index.less';

interface IEditableTable {
  data: any[];
  setData: React.Dispatch<React.SetStateAction<any[]>>;
  readOnly?: boolean;
  onChange?: (value: any[]) => void;
}

const type = 'DraggableBodyRow';

const DraggableBodyRow = ({ index, moveRow, className, style, ...restProps }: any) => {
  const ref = useRef();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = (monitor.getItem() as any) || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item: any) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));

  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    />
  );
};

const DragSortingTable: React.FC<IEditableTable> = (props) => {
  const { data, setData } = props;
  const [cnt, setCnt] = useState<number>(0);

  useEffect(() => {
    props.onChange?.(data);
  }, [data]);

  const getKey = (): string => {
    setCnt(cnt + 1);
    return new Number(cnt).toString();
  };

  const addRow = () => {
    setData([...data, { key: getKey(), value: '', desc: '' }]);
  };

  const cloneRow = (key: string) => {
    const baseData = data.find((item) => item.key === key);
    setData([...data, { ...baseData, key: getKey() }]);
  };

  const deleteRow = (key: string) => {
    setData([...data.filter((item) => item.key !== key)]);
  };

  const editRow = (idx: number, propName: string, propValue: string) => {
    data[idx][propName] = propValue;
    setData([...data]);
  };

  const components = {
    body: {
      row: DraggableBodyRow,
    },
  };

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = data[dragIndex];
      setData(
        update(data, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      );
    },
    [data],
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <Table
        className="editable-table"
        dataSource={data}
        components={components}
        // @ts-ignore
        onRow={(_, index) => ({
          index,
          moveRow,
        })}
        pagination={false}
        footer={() => <Button block icon={<PlusOutlined />} onClick={addRow} />}
      >
        <Table.Column title="编号" render={(_: any, __: any, index: number) => 1 + index} />
        <Table.Column
          title="步骤描述"
          dataIndex="value"
          render={(value, _: any, index: number) => (
            <div className="text-area-container">
              <Input.TextArea
                className="text-area"
                placeholder="输入步骤描述"
                value={value}
                disabled={props.readOnly}
                onChange={(e) => editRow(index, 'value', e.target.value)}
              />
            </div>
          )}
        />
        <Table.Column
          title="预期结果"
          dataIndex="desc"
          render={(value, _: any, index: number) => (
            <div className="text-area-container">
              <Input.TextArea
                className="text-area"
                placeholder="输入预期结果"
                value={value}
                disabled={props.readOnly}
                onChange={(e) => editRow(index, 'desc', e.target.value)}
              />
            </div>
          )}
        />
        <Table.Column
          title="操作"
          dataIndex="key"
          render={(key: string) => (
            <Space>
              <a onClick={() => cloneRow(key)}>复制</a>
              <a onClick={() => deleteRow(key)}>删除</a>
            </Space>
          )}
        />
      </Table>
    </DndProvider>
  );
};

export default DragSortingTable;
