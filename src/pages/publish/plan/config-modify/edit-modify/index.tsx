import React, { useState, useEffect } from 'react';
import MatrixPageContent from '@/components/matrix-page-content';
import Coms from '../add-edit';
import { queryPublishPlanReq } from '@/pages/publish/service';

const EditModify: React.FC = (props) => {
  //@ts-ignore
  const { id } = props?.location?.query;
  const [detailInfo, setDetailInfo] = useState<any>({});
  useEffect(() => {
    if (id) {
      queryPublishPlanReq({ id }).then((resp) => {
        setDetailInfo(resp?.[0] || {});
      });
    }
  }, [id]);
  return (
    <MatrixPageContent>
      <Coms initValueObj={detailInfo} type="edit" />
    </MatrixPageContent>
  );
};

export default EditModify;
