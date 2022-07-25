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
}

export default function OverviewDashboards(props: OverviewDashboardsIProps) {
  const { dataSource } = props;
  const data = [
    {
      type: 'MySQL',
      value: dataSource?.sumMysql === 0 ? null : dataSource?.sumMysql,
    },

    {
      type: 'PostgreSQL',
      value: dataSource?.sumPostgre === 0 ? null : dataSource?.sumPostgre,
    },
    {
      type: 'Mongdb',
      value: dataSource?.sumMongdb === 0 ? null : dataSource?.sumMongdb,
    },
    {
      type: 'Redis',
      value: dataSource?.sumRedis === 0 ? null : dataSource?.sumRedis,
    },
    {
      type: 'RDS',
      value: dataSource?.sumRds === 0 ? null : dataSource?.sumRds,
    },
  ];
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
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
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
    // statistic: {
    //   title: {
    //     offsetY: -4,
    //     customHtml: (container:any, view:any, datum:any) => {
    //       const { width, height } = container.getBoundingClientRect();
    //       const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
    //       console.log('datum.type ',datum?.type, datum)
    //       const text = datum ? datum.type : '总实例数';
    //       return renderStatistic(d, text, {
    //         fontSize: 28,
    //       });
    //     },
    //   },
    //   content: {
    //     offsetY: 4,
    //     style: {
    //       fontSize: '32px',
    //     },
    //     customHtml: (container:any, view:any, datum:any, data:any) => {
    //       const { width } = container.getBoundingClientRect();
    //       const text = datum ? ` ${datum.value}` : "";
    //       return renderStatistic(width, text, {
    //         fontSize: 32,
    //       });
    //     },
    //   },
    // },
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
