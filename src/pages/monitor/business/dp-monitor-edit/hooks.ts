import { useState, useEffect } from 'react';
import {getRequest, postRequest} from '@/utils/request';
import * as APIS from '../service';

export function useDbType() {
  const [dbType, setDbType] = useState<IOption[]>([]);
  useEffect(() => {
    getRequest(APIS.getDbType, {}).then((result) => {
      const next = (result?.data || []).map((item: any) => ({
        label: item,
        value: item,
      }));

      setDbType(next);
    });
  }, []);

  return [dbType];
}

export function useQueryLogSample() {
  const [source, setSource] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const queryLogSample = async (data: any) => {
    setLoading(true);
    await postRequest(APIS.metricPreview, {
      data,
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
