import { cancelCollection, addCollection } from './service';
import { postRequest } from '@/utils/request';

export async function collectRequst(collectionType: string, addOrCancel: string, params: any): Promise<any> {
  const url = addOrCancel === 'add' ? addCollection : cancelCollection;
  const res = await postRequest(url, { data: { collectionType, collectionObj: params } });
  return res.success;
}
