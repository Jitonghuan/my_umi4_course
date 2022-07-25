/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-07-06 15:16:35
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-07-15 16:45:51
 * @FilePath: /fe-matrix/src/pages/database/overview/dashboard/pie-one.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Pie } from '@ant-design/charts';
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
      type: 'Postgre',
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
