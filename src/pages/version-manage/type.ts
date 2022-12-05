
export const statusMap: any = {
    developing: { label: '版本开发', color: 'blue' },
    waitPack: { label: '等待发版', color: 'geekblue' },
    packing: { label: '正在打包', color: 'green' },
    packError: { label: '打包出错', color: 'red' },
    packFinish: { label: '发版完成', color: 'purple' },
    disable: { label: '版本禁用', color: 'volcano' },
    mergeError: { label: '合并错误', color: 'red' },
    merged: { label: '版本合并', color: 'cyan' },
    merging: { label: '版本合并中', color: 'lime' }
}

export interface UpdateItems{
    id: number,
    releaseNumber: string,
    categoryCode: string,
    mergeReleaseIds: string,
    status: string,
    locked: number,
    planTime: string,
    finishTime: string,
    owner: string,
    errorInfo:string,
    sketch: string,
    desc: string,
    createUser: string,
    modifyUser:string,
    gmtCreate: string,
    gmtModify: string,
    relationDemandCount: number,
    alterationAppCount: number,
    alterationConfigCount: number,
    alterationSqlCount: number,
    downloadCount: number
}