import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/page-container';
import Coms from '../add-edit';

const AddModify: React.FC = () => {
  return (
    <PageContainer>
      <Coms type="add" />
    </PageContainer>
  );
};

export default AddModify;
