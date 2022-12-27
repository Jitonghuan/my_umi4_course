/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-07-06 15:16:35
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-07-15 16:45:51
 * @FilePath: /fe-matrix/src/pages/database/overview/dashboard/pie-one.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useMemo} from 'react';
import { Pie, measureTextWidth } from '@ant-design/charts';
export interface OverviewDashboardsIProps {
  dataSource: any;
  pieTypeData: any;
}

export default function OverviewDashboards(props: OverviewDashboardsIProps) {
  const { dataSource, pieTypeData } = props;
  let data: any = [];
  pieTypeData?.map((item: string) => {
    data.push({
      type: item + '',
      value: dataSource[item] === 0 ? 0 : dataSource[item],
    });
  });

  const config = {
    // padding:14,
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.6,
    // label:false,
    label: {
      type: 'inner',
      offset: '-50%',
      content: (item: any) => {
        if (item.value !== 0) {
          return item.value;
        }
      },

      autoRotate: false,
      style: {
        textAlign: 'center',
        fontSize: 12,
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: 14,
        },
        content: '总实例数',
      },
    },
  };

  return (
    <>
      <h3>按数据库类型分布情况</h3>

      <div 
      style={{ padding: 0, height: 160 }}
        >
       
        {
            useMemo(() => <Pie {...config} />, [dataSource,pieTypeData])
        }
      </div>
    </>
  );
}
