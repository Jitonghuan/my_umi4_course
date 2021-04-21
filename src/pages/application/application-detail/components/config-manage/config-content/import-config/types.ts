export interface IProps {
  env: string;
  visible: boolean;
  onClose: () => void;
  /** 提交成功后回调 */
  onSubmit: () => void;
}
