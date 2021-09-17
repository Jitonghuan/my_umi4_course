import { CaseItemVO, TreeNode, FuncProps } from '../../interfaces';

export interface CaseEditorProps extends Record<string, any> {
  mode: EditorMode;
  initData?: CaseItemVO;
  /** 当前节点，新增时用到 */
  current?: TreeNode;
  /** 当前的 API 节点，新增时用到 */
  apiDetail?: Record<string, any>;
  /** 保存前调用，如果返回 false，则停止保存 */
  hookBeforeSave?: (mode: EditorMode, payload: any) => Promise<boolean>;
  onCancel?: () => any;
  onSave?: () => any;
}

/** 参数类型 */
export type ParamType = 'json' | 'form';

export type TabKeys = 'form-mode' | 'source-mode';
