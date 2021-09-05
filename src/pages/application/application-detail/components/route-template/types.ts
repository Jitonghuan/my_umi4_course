// route template types
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/03 17:34

export interface RouteTemplateItemVO {
  id: number;
  appCode: string;
  appCategoryCode: string;
  templateType: string;
  templateCode: string;
  envCode: string;
  tmplConfigurableItem: string;
  value: string;
  createUser: string;
  modifyUser: string;
  gmtCreate: string;
  gmtModify: string;
}
