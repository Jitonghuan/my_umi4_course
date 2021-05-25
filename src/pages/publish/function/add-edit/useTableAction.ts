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
  const [editingKey, setEditingKey] = useState<string[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const edit = (record: Partial<IFuncItem> & { key: React.Key }) => {
    const key = record.key;
    form.setFieldsValue({
      ...record,
      [`funcName-${key}`]: record.funcName,
      [`envs-${key}`]: record.envs,
      [`coverageRange-${key}`]: record.coverageRange,
      [`resolveNeeds-${key}`]: record.resolveNeeds,
      [`preDeployTime-${key}`]: record.preDeployTime,
      [`demandId-${key}`]: record.demandId,
    });
    setEditingKey(editingKey.concat([record.key]));
  };

  const isEditing = (record: IFuncItem) => editingKey.includes(record?.key!);

  const addTableRow = () => {
    const newData = [...data];
    if (!form.getFieldValue('appGroupCode')) {
      message.warning('请先选择应用组');
      return;
    }
    if (editingKey.length) {
      message.warning('先保存，再新增');
      return;
    }
    const newStart = newData.length
      ? Number(newData[newData.length - 1].key) + 1
      : 1;
    const obj = {
      key: `${newStart}`,
      [`funcName-${newStart}`]: '',
      [`envs-${newStart}`]: [],
      [`coverageRange-${newStart}`]: '',
      [`resolveNeeds-${newStart}`]: '',
      [`preDeployTime-${newStart}`]: '',
      [`demandId-${newStart}`]: '',
    };

    form.resetFields([
      `funcName-${obj.key}`,
      `envs-${obj.key}`,
      `coverageRange-${obj.key}`,
      `resolveNeeds-${obj.key}`,
      `preDeployTime-${obj.key}`,
      `demandId-${obj.key}`,
    ]);
    newData.push(obj);
    setData(newData);
    setEditingKey([obj.key]);
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
    // form.resetFields([
    //   `funcName-${key}`,
    //   `envs-${key}`,
    //   `coverageRange-${key}`,
    //   `resolveNeeds-${key}`,
    //   `preDeployTime-${key}`,
    //   `demandId-${key}`,
    // ]);
    const editIndex = editingKey.findIndex(
      (item) => Number(item) === Number(key),
    );
    editingKey.splice(Number(editIndex), 1);
    setEditingKey([...editingKey]);
  };

  const save = async (key: React.Key) => {
    try {
      const row = await form.validateFields();

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      const editIndex = editingKey.findIndex(
        (item) => Number(item) === Number(key),
      );
      let result = {
        appCategoryCode: row.appCategoryCode,
        appGroupCode: row.appCategoryCode,
        coverageRange: row[`coverageRange-${key}`],
        demandId: row[`demandId-${key}`],
        envs: row[`envs-${key}`],
        funcName: row[`funcName-${key}`],
        preDeployTime: row[`preDeployTime-${key}`],
        resolveNeeds: row[`resolveNeeds-${key}`],
      };
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...result,
        });
        setData(newData);
      } else {
        newData.push(result);
        setData(newData);
      }
      editingKey.splice(editIndex, 1);
      setEditingKey([...editingKey]);
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
    setSelectedRowKeys(selectedRowKeys);
  };

  useEffect(() => {
    setData(
      initData.map((data, index) => {
        return {
          ...data,
          [`funcName-${index + 1}`]: data.funcName,
          [`envs-${index + 1}`]: data.envs,
          [`coverageRange-${index + 1}`]: data.coverageRange,
          [`resolveNeeds-${index + 1}`]: data.resolveNeeds,
          [`preDeployTime-${index + 1}`]: data.preDeployTime,
          [`demandId-${index + 1}`]: data.demandId,
        };
      }),
    );
  }, [initData]);

  return {
    form,
    data,
    setData,
    editingKey,
    setEditingKey,
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
