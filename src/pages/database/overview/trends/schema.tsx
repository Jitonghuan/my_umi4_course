
//MySQL cpu/内存利用率
export const getCpuOption: any = (data = []) => {
    return {
        data,
        xField: 'time',
        yField: 'count',
        seriesField: 'category',
        xAxis: {
            // tickInterval:6,
            // tickCount:20
        },
        yAxis: {
            label: {
                // 数值格式化为带百分号
                formatter: (v: any) => `${v}%`,
            },
        },
        width: 550,
        height: 260,
    };
};
export const getDiskOption: any = (data = []) => {
    return {
        data,
        xField: 'time',
        yField: 'count',
        seriesField: 'category',
        xAxis: {
            // tickInterval:6,
            // tickCount:20
        },
        yAxis: {
            label: {
                // 数值格式化为带百分号
                formatter: (v: any) => `${v}%`,
            },
        },
        width: 550,
        height: 260,
    };
};
//MySQL存储空间使用量
export const getMemoryOption: any = (data = []) => {
    return {
        data,
        xField: 'time',
        yField: 'count',
        seriesField: 'category',
        yAxis: {
            // title: {
            //   text: '内存',
            // },
            label: {
                // 数值格式化为带百分号
                formatter: (v: any) => `${v}%`,
            },
        },
        LegendCfg: {
            legend: {
                position: 'top-left',
            },
        },

        width: 550,
        height: 260,
    };
};

//会话连接
export const getSessionOption: any = (data = []) => {
    return {
        data: data || [],
        xField: 'time',
        yField: 'count',
        seriesField: 'category',
        color: ['#1890ff', '#8bc0d6'],
        yAxis: {
            label: {
                // 数值格式化为带百分号
                // formatter: (v: any) => `${v}%`,
            },
        },
        LegendCfg: {
            legend: {
                position: 'top-left',
            },
        },

        width: 550,
        height: 260,
    };
};

//流量吞吐（KB）
export const getTrafficOption: any = (data = []) => {
    return {
        data,
        xField: 'time',
        yField: 'count',
        seriesField: 'category',
        xAxis: {
            // tickInterval:6,
            // tickCount:20
        },
        yAxis: {
            label: {
                // 数值格式化为带百分号
                formatter: (v: any) => `${v}KB`,
                // formatter: (v: any) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
            },
        },
        // width: 550,
        height: 260,
    };
};

//执行次数
export const getExecutionOption: any = (data = [], loading = false) => {
    return {
        data,
        xField: 'time',
        yField: 'count',
        seriesField: 'category',
        xAxis: {
            // tickInterval:6,
            // tickCount:20
        },
        yAxis: {
            label: {
                // 数值格式化为带百分号
                formatter: (v: any) => `${v}K`,
                // formatter: (v: any,record) =>{ console.log("v",v,record)}
            },
        },
        // width: 550,
        height: 260,
    };
};


/* ---------引擎监控---------- */
export const getDirtyPctOption: any = (data = []) => {
    return {
        data,
        xField: 'time',
        yField: 'count',
        seriesField: 'category',
        xAxis: {
            // tickInterval:6,
            // tickCount:20
        },
        tooltip: {
            formatter: (datum: any) => {
                return { name: datum.category, value: datum.count + '%' };
              },

          },
        yAxis: {
            label: {
                // 数值格式化为带百分号
                formatter: (v: any) => `${v}%`,
            },
        },
        width: 550,
        height: 260,
    };
};
export const getHitOption: any = (data = []) => {
    return {
        data,
        xField: 'time',
        yField: 'count',
        seriesField: 'category',
        tooltip: {
            formatter: (datum: any) => {
                return { name: datum.category, value: datum.count + '%' };
              },

          },
        xAxis: {
            // tickInterval:6,
            // tickCount:20
        },
        yAxis: {
            label: {
                // 数值格式化为带百分号
                formatter: (v: any) => `${v}%`,
            },
        },
        width: 550,
        height: 260,
    };
};
export const getUsageOption: any = (data = []) => {
    return {
        data,
        xField: 'time',
        yField: 'count',
        seriesField: 'category',
        tooltip: {
            formatter: (datum: any) => {
                return { name: datum.category, value: datum.count + '%' };
              },

          },
        xAxis: {
            // tickInterval:6,
            // tickCount:20
        },
        yAxis: {
            label: {
                // 数值格式化为带百分号
                formatter: (v: any) => `${v}%`,
            },
        },
        width: 550,
        height: 260,
    };
};

