/** 应用类型 */
export type AppType = 'frontend' | 'backend';

/** 应用开发语言(后端) */
export type AppDevelopLanguage = 'java' | 'golang' | 'python';

/** 前端工程类型 */
export type AppFeProjectType = 'single' | 'micro';

/** 微前端类型 */
export type AppMicroFeType = 'mainProject' | 'subProject';

export interface AppItemVO {
  /** 数据库自增ID */
  id?: number;
  /** 应用CODE */
  appCode: string;
  /** 应用名称 */
  appName: string;
  /** 应用类型 */
  appType: AppType;
  /** 应用分类 */
  appCategoryCode: string;
  /** 应用组CODE */
  appGroupCode: string;
  /** 应用开发语言 (后端) **/
  appDevelopLanguage: AppDevelopLanguage;
  /** 应用部署名称 **/
  deploymentName?: string;
  /** 应用负责人 */
  owner: string;
  /** 应用负责人（仅用于编辑） */
  ownerList?: string[];
  /** gitlab 中项目http地址 */
  gitAddress: string;
  /** gitlab 中项目的分组信息 (未使用) */
  gitGroup?: string;
  /** pom文件路径 (后端、java) */
  deployPomPath?: string;
  /** 二方包应用pom文件位置 (后端) */
  clientPomPath?: string;
  /** 是否是服务端工程包含二方包 (后端) */
  isContainClient?: number;
  /** 是否是二方包应用 (后端) */
  isClient?: number;
  /** 描述 */
  desc?: string;
  /**是否启用Nacos */
  useNacos?: number;

  // ----- 前端应用类型相关属性
  /** 前端工程类型 */
  projectType?: AppFeProjectType;
  /** 微前端类型 */
  microFeType?: AppMicroFeType;
  /** 路由文件（前端 - 微前端应用 - 主工程） */
  routeFile?: string;
  /** 微前端子应用关联主应用信息 */
  relationMainApps?: {
    /** 主应用Code */
    appCode: string;
    /** 路由 */
    routePath: string;
  }[];
  /** 构建任务 */
  deployJobUrl?: string;
  /** 自定义配置参数 */
  customParams?: string;
}
