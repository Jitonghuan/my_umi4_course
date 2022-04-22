// 项目环境管理
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/02/14 10:20

import React, { useState, useEffect, useRef } from 'react';
import { Button, Spin, Descriptions } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { DiffOutlined } from '@ant-design/icons';
import { getRequest } from '@/utils/request';
import { queryProjectEnvList, queryAppsList } from '../service';
import { ContentCard } from '@/components/vc-page-content';
import EnvironmentEditDraw from '../add-environment';
import { useRemoveApps, useUpdateProjectEnv, useAddAPPS } from '../hook';
import './index.less';
import DetailList from './detail-list';

/** 编辑页回显数据 */
export interface EnvironmentEdit extends Record<string, any> {
  id: number;
  envName: string;
  envCode: string;
  relEnvs: string;
  categoryCode: string;
  envTypeCode: string;
  mark: string;
}

export const appTypeOptions = [
  {
    label: '前端',
    value: 'frontend',
  },
  {
    label: '后端',
    value: 'backend',
  },
];
export default function EnvironmentList() {
  const projectEnvInfo: any = history.location.state;
  const [isUpdata, setIsUpdata] = useState<boolean>(false);
  const [enviroInitData, setEnviroInitData] = useState<EnvironmentEdit>();
  const [enviroEditMode, setEnviroEditMode] = useState<EditorMode>('HIDE');
  const [appsListData, setAppsListData] = useState<any>([]);
  const [projectEnvData, setProjectEnvData] = useState<any>([]);
  const [dataSource, setDataSource] = useState<any>([]);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const queryProjectEnv = async (benchmarkEnvCode: string, envCode: string) => {
    setListLoading(true);
    await getRequest(queryProjectEnvList, { data: { benchmarkEnvCode, envCode } })
      .then((res) => {
        if (res?.success) {
          let data = res?.data?.dataSource;
          setProjectEnvData(data[0]);
          setEnviroInitData(data[0]);
        }
      })
      .finally(() => {
        setListLoading(false);
      });
  };
  const queryCommonParamsRef = useRef<{ benchmarkEnvCode: string; projectEnvCode: string; whichApps: String }>({
    benchmarkEnvCode: projectEnvInfo.benchmarkEnvCode,
    projectEnvCode: projectEnvInfo.envCode,
    whichApps: 'alreadyAdd',
  });
  const queryAppsListData = async (paramObj: any) => {
    setLoading(true);
    let canAddAppsData: any = []; //可选数据数组
    await getRequest(queryAppsList, {
      data: {
        benchmarkEnvCode: paramObj.benchmarkEnvCode,
        projectEnvCode: paramObj.projectEnvCode,
        appName: paramObj?.appName,
        appCode: paramObj?.appCode,
        appType: paramObj?.appType,
        whichApps: paramObj?.whichApps,
      },
    })
      .then((res) => {
        if (res?.success) {
          let data = res?.data;
          data.canAddApps?.map((item: any, index: number) => {
            canAddAppsData.push({
              value: item.appCode,
              label: item.appName,
            });
          });
          setAppsListData(canAddAppsData);
          if (data.alreadyAddApps) {
            setDataSource(data.alreadyAddApps);
          } else {
            setDataSource([]);
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    queryProjectEnv(projectEnvInfo.benchmarkEnvCode, projectEnvInfo.envCode);
    // queryAppsListData(queryCommonParamsRef.current);
  }, []);

  const onSpin = () => {
    setIsSpinning(true);
  };

  const stopSpin = () => {
    setIsSpinning(false);
  };

  const cancelUpdate = () => {
    setIsUpdata(false);
  };

  return (
    <PageContainer className="project-env-detail">
      <EnvironmentEditDraw
        mode={enviroEditMode}
        initData={enviroInitData}
        onClose={() => {
          setEnviroEditMode('HIDE');
        }}
        onSave={() => {
          setEnviroEditMode('HIDE');
          setIsUpdata(true);
          // queryAppsListData(queryCommonParamsRef.current);
        }}
      />

      <ContentCard>
        <div className="table-caption">
          <div className="caption-left">
            <h3>项目详情</h3>
          </div>
          <div className="caption-right">
            <Button
              type="primary"
              onClick={() => {
                setEnviroEditMode('EDIT');
              }}
            >
              <DiffOutlined />
              编辑
            </Button>
          </div>
        </div>
        <div>
          <Spin spinning={isSpinning || loading}>
            <Descriptions
              bordered
              column={2}
              labelStyle={{ color: '#5F677A', textAlign: 'right', whiteSpace: 'nowrap', width: 175 }}
            >
              <Descriptions.Item label="项目环境名">{projectEnvData?.envName || '--'}</Descriptions.Item>
              <Descriptions.Item label="项目环境CODE">{projectEnvData?.envCode || '--'}</Descriptions.Item>
              <Descriptions.Item label="基准环境CODE">{projectEnvData?.relEnvs || '--'}</Descriptions.Item>
              <Descriptions.Item label="环境大类">{projectEnvData?.envTypeCode || '--'}</Descriptions.Item>
              <Descriptions.Item label="备注" span={3}>
                {projectEnvData?.mark || '--'}
              </Descriptions.Item>
            </Descriptions>
          </Spin>
        </div>
        <Spin spinning={isSpinning || loading}>
          <DetailList onSpin={onSpin} stopSpin={stopSpin} isUpdata={isUpdata} cancelUpdate={cancelUpdate}></DetailList>
        </Spin>
      </ContentCard>
    </PageContainer>
  );
}
