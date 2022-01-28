import { useState, useEffect } from 'react';
import { getRequest, putRequest, delRequest } from '@/utils/request';
import * as APIS from '../service';
//选择日志库
export function useLogStoreOptions() {
  const [source, setSource] = useState<any>([]);
  const getRuleIndex = async (envCode: string) => {
    await getRequest(APIS.ruleIndexOptions, {
      data: { envCode },
    }).then((resp) => {
      if (resp?.success) {
        let indexdata = resp.data;
        // const { Index } = result.data || [];
        const next = (indexdata || []).map((n: string) => ({
          label: n,
          value: n,
        }));

        setSource(next);
      }
    });
  };

  return [source, getRuleIndex];
}
// indexModeFields

export function useIndexModeFieldsOptions() {
  const [source, setSource] = useState<any>([]);
  const getIndexModeFields = async (envCode: string, indexMode: string) => {
    await getRequest(APIS.indexModeFields, {
      data: { envCode, indexMode },
    }).then((resp) => {
      if (resp?.success) {
        let indexdata = resp.data;
        // const { Index } = result.data || [];
        const next = (indexdata || []).map((n: string) => ({
          label: n,
          value: n,
        }));

        setSource(next);
      }
    });
  };

  return [source, getIndexModeFields];
}

export function useQueryLogSample() {
  const [source, setSource] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const queryLogSample = async (envCode: string, index: string, appCode?: string) => {
    setLoading(true);
    await getRequest(APIS.getLogSample, {
      data: { envCode, index, appCode },
    })
      .then((resp) => {
        if (resp?.success) {
          let data = resp?.data;
          setSource(data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [source, loading, queryLogSample];
}
