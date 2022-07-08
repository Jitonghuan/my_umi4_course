export interface statusInterface {
    [key: string]: any;
}

export const STATUS_COLOR: statusInterface = {
    risk: '#d0c669', offline: '#c15454', health: '#65ca75'
};

export const STATUS_TEXT: statusInterface = {
    risk: '警告', offline: '离线中', health: '健康'
}