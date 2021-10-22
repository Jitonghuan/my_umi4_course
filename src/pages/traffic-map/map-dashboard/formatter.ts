let color = ['#ffffff', '#36fff6', '#ffe93a', '#67f95f'];
let oneArr = [
  {
    name: '地理信息中台',
    type: 0,
    symbol: '',
    symbolSize: 190,
    itemStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: '#ffe93a', // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#36fff6', // 100% 处的颜色
          },
        ],
        global: false, // 缺省为 false
      },
    },
  },
];
let erArr = [
  {
    name: '市城市管理局',
    type: 1,
  },
  {
    name: '科大讯飞',
    type: 2,
  },
  {
    name: '市水利局',
    type: 1,
  },
  {
    name: '市政法委',
    type: 1,
  },
  {
    name: '市自然资源和规划局',
    type: 1,
  },
  {
    name: '市生态环境局',
    type: 1,
  },
  {
    name: '市大数据局',
    type: 3,
  },
];
let allArr = [...oneArr, ...erArr],
  dataArr = [];
// 点
allArr.forEach((el, ind) => {
  if (el.type > 0) {
    el.symbolSize = 50;
    el.symbol =
      'path://M544 552.325V800a32 32 0 0 1-32 32 31.375 31.375 0 0 1-32-32V552.325L256 423.037a32 32 0 0 1-11.525-43.512A31.363 31.363 0 0 1 288 368l224 128 222.075-128a31.363 31.363 0 0 1 43.525 11.525 31.988 31.988 0 0 1-11.525 43.513L544 551.038z m0 0,M64 256v512l448 256 448-256V256L512 0z m832 480L512 960 128 736V288L512 64l384 224z m0 0';
    el.itemStyle = {
      color: color[el.type],
    };
  }
  el.label = {
    normal: {
      show: true,
      position: 'bottom',
      distance: 10,
      color: color[el.type],
    },
  };
});

// 圆形分区
function group(arr, r) {
  const newArray = [];
  const { length: arLen } = arr;
  arr.forEach((e, ind) => {
    // 按角度均匀分布
    const ang = 90 - (360 / arLen).toFixed(2) * (ind + 1);
    const x = Math.cos((ang * Math.PI) / 180).toFixed(2) * r;
    const y = Math.sin((ang * Math.PI) / 180).toFixed(2) * r;
    const x1 = Math.cos((ang * Math.PI) / 180).toFixed(2) * (r - 5);
    const y1 = Math.sin((ang * Math.PI) / 180).toFixed(2) * (r - 5);
    const x0 = Math.cos((ang * Math.PI) / 180).toFixed(2) * (r - 30);
    const y0 = Math.sin((ang * Math.PI) / 180).toFixed(2) * (r - 30);
    e.value = [x.toFixed(2), y.toFixed(2)];
    e.twoPoint = [
      [x1.toFixed(2), y1.toFixed(2)],
      [x0.toFixed(2), y0.toFixed(2)],
    ];
    newArray.push(e);
  });
  return newArray;
}

// 线配置
function linesConfig(arr) {
  const [dataArr, targetCoord] = [[], [0, 0]];
  arr.forEach((el) => {
    function getFormatItem(start, end) {
      let item = [
        { coord: el.twoPoint[start] }, // 起点
        {
          coord: el.twoPoint[end],
          lineStyle: {
            color: color[el.type],
            curveness: el.type === 3 ? 0.1 : 0,
          },
          effect: {
            color: color[el.type],
          },
        }, // 终点
      ];
      return item;
    }
    switch (el.type) {
      case 0:
        break;
      case 1:
        dataArr.push(getFormatItem(0, 1));
        break;
      case 2:
        dataArr.push(getFormatItem(1, 0));
        break;
      case 3:
        dataArr.push(getFormatItem(0, 1));
        dataArr.push(getFormatItem(1, 0));
        break;
    }
  });
  return dataArr;
}

