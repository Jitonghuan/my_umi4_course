import React, { useState, useContext, useMemo } from 'react';
import EditTable from '../add-edit';
import FEContext from '@/layouts/basic-layout/FeContext';
import { OptionProps } from '@/components/table-search/typing';
import { queryAppGroupReq } from '@/pages/publish/service';

const AddFunction: React.FC = () => {
  const { categoryData } = useContext(FEContext);
  const categorys = useMemo(() => {
    return (
      categoryData?.map((el) => {
        return {
          ...el,
          key: el.value,
          value: el.label,
        };
      }) || []
    );
  }, [categoryData]);
  const [groupData, setGroupData] = useState<OptionProps[]>([]);

  const formSelectChange = (code: string, type: string) => {
    console.log(code);
    if (type === 'appCategoryCode') {
      queryAppGroupReq({
        categoryCode: code,
      }).then((resp) => {
        setGroupData(
          resp.list?.map((el: any) => {
            return {
              ...el,
              key: el.value,
              label: el.label,
            };
          }),
        );
      });
    }
  };

  return (
    <EditTable
      type="add"
      initData={[]}
      title="新增发布功能"
      categoryData={categorys}
      lineOption={groupData}
      formSelectChange={formSelectChange}
    />
  );
};

export default AddFunction;
