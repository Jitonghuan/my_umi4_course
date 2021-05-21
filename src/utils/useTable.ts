import { useAntdTable } from 'ahooks';
import { getRequest, postRequest } from './request';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { FormInstance } from 'antd/lib';
import { IResponse } from '@cffe/vc-request/es/service';

interface UseTableProps {
  url: string;
  method: 'POST' | 'GET';
  form: FormInstance;
  formatResult?: (result: any) => { total: number; list: any[] };
}

const useTable = (props: UseTableProps) => {
  const { method, url, form, formatResult } = props;

  const getTableData = (
    { current, pageSize }: PaginatedParams[0],
    formData: Record<string, any>,
  ) => {
    if (method === 'GET') {
      return getRequest(url, {
        method: 'GET',
        data: { ...formData, pageIndex: current, pageSize },
      }).then((data) => {
        if (formatResult) {
          return formatResult(data);
        }
        return {
          total: data.data?.pageInfo?.total,
          list: data.data.dataSource,
        };
      });
    }

    return postRequest(url, {
      method: 'POST',
      data: { ...formData, pageIndex: current, pageSize },
    }).then((data) => {
      if (formatResult) {
        return formatResult(data);
      }
      return {
        total: data.data?.pageInfo?.total,
        list: data.data.dataSource,
      };
    });
  };

  const antdTable = useAntdTable(getTableData, {
    defaultPageSize: 20,
    form,
  });

  return {
    ...antdTable,
  };
};

export default useTable;
