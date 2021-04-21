import { ConfigData } from '../../types';

export interface IProps {
  env: string;
  type: 'look' | 'edit' | 'add';
  formValue?: ConfigData;
  visible: boolean;
  onClose: () => void;
  /** 提交成功后回调 */
  onSubmit: () => void;
}