export const getWrittenOption: any = (data = []) => {
    return {
        data,
        xField: 'time',
        yField: 'count',
        seriesField: 'category',
        xAxis: {
            // tickInterval:6,
            // tickCount:20
        },
        tooltip: {
            formatter: (datum: any) => {
                return { name: datum.category, value: datum.count + 'k' };
              },

          },
        yAxis: {
            label: {
                // 数值格式化为带百分号
                formatter: (v: any) => `${v}K`,
                // formatter: (v: any) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
            },
        },
        // width: 550,
        height: 260,
    };
};
export const getReadOption: any = (data = []) => {
    return {
        data,
        xField: 'time',
        yField: 'count',
        seriesField: 'category',
        xAxis: {
            // tickInterval:6,
            // tickCount:20
        },
        tooltip: {
            formatter: (datum: any) => {
                return { name: datum.category, value: datum.count + 'k' };
              },

          },
        yAxis: {
            label: {
                // 数值格式化为带百分号
                formatter: (v: any) => `${v}K`,
                // formatter: (v: any) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
            },
        },
        // width: 550,
        height: 260,
    };
};

export const getRowsOpsOption: any = (data = []) => {
    return {
        data,
        xField: 'time',
        yField: 'count',
        seriesField: 'category',
        tooltip: {
            formatter: (datum: any) => {
             
                return { name: datum.category, value:datum.category==="Rows read"?  datum.count + 'k':datum.count };
              },

          },
        xAxis: {
            // tickInterval:6,
            // tickCount:20
        },
        yAxis: {
            label: {
                // 数值格式化为带百分号
                formatter: (v: any) => `${v}K`,
                // formatter: (v: any) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
            },
        },
        // width: 550,
        height: 260,
    };
};
//TPS/QPS
export const getTpsOption: any = (data = []) => {
    return {
        data,
        xField: 'time',
        yField: 'count',
        seriesField: 'category',
        color: ['#6897a7', '#8bc0d6', '#60d7a7'],
        xAxis: {
            // type: 'time',
            // tickCount: 5,
        },
        tooltip: {
            formatter: (datum: any) => {
                return { name: datum.category, value: datum.count + 'k' };
              },

          },
       
        yAxis: {
            // title:{
            //   text:'内存'
            // },
            label: {
                // 数值格式化为带百分号
                formatter: (v: any) => `${v}k`,
            },
        },
        width: 550,
        height: 260,
    };
};
//TPS/QPS
export const getQpsOption: any = (data = []) => {
    return {
        data,
        xField: 'time',
        yField: 'count',
        seriesField: 'category',
        color: ['#6897a7', '#8bc0d6', '#60d7a7'],
        xAxis: {
            // type: 'time',
            // tickCount: 5,
        },
        tooltip: {
            formatter: (datum: any) => {
                return { name: datum.category, value: datum.count + 'k' };
              },

          },
       
        yAxis: {
            // title:{
            //   text:'内存'
            // },
            label: {
                // 数值格式化为带百分号
                formatter: (v: any) => `${v}k`,
            },
        },
        width: 550,
        height: 260,
    };
};
export const getConnections: any = (data = []) => {
    return {
        data,
        xField: 'time',
        yField: 'count',
        seriesField: 'category',
        // color: ['#6897a7', '#8bc0d6', '#60d7a7'],
        xAxis: {
            // type: 'time',
            // tickCount: 5,
        },
        tooltip: {
            formatter: (datum: any) => {
                return { name: datum.category, value: datum.count + 'k' };
              },

          },
       
        yAxis: {
            // title:{
            //   text:'内存'
            // },
            label: {
                // 数值格式化为带百分号
                formatter: (v: any) => `${v}k`,
            },
        },
        width: 550,
        height: 260,
    };
};

