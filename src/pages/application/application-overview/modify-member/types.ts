export interface IProps {
  formValue?: FormValue;
  visible: boolean;
  onClose: () => void;
  /** 提交成功后回调 */
  onSubmit: () => void;
}

export interface FormValue {
  id?: number | string;
  // TODO 待接口文档
  [key: string]: any;
}
