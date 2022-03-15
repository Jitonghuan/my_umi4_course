import { cancelCollection, addCollection } from './service';
import { postRequest } from '@/utils/request';

export function collectRequst(collectionType: string, addOrCancel: string, params: any) {
  const url = addOrCancel === 'add' ? addCollection : cancelCollection;
  postRequest(url, { data: { ...params } }).then((res) => {
    if (res) {
      return res.data.success;
    }
  });
}
