export interface Node {
    id: string;
    x?: number;
    y?: number;
    envCode: string; //环境CODE
    httpResp: string;
    nodeId: string;
    nodeLabel: string;
    nodeRegion: string; //node类型为app时，其所属域CODE.
    nodeType: string; // node类型，node-应用节点，region-域节点
    requests: number;
    status: string; //节点状态，dangerous危险，waring警告，normal正常
    step: string; //计算数据周期

    [s: string]: any;
}
export interface Edge {
    source: string;
    target: string;
    time: string; //时间戳
    callID: string; //调用线ID
    status: string; //调用线状态，dangerous危险，waring警告，normal正常
    rt: string; //响应时间
    suc: string; //调用成功率
    qps: string; //请求频率
    step: string; //计算数据周期
    degree?: number; // 权重
    [s: string]: any;
}
export interface GraphData {
    nodes: Node[];
    edges: Edge[];
}
const createArray = (s: number) => Array.from(Array(s)).map((e, i) => i);
export const random = (s = 0xffffffff) => Math.floor(Math.random() * s);

export const mockRomote = (size = 20) => {
    let domain = ['中间件', 'region1', 'region2', 'region3'];
    let regionNode = domain.map((item: any) => ({
        id: item,
        nodeId: item,
        nodeType: 'region',
        status: ['normal', 'dangerous', 'warning'][random(3)],
        envCode: 'hbos-dev',
        nodeLabel: 'test',
        step: random(100),
        nodeRegion: '',
    }));
    let appNode: any = domain
        .map((item) =>
            createArray(size).map((i) => ({
                nodeId: `node${random(1001111)}`,
                nodeType: 'node',
                status: ['normal', 'dangerous', 'warning'][random(3)],
                envCode: 'hbos-dev',
                nodeLabel: 'app',
                step: random(100),
                nodeRegion: item,
            })),
        )
        .flat(2);
    let edges = createArray(domain.length * 2).map((item, index) => {
        return {
            callID: 'testCallsID1',
            status: ['normal', 'dangerous', 'warning'][random(3)],
            rt: '124ms',
            suc: '97%',
            qps: '234/s',
            step: '1min',
            source: domain[random(domain.length)],
            target: domain[random(domain.length)],
        };
    });
    let edges2 = createArray(appNode.length * 2).map((item, index) => {
        return {
            callID: 'testCallsID1',
            status: ['normal', 'dangerous', 'warning'][random(3)],
            rt: '124ms',
            suc: '97%',
            qps: '234/s',
            step: '1min',
            source: appNode[random(appNode.length)].nodeId,
            target: appNode[random(appNode.length)].nodeId,
        };
    });
    return {
        data: {
            Nodes: [regionNode, appNode].flat(2),
            Calls: [edges2, edges].flat(2),
        },
    };
};