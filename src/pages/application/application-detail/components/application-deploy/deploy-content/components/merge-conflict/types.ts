export interface MergeProp {
  visible: boolean;
  handleCancel: any;
  mergeMessage: conflictItem[];
  releaseBranch: string;
}

export interface conflictItem {
  id?: any;
  resolved?: boolean;
  filePath: string;
  releaseBranch: Branch;
  featureBranch: Branch;
}

export interface Branch {
  branchName: string;
  context: string;
}
