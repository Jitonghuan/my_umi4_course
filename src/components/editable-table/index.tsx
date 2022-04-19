import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { EditableProTable } from '@ant-design/pro-table';
import { Popconfirm, message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm from '@ant-design/pro-form';

const ETable = React.forwardRef((props: any, ref) => {
  const {
    dataSource,
    columns,
    setDataSource,
    onChange,
    addBottonText,
    deleteText,
    handleDelete,
    handleSave,
    ...others
  } = props;
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const formRef = useRef<ProFormInstance<any>>();
  const actionRef = useRef(null) as any;
  useImperativeHandle(
    ref,
    () => ({
      reset: () => {
        // function name
        editableKeys.forEach((k) => actionRef.current.cancelEditable(k));
      },
    }),
    [editableKeys],
  );
  const __columns: any = columns.concat({
    fixed: 'right',
    title: '操作',
    valueType: 'option',
    width: 100,
    render: (text: any, record: any, _: any, action: any) => (
      <div>
        <a
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>
        <Popconfirm
          title={deleteText}
          onConfirm={() => {
            handleDelete(record);
          }}
          okText="确定"
          cancelText="取消"
        >
          <a style={{ marginLeft: '10px' }}>删除</a>
        </Popconfirm>
      </div>
    ),
  });

  return (
    <>
      <ProForm
        formRef={formRef}
        initialValues={{
          table: dataSource,
        }}
        submitter={false}
        validateTrigger="onBlur"
      >
        <EditableProTable
          rowKey="id"
          actionRef={actionRef}
          loading={false}
          columns={__columns}
          value={dataSource}
          onChange={onChange}
          {...others}
          recordCreatorProps={{
            record: () => ({ id: -1 }),
            creatorButtonText: addBottonText ? addBottonText : '新增一行',
          }}
          editable={{
            editableKeys,
            onSave: async (rowKey, data, row) => {
              handleSave(rowKey, data);
            },
            onChange: (keys, cols) => {
              setEditableRowKeys(keys);
            },
            actionRender: (row, config, defaultDom) => {
              return [defaultDom.save, defaultDom.delete, defaultDom.cancel];
            },
          }}
        />
      </ProForm>
    </>
  );
});
export default ETable;
