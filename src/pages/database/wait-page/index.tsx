import React, { useEffect, useState,createContext } from 'react';
import PageContainer from '@/components/page-container';
import { Empty} from 'antd';
import './index.less'
export default function WaitPage(){
    const empty = (
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{
            height: 60,
          }}
          description={<span>暂未开发...敬请期待...</span>}
        ></Empty>
      );
    return (
        <PageContainer>
             <div
        className="unstart-demo"
        style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        {empty}
      </div>

        </PageContainer>
       
    )
}