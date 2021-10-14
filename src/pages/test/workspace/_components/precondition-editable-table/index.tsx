import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Table, Input, Button, Space, Form, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { preconditionOptions } from '../../constant';
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
    if (!value) {
      props.onChange?.([{ key: getKey(), value: '', desc: '' }]);
      return;
    }
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

  const PreWrapDiv = (props: any) => {
    return <div style={{ whiteSpace: 'pre-wrap' }}>{props.value}</div>;
  };

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
          title="类型"
          dataIndex="category"
          render={(value, _: any, index: number) => (
            <Form.Item
              noStyle
              name={['precondition', index, 'category']}
              rules={[{ required: true, message: '请选择前置条件类型' }]}
            >
              {props.readOnly ? <PreWrapDiv value /> : <Select options={preconditionOptions} placeholder="请选择" />}
            </Form.Item>
          )}
        />
        <Table.Column
          title="描述"
          dataIndex="desc"
          render={(value, _: any, index: number) => (
            <Form.Item
              noStyle
              name={['precondition', index, 'desc']}
              rules={[{ required: true, message: '请输入前置条件描述' }]}
            >
              {props.readOnly ? (
                <PreWrapDiv />
              ) : (
                <Input.TextArea autoSize={{ minRows: 1 }} className="text-area" placeholder="请输入前置条件描述" />
              )}
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
