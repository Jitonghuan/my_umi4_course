import React, { useState, useEffect } from 'react';
import CardLayout from '@cffe/vc-b-card-layout';
import { history } from 'umi';
import { Tag, Tooltip, Popconfirm } from 'antd';
import { StarFilled, StarTwoTone, Html5Outlined, CodeOutlined, UserOutlined } from '@ant-design/icons';
import './index.less';
const cardCls = 'all-application-page__card';

const APP_TYPE_MAP: { [index: string]: any } = {
  frontend: '前端',
  backend: '后端',
};

const APP_TYPE_TAG: Record<string, [string, React.ReactNode]> = {
  frontend: ['geekblue', <Html5Outlined />],
  backend: ['cyan', <CodeOutlined />],
};
export function isValidKey(key: string | number | symbol, object: object): key is keyof typeof object {
  return key in object;
}

export interface IProps {
  dataSource?: [];
  type?: string;
  loadAppListData?: any;
}

export default function ApplicationCardList(props: IProps) {
  //   const { dataSource, type, loadAppListData } = props;
  const dataSource = [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
    {
      id: 4,
    },
  ];

  const switchStar = async (a: any, evt: any) => {
    const appCode = a.appCode;
    // const result = await collectRequst('application', a.isCollection ? 'cancel' : 'add', appCode);
    // if (result) {
    //   loadAppListData();
    // }
  };

  return (
    <CardLayout>
      {dataSource.map((item) => (
        <div
          key={item.id}
          className={cardCls}
          onClick={() =>
            history.push({
              pathname: 'detail',
              query: {
                id: `${item.id}`,
                // appCode: item.appCode,
              },
            })
          }
        >
          {item.id}
        </div>
      ))}
    </CardLayout>
  );
}
