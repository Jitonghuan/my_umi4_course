import React, { useState, useEffect, useCallback } from 'react';
import { Link, Card, Radio, Table, Typography } from '@arco-design/web-react';
import { IconCaretDown, IconCaretUp } from '@arco-design/web-react/icon';
import axios from 'axios';
import { ScrollRankingBoard } from '@jiaminghi/data-view-react';
// import useLocale from '@/utils/useLocale';
// import locale from './locale';ScrollRankingBoard
import styles from './style/popular-contents.module.less';

function PopularContent() {
  // const t = useLocale(locale);
  const [type, setType] = useState(0);
  // const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const data = {
    data: [
      {
        name: '木南',
        value: 55,
      },
      {
        name: '时雨',
        value: 120,
      },
      {
        name: '青枫',
        value: 78,
      },
      {
        name: '冰果',
        value: 66,
      },
      {
        name: '羁绊',
        value: 80,
      },
      {
        name: '东来',
        value: 45,
      },
      {
        name: '习习',
        value: 29,
      },
    ],
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography.Title heading={6} style={{ marginTop: '0px', lineHeight: 1, paddingTop: 0 }}>
          本周展示
          {/* {t['workplace.popularContents']} */}
        </Typography.Title>

        {/* <Link>{t['workplace.seeMore']}</Link> */}
      </div>
      <ScrollRankingBoard config={data} style={{ width: '346px', height: '280px' }}></ScrollRankingBoard>
    </Card>
  );
}

export default PopularContent;
