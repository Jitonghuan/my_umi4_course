import React, { useState, useEffect } from 'react';
import { Form, message } from 'antd';

import { IFuncItem } from '../../typing';

interface IProps {
  initData: IFuncItem[];
}

const useTableAction = (props: IProps) => {
  const { initData = [] } = props;
  const [form] = Form.useForm();
  const [data, setData] = useState<IFuncItem[]>([]);
  const [editingKey, setEditingKey] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const edit = (record: Partial<IFuncItem> & { key: React.Key }) => {
    form.setFieldsValue({ funcName: '', envs: [], ...record });
    setEditingKey(record.key);
  };

  const isEditing = (record: IFuncItem) => record.key === editingKey;

  const addTableRow = () => {
    const newData = [...data];
    if (!form.getFieldValue('appGroupCode')) {
      message.warning('请先选择应用组');
      return;
    }
    if (
      newData.length &&
      newData.filter((v) => !(v?.funcName && v?.envs?.length)).length
    ) {
      message.warning('先保存，再新增');
      return;
    }
    const obj = {
      key: `${newData.length + 1}`,
    };

    form.resetFields([
      'funcName',
      'envs',
      'coverageRange',
      'resolveNeeds',
      'preDeployTime',
      'demandId',
    ]);
    newData.push(obj);
    setData(newData);
    setEditingKey(obj.key);
  };

  const cancel = (key: React.Key) => {
    if (
      data.filter(
        (v) => !(v?.funcName && v?.envs && v?.envs.length) && v.key === key,
      ).length
    ) {
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      newData.splice(index, 1);
      setData(newData);
    }

    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as IFuncItem;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
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

  useEffect(() => {
    setData(initData);
  }, [initData]);

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
