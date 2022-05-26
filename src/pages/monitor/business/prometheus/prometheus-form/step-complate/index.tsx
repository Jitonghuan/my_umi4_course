import React, { useState } from 'react';
import { Result, Button } from '@cffe/h2o-design';
import { history } from 'umi';

interface StepThreeProps {
  reset: () => void;
}

const StepThree: React.FC<StepThreeProps> = ({ reset }) => {
  return (
    <Result
      status="success"
      title="接入成功"
      extra={[
        <Button type="primary" key="console" onClick={reset}>
          再次接入Prometheus
        </Button>,
        <Button
          key="buy"
          onClick={() => {
            history.goBack();
          }}
        >
          查看Prometheus监控
        </Button>,
      ]}
    />
  );
};

export default StepThree;
