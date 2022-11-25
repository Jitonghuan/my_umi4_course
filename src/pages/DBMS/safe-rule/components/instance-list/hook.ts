
import { getRequest,postRequest } from '@/utils/request';
import * as APIS from '../../../service';

export const queryRuleSetList = async () =>
await getRequest(APIS.getRuleSetListApi)
  .then((result) => {
    if (result?.success) {
      const dataSource = result.data.ruleSets || [];
      let option = dataSource?.map((ele: any) => (
        {
        label: ele?.ruleSetName,
        value: ele?.id,
        ...ele
      }))
      option.unshift({
        label: "--",
        value: 0,
      })
      return option;

    }
    return [];
  })

  //updateInstanceRuleSetApi
  export const updateRuleSet = (params: {instanceId:number,ruleSetId:number}) =>
  postRequest(APIS.updateInstanceRuleSetApi, {
    data: params,
  });