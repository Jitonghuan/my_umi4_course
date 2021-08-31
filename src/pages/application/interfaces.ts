export type AppType = 'frontend' | 'backend';

export type AppDevelopLanguage = 'java' | 'golang' | 'python';

export interface AppItemVO {
  /** 数据库自增ID */
  id?: number;
  /** 应用CODE */
  appCode: string;
  /** 应用名称    ---支持模糊搜索 */
  appName: string;
  /** 应用类型 */
  appType: AppType;
  /** 应用分类 */
  appCategoryCode: string;
  /** 应用组CODE */
  appGroupCode: string;
  /** 应用开发语言 **/
  appDevelopLanguage: AppDevelopLanguage;
  /** 应用部署名称 **/
  deploymentName?: string;
  /** 应用负责人   ---支持模糊搜索 */
  owner: string;
  /** gitlab 中项目http地址 */
  gitAddress: string;
  /** gitlab 中项目的分组信息 */
  gitGroup?: string;
  /** pom文件路径 ---只有后端应用Java应用才需要 */
  deployPomPath?: string;
  /** 二方包应用pom文件位置 */
  clientPomPath?: string;
  /** 是否是服务端工程包含二方包 */
  isContainClient?: number;
  /** 是否是二方包应用*/
  isClient?: number;
  /** 描述 */
  desc?: string;
}