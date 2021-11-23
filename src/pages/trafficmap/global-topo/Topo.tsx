/*
 * @Author: shixia.ds
 * @Date: 2021-11-23 15:41:41
 * @Description:
 */
import G6 from '@antv/g6';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { data } from './data';

const Topo = () => {
  const [loading, setLoading] = useState(false);

  const ref = React.useRef(null);
  let graph = null as any;

  useEffect(() => {
    const container = document.getElementById('topo');

    const width = container?.scrollWidth;
    const height = 600;
    if (!graph) {
      graph = new G6.Graph({
        container: 'topo',
        width,
        height,
        layout: {
          type: 'comboForce',
          nodeSpacing: (d: any) => 100,
          focusNode: 'li',
          linkDistance: (d: any) => {
            // if (d.source.id === 'node0') {
            //   return 200;
            // }
            return 3;
          },
          unitRadius: 100,
          nodeStrength: (d: any) => {
            if (d.isLeaf) {
              return -50;
            }
            return -0;
          },
          preventOverlap: true,
        },
        defaultCombo: {
          // The type of the combos. You can also assign type in the data of combos
          type: 'cRect',
          // ... Other global configurations for combos
        },
        comboStateStyles: {
          dragenter: {
            lineWidth: 4,
            stroke: '#FE9797',
          },
        },
        modes: {
          default: [
            'drag-canvas',
            'drag-node',
            'activate-relations',
            {
              type: 'zoom-canvas',
            },
          ],
        },
        defaultNode: {
          /* node type */
          type: 'circle',
          /* node size */
          size: [60],
          /* style for the keyShape */
          style: {
            fill: '#9EC9FF',
            stroke: '#5B8FF9',
            lineWidth: 3,
          },
          labelCfg: {
            /* label's position, options: center, top, bottom, left, right */
            position: 'bottom',
            /* label's offset to the keyShape, 4 by default */
            //   offset: 12,
            /* label's style */
            //   style: {
            //     fontSize: 20,
            //     fill: '#ccc',
            //     fontWeight: 500
            //   }
          },
          /* icon configuration */
          icon: {
            /* whether show the icon, false by default */
            show: true,
            /* icon's img address, string type */
            img: 'https://gw.alipayobjects.com/zos/bmw-prod/dc1ced06-417d-466f-927b-b4a4d3265791.svg',
            /* icon's size, 20 * 20 by default: */
            // width: 35,
            // height: 35,
          },
        },
        defaultEdge: {
          size: 1,
          style: {
            stroke: '#e2e2e2',
            lineAppendWidth: 2,
          },
        },
        nodeStateStyles: {
          // node style of active state
          active: {
            fillOpacity: 0.2,
          },
          // node style of selected state
          selected: {
            lineWidth: 5,
            fillOpacity: 0.2,
          },
        },
        edgeStateStyles: {
          yourStateName: {
            stroke: '#f00',
            lineWidth: 3,
          },
        },
      });
      graph.data(data);
      graph.render();
      graph.on('node:mouseenter', (evt: any) => {
        const { item } = evt;
        graph.setItemState(item, 'active', true);
      });

      graph.on('node:mouseleave', (evt: any) => {
        const { item } = evt;
        graph.setItemState(item, 'active', false);
      });

      graph.on('node:click', (evt: any) => {
        const { item } = evt;
        graph.setItemState(item, 'selected', true);
      });
      graph.on('canvas:click', (evt: any) => {
        graph.getNodes().forEach((node: any) => {
          graph.clearItemStates(node);
        });
      });
    }
  }, []);

  if (typeof window !== 'undefined')
    window.onresize = () => {
      if (!graph || graph.get('destroyed')) return;
      const container = document.getElementById('topo');
      if (!container) return;
      graph.changeSize(container.scrollWidth, container.scrollHeight - 30);
    };

  return <div id="topo"></div>;
};

export default Topo;
