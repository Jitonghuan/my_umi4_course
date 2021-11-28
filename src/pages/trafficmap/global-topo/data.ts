/*
 * @Author: shixia.ds
 * @Date: 2021-11-23 14:29:03
 * @Description:
 */
import G6, { ModelConfig } from '@antv/g6';

const DANGER_COLOR = '#F5222D';
const WARNING_COLOR = '#FFC020';
const NORMAL_COLOR = '#3592FE';
const arrowStyleType = {
  dangerous: {
    stroke: DANGER_COLOR,
    lineAppendWidth: 2,
    cursor: 'pointer',
    endArrow: {
      path: G6.Arrow.triangle(),
      fill: DANGER_COLOR,
    },
  },
  warning: {
    stroke: WARNING_COLOR,
    lineAppendWidth: 2,
    cursor: 'pointer',
    endArrow: {
      path: G6.Arrow.triangle(),
      fill: WARNING_COLOR,
    },
  },
  normal: {
    stroke: NORMAL_COLOR,
    lineAppendWidth: 2,
    cursor: 'pointer',
    endArrow: {
      path: G6.Arrow.triangle(),
      fill: NORMAL_COLOR,
    },
  },
};
export const OriginData = {
  nodes: [
    { id: 'region0', label: '0', type: 'card-node', status: 'normal', nodeType: 'region' },
    { id: 'region1', label: '1', type: 'card-node', status: 'normal', nodeType: 'region' },
    { id: 'region2', label: '2', type: 'card-node', status: 'warning', nodeType: 'region' },
    { id: 'region3', label: '3', type: 'card-node', status: 'danger', nodeType: 'region' },
    { id: 'region4', label: '4', type: 'card-node', status: 'normal', nodeType: 'region' },
    { id: 'region5', label: '5', type: 'card-node', status: 'normal', nodeType: 'region' },

    { id: 'node0', label: '0', status: 'normal', nodeRegionCode: 'region0', nodeType: 'app' },
    { id: 'node1', label: '1', status: 'normal', nodeRegionCode: 'region1', nodeType: 'app' },
    { id: 'node2', label: '2', status: 'warning', nodeRegionCode: 'region2', nodeType: 'app' },
    { id: 'node3', label: '3', status: 'danger', nodeRegionCode: 'region3', nodeType: 'app' },
    { id: 'node4', label: '4', status: 'normal', nodeRegionCode: 'region4', nodeType: 'app' },
    { id: 'node5', label: '5', status: 'normal', nodeRegionCode: 'region4', nodeType: 'app' },
    { id: 'node6', label: '6', status: 'danger', nodeRegionCode: 'region1', nodeType: 'app' },
    { id: 'node7', label: '7', status: 'normal', nodeRegionCode: 'region1', nodeType: 'app' },
    { id: 'node8', label: '8', status: 'normal', nodeRegionCode: 'region2', nodeType: 'app' },
    { id: 'node9', label: '9', status: 'normal', nodeRegionCode: 'region2', nodeType: 'app' },
    { id: 'node10', label: '10', status: 'normal', nodeRegionCode: 'region2', nodeType: 'app' },
    { id: 'node11', label: '11', status: 'danger', nodeRegionCode: 'region2', nodeType: 'app' },
    { id: 'node12', label: '12', status: 'normal', nodeRegionCode: 'region2', nodeType: 'app' },
    { id: 'node13', label: '13', status: 'normal', nodeRegionCode: 'region2', nodeType: 'app' },
    { id: 'node14', label: '14', status: 'normal', nodeRegionCode: 'region3', nodeType: 'app' },
    { id: 'node15', label: '15', status: 'normal', nodeRegionCode: 'region3', nodeType: 'app' },
    { id: 'node16', label: '16', status: 'normal', nodeRegionCode: 'region3', nodeType: 'app' },
  ],
  edges: [
    { source: 'region0', target: 'region1', label: '0-1\n0-2', style: arrowStyleType.normal },
    { source: 'region0', target: 'region2', label: '0-1\n0-2', style: arrowStyleType.normal },
    { source: 'region0', target: 'region3', label: '0-1\n0-2', style: arrowStyleType.normal },
    { source: 'region0', target: 'region4', label: '0-1\n0-2', style: arrowStyleType.normal },
    { source: 'region0', target: 'region5', label: '0-1\n0-2', style: arrowStyleType.normal },
    { source: 'region1', target: 'region4', label: '0-1\n0-2', style: arrowStyleType.normal },
    { source: 'region2', target: 'region3', label: '0-1\n0-2', style: arrowStyleType.normal },
    { source: 'region2', target: 'region4', label: '0-1\n0-2', style: arrowStyleType.normal },

    { source: 'node0', target: 'region1', label: '0-1\n0-2', style: arrowStyleType.normal },
    { source: 'node0', target: 'region2', label: '0-1\n0-2', style: arrowStyleType.normal },
    { source: 'node0', target: 'region3', label: '0-1\n0-2', style: arrowStyleType.normal },
    { source: 'node0', target: 'region4', label: '0-1\n0-2', style: arrowStyleType.normal },
    { source: 'node0', target: 'region5', label: '0-1\n0-2', style: arrowStyleType.normal },

    { source: 'node0', target: 'node1', label: '0-1\n0-2', status: 'warning', style: arrowStyleType.warning },
    { source: 'node0', target: 'node2', label: '0-2', status: 'danger', style: arrowStyleType.dangerous },
    { source: 'node0', target: 'node3', label: '0-3', status: 'normal', style: arrowStyleType.normal },
    { source: 'node0', target: 'node4', label: '0-4', status: 'warning', style: arrowStyleType.warning },
    { source: 'node0', target: 'node5', label: '0-5', status: 'normal', style: arrowStyleType.normal },
    { source: 'node1', target: 'node6', label: '1-6', status: 'danger', style: arrowStyleType.dangerous },
    { source: 'node1', target: 'node7', label: '1-7', status: 'normal', style: arrowStyleType.normal },
    { source: 'node2', target: 'node8', label: '2-8', status: 'normal', style: arrowStyleType.normal },
    { source: 'node2', target: 'node9', label: '2-9', status: 'warning', style: arrowStyleType.warning },
    { source: 'node2', target: 'node10', label: '2-10', status: 'normal', style: arrowStyleType.normal },
    { source: 'node2', target: 'node11', label: '2-11', status: 'normal', style: arrowStyleType.normal },
    { source: 'node2', target: 'node12', label: '2-12', status: 'normal', style: arrowStyleType.normal },
    { source: 'node2', target: 'node13', label: '2-13', status: 'danger', style: arrowStyleType.dangerous },
    { source: 'node3', target: 'node14', label: '3-14', status: 'normal', style: arrowStyleType.normal },
    { source: 'node3', target: 'node15', label: '3-15', status: 'normal', style: arrowStyleType.normal },
    { source: 'node3', target: 'node16', label: '3-16', status: 'normal', style: arrowStyleType.normal },
    { source: 'node8', target: 'node10', label: '8-10', status: 'normal', style: arrowStyleType.normal },
    { source: 'node8', target: 'node13', label: '8-13', status: 'normal', style: arrowStyleType.normal },
    { source: 'node8', target: 'node12', label: '8-12', status: 'normal', style: arrowStyleType.normal },
    { source: 'node4', target: 'node5', label: '4-5', status: 'normal', style: arrowStyleType.normal },
  ],
  combos: [],
};
