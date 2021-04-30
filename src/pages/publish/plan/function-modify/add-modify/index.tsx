import React, { useState, useEffect } from 'react';
import MatrixPageContent from '@/components/matrix-page-content';
import Coms from '../add-edit';

const AddModify: React.FC = () => {
  return (
    <MatrixPageContent>
      <Coms />
    </MatrixPageContent>
  );
};

export default AddModify;
