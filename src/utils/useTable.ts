import { useAntdTable } from 'ahooks';
import { getRequest, postRequest } from './request';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { FormInstance } from 'antd/lib';
import { IResponse } from '@cffe/vc-request/es/service';

interface UseTableProps {
  url: string;
  method: 'POST' | 'GET';
  form: FormInstance;
}

const useTable = (props: UseTableProps) => {
  const { method, url, form } = props;

  const getTableData = (
    { current, pageSize }: PaginatedParams[0],
    formData: Record<string, any>,
  ) => {
    console.log(formData, 'formData==');

    if (method === 'GET') {
      return getRequest(url, {
        method: 'GET',
        data: { ...formData, pageIndex: current, pageSize },
      }).then((data) => ({
        total: data.data?.pageInfo?.total,
        list: data.data.dataSource,
      }));
    }

    return postRequest(url, {
      method: 'POST',
      data: { ...formData, pageIndex: current, pageSize },
    });
  };

  const antdTable = useAntdTable(getTableData, {
    defaultPageSize: 20,
    form,
  });

  console.log(antdTable, 'antdTable');

  return {
    ...antdTable,
  };
};

export default useTable;
