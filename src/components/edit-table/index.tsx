import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Form, Input, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// interface Item {
//   key: string;
//   name: string;
//   age: number;
//   address: string;
// }

// interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
//   editing: boolean;
//   dataIndex: string;
//   title: any;
//   inputType: 'number' | 'text';
//   record: Item;
//   index: number;
//   children: React.ReactNode;
// }

// const EditableCell: React.FC<EditableCellProps> = ({
//   editing,
//   dataIndex,
//   title,
//   inputType,
//   record,
//   index,
//   children,
//   ...restProps
// }) => {
//   const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

//   return (
//     <td {...restProps}>
//       {editing ? (
//         <Form.Item
//           name={dataIndex}
//           style={{ margin: 0 }}
//           rules={[
//             {
//               required: true,
//               message: `Please Input ${title}!`,
//             },
//           ]}
//         >
//           {inputNode}
//         </Form.Item>
//       ) : (
//         children
//       )}
//     </td>
//   );
// };
type Component<P> =
  | React.ComponentType<P>
  | React.ForwardRefExoticComponent<P>
  | React.FC<P>
  | keyof React.ReactHTML;
interface EditTableProps<RecordType> {
  dataSource: RecordType[];
  columns: RecordType[];
  cell: Component<any>;
}

const EditTable = <RecordType extends object = any>(
  props: EditTableProps<RecordType>,
) => {
  const { dataSource = [], columns, cell } = props;

  const [refresh, setRefresh] = useState(false);
  const [tableData, setTableData] = useState<RecordType[]>([]);
  const newData = useRef(JSON.parse(JSON.stringify(dataSource)));

  const addTableRow = () => {
    const obj = {
      key: `${newData.current.length + 1}`,
      name: '123',
      isEdit: true,
    };
    newData.current.push(obj);
    console.log(newData.current, 'newData');
    console.log(dataSource, 'dataSource');
    setTableData([...newData.current]);
  };

  useEffect(() => {
    if (!dataSource) return;
    setTableData(dataSource);
  }, [dataSource]);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
        components={{
          body: {
            cell: cell,
          },
        }}
      />
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        style={{ width: '100%' }}
        onClick={addTableRow}
      >
        新增发布功能
      </Button>
    </div>
  );
};

export default EditTable;
