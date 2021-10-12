import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Table, Input, Button, Space, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';

import './index.less';

interface IEditableTable {
  value?: any[];
  readOnly?: boolean;
  onChange?: (value?: any[]) => void;
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
  const { value } = props;
  const [cnt, setCnt] = useState<number>(0);

  useEffect(() => {
    props.onChange?.(value);
  }, [value]);

  const getKey = (): string => {
    setCnt(cnt + 1);
    return new Number(cnt).toString();
  };

  const addRow = () => {
    if (!value) return;
    props.onChange?.([...value, { key: getKey(), value: '', desc: '' }]);
  };

  const cloneRow = (key: string) => {
    if (!value) return;
    const baseData = value.find((item) => item.key === key);
    props.onChange?.([...value, { ...baseData, key: getKey() }]);
  };

  const deleteRow = (key: string) => {
    if (!value) return;
    props.onChange?.([...value.filter((item) => item.key !== key)]);
  };

  const editRow = (idx: number, propName: string, propValue: string) => {
    if (!value) return;
    value[idx][propName] = propValue;
    props.onChange?.([...value]);
  };

  const components = {
    body: {
      row: DraggableBodyRow,
    },
  };

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      if (!value) return;
      const dragRow = value[dragIndex];
      props.onChange?.(
        update(value, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      );
    },
    [value],
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <Table
        className="editable-table"
        dataSource={value}
        components={components}
        // @ts-ignore
        onRow={(_, index) => ({
          index,
          moveRow,
        })}
        pagination={false}
        footer={() => {
          if (props.readOnly) return null;
          return <Button block icon={<PlusOutlined />} onClick={addRow} />;
        }}
      >
        <Table.Column title="编号" render={(_: any, __: any, index: number) => 1 + index} />
        <Table.Column
          title="步骤描述"
          dataIndex="value"
          render={(value, _: any, index: number) => (
            <Form.Item
              noStyle
              name={['stepContent', index, 'input']}
              rules={[{ required: true, message: '请输入步骤描述' }]}
            >
              <Input.TextArea className="text-area" placeholder="步骤描述" value={value} disabled={props.readOnly} />
            </Form.Item>
          )}
        />
        <Table.Column
          title="预期结果"
          dataIndex="desc"
          render={(value, _: any, index: number) => (
            <Form.Item
              noStyle
              name={['stepContent', index, 'output']}
              rules={[{ required: true, message: '请输入步骤描述' }]}
            >
              <Input.TextArea className="text-area" placeholder="预期结果" value={value} disabled={props.readOnly} />
            </Form.Item>
          )}
        />
        {props.readOnly ? null : (
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
        )}
      </Table>
    </DndProvider>
  );
};

export default DragSortingTable;
