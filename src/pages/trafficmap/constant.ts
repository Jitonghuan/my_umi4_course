import G6 from '@antv/g6';

export const LevelEnum = [
  {
    label: '未分配',
    value: 0,
  },
  {
    label: '重要',
    value: 1,
  },
  {
    label: '中等',
    value: 2,
  },
  {
    label: '普通',
    value: 3,
  },
];
export const DEFAULT_LEVEL = 2;

export const AppRelationEnum = [
  {
    label: '未关联',
    value: 0,
  },
  {
    label: '已关联',
    value: 1,
  },
];

const DANGER_COLOR = '#F5222D';
const WARNING_COLOR = '#FFC020';
const NORMAL_COLOR = '#3592FE';
export const NodeStatusEnum = [
  {
    label: 'dangerous',
  },
  {
    label: 'warning',
  },
  {
    label: 'normal',
  },
];

export const arrowStyleType = {
  dangerous: {
    stroke: DANGER_COLOR,
    lineAppendWidth: 2,
    cursor: 'pointer',
    lineDash: [4, 4, 4, 4],
    lineWidth: 1,
    endArrow: {
      path: G6.Arrow.triangle(),
      fill: DANGER_COLOR,
      strokeOpacity: 0,
    },
  },
  warning: {
    stroke: WARNING_COLOR,
    lineAppendWidth: 2,
    cursor: 'pointer',
    lineDash: [4, 4, 4, 4],
    lineWidth: 1,
    endArrow: {
      path: G6.Arrow.triangle(),
      fill: WARNING_COLOR,
      strokeOpacity: 0,
    },
  },
  normal: {
    stroke: NORMAL_COLOR,
    lineAppendWidth: 2,
    cursor: 'pointer',
    lineDash: [4, 4, 4, 4],
    lineWidth: 1,
    endArrow: {
      path: G6.Arrow.triangle(),
      fill: NORMAL_COLOR,
      strokeOpacity: 0,
    },
  },
};
