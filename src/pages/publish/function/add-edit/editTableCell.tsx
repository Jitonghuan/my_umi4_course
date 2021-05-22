import React from 'react';
import { Form } from 'antd';
import { IFuncItem } from '../../typing';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  required: boolean;
  dataIndex: string;
  title: string;
  record: IFuncItem;
  index: number;
  children: React.ReactNode;
  item: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  record,
  index,
  children,
  required,
  item,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: required,
              message: `请输入 ${title}`,
            },
          ]}
        >
          {item}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableCell;
