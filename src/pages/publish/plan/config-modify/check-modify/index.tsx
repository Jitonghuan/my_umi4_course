import React, { useState, useEffect } from 'react';
import MatrixPageContent from '@/components/matrix-page-content';
import Coms from '../add-edit';
import { queryPublishPlanReq } from '@/pages/publish/service';
import moment from 'moment';

const EditModify: React.FC = (props) => {
  //@ts-ignore
  const { id } = props?.location?.query;
  const [detailInfo, setDetailInfo] = useState<any>({});
  useEffect(() => {
    if (id) {
      queryPublishPlanReq({ id }).then((resp) => {
        if (resp?.[0]) {
          setDetailInfo({
            ...resp?.[0],
            preDeployTime: moment(resp?.[0]?.preDeployTime),
          });
        }
      });
    }
  }, [id]);
  return (
    <MatrixPageContent>
      <Coms initValueObj={detailInfo} type="check" />
    </MatrixPageContent>
  );
};

export default EditModify;
