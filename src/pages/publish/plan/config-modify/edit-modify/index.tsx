import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/page-container';
import Coms from '../add-edit';
import { queryPublishPlanReq } from '@/pages/publish/service';
import moment from 'moment';
import { history,useLocation } from 'umi';
import { parse } from 'query-string';

const EditModify: React.FC = (props) => {
  //@ts-ignore
  let location:any = useLocation();
  const query:any = parse(location.search);
  const { id } =query;
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
      <Coms initValueObj={detailInfo} type="edit" />
    </PageContainer>
  );
};

export default EditModify;
