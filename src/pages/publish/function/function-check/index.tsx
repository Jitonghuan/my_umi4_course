import React, { useState, useEffect, useMemo } from 'react';
import EditTable, { DefaultValueObjProps } from '../add-edit';
import { Item } from '../../typing';

const EditFunction: React.FC = () => {
  const [ownOption, setOwnOption] = useState<{ key: string; value: string }[]>(
    [],
  );
  const [lineOption, setLineOption] = useState<
    { key: string; value: string }[]
  >([]);
  const [modelOption, setmodelOption] = useState<
    { key: string; value: string }[]
  >([]);
  const [initData, setInitData] = useState<Item[]>([]);
  const [defaultValueObj, setDefaultValueObj] = useState(
    {} as DefaultValueObjProps,
  );

  const formSelectChange = (
    e: React.FormEvent<HTMLInputElement>,
    type: string,
  ) => {
    console.log(e, type, 'qweq');
    if (type === 'own') {
      setLineOption([
        {
          key: '3',
          value: '3',
        },
        {
          key: '4',
          value: '4',
        },
      ]);
    } else if (type === 'line') {
      setmodelOption([
        {
          key: '5',
          value: '5',
        },
        {
          key: '6',
          value: '6',
        },
      ]);
    }
  };

  useEffect(() => {
    setOwnOption([
      {
        key: '1',
        value: '1',
      },
      {
        key: '2',
        value: '2',
      },
    ]);
    setLineOption([
      {
        key: '3',
        value: '3',
      },
      {
        key: '4',
        value: '4',
      },
    ]);
    setmodelOption([
      {
        key: '5',
        value: '5',
      },
      {
        key: '6',
        value: '6',
      },
    ]);
    setDefaultValueObj({
      own: '1',
      line: '3',
      model: '5',
    });
    setInitData([
      {
        key: '1',
        function: 'sss',
        org: ['1', '2'],
      },
    ]);
  }, []);

  return (
    <EditTable
      type="check"
      initData={initData}
      title="查看发布功能"
      ownOption={ownOption}
      lineOption={lineOption}
      modelOption={modelOption}
      formSelectChange={formSelectChange}
      defaultValueObj={{ ...defaultValueObj }}
    />
  );
};

export default EditFunction;
