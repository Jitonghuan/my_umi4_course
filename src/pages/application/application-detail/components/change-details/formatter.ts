// 应用变更详情 formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/09/16 16:34
import React, { useEffect, useState, useContext } from 'react';
import { getRequest } from '@/utils/request';
import { changeDetailList, envList } from './service';
import DetailContext from '@/pages/application/application-detail/context';
import moment from 'moment';

// 变更详情折线图
export function appChangeChart(appChangeData: Record<string, any>) {
  const { appData } = useContext(DetailContext);
  const startDate = moment().subtract(8, 'days').format('YYYY-MM-DD');
  const endDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
  console.log('时间：', startDate, endDate);
  useEffect(() => {
    getChangeDetailList();
  }, []);
  let envCodeArry = [];
  const getChangeDetailList = () => {
    getRequest(changeDetailList, {
      data: { appCode: appData?.appCode, cycleStart: startDate, cycleEnd: endDate },
    })
      .then((result) => {
        let changeDetailData = result.data;
        for (let index = 0; index < changeDetailData.length; index++) {
          const element = changeDetailData[index];
        }
      })
      .finally(() => {});
  };
  return {
    title: {
      text: '应用变更折线图',
    },
    tooltip: {
      trigger: 'axis',
    },
    //图例组件
    legend: {
      data: ['HBOS开发', 'HBOS测试', 'HBOS预发', 'HBOS生产'],
      orient: 'vertical',
      top: 0,
      right: 0,
      icon: 'rect',
      itemWidth: 27, // 设置宽度
      itemHeight: 4, // 设置高度
    },
    grid: {
      left: '2%',
      right: '8%',
      top: '28%',
      bottom: '0%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      // data: appChangeData[6],
      data: ['09/09', '09/10', '09/11', '09/12', '09/13', '09/14', '09/15'],
      name: '应用变更日期',
    },
    yAxis: {
      type: 'value',
      name: '变更量',
    },
    series: [
      {
        name: 'HBOS开发',
        type: 'line',
        // stack: '访问量',
        color: '#191970',
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: 'HBOS测试',
        type: 'line',
        color: '#2E8B57',
        // stack: '访问量',
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: 'HBOS预发',
        type: 'line',
        // stack: '访问量',
        color: '#8B864E',
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: 'HBOS生产',
        type: 'line',
        // stack: '访问量',
        color: '#3A5FCD',
        data: [320, 332, 301, 334, 390, 330, 320],
      },
    ],
  } as any;
}
