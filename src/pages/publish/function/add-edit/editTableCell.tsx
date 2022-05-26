import React from 'react';
import { Form } from '@cffe/h2o-design';
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
  // 行key；通过关联jira批量创建时，会存在多行同时在编辑状态，用这个来区分
  const rowKey = record?.key || '0';
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={`${dataIndex}-${rowKey}`}
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
