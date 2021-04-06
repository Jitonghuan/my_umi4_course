import React, { useEffect, useContext } from 'react';
import { FELayout } from '@cffe/fe-backend-component';
import FeContext from '@/layouts/basic-layout/FeContext';
import styles from './index.less';
import request, { getRequest } from '@/utils/request';

const { UserInfoContext } = FELayout;

export default function IndexPage() {
  const userinfo = useContext(UserInfoContext);
  const feData = useContext(FeContext);

  console.log(userinfo, feData);

  // get 接口调用
  const getQueryUserInfo = async () => {
    const resp = await getRequest('/user_backend/v1/user/info', {
      data: {
        test: 1,
      },
    });

    console.log(resp);
  };

  // post 接口调用
  // const postQueryUserInfo = async () => {
  //   const resp = await postRequest('/user_backend/v1/user/info', {
  //     data: {
  //       test: 1,
  //     }
  //   });

  //   console.log(resp);
  // }

  // 接口调用
  const queryUserInfo = async () => {
    const resp = await request('/user_backend/v1/user/info', {
      data: {
        test: 1,
      },
    });

    console.log(resp);
  };

  useEffect(() => {
    getQueryUserInfo();
    // postQueryUserInfo();
    queryUserInfo();
  }, []);

  return (
    <div>
      <h1 className={styles.title}>hello {userinfo.nickName}</h1>
    </div>
  );
}
