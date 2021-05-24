import React, { useState, useEffect } from 'react';
import MatrixPageContent from '@/components/matrix-page-content';
import Coms from '../add-edit';

const EditModify: React.FC = (props) => {
  console.log('props', props);
  useEffect(() => {}, []);
  return (
    <MatrixPageContent>
      <Coms initValueObj={{}} type="check" />
    </MatrixPageContent>
  );
};

export default EditModify;
