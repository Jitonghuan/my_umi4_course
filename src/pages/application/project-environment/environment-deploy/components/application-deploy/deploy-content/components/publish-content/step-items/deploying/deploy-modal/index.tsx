/**
 * DeployModal
 * @description 部署-弹窗
 * @author moting.nq
 * @create 2021-04-24 11:46
 */

import React, { useMemo, useState, useEffect, useContext } from 'react';
import { Modal, Radio, Spin, message, Select } from 'antd';
import DetailContext from '@/pages/application/application-detail/context';
import { confirmProdDeploy, queryEnvsReq, applyHaveNoUpPlanList } from '@/pages/application/service';
import { IProps } from './types';
import { getRequest, postRequest } from '@/utils/request';

export default function DeployModal({ envTypeCode, visible, deployInfo, onCancel, onOperate }: IProps) {
  const { deployStatus, deployedEnvs, deployingEnv, deployingHosBatch, jenkinsUrl, deployApplyIds } = deployInfo || {};
  const { appData } = useContext(DetailContext);
  const { appCategoryCode, appCode } = appData || {};
  const [stateDeployEnv, setStateDeployEnv] = useState<string>();
  const [deployBatch, setDeployBatch] = useState(12);
  const [envDataList, setEnvDataList] = useState<any>([]);
  useEffect(() => {
    let batch = localStorage.DEPLOYBATCH ? localStorage.DEPLOYBATCH : 12;
    let applyIdsData;
    if (localStorage.APPLY_IDS) {
      applyIdsData = JSON.parse(localStorage.APPLY_IDS);
    } else {
      applyIdsData = [];
    }
    setDeployBatch(parseInt(batch));
    setCurrentAppIds(applyIdsData);
  }, []);

  useEffect(() => {
    if (!visible) return;

    setStateDeployEnv(deployingEnv);
    if (deployingEnv.indexOf(',') == -1) {
      deployApply(deployingEnv);
    }
    // deployApply(deployingEnv);
  }, [visible]);

  useEffect(() => {
    if (!appCategoryCode) return;
    queryEnvsReq({
      // categoryCode: appCategoryCode as string,
      envTypeCode,
      appCode: appData?.appCode,
    }).then((data) => {
      let envSelect = [];
      data?.list?.map((item: any) => {
        envSelect.push({ label: item.envName, value: item.envCode });
      });
      setEnvDataList(data.list);
    });
  }, [appCategoryCode, envTypeCode]);

  const envList = useMemo(() => {
    const { envs } = deployInfo;
    const namesArr: any[] = [];
    if (envs?.indexOf(',') > -1) {
      const list = envs?.split(',') || [];
      envDataList?.forEach((item: any) => {
        list?.forEach((v: any) => {
          if (item?.envCode === v) {
            namesArr.push({
              envName: item.envName,
              envCode: v,
            });
          }
        });
      });
      return namesArr;
    }
    return (envDataList as any[]).filter((v: any) => v.envCode === envs);
  }, [envDataList, deployInfo]);

  const deployedEnvList = useMemo(() => {
    const { deployedEnvs } = deployInfo;
    const resultList: any[] = [];
    if (deployedEnvs?.indexOf(',') > -1) {
      const list = deployedEnvs?.split(',') || [];
      envDataList?.forEach((item: any) => {
        list?.forEach((v: any) => {
          if (item?.envCode === v) {
            resultList.push({
              envName: item.envName,
              envCode: v,
            });
          }
        });
      });
      return resultList;
    }
    return (envDataList as any[]).filter((v: any) => v.envCode === deployedEnvs);
  }, [envDataList, deployInfo]);

  const detail = useMemo(() => {
    // TODO 如何判断哪个机构被部署了
    let text1 = null;
    let text2 = null;
    if (deployStatus === 'deployFinish' || deployStatus === 'merging') {
      localStorage.removeItem('DEPLOYBATCH');
      localStorage.removeItem('APPLY_IDS');
    }
    if (deployStatus !== 'deploying' && deployStatus !== 'deployWaitBatch2') {
      return null;
    }

    if (deployStatus === 'deploying') {
      text1 = (
        <span>
          {envList.find((v) => v.envCode === deployingEnv)?.envName}
          正在部署中...
        </span>
      );

      if (deployingHosBatch === 2) {
        text2 = <span>第一批已部署完成，正在部署第二批...</span>;
      }
    } else if (deployStatus === 'deployWaitBatch2') {
      text1 = (
        <span>
          {envList.find((v) => v.envCode === deployingEnv)?.envName}
          正在部署中...
        </span>
      );
      text2 = <span>第一批已部署完成，点击继续按钮发布第二批</span>;
    }
    return (
      <>
        <div>
          <Spin spinning />
          {text1}
          {text2}
        </div>
        {jenkinsUrl && (
          <div>
            <a target="_blank" href={jenkinsUrl}>
              查看构建详情
            </a>
          </div>
        )}
      </>
    );
  }, [deployInfo]);
  const [deployApplyOptions, setDeployApplyOptions] = useState<any>();
  let appIds: any = [];
  const [currentAppIds, setCurrentAppIds] = useState<any>([]);
  let resData;
  const deployApply = async (currentEnv: any) => {
    await getRequest(applyHaveNoUpPlanList, { data: { appCode, envCode: currentEnv } }).then((res) => {
      if (res.success) {
        let dataArry: any = [];
        let dataSource = res.data || [];
        dataSource?.map((item: any) => {
          dataArry.push({ label: item?.ApplyTitle, value: item?.ApplyId });
        });
        setDeployApplyOptions(dataArry);
        if (res.data === null) {
          resData = null;
          setDeployApplyOptions(null);
        }
      }
    });
  };
  const changeDeployApply = (value: any) => {
    appIds = value;
    setCurrentAppIds(value);
    localStorage.APPLY_IDS = JSON.stringify(value || []);
  };

  return (
    <Modal
      title="批量部署"
      visible={visible}
      confirmLoading={deployStatus === 'deploying'}
      okText={deployStatus === 'deployWaitBatch2' ? '继续' : '确定'}
      onOk={() => {
        // let batch: 0 | 1 | 2 = deployBatch === 12 ? 1 : 0;
        let batch;
        if (deployBatch === 0) {
          batch = 0;
        } else if (deployBatch === 12) {
          batch = 1 || 2;
        }
        if (deployStatus === 'deployWaitBatch2') {
          batch = 2;
        } else if (deployStatus === 'deployWait') {
          // batch = 1;
          if (deployBatch === 0) {
            batch = 0;
          } else {
            batch = 1;
          }
        } else {
          onCancel?.();
          return;
        }

        confirmProdDeploy({
          id: deployInfo.id,
          hospital: stateDeployEnv!,
          batch: batch,
          applyIds: currentAppIds!,
        })
          .then((res) => {
            if (!res.success) {
              message.error(res.errorMsg);
            }
          })
          .finally(() => {
            onOperate('deployEnd');
            // window.location.reload();
          });
      }}
      onCancel={onCancel}
    >
      <div>
        <span>发布环境：</span>
        {/* 根据 envs 拿到列表 */}
        <Radio.Group
          disabled={['deploying', 'deployWaitBatch2'].includes(deployStatus)}
          value={stateDeployEnv}
          onChange={(v) => {
            setStateDeployEnv(v.target.value);
            deployApply(v.target.value);
          }}
          options={envList?.map((v: any) => ({
            label: v.envName,
            value: v.envCode,
          }))}
        />
      </div>
      <div style={{ marginTop: 8 }}>
        <span>发布批次：</span>
        <Radio.Group
          disabled={deployStatus !== 'deployWait'}
          value={deployBatch}
          onChange={(v) => {
            setDeployBatch(v.target.value);
            localStorage.DEPLOYBATCH = v.target.value;
          }}
          options={[
            { label: '分批', value: 12 },
            { label: '不分批', value: 0 },
          ]}
        />
      </div>
      {deployApplyOptions !== undefined && deployApplyOptions !== null && (
        <div style={{ marginTop: 8 }}>
          <span>发布申请：</span>
          <Select
            disabled={deployStatus !== 'deployWait'}
            style={{ width: 220 }}
            mode="multiple"
            options={deployApplyOptions}
            onChange={changeDeployApply}
            value={currentAppIds}
          ></Select>
        </div>
      )}

      <h3 style={{ marginTop: 20 }}>发布详情</h3>
      {deployedEnvs &&
        deployedEnvList.map((item: any) => {
          return <div>{item.envName}已经部署完成</div>;
        })}
      {detail}
    </Modal>
  );
}