import React, { useState, useEffect } from 'react';
import { getEnvList } from './service';

export const useEnvOptions = () => {
  const [envOptions, setEnvOptions] = useState([]);

  useEffect(() => {
    getEnvOptions();
  }, []);
  const getEnvOptions = async () => {
    const res = await getEnvList();
    const envList = res?.data?.dataSource;
    const envOptions = envList?.map((item: any) => {
      return {
        label: item.envName,
        value: item.envCode,
      };
    });
    setEnvOptions(envOptions);
  };
  return [envOptions];
};
