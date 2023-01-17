declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.gif';
declare module 'qs';
declare module '*.svg' {
  export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement;
  const url: string;
  export default url;
}

declare const NODE_ENV: any;
declare var window: Window & typeof globalThis;

/** 用于 Select, Radio, Checkbox 的数据项 */
declare interface IOption<ValueType = string, T = Record<string, any>> extends Record<string, any> {
  label: string;
  value: ValueType;
  key?:string|number;
  /** 用于挂载到选项上的业务数据 */
  data?: T;
  children?: IOption<ValueType>[];
}

/** 编辑弹层显示状态: 隐藏 | 编辑 | 新增 */
declare type EditorMode = 'HIDE' | 'EDIT' | 'ADD' | 'VIEW' | "COPY";
