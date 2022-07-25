/**
 * @description: 图表接口
 * @name {muxi.jth}
 * @date {2021/12/13 10:30}
 */
import { useState, useEffect, useCallback } from 'react';
import * as APIS from '../../service';
import { getRequest } from '@/utils/request';
import moment from 'moment';
//性能趋势
export function useQueryPerformanceTrends() {
  const [dataSource, setDataSource] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  const queryPerformanceTrends = async (paramsObj: { instanceId: number; start: any; end: any }) => {
    setLoading(true);
    await getRequest(APIS.performanceTrends, { data: paramsObj })
      .then((res) => {
        if (res?.success) {
          let dataSource = res?.data;
          // let dataSource=data;
          //会话链接
          let connectionsDataArry: any = [];
          //CPU内存利用率
          let cpuLimitDataArry: any = [];
          let cpuUseDataArry: any = [];
          //磁盘读取
          let diskReadsDataArry: any = [];
          let diskWritesDataArry: any = [];
          //memLimitInfo
          let memLimitInfoDataArry: any = [];
          let qpsDataArry: any = [];
          let receiveDataArry: any = [];
          let rowsOpsDataArry: any = [];
          let rssInfoDataArry: any = [];
          let tpsDataArry: any = [];
          let transmitDataArry: any = [];
          let wssInfoDataArry: any = [];
          if (dataSource?.connections && dataSource?.connections?.length > 0) {
            dataSource?.connections?.map((item: any, index) => {
              console.log('Object.keys(item)1111', Object.keys(item));
              const key = Object.keys(item)[index];
              item[key]?.map((ele: any) => {
                connectionsDataArry.push({
                  category: key,
                  time: moment(parseInt(ele[0]) * 1000).format('MM-DD HH:mm'),
                  count: Number(Number(ele[1]).toFixed(1)),
                });
              });
            });
          }

          /* ------------------------------ */
          if (dataSource?.cpuLimit && dataSource?.cpuLimit?.length > 0) {
            dataSource?.cpuLimit?.map((item: any, index) => {
              console.log('Object.keys(item)222', Object.keys(item));
              const key = Object.keys(item)[index];
              item[key]?.map((ele: any) => {
                cpuLimitDataArry.push({
                  category: key,
                  time: moment(parseInt(ele[0]) * 1000).format('MM-DD HH:mm'),
                  count: Number(Number(ele[1]).toFixed(1)),
                });
              });
            });
          }
          /* ------------------------------ */
          if (dataSource?.cpuUse && dataSource?.cpuUse?.length > 0) {
            dataSource?.cpuUse?.map((item: any, index) => {
              console.log('Object.keys(item)333', Object.keys(item));
              const key = Object.keys(item)[index];
              item[key]?.map((ele: any) => {
                cpuUseDataArry.push({
                  category: key + '_cpu_use',
                  time: moment(parseInt(ele[0]) * 1000).format('MM-DD HH:mm'),
                  count: Number(Number(ele[1]).toFixed(1)),
                });
              });
            });
          }
          /* ------------------------------ */
          if (dataSource?.diskReads && dataSource?.diskReads?.length > 0) {
            dataSource?.diskReads?.map((item: any, index) => {
              console.log('Object.keys(item)444', Object.keys(item));
              const key = Object.keys(item)[index];
              item[key]?.map((ele: any) => {
                diskReadsDataArry.push({
                  category: key + '_disk_reads',
                  time: moment(parseInt(ele[0]) * 1000).format('MM-DD HH:mm'),
                  count: Number(Number(ele[1]).toFixed(1)),
                });
              });
            });
          }
          /* ------------------------------ */
          if (dataSource?.diskWrites && dataSource?.diskWrites?.length > 0) {
            dataSource?.diskWrites?.map((item: any, index: number) => {
              console.log('Object.keys(item)555', Object.keys(item));
              const key = Object.keys(item)[index];
              item[key]?.map((ele: any) => {
                diskWritesDataArry.push({
                  category: key + '_disk_writes',
                  time: moment(parseInt(ele[0]) * 1000).format('MM-DD HH:mm'),
                  count: Number(Number(ele[1]).toFixed(1)),
                });
              });
            });
          }
          /* ------------------------------ */
          if (dataSource?.memLimitInfo && dataSource?.memLimitInfo?.length > 0) {
            dataSource?.memLimitInfo?.map((item: any, index) => {
              console.log('Object.keys(item)6666', Object.keys(item));
              const key = Object.keys(item)[index];
              item[key]?.map((ele: any) => {
                memLimitInfoDataArry.push({
                  category: key,
                  time: moment(parseInt(ele[0]) * 1000).format('MM-DD HH:mm'),
                  count: Number(Number(ele[1]).toFixed(1)),
                });
              });
            });
          }
          /* ------------------------------ */
          if (dataSource?.qps && dataSource?.qps?.length > 0) {
            dataSource?.qps?.map((item: any, index) => {
              console.log('Object.keys(item)7777', Object.keys(item));
              const key = Object.keys(item)[index];
              item[key]?.map((ele: any) => {
                qpsDataArry.push({
                  category: key + '_qps',
                  time: moment(parseInt(ele[0]) * 1000).format('MM-DD HH:mm'),
                  count: Number(Number(ele[1]).toFixed(1)),
                });
              });
            });
          }
          /* ------------------------------ */
          if (dataSource?.receive && dataSource?.receive?.length > 0) {
            dataSource?.receive?.map((item: any, index) => {
              console.log('Object.keys(item)8888', Object.keys(item));
              const key = Object.keys(item)[index];
              item[key]?.map((ele: any) => {
                receiveDataArry.push({
                  category: key + '_receive',
                  time: moment(parseInt(ele[0]) * 1000).format('MM-DD HH:mm'),
                  count: Number(Number(ele[1]).toFixed(1)),
                });
              });
            });
          }
          /* ------------------------------ */
          if (dataSource?.rowsOps && dataSource?.rowsOps?.length > 0) {
            dataSource?.rowsOps?.map((item: any, index) => {
              console.log('Object.keys(item)9999', Object.keys(item));
              const key = Object.keys(item)[index];
              item[key]?.map((ele: any) => {
                rowsOpsDataArry.push({
                  category: key,
                  time: moment(parseInt(ele[0]) * 1000).format('MM-DD HH:mm'),
                  count: Number(Number(ele[1]).toFixed(1)),
                });
              });
            });
          }
          /* ------------------------------ */
          if (dataSource?.rssInfo && dataSource?.rssInfo?.length > 0) {
            dataSource?.rssInfo?.map((item: any, index) => {
              console.log('Object.keys(item)10101010', Object.keys(item));
              const key = Object.keys(item)[index];
              item[key]?.map((ele: any) => {
                rssInfoDataArry.push({
                  category: key + '_rss',
                  time: moment(parseInt(ele[0]) * 1000).format('MM-DD HH:mm'),
                  count: Number(Number(ele[1]).toFixed(1)),
                });
              });
            });
          }
          /* ------------------------------ */
          if (dataSource?.tps && dataSource?.tps?.length > 0) {
            dataSource?.tps?.map((item: any, index) => {
              console.log('Object.keys(item)12121212', Object.keys(item));
              const key = Object.keys(item)[index];
              item[key]?.map((ele: any) => {
                tpsDataArry.push({
                  category: key + '_tps',
                  time: moment(parseInt(ele[0]) * 1000).format('MM-DD HH:mm'),
                  count: Number(Number(ele[1]).toFixed(1)),
                });
              });
            });
          }
          /* ------------------------------ */
          if (dataSource?.transmit && dataSource?.transmit?.length > 0) {
            dataSource?.transmit?.map((item: any, index) => {
              console.log('Object.keys(item)131331', Object.keys(item));
              const key = Object.keys(item)[index];
              item[key]?.map((ele: any) => {
                transmitDataArry.push({
                  category: key + '_transmit',
                  time: moment(parseInt(ele[0]) * 1000).format('MM-DD HH:mm'),
                  count: Number(Number(ele[1]).toFixed(1)),
                });
              });
            });
          }
          /* ------------------------------ */
          if (dataSource?.wssInfo && dataSource?.wssInfo?.length > 0) {
            dataSource?.wssInfo?.map((item: any, index) => {
              console.log('Object.keys(item)14144141', Object.keys(item));
              const key = Object.keys(item)[index];
              item[key]?.map((ele: any) => {
                wssInfoDataArry.push({
                  category: key,
                  time: moment(parseInt(ele[0]) * 1000).format('MM-DD HH:mm'),
                  count: Number(Number(ele[1]).toFixed(1)),
                });
              });
            });
          }
          console.log('tpsDataArry.concat(qpsDataArry)', tpsDataArry.concat(qpsDataArry));

          setDataSource({
            //cpu内存利用率
            cpuMem: cpuUseDataArry.concat(rssInfoDataArry),
            //存储空间
            memLimit: diskReadsDataArry.concat(diskWritesDataArry),
            //TPS/QPS
            tpsQps: tpsDataArry.concat(qpsDataArry),
            //会话链接
            connection: connectionsDataArry,
            //流量吞吐
            transmit: receiveDataArry.concat(transmitDataArry),
            //执行次数
            rowsOpsData: rowsOpsDataArry,
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [dataSource, loading, queryPerformanceTrends];
}
