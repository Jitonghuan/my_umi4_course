export interface MergeProp {
  visible: boolean;
  handleCancel: any;
  retryMergeClick: any;
  mergeMessage: conflictItem[];
  releaseBranch: string;
}

export interface conflictItem {
  id?: any;
  resolved?: boolean;
  filePath: string;
  context: string;
}

export interface IProp {
  visible: boolean;
  handleCancel: any;
  retryMergeClick: any;
}
