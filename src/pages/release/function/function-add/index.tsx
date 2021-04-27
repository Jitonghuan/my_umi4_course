import React, { useState, useEffect } from 'react';
import EditTable from '../add-edit';

const AddFunction: React.FC = () => {
  return (
    <EditTable
      type="add"
      initData={[]}
      title="新增发布功能"
      ownOption={[]}
      lineOption={[]}
      modelOption={[]}
    />
  );
};

export default AddFunction;
