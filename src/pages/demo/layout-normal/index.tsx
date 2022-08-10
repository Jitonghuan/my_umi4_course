// 普通布局
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React,{useCallback,useState} from 'react';
import {Modal} from 'antd';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import type { IResponse } from '@cffe/vc-request/es/base-request/type';
import { getRequest, postRequest } from '@/utils/request';
import { addAPIPrefix } from '@/utils';
import appConfig from '@/app.config';
export const unreadNumApi = `${appConfig.apiPrefix}/adminManage/systemNotice/unreadNum`;

type ResPromise = Promise<IResponse<any>>;
/** GET Nacos配置比对 */
export const configDiff = addAPIPrefix('/opsManage/k8s/multiple/configDiff');
export default function DemoPageNormal() {
  const [pending, setPending] = useState(true);
  const [currState, setCurrState] = useState<any>();
  const [catchError, setCatchError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<any>('');

  const updateResultLog = useCallback((addon: string) => {
    // resultLogCache += `[${moment().format('HH:mm:ss')}] ${addon || '<no result> success'}\n`;
    // setResultLog(resultLogCache);
  }, []);
  const doAction = useCallback(async (promise: ResPromise) => {
    try {
      setPending(true);
      const result = await promise;
      let addon = result?.data;
      let errorCode=result?.code;
      if(errorCode===1001){
        debugger
        setCatchError(true);
        setErrorMessage(`<ERROR> ${result?.errorMsg || 'Server Error'}`);

      }
      if (typeof addon === 'object' && 'log' in addon) {
        if (addon?.log === 'null') {
          addon = '';
        } else {
          addon = addon?.log;
        }
      }
      if (typeof addon === 'object' && 'syncLog' in addon) {
        //  addon.deploymentName === 'Pass' ? ` ${addon.syncLog || '--'}` :
        addon = ` ${addon.syncLog || '--'}`;
      }
      if (typeof addon === 'object' && 'deploymentName' in addon) {
        addon = `当前同步的应用: ${addon.deploymentName || '--'}`;
      }

      updateResultLog(addon);
      return result;
    } catch (ex) {
      updateResultLog(`<ERROR> ${ex?.message || 'Server Error'}`);
      setErrorMessage(`<ERROR> ${ex?.message || 'Server Error'}`);
      setCatchError(true);
      throw ex;
    } finally {
      setPending(false);
    }
  }, []);
  const resultAction=(resultCode:number,errorMsg:any,doAction:any)=>{
    if(resultCode===1001){
      Modal.error({
        title: '同步出错！',
        content: errorMsg,
      });

     

    }else{
      // ()=>{doAction}
      doAction
    }

  }
  const configDiff = useCallback(async () => {
    await doAction(getRequest(unreadNumApi)).then((res)=>{
      resultAction(res?.code,res?.errorMsg, setCurrState('GetDiffClusterConfig'))

    });
   
  }, []);
  return (
    <PageContainer>
      <ContentCard>Hello
        <a onClick={configDiff}>dianjibidui,{currState}</a>
      </ContentCard>
    </PageContainer>
  );
}
