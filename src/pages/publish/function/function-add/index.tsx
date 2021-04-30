import React, { useState, useEffect } from 'react';
import EditTable from '../add-edit';

const AddFunction: React.FC = () => {
  const [ownOption, setOwnOption] = useState<{ key: string; value: string }[]>(
    [],
  );
  const [lineOption, setLineOption] = useState<
    { key: string; value: string }[]
  >([]);
  const [modelOption, setmodelOption] = useState<
    { key: string; value: string }[]
  >([]);

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
  }, []);

  return (
    <EditTable
      type="add"
      initData={[]}
      title="新增发布功能"
      ownOption={ownOption}
      lineOption={lineOption}
      modelOption={modelOption}
      formSelectChange={formSelectChange}
    />
  );
};

export default AddFunction;
