export interface conflictItem {
    id?: any;
    resolved?: boolean;
    filePath: string;
    content: string;
}

export const statusMap: any = {
    Initializing: 'wait',
    AnalyzeFailed: 'error',
    Analyzed: 'wait',
    Queue: 'process',
    Running: 'process',
    Paused: 'process',
    Failed: 'error',
    Timeout: 'error',
    StopByUser: 'error',
    Disabled: 'gray',
    Success: 'finish',
    WaitApprove: "process",
    WaitInput: 'error',
    WaitDownload: "finish",
    Batch1: "process",
    Batch2: "process",
    WaitConfirm: 'process',
}