// merge release
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/05 21:09

import React, { useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Steps, Button, message, Spin } from 'antd';
import { retryMerge, getMergeMessage } from '@/pages/application/service';
import { StepItemProps } from '../../types';
import MergeConflict from '../../../merge-conflict';
import { conflictItem } from '../../../merge-conflict/types';

/** 合并release */
export default function MergeReleaseStep(props: StepItemProps) {
  const { deployInfo, deployStatus, onOperate, envTypeCode, onSpin, stopSpin, deployedList, ...others } = props;
  const [mergeVisible, setMergeVisible] = useState(false); //冲突详情
  const [mergeMessage, setMergeMessage] = useState<any>([]);
  // const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const isLoading = deployStatus === 'merging';
  const isError = deployStatus === 'mergeErr' || deployStatus === 'conflict';

  const retryMergeClick = async () => {
    try {
      await retryMerge({ id: deployInfo.id });
    } finally {
      onOperate('mergeReleaseRetryEnd');
    }
  };

  const openMergeConflict = () => {
    // setMergeVisible(true);
    // onOperate('mergeStart');
    onSpin();
    getMergeMessage({ releaseBranch: deployInfo.releaseBranch })
      .then((res) => {
        if (!res.success) {
          return;
        }
        const dataArray = res?.data.map((item: conflictItem, index: number) => ({
          ...item,
          id: index + 1,
          resolved: false,
        }));
        setMergeMessage(dataArray);
        // setIsUpdate(true);
        setMergeVisible(true);
        onOperate('mergeStart');
      })
      .finally(() => {
        stopSpin();
      });
  };
  const handleCancelMerge = () => {
    // setIsUpdate(false);
    setMergeVisible(false);
    onOperate('mergeEnd');
  };

  return (
    <>
      <MergeConflict
        visible={mergeVisible}
        handleCancel={handleCancelMerge}
        mergeMessage={mergeMessage}
        releaseBranch={deployInfo.releaseBranch}
        retryMergeClick={retryMergeClick}
      ></MergeConflict>
      <Steps.Step
        {...others}
        title="合并release"
        icon={isLoading && <LoadingOutlined />}
        status={isError ? 'error' : others.status}
        description={
          isError && (
            <>
              {deployInfo.mergeWebUrl && (
                <div style={{ marginTop: 2 }}>
                  <Button onClick={openMergeConflict} disabled={deployedList.length === 0}>
                    解决冲突
                  </Button>
                </div>
              )}
              {/* <Button style={{ marginTop: 4 }} onClick={retryMergeClick}>
                重试
              </Button> */}
            </>
          )
        }
      />
    </>
  );
}
