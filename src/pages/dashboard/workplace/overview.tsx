import { Card, Typography } from '@arco-design/web-react';
import { Decoration7 } from '@jiaminghi/data-view-react';

function Overview() {
  let userInfo = JSON.parse(localStorage.getItem('USER_INFO') || '{}');

  return (
    <Card>
      <Typography.Title heading={5}>
        <Decoration7 style={{ width: '230px', height: '30px' }}>
          <span style={{ display: 'inline-block', padding: 10 }}>欢迎回来，{userInfo?.name}</span>
        </Decoration7>
      </Typography.Title>
    </Card>
  );
}

export default Overview;
