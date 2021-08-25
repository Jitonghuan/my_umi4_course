import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/page-container';
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
            plan: {
              ...resp?.[0].plan,
              preDeployTime: moment(resp?.[0]?.plan.preDeployTime),
            },
            funcIds: resp?.[0].funcIds,
          });
        }
      });
    }
  }, [id]);
  return (
    <PageContainer>
      <Coms initValueObj={detailInfo} type="check" />
    </PageContainer>
  );
};

export default EditModify;
