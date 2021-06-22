/**
 * editTable
 * @description 简易可编辑表格
 * @author
 * @create
 */

import React, { useContext, useState, useEffect, useRef, useMemo } from 'react';
import { Table, Input, Button, Popconfirm, Form, Space } from 'antd';
import { FormInstance, TableColumnProps } from 'antd/lib';
import { ColumnsType } from 'antd/lib/table';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
// import { Item } from '../../typing';
import './index.less';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps<T = object> {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof T;
  record: T;
  handleSave: (record: T) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<Input>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      // toggleEdit();
      setEditing(!editing);
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  <Form.Item
    style={{ margin: 0 }}
    name={dataIndex}
    rules={[
      {
        required: true,
        message: '请输入',
      },
    ]}
  >
    <Input
      ref={inputRef}
      onPressEnter={save}
      onBlur={save}
      // style={{ width: 160 }}
    />
  </Form.Item>;

  if (editable) {
    // form.resetFields([`${dataIndex}`]);
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: '请输入',
          },
        ]}
      >
        <Input
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
          // style={{ width: 160 }}
        />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];
interface EditableTableState<T = any> extends EditableTableProps {
  initData?: T[];
  headerTitle?: string | React.ReactNode;
  onTableChange?: (value: T[]) => void;
  handleAddItem: () => T;
}

const EditableTable = <
  T extends {
    id: React.Key;
  } = any,
>({
  initData = [],
  onTableChange,
  headerTitle,
  style,
  handleAddItem,
  columns: columnsList,
}: EditableTableState) => {
  const [dataSource, setDataSource] = useState<T[]>([]);
  const [count, setCount] = useState<number>(dataSource.length);

  const columns = [
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 50,
      render: (_: string, record: any) => {
        const findData = dataSource.find((v) => v.id === record.id);
        return (
          <Space>
            {dataSource.length >= 1 ? (
              <Popconfirm
                title="确认删除"
                onConfirm={() => handleDelete(record.id as React.Key)}
              >
                <MinusCircleOutlined style={{ color: 'red' }} />
              </Popconfirm>
            ) : null}
            {/* {dataSource.indexOf(findData as Item) === dataSource.length - 1 ? (
              <PlusCircleOutlined
                onClick={handleAdd}
                style={{ color: 'green' }}
              />
            ) : null} */}
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    onTableChange && onTableChange(dataSource);
  }, [dataSource]);

  useEffect(() => {
    if (initData.length === 0) return;
    setDataSource(initData);
  }, [initData]);

  const handleDelete = (id: React.Key) => {
    const data = [...dataSource];
    setDataSource(data.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    const newData: T = handleAddItem();
    setDataSource([...dataSource, newData]);
    // setCount(count + 1);
  };

  const handleSave = (row: T) => {
    const newData = [...dataSource];

    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const EditColumns = columnsList?.map((col: any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: T) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });

  return (
    <div style={style}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <span>{headerTitle}</span>
        <Button style={{ marginBottom: 8 }} type="primary" onClick={handleAdd}>
          添加
        </Button>
      </div>
      <Table<T>
        components={components}
        // rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={[...(EditColumns as any[]), ...columns]}
        pagination={false}
        rowKey="id"
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default EditableTable;
