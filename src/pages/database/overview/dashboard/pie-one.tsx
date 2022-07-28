/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-07-06 15:16:35
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-07-15 16:45:51
 * @FilePath: /fe-matrix/src/pages/database/overview/dashboard/pie-one.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
      value: dataSource[item] === 0 ? null : dataSource[item],
    });
  });

  function renderStatistic(containerWidth: any, text: any, style: any) {
    const { width: textWidth, height: textHeight } = measureTextWidth(text, style);
    const R = containerWidth / 2; // r^2 = (w / 2)^2 + (h - offsetY)^2

    let scale = 1;

    if (containerWidth < textWidth) {
      scale = Math.min(Math.sqrt(Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)))), 1);
    }

    const textStyleStr = `width:${containerWidth}px;`;
    return `<div style="${textStyleStr};font-size:${scale}em;line-height:${scale < 1 ? 1 : 'inherit'};">${text}</div>`;
  }

  const config = {
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
      content: '{value}',
      autoRotate: false,
      style: {
        textAlign: 'center',
        fontSize: 14,
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
          fontSize: 18,
        },
        content: '总实例数',
      },
    },
  };

  return (
    <>
      <h3>按数据库类型分布情况</h3>

      <div style={{ padding: 10, height: 220 }}>
        <Pie {...config} />
      </div>
    </>
  );
}
