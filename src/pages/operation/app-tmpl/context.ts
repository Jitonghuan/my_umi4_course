import { createContext } from 'react';
//需要共享给兄弟组件推送页的数据信息：
export interface ContextTypes {
  envCode?: string;
  appCategoryCode?: string;
  templateType?: string;
  templateValue?: string;
  jvm?: string;
  tmplConfigurableItem?: object;
}
export default createContext<ContextTypes>({});
