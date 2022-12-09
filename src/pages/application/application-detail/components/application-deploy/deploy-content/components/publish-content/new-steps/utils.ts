declare type PipeType = {
    id: number;
    runAfter: string[]
    children?: PipeType[];
    [name: string]: any
}
export const mockData: PipeType[] = [
    {
        "id": 1,
        name: '开始任务',
        "code": "start",
        "instanceCode": "qqq",
        "executorKind": "qqq",
        "executorName": "qqq",
        "status": "Success",
        "consTimeSec": 1,
        "gmtBegin": "qqq",
        "gmtEnd": "qqq",
        "modifyUser": "qqq",
        "createUser": "qqq",
        "extra": {},
        runAfter: [''],
    },
    {
        "id": 2,
        "code": "merge",
        name: '合并分支',
        "instanceCode": "qqq",
        "executorKind": "qqq",
        "executorName": "qqq",
        "status": "Success",
        "consTimeSec": 1,
        "gmtBegin": "qqq",
        "gmtEnd": "qqq",
        "modifyUser": "qqq",
        "createUser": "qqq",
        "extra": {},
        runAfter: ['start'],
    },
    {
        "id": 3,
        "code": "building1",
        name: '部署',
        "instanceCode": "qqq",
        "executorKind": "qqq",
        "executorName": "qqq",
        "status": "Batch1",
        "consTimeSec": 1,
        "gmtBegin": "qqq",
        "gmtEnd": "qqq",
        "modifyUser": "qqq",
        "createUser": "qqq",
        "extra": {
            envCode: 'base'
        },
        runAfter: ['merge'],
    },
    {
        "id": 4,
        "code": "building2",
        name: '部署',
        "instanceCode": "qqq",
        "executorKind": "qqq",
        "executorName": "qqq",
        "status": "Pause",
        "consTimeSec": 1,
        "gmtBegin": "qqq",
        "gmtEnd": "qqq",
        "modifyUser": "qqq",
        "createUser": "qqq",
        "extra": {
            envCode: 'hbos'
        },
        runAfter: ['merge'],
    },
    {
        "id": 6,
        name: '推送版本',
        "code": "pushVersion1",
        "instanceCode": "qqq",
        "executorKind": "qqq",
        "executorName": "qqq",
        "status": "Initializing",
        "consTimeSec": 1,
        "gmtBegin": "qqq",
        "gmtEnd": "qqq",
        "modifyUser": "qqq",
        "createUser": "qqq",
        "extra": {
            envCode: 'base'
        },
        runAfter: ['building1'],
    },
    {
        "id": 7,
        name: '推送版本',
        "code": "pushVersion2",
        "instanceCode": "qqq",
        "executorKind": "qqq",
        "executorName": "qqq",
        "status": "Initializing",
        "consTimeSec": 1,
        "gmtBegin": "qqq",
        "gmtEnd": "qqq",
        "modifyUser": "qqq",
        "createUser": "qqq",
        "extra": {
            envCode: 'hbos'
        },
        runAfter: ['building2'],
    },
    {
        "id": 8,
        name: '完成',
        "code": "finish",
        "instanceCode": "qqq",
        "executorKind": "qqq",
        "executorName": "qqq",
        "status": "Initializing",
        "consTimeSec": 1,
        "gmtBegin": "qqq",
        "gmtEnd": "qqq",
        "modifyUser": "qqq",
        "createUser": "qqq",
        "extra": {},
        runAfter: ['pushVersion1', 'pushVersion2'],
    },
]

// 处理步骤条数据 根据runAfter依次组装数据
export const handleData = (pipes: PipeType[] = mockData) => {
    // 先找到第一个节点
    const root: any = pipes.find((e) => !e.runAfter[0]);
    // 再一直去找下一个节点
    // 先得到[{节点1},{节点2},{节点3},{环境1:[{节点4},{节点5}]},{环境2:[{节点4},{节点5}]},{节点6},{节点7}]的格式
    const arr: any = findNext(root, pipes);
    // 再转换成[[{节点1},{节点2},{节点3}],{环境1:[{节点4},{节点5}]},{环境2:[{节点4},{节点5}]},[{节点6},{节点7}]]的格式
    // 这样才能把单环境多环境交叉的步骤条正常渲染出来
    const finalArr = transAntdStruct(arr);
    return finalArr;
};

export const findNext = (preNode: PipeType, allNodes: PipeType[]) => {
    let res: any = [preNode];
    const next: any = allNodes.filter((item: any) => item.runAfter.includes(preNode.code));
    // 下一个节点为单节点
    if (next.length === 1) {
        // 如果下一个是合并节点则不需要加到返回数组
        if (next[0]?.runAfter?.length > 1) {
            return res;
        } else {
            // 继续拼接单节点
            res = res.concat(findNext(next[0], allNodes));
        }
    }
    // 下一个节点为多环境的节点
    if (next.length > 1) {
        // 拼接多节点 {} 到数组
        res = res.concat(handleMultiEnvNodes(next, allNodes));
    }
    return res;
};
// 组装多环境数据
export const handleMultiEnvNodes = (multiNode: PipeType[], allNodes: PipeType[]) => {
    const multiEnvNode: any = {};
    let res = [multiEnvNode];
    const next: any = [];

    multiNode.map((i: any) => {
        // 假设只分叉一次 ，找到当前环境的节点列表 ，结果均为单节点
        const arr = findNext(i, allNodes);
        multiEnvNode[i.extra.envCode] = arr;
        // 找到单节点列表最后一个单节点
        const code = arr[arr.length - 1].code;
        // 找到此单节点后面的节点，即合并节点
        const after = allNodes.find((e) => e.runAfter.includes(code));
        // 将合并节点 放入 数组
        if (after && !next.find((e: any) => e.code === after.code)) {
            next.push(after);
        }
    });
    // 如果多个环境的合并节点只有一个，继续寻找这个合并节点的后续节点
    if (next.length === 1) {
        res = res.concat(findNext(next[0], allNodes));
    }
    return res;
};

export const transAntdStruct = (arr: any) => {
    let res: any = [];
    arr.forEach((item: any, index: number) => {
        if (item.id) {
            const curr = res[res.length - 1];
            if (curr && Array.isArray(curr)) {
                curr.push(item)
            } else {
                res.push([item])
            }
        } else {
            res.push(item);
        }
    })
    return res;
};