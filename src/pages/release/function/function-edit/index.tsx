import React, { useState, useEffect } from 'react';
import EditTable from '../add-edit';

const EditFunction: React.FC = () => {
  return (
    <EditTable
      type="edit"
      initData={[]}
      title="编辑发布功能"
      ownOption={[]}
      lineOption={[]}
      modelOption={[]}
    />
  );
};

export default EditFunction;
