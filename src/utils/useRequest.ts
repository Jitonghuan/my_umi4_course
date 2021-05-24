import { useState } from 'react';
import request, { getRequest, postRequest } from './request';
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
  api?: string;
  method?: 'POST' | 'GET' | 'DELETE' | 'PUT';
  onSuccess?: (res: R) => void;
  successText?: string;
  isSuccessModal?: boolean;
  formatData?: (res: R) => R;
}

interface RunProps<T = any> {
  (body?: Record<string, T>, url?: string): Promise<any>;
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

  const run: RunProps = async (body = {}, url?: string) => {
    setLoading(true);
    let resp = {} as IResponse;
    switch (method) {
      case 'POST':
      case 'PUT':
        resp = await postRequest(api as string, { method, data: body });
        break;
      case 'GET':
        resp = await getRequest(api as string, { method, data: body });
        break;
      case 'DELETE':
        resp = await request(url as string, { method });
      default:
        break;
    }

    if (!resp.success) return;
    if (onSuccess) {
      onSuccess(resp.data);
    }
    if (isSuccessModal) {
      message.success(successText);
    }
    setLoading(false);

    if (formatData) {
      setData(formatData(resp.data));
      return formatData(resp.data);
    }
    setData(resp.data);

    return resp.data;
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
