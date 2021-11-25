/*
 * @Author: shixia.ds
 * @Date: 2021-11-23 14:29:03
 * @Description:
 */
export const OriginData = {
  nodes: [
    { id: 'region0', label: '0', type: 'card-node', status: 'normal', nodeType: 'region' },
    { id: 'region1', label: '1', type: 'card-node', status: 'normal', nodeType: 'region' },
    { id: 'region2', label: '2', type: 'card-node', status: 'warning', nodeType: 'region' },
    { id: 'region3', label: '3', type: 'card-node', status: 'danger', nodeType: 'region' },
    { id: 'region4', label: '4', type: 'card-node', status: 'normal', nodeType: 'region' },
    { id: 'region5', label: '5', type: 'card-node', status: 'normal', nodeType: 'region' },

    { id: 'node0', label: '0', type: 'circle', status: 'normal', nodeRegionCode: 'region0' },
    { id: 'node1', label: '1', type: 'circle', status: 'normal', nodeRegionCode: 'region1' },
    { id: 'node2', label: '2', status: 'warning', nodeRegionCode: 'region2' },
    { id: 'node3', label: '3', status: 'danger', nodeRegionCode: 'region3' },
    { id: 'node4', label: '4', status: 'normal', nodeRegionCode: 'region4' },
    { id: 'node5', label: '5', status: 'normal', nodeRegionCode: 'region4' },
    { id: 'node6', label: '6', status: 'normal', nodeRegionCode: 'region1' },
    { id: 'node7', label: '7', status: 'normal', nodeRegionCode: 'region1' },
    { id: 'node8', label: '8', status: 'normal', nodeRegionCode: 'region2' },
    { id: 'node9', label: '9', status: 'normal', nodeRegionCode: 'region2' },
    { id: 'node10', label: '10', status: 'normal', nodeRegionCode: 'region2' },
    { id: 'node11', label: '11', status: 'normal', nodeRegionCode: 'region2' },
    { id: 'node12', label: '12', status: 'normal', nodeRegionCode: 'region2' },
    { id: 'node13', label: '13', status: 'normal', nodeRegionCode: 'region2' },
    { id: 'node14', label: '14', status: 'normal', nodeRegionCode: 'region3' },
    { id: 'node15', label: '15', status: 'normal', nodeRegionCode: 'region3' },
    { id: 'node16', label: '16', status: 'normal', nodeRegionCode: 'region3' },
  ],
  edges: [
    { source: 'region0', target: 'region1', label: '0-1\n0-2' },
    { source: 'region0', target: 'region2', label: '0-1\n0-2' },
    { source: 'region0', target: 'region3', label: '0-1\n0-2' },
    { source: 'region0', target: 'region4', label: '0-1\n0-2' },
    { source: 'region0', target: 'region5', label: '0-1\n0-2' },

    { source: 'node0', target: 'region1', label: '0-1\n0-2' },
    { source: 'node0', target: 'region2', label: '0-1\n0-2' },
    { source: 'node0', target: 'region3', label: '0-1\n0-2' },
    { source: 'node0', target: 'region4', label: '0-1\n0-2' },
    { source: 'node0', target: 'region5', label: '0-1\n0-2' },

    { source: 'node0', target: 'node1', label: '0-1\n0-2' },
    { source: 'node0', target: 'node2', label: '0-2' },
    { source: 'node0', target: 'node3', label: '0-3' },
    { source: 'node0', target: 'node4', label: '0-4' },
    { source: 'node0', target: 'node5', label: '0-5' },
    { source: 'node1', target: 'node6', label: '1-6' },
    { source: 'node1', target: 'node7', label: '1-7' },
    { source: 'node2', target: 'node8', label: '2-8' },
    { source: 'node2', target: 'node9', label: '2-9' },
    { source: 'node2', target: 'node10', label: '2-10' },
    { source: 'node2', target: 'node11', label: '2-11' },
    { source: 'node2', target: 'node12', label: '2-12' },
    { source: 'node2', target: 'node13', label: '2-13' },
    { source: 'node3', target: 'node14', label: '3-14' },
    { source: 'node3', target: 'node15', label: '3-15' },
    { source: 'node3', target: 'node16', label: '3-16' },
    { source: 'node8', target: 'node10', label: '8-10' },
    { source: 'node8', target: 'node13', label: '8-13' },
    { source: 'node8', target: 'node12', label: '8-12' },
  ],
  combos: [
    { id: 'combo1', label: 'Combo 1', type: 'card-combo' },
    { id: 'combo2', label: 'Combo 2', type: 'card-combo' },
    { id: 'combo3', label: 'Combo 3', type: 'card-combo' },
  ],
};
