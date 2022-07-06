/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-07-06 15:16:35
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-07-06 15:53:29
 * @FilePath: /fe-matrix/src/pages/database/overview/dashboard/pie-one.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useMemo, useEffect, useState } from 'react';
import { Pie } from '@ant-design/charts';
import { Button, Space, Form } from 'antd';
import useTable from '@/utils/useTable';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';
const { ColorContainer } = colorUtil.context;
export default function DEMO() {
  const [form] = Form.useForm();
  const [mode, setMode] = useState<EditorMode>('HIDE');
  const options = {
    grid: {
      left: '0',
      right: '0',
      top: '0',
      bottom: '0',
    },
    tooltip: {
      trigger: 'item',
      formatter(param: any) {
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
            value: 80,
            name: '数值',
            // itemStyle: { color: color || '#439D75' },
            itemStyle: { color: '#439D75' },
          },
          // {
          //   value: 100,
          //   name: '空闲',
          //   itemStyle: { color: '#ddd' },
          // },
        ],
      },
    ],
  };

  return (
    <>
      <h3>集群信息</h3>
      <ColorContainer roleKeys={['color']}>
        <EchartsReact option={options} />
      </ColorContainer>
    </>
  );
}
