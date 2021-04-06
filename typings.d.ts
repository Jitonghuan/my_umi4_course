declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>,
  ): React.ReactElement;
  const url: string;
  export default url;
}
declare interface globalConfig {
  /** 标题 */
  title: string;
  /** icon */
  favicon: string;
  /** logo */
  logo: string;
  /** 授权 */
  copyright: string;
}

declare interface Window {
  FE_GLOBAL: globalConfig;
}

declare const NODE_ENV: any;
declare var window: Window & typeof globalThis;
