export interface IProps {
  appCode: string;
  env: string;
  visible: boolean;
  onClose: () => void;
  /** 提交成功后回调 */
  onSubmit: () => void;
  configType: 'boot' | 'app';
}
