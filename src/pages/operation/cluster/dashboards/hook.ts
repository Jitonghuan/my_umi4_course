// dashboard hooks
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:36

import { useState, useEffect, useCallback } from 'react';
import * as APIS from '../service';
import { getRequest } from '@/utils/request';
type AnyObject = Record<string, any>;
/** A集群各院区流量 */
export function useClusterA(): [AnyObject, boolean] {
  const [data, setData] = useState<AnyObject>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
  }, []);

  return [data, loading];
}
