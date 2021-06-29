import React, { useState, useEffect } from 'react';
import EditTable from '../add-edit';
import { IFuncItem } from '../../typing';
import { queryFunctionReq } from '../../service';
import moment from 'moment';

const EditFunction: React.FC = (props) => {
  //@ts-ignore
  const { id } = props?.location?.query;
  const [detailInfo, setDetailInfo] = useState<any>({});
  const [initData, setInitData] = useState<IFuncItem[]>([]);

  useEffect(() => {
    if (id) {
      queryFunctionReq({ id }).then((resp) => {
        setDetailInfo(resp?.[0] || {});
        setInitData([
          {
            key: '1',
            ...resp?.[0],
            envs: resp?.[0]?.envs.split(','),
            preDeployTime: resp?.[0]?.preDeployTime ? moment(resp?.[0]?.preDeployTime) : '',
          },
        ]);
      });
    }
  }, [id]);

  return <EditTable type="edit" initData={initData} title="编辑发布功能" defaultValueObj={detailInfo} />;
};

export default EditFunction;
