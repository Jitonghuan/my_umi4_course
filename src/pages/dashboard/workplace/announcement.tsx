import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Decoration11, BorderBox13 } from '@jiaminghi/data-view-react';
import { Link, Card, Skeleton, Tag, Typography } from '@arco-design/web-react';


function Announcement() {






  return (
    <Card style={{ width: 374 }}>
      <div>
        <BorderBox13 style={{ width: '350px', height: '42vh', display: 'flex' }}>
          <Typography.Title heading={6} style={{ paddingLeft: 9, display: 'flex', justifyContent: 'space-between' }}>
            <span>Matrix公告</span>

            <Link style={{ paddingRight: 9 }}>查看更多</Link>
          </Typography.Title>
          <div style={{ paddingLeft: 9 }}>1、Matrix多流水线已发布更新；</div>
          <div style={{ paddingLeft: 9 }}>2、Matrix测试环境更新Layout；</div>
          <div style={{ paddingLeft: 9 }}>3、Matrix部署信息页面优化；</div>
          <div style={{ paddingLeft: 9 }}>4、Matrix流量地图链路追踪功能已发布测试环境；</div>

          {/* <Link>查看更多</Link> */}
        </BorderBox13>

        {/* <Typography.Title heading={6}>
          <Decoration11 style={{width: '300px', height: '60px'}}>  Matrix公告</Decoration11>

        </Typography.Title>
        <Link>查看更多</Link> */}
      </div>
      {/* <Skeleton loading={loading} text={{ rows: 5, width: '100%' }} animation> */}
      {/* <div>
          {data||[]?.map((d) => (
            <div key={d.key} className={styles.item}>
              <Tag color={getTagColor(d.type)} size="small">
                {t[`workplace.${d.type}`]}
              </Tag>
              <span className={styles.link}>{d.content}</span>
            </div>
          ))}
        </div> */}
      {/* 00000000
      </Skeleton> */}
    </Card>
  );
}

export default Announcement;
