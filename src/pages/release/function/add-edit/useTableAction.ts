import React, { useState, useEffect } from 'react';
import { Form, message } from 'antd';

import { Item } from '../../typing';

interface IProps {
  initData: Item[];
}

const useTableAction = (props: IProps) => {
  const { initData = [] } = props;
  const [form] = Form.useForm();
  const [data, setData] = useState<Item[]>(initData);
  const [editingKey, setEditingKey] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ function: '', org: [], ...record });
    setEditingKey(record.key);
  };

  const isEditing = (record: Item) => record.key === editingKey;

  const addTableRow = () => {
    const newData = [...data];
    if (
      newData.length &&
      newData.filter((v) => !(v?.function && v?.org)).length
    ) {
      message.warning('先保存，再新增');
      return;
    }
    const obj = {
      key: `${newData.length + 1}`,
    };
    form.resetFields();
    newData.push(obj);
    setData(newData);
    setEditingKey(obj.key);
  };

  const cancel = (key: React.Key) => {
    if (data.filter((v) => !(v?.function && v?.org) && v.key === key).length) {
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      newData.splice(index, 1);
      setData(newData);
    }

    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        console.log(newData, 'newData');
        console.log(item, '123');
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const onDelete = (key: React.Key) => {
    const newData = [...data];
    const index = newData.findIndex((item) => key === item.key);
    newData.splice(index, 1);
    setData(newData);
  };

  const onSelectChange = (selectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };

  return {
    form,
    data,
    editingKey,
    selectedRowKeys,
    edit,
    isEditing,
    addTableRow,
    cancel,
    save,
    onDelete,
    onSelectChange,
  };
};

export default useTableAction;
