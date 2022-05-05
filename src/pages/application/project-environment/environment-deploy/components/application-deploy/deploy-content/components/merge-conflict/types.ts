export interface MergeProp {
  visible: boolean;
  handleCancel: any;
  retryMergeClick: any;
  mergeMessage: conflictItem[];
  releaseBranch: string;
  id: any;
}

export interface conflictItem {
  id?: any;
  resolved?: boolean;
  filePath: string;
  content: string;
}

export interface IProp {
  visible: boolean;
  handleCancel: any;
  retryMergeClick: any;
}
