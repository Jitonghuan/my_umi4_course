import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Tag, Divider, Progress, Select, Table } from 'antd';

export default function TraceTime({ durations, allDurations, selfDurations }: any) {
  let allP = 0;
  let selfP = 0;
  if (durations !== 0) {
    allP = (durations / allDurations) * 100;
  }
  if (selfDurations !== 0 && durations !== 0) {
    selfP = (selfDurations / durations) * 100;
  }

  // const allP = (durations / allDurations) * 100;
  // const selfP = (selfDurations / durations) * 100;

  return (
    <div className="trace-time">
      <div
        className="duration"
        style={{
          height: '7px',
          borderRadius: '3px',
          background: '#3fb1e3',
          position: 'relative',
          border: 'none',
          backgroundColor: '#3fb1e3',
          width: allP > 100 ? '100%' : `${allP + '%'}`,
        }}
      >
        <Progress
          style={{ position: 'absolute', top: '-7px' }}
          percent={selfP}
          showInfo={false}
          size="small"
          trailColor="transparent"
          className="span-progress"
        />
      </div>
    </div>
  );
}
