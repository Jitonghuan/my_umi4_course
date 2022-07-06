import React, { useEffect, useContext } from 'react';
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Steps, Button, Modal } from 'antd';
import { retry } from '@/pages/application/service';
import { StepItemProps } from '../../types';
import DetailContext from '@/pages/npm-manage/detail/context';
import { listAppEnv } from '@/pages/application/service';
import { getRequest } from '@/utils/request';

/** 构建 */
export default function BuildingStep(props: StepItemProps) {
  const { deployInfo, onOperate, envTypeCode, env = '', status, getItemByKey, item, ...others } = props;
  const { npmData } = useContext(DetailContext);
  const { metadata, buildInfo } = deployInfo || {};
  const { buildUrl } = buildInfo || {};

  const url = getItemByKey(buildUrl, 'singleBuild')
    ? getItemByKey(buildUrl, 'singleBuild')
    : getItemByKey(buildUrl, env)
    ? getItemByKey(buildUrl, env)
    : '';
  const isError = status === 'error';
  const isLoading = status === 'process';


  useEffect(() => {
    if (!npmData?.npmName) return;
    queryDownloadImageEnv();
  }, []);

  const queryDownloadImageEnv = () => {
    getRequest(listAppEnv, {
      data: {
        envTypeCode: envTypeCode,
        appCode: npmData?.npmName,
        proEnvType: 'benchmark',
        clusterName: 'private-cluster',
      },
    }).then((result) => {
      let downloadImageEnv: any = [];
      if (result?.success) {
        result?.data?.map((item: any) => {
          downloadImageEnv.push(item.envCode);
        });
      }
    });
  };

  const handleRebuildClick = () => {
    onOperate('retryDeployStart');

    Modal.confirm({
      title: '确定要重新构建吗?',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        const params = { id: metadata?.id };
        if (env) {
          Object.assign(params, { envCode: env });
        }
        await retry({ ...params });
        onOperate('retryDeployEnd');
      },
      onCancel: () => {
        onOperate('retryDeployEnd');
      },
    });
  };

  return (
    <>
      <Steps.Step
        {...others}
        title="构建 & 发布"
        status={status}
        icon={isLoading && <LoadingOutlined />}
        description={
          // isLoading && (
          <>
            {/* 浙一日常环境下的部署步骤显示jenkins链接,构建步骤下不显示。其他环境都是构建步骤下显示Jenkins详情 */}
            {url && (
              <div style={{ marginTop: -5 }}>
                <a target="_blank" href={url}>
                  构建详情
                </a>
              </div>
            )}
            {isError && (
              <Button style={{ paddingLeft: 4, paddingRight: 4 }} size="small" onClick={handleRebuildClick}>
                重新构建
              </Button>
            )}
          </>
          // )
        }
      />
    </>
  );
}
