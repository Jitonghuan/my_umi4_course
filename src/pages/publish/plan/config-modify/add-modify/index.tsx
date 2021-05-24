import React, { useState, useEffect } from 'react';
import MatrixPageContent from '@/components/matrix-page-content';
import Coms from '../add-edit';

const AddModify: React.FC = () => {
  return (
    <MatrixPageContent>
      <Coms type="add" />
    </MatrixPageContent>
  );
};

export default AddModify;
