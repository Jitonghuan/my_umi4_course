// 前端版本
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/02 14:22

import React, { useState, useContext, useCallback } from 'react';
import moment from 'moment';
import { Button, Empty, Spin } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import FeContext from '@/layouts/basic-layout/fe-context';
import DetailContext from '../../context';
import { EnvDataVO } from '@/pages/application/interfaces';
import { useAppEnvCodeData } from '@/pages/application/hooks';
import { useFeVersions } from './hooks';
import RollbackVersion from './rollback';
import './index.less';

export default function FEVersions() {
  const { appData } = useContext(DetailContext);
  const { envTypeData } = useContext(FeContext);
  const [appEnvCodeData, isLoading] = useAppEnvCodeData(appData?.appCode);
  const [feVersionData, isVersionLoading, reloadVersionData] = useFeVersions(appData!);
  const [rollbackEnv, setRollbackEnv] = useState<EnvDataVO>();

  const handleRollbackClick = useCallback((envCodeItem: EnvDataVO) => {
    setRollbackEnv(envCodeItem);
  }, []);

  const handleRollbackSubmit = useCallback(() => {
    setRollbackEnv(undefined);
    reloadVersionData();
  }, []);

  return (
    <ContentCard className="page-fe-version">
      {envTypeData?.map((envTypeItem) => {
        const envCodeList = appEnvCodeData[envTypeItem.value] || [];

        return (
          <section key={envTypeItem.value}>
            <header>{envTypeItem.label}</header>
            <div className="version-card-list clearfix">
              {isLoading && <Spin className="block-loading" />}
              {!isLoading && !envCodeList.length && (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="没有可布署环境" />
              )}
              {envCodeList.map((envCodeItem) => {
                const versionList = feVersionData[envCodeItem.envCode] || [];
                const latestVersion = versionList.find((n) => n.isActive === 0);

                return (
                  <div className="version-card-item" key={envCodeItem.envCode}>
                    <div className="card-item-header">
                      <h4>{envCodeItem.envName}</h4>
                      <small>{envCodeItem.envCode}</small>
                    </div>
                    <div className="card-item-body">
                      <p>
                        当前版本: <b>{latestVersion?.version || '--'}</b>
                      </p>
                      <p>
                        发布时间:{' '}
                        {(latestVersion?.gmtModify && moment(latestVersion.gmtModify).format('YYYY-MM-DD HH:mm:ss')) ||
                          '--'}
                      </p>
                    </div>
                    <div className="card-item-actions">
                      <Button
                        type="default"
                        danger
                        size="small"
                        loading={isVersionLoading}
                        disabled={!latestVersion}
                        onClick={() => handleRollbackClick(envCodeItem)}
                      >
                        回滚
                      </Button>
                      {/* {envTypeItem.value === 'prod' && <Button type="default" danger size="small">回滚</Button>} */}
                      {/* {envTypeItem.value !== 'prod' && <Button type="primary" ghost size="small">切换版本</Button>} */}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <RollbackVersion
        envItem={rollbackEnv}
        versionList={feVersionData[rollbackEnv?.envCode!]}
        onClose={() => setRollbackEnv(undefined)}
        onSubmit={handleRollbackSubmit}
      />
    </ContentCard>
  );
}