// 点分布
oneArr = group(oneArr, 0);
erArr = group(erArr, 40);

allArr = [...oneArr, ...erArr];
// 线坐标和配置
dataArr = linesConfig(allArr);

function generateData(totalNum, bigvalue, smallvalue, color) {
  let dataArr = [];
  for (var i = 0; i < totalNum; i++) {
    if (i % 2 === 0) {
      dataArr.push({
        name: (i + 1).toString(),
        value: bigvalue,
        itemStyle: {
          normal: {
            color: color,
            borderWidth: 0,
          },
        },
      });
    } else {
      dataArr.push({
        name: (i + 1).toString(),
        value: smallvalue,
        itemStyle: {
          normal: {
            color: 'rgba(0,0,0,0)',
            borderWidth: 0,
          },
        },
      });
    }
  }
  return dataArr;
}

let dolitData = generateData(100, 25, 20, 'rgb(126,190,255)');
let threeData = generateData(6, 40, 10, '#2dc0c9');

function getOption(startAngle, radius) {
  let option = {
    backgroundColor: '#081c47',
    title: {
      text: '开启线图拖尾效果出现一卡一卡\n因为圆使用的定时动画',
      left: 'center',
      textStyle: {
        color: '#fff',
      },
    },
    xAxis: {
      show: false,
      type: 'value',
      max: 50,
      min: -51,
    },
    grid: {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10,
    },
    yAxis: {
      show: false,
      type: 'value',
      max: 50,
      min: -50,
    },
    series: [
      {
        name: '节点',
        type: 'graph',
        silent: false,
        hoverAnimation: false, // 鼠标悬浮高亮
        cursor: 'default',
        coordinateSystem: 'cartesian2d',
        z: 3,
        itemStyle: {
          normal: {
            shadowColor: 'none',
          },
        },
        emphasis: {
          scale: false,
        },
        data: allArr,
      },
      {
        name: '线图',
        type: 'lines',
        hoverAnimation: false,
        silent: false,
        cursor: 'default',
        coordinateSystem: 'cartesian2d',
        polyline: false, // 多线段
        z: 1,
        lineStyle: {
          width: 2,
          type: 'dashed',
          curveness: 0,
        },
        effect: {
          show: true,
          period: 8, //箭头指向速度，值越小速度越快
          trailLength: 0, //特效尾迹长度[0,1]值越大，尾迹越长重
          symbol: 'arrow', //箭头图标
          symbolSize: 6,
        },
        emphasis: {
          lineStyle: {
            type: 'dashed',
          },
        },
        data: dataArr,
      },
      {
        name: '不动外圆',
        type: 'pie',
        zlevel: 4,
        silent: true,
        radius: ['60%', '59%'],
        label: {
          normal: {
            show: false,
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
        data: dolitData,
      },
      {
        type: 'pie',
        name: '旋转圆',
        zlevel: 20,
        silent: true,
        radius: ['50%', '49%'],
        hoverAnimation: false,
        startAngle: startAngle,
        data: threeData,
        label: {
          normal: {
            show: false,
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
      },
      {
        name: '缩放圆',
        type: 'pie',
        zlevel: 4,
        silent: true,
        radius: [radius + 1 + '%', radius + '%'],
        label: {
          normal: {
            show: false,
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
        data: dolitData,
      },
    ],
  };
  return option;
}

let startAngle = 50; // 初始旋转角度
let [minradius, radius, maxradius] = [24, 24, 28]; // 初始缩放尺寸
let isBig = true; // 缩放动画 标识

function draw() {
  startAngle = startAngle - 5;
  if (isBig) {
    radius = radius + 0.5;
    if (radius > maxradius) {
      isBig = false;
    }
  } else {
    radius = radius - 0.5;
    if (radius < minradius) {
      isBig = true;
    }
  }
  let option = getOption(startAngle, radius);
  myChart.setOption(option, true);
}

timer = setInterval(draw, 200);
