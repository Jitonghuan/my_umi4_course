// MQ同步页面
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/14 14:30
import React, { useContext, useState, useEffect } from 'react';
import { Radio, Button, Card, Tag, Divider, Tooltip, Space, Steps, Modal, Form, message, Popconfirm } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import HeaderTabs from '../../components/header-tabs';
// import './index.less';

export default function Traffic(props: any) {
  const { Step } = Steps;
  const { confirm } = Modal;
  const steps = [
    {
      title: 'MQ同步',
      content: 'First-content',
    },
    {
      title: '配置同步',
      content: 'Second-content',
    },
    {
      title: '应用同步',
      content: 'Last-content',
    },
    {
      title: '前端资源同步',
      content: 'Last-content',
    },
  ];
  const App = () => {
    const [current, setCurrent] = React.useState(0);

    const next = () => {
      setCurrent(current + 1);
    };

    const prev = () => {
      setCurrent(current - 1);
    };

    return (
      <MatrixPageContent>
        <HeaderTabs activeKey="application-synchro" history={props.history} />

        <ContentCard>
          <FilterCard>
            <>
              <Steps current={current}>
                {steps.map((item) => (
                  <Step key={item.title} title={item.title} />
                ))}
              </Steps>
            </>
          </FilterCard>
          <div className="steps-content">{steps[current].content}</div>
          <div className="steps-action">
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                下一步
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={() => message.success('Processing complete!')}>
                MQ同步开始
              </Button>
            )}
            {current > 0 && (
              <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                取 消
              </Button>
            )}
          </div>
        </ContentCard>
      </MatrixPageContent>
    );
  };
}
