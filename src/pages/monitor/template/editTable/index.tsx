import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form, Space } from 'antd';
import { FormInstance } from 'antd/lib';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Item } from '../../typing';
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

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
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

  if (editable) {
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
          style={{ width: 160 }}
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

interface EditableTableState extends EditableTableProps {
  initData?: Item[];
  onTableChange?: (value: Item[]) => void;
}

const EditableTable: React.FC<EditableTableState> = ({
  initData = [],
  onTableChange,
}) => {
  const [dataSource, setDataSource] = useState<Item[]>(
    initData.length
      ? initData
      : [
          {
            id: 0,
            key: '0',
            value: '0',
          },
        ],
  );
  const [count, setCount] = useState<number>(dataSource.length);

  const columns = [
    {
      title: '键',
      dataIndex: 'key',
      editable: true,
      width: '45%',
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
      editable: true,
      width: '45%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 50,
      render: (_: string, record: Item) => {
        const findData = dataSource.find((v) => v.id === record.id);
        return (
          <Space>
            {dataSource.length > 1 ? (
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => handleDelete(record.id as React.Key)}
              >
                <MinusCircleOutlined style={{ color: 'red' }} />
              </Popconfirm>
            ) : null}
            {dataSource.indexOf(findData as Item) === dataSource.length - 1 ? (
              <PlusCircleOutlined
                onClick={handleAdd}
                style={{ color: 'green' }}
              />
            ) : null}
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    onTableChange && onTableChange(dataSource);
  }, [dataSource]);

  const handleDelete = (id: React.Key) => {
    const data = [...dataSource];
    setDataSource(data.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    const newData: Item = {
      id: count,
      key: '0',
      value: '0',
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row: Item) => {
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

  const EditColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });
  return (
    <div>
      <Table
        components={components}
        // rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={EditColumns}
        pagination={false}
        rowKey="id"
      />
    </div>
  );
};

export default EditableTable;
