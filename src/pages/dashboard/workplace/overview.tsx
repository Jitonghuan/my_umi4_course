import React, { useState, useEffect, ReactNode } from 'react';
import { Grid, Card, Typography, Divider, Skeleton, Link } from '@arco-design/web-react';
import { Decoration7, Decoration10, Decoration9 } from '@jiaminghi/data-view-react';
import { useSelector } from 'react-redux';
import { IconCaretUp } from '@arco-design/web-react/icon';
// import OverviewAreaLine from '@/components/Chart/overview-area-line';
import axios from 'axios';
// import locale from './locale';
// import useLocale from '@/utils/useLocale';
import styles from './style/overview.module.less';
import IconCalendar from './assets/calendar.svg';
import IconComments from './assets/comments.svg';
import IconContent from './assets/content.svg';
import IconIncrease from './assets/increase.svg';

const { Row, Col } = Grid;

type StatisticItemType = {
  icon?: ReactNode;
  title?: ReactNode;
  count?: ReactNode;
  loading?: boolean;
  unit?: ReactNode;
};

function StatisticItem(props: StatisticItemType) {
  const { icon, title, count, loading, unit } = props;
  return (
    <div className={styles.item}>
      <div className={styles.icon}>{icon}</div>
      <div>
        <Skeleton loading={loading} text={{ rows: 2, width: 60 }} animation>
          <div className={styles.title}>{title}</div>
          <div className={styles.count}>
            {count}
            <span className={styles.unit}>{unit}</span>
          </div>
        </Skeleton>
      </div>
    </div>
  );
}

type DataType = {
  allContents?: string;
  liveContents?: string;
  increaseComments?: string;
  growthRate?: string;
  chartData?: { count?: number; date?: string }[];
  down?: boolean;
};

function Overview() {
  const [data, setData] = useState<DataType>({});
  const [loading, setLoading] = useState(true);
  let userInfo = JSON.parse(localStorage.getItem('USER_INFO') || '{}');
  

  return (
    <Card>
      <Typography.Title heading={5}>
        <Decoration7 style={{ width: '230px', height: '30px' }}>
          <span style={{ display: 'inline-block', padding: 10 }}>欢迎回来，{userInfo?.name}</span>
        </Decoration7>

        {/* {t['workplace.welcomeBack']} */}
        {/* {userInfo.name} */}
      </Typography.Title>
     
      {/* <Decoration10 style={{ width: '100%', height: '2px' }}></Decoration10> */}
      {/* <Row style={{ marginTop: 8 }}>
        <Col flex={1}>
          <div style={{display:'flex'}}>
          <Decoration9 style={{width: '50px', height: '50px'}}>66%</Decoration9>
        <span>线上总数据</span>

          </div>

          <StatisticItem
            icon={<IconCalendar />}
            title="线上总数据"
            count={1110}
            loading={loading}
            unit={t['workplace.pecs']}
          />
        </Col>
        <Divider type="vertical" className={styles.divider} />
        <Col flex={1}>
          <StatisticItem
            icon={<IconContent />}
            title="我的发布中"
            count={5}
            loading={loading}
            unit={t['workplace.pecs']}
          />
        </Col>
        <Divider type="vertical" className={styles.divider} />
        <Col flex={1}>
          <StatisticItem
            icon={<IconComments />}
            title="与我相关应用"
            count={10}
            loading={loading}
            unit={t['workplace.pecs']}
          />
        </Col>
        <Divider type="vertical" className={styles.divider} />
        <Col flex={1}>
          <StatisticItem
            icon={<IconIncrease />}
            title="较昨日新增"
            count={
              <span>
                {data.growthRate} <IconCaretUp style={{ fontSize: 18, color: 'rgb(var(--green-6))' }} />
              </span>
            }
            loading={loading}
          />
        </Col>
      </Row> */}
      {/* <Divider />
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Decoration9 style={{ width: '150px', height: '150px' }} dur={7}>
          高效协同
        </Decoration9>
        <Decoration9 style={{ width: '150px', height: '150px' }} dur={7}>
          实现需求
        </Decoration9>
        <Decoration9 style={{ width: '150px', height: '150px' }} dur={7}>
          交付运维
        </Decoration9>
      </div> */}

      {/* <div>
        <div className={styles.ctw}>
          <Typography.Paragraph
            className={styles['chart-title']}
            style={{ marginBottom: 0 }}
          >
            {t['workplace.contentData']}
            <span className={styles['chart-sub-title']}>
              ({t['workplace.1year']})
            </span>
          </Typography.Paragraph>
          <Link>{t['workplace.seeMore']}</Link>
        </div>
        <OverviewAreaLine data={data.chartData} loading={loading} />
      </div> */}
    </Card>
  );
}

export default Overview;
