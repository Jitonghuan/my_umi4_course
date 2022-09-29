
type status = {
    text: string;
    image:string;
  };
  export const STATUS_TYPE: Record<string, status> = {
    "online": { text: '在线包',image:"不含镜像"  },
    "offline": { text: '离线包',image:"含底座、组件以及镜像"  },
    "onlineComponent": { text: '在线组件包',image:"不包含底座" },
    "offlineComponent": { text: '离线组件包', image:"" },
   
  };
  type packageStatus = {
    text: string;
    color:string;
  }
  export const PACKAGE_STATUS_TYPE: Record<string, packageStatus> = {
    未出包: { text: '未出包', color: 'gray' },
    出包中: { text: '出包中', color: 'green' },
    出包异常: { text: '出包异常', color: 'red' },
    已出包: { text: '已出包', color: 'blue' },
    未知: { text: '未知', color: 'default' },
  };