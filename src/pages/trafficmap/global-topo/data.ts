/*
 * @Author: shixia.ds
 * @Date: 2021-11-23 14:29:03
 * @Description:
 */
export const data = {
  nodes: [
    { id: 'node0', size: 50, label: '0' },
    { id: 'node1', size: 50, label: '1', comboId: 'combo1', isLeaf: true, status: 'normal' },
    { id: 'node2', size: 50, label: '2', comboId: 'combo2', isLeaf: true, status: 'warning' },
    { id: 'node3', size: 50, label: '3', comboId: 'combo3', isLeaf: true, status: 'danger' },
    { id: 'node4', size: 50, label: '4', isLeaf: true, status: 'normal' },
    { id: 'node5', size: 50, label: '5', isLeaf: true, status: 'normal' },
    { id: 'node6', size: 50, label: '6', comboId: 'combo1', status: 'normal' },
    { id: 'node7', size: 50, label: '7', comboId: 'combo1', status: 'normal' },
    { id: 'node8', size: 50, label: '8', comboId: 'combo2', status: 'normal' },
    { id: 'node9', size: 50, label: '9', comboId: 'combo2', status: 'normal' },
    { id: 'node10', size: 50, label: '10', comboId: 'combo2', status: 'normal' },
    { id: 'node11', size: 50, label: '11', comboId: 'combo2', status: 'normal' },
    { id: 'node12', size: 50, label: '12', comboId: 'combo2', status: 'normal' },
    { id: 'node13', size: 50, label: '13', comboId: 'combo2', status: 'normal' },
    { id: 'node14', size: 50, label: '14', comboId: 'combo3', status: 'normal' },
    { id: 'node15', size: 50, label: '15', comboId: 'combo3', status: 'normal' },
    { id: 'node16', size: 50, label: '16', comboId: 'combo3', status: 'normal' },
  ],
  edges: [
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
    { source: 'node3', target: 'node16', label: '3-16' },
    { source: 'node8', target: 'node10', label: '8-10' },
    { source: 'node8', target: 'node13', label: '8-13' },
    { source: 'node8', target: 'node12', label: '8-12' },
  ],
  //   combos: [
  //   { id: 'combo1', label: 'Combo 1' },
  //   { id: 'combo2', label: 'Combo 2'},
  //   { id: 'combo3', label: 'Combo 3' },
  // ],
};
