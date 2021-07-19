// data formatter
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/13 11:13

import { TreeNode } from '../../interfaces';

const keys = ['projectId', 'moduleId', 'belongId', 'caseId'];

export function treeDataFormatter(reportTree: any[], level = 1, parent?: TreeNode): TreeNode[] {
  const key = keys[level - 1];

  return reportTree.map((item: any) => {
    const { children, ...info } = item;
    const node: TreeNode = {
      bizId: info[key],
      key: `l${level}-${info[key]}`,
      title: info.name,
      selectable: level === 4,
      level,
      info,
      parent,
    };

    if (level < 4) {
      node.children = treeDataFormatter(item.children || [], level + 1, node);
    }

    return node;
  });
}

export function formatNum(num: number) {
  if (typeof num !== 'number') return '--';
  if (num > 99) return '99+';
  return `${num}`;
}

export function createKVList(obj: Record<string, any>) {
  const keys = Object.keys(obj || {});
  return keys.map((key) => ({
    key,
    value: obj[key],
  }));
}

export function getChartOptions(testcases: Record<string, any>) {
  const { success = 0, fail = 0, total = 1 } = testcases;

  return {
    grid: {
      left: '0',
      right: '0',
      top: '0',
      bottom: '0',
    },
    tooltip: {
      trigger: 'item',
      formatter(param: any = {}) {
        return `${param.name}<br/>${param.marker}${param.value}%`;
      },
    },
    series: [
      {
        type: 'pie',
        radius: ['55%', '90%'],
        label: {
          show: false,
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2,
        },
        labelLine: {
          show: false,
        },
        data: [
          {
            value: success,
            name: '成功',
            itemStyle: { color: '#439D75' },
          },
          {
            value: fail,
            name: '失败',
            itemStyle: { color: '#FF0000' },
          },
        ],
      },
    ],
  } as any;
}
