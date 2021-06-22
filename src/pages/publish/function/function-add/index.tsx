import React from 'react';
import EditTable from '../add-edit';

const AddFunction: React.FC = () => {
  return <EditTable type="add" initData={[]} title="新增发布功能" />;
};

export default AddFunction;
