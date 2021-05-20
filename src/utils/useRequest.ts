import { useState } from 'react';
import { getRequest, postRequest } from './request';
import { message } from 'antd';

type IResponse<R = any> = {
  success: boolean;
  errorMsg: string;
  /** 失败的错误码 */
  code: number;
  /** 请求返回数据 */
  data: R;
};

interface UseRequestProps<R = any> {
  api: string;
  method?: 'POST' | 'GET';
  onSuccess?: (res: IResponse) => void;
  successText?: string;
  isSuccessModal?: boolean;
  formatData?: (res: R) => R;
}

interface RunProps<T = any> {
  (body?: Record<string, T>): Promise<void>;
}

const useRequest = <K>(props: UseRequestProps) => {
  const {
    method,
    api,
    successText,
    isSuccessModal = false,
    onSuccess,
    formatData,
  } = props;
  const [data, setData] = useState<K>();
  const [loading, setLoading] = useState<boolean>(false);

  const run: RunProps = async (body = {}) => {
    setLoading(true);
    const resp =
      method === 'POST'
        ? await postRequest(api, { method: 'POST', data: body })
        : await getRequest(api, { method: 'GET', data: body });

    if (!resp.success) return;
    onSuccess && onSuccess(resp.data);
    if (isSuccessModal) {
      message.success(successText);
    }
    setLoading(false);

    if (formatData) {
      setData(formatData(resp.data));
      return;
    }
    setData(resp.data);
  };

  const resetData = (value: any) => {
    setData(value);
  };

  return {
    data,
    loading,
    run,
    resetData,
  };
};

export default useRequest;
