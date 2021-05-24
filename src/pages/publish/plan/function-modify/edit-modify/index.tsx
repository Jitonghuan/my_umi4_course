import React, { useState, useEffect } from 'react';
import MatrixPageContent from '@/components/matrix-page-content';
import Coms from '../add-edit';

const EditModify: React.FC = () => {
  return (
    <MatrixPageContent>
      <Coms initValueObj={{}} type="edit" />
    </MatrixPageContent>
  );
};

export default EditModify;
