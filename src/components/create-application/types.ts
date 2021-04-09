export interface IProps {
  formValue?: FormValue;
  visible: boolean;
  onClose: () => void;
  onSubmit: (value: FormValue) => void;
}

export interface FormValue {
  id?: number | string;
  // TODO 待接口文档
  [key: string]: any;
}
