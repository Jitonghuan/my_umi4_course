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
          let pvcUsagDataArry: any = [];
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
            dataSource?.connections?.map((item: any, index: number) => {
              const key = Object.keys(item)[0];
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
            dataSource?.cpuLimit?.map((item: any, index: number) => {
              const key = Object.keys(item)[0];
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
            dataSource?.cpuUse?.map((item: any, index: number) => {
              const key = Object.keys(item)[0];
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
          if (dataSource?.pvcUsage && dataSource?.pvcUsage?.length > 0) {
            dataSource?.pvcUsage?.map((item: any, index: number) => {
              const key = Object.keys(item)[0];
              item[key]?.map((ele: any) => {
                pvcUsagDataArry.push({
                  category: key,
                  time: moment(parseInt(ele[0]) * 1000).format('MM-DD HH:mm'),
                  count: Number(Number(ele[1]).toFixed(1)),
                });
              });
            });
          }

          /* ------------------------------ */
          if (dataSource?.memLimitInfo && dataSource?.memLimitInfo?.length > 0) {
            dataSource?.memLimitInfo?.map((item: any, index: number) => {
              const key = Object.keys(item)[0];
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
            dataSource?.qps?.map((item: any, index: number) => {
              const key = Object.keys(item)[0];
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
            dataSource?.receive?.map((item: any, index: number) => {
              const key = Object.keys(item)[0];
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
            dataSource?.rowsOps?.map((item: any, index: number) => {
              const key = Object.keys(item)[0];
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
            dataSource?.rssInfo?.map((item: any, index: number) => {
              const key = Object.keys(item)[0];
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
            dataSource?.tps?.map((item: any, index: number) => {
              const key = Object.keys(item)[0];
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
            dataSource?.transmit?.map((item: any, index: number) => {
              const key = Object.keys(item)[0];
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
            dataSource?.wssInfo?.map((item: any, index: number) => {
              const key = Object.keys(item)[0];
              item[key]?.map((ele: any) => {
                wssInfoDataArry.push({
                  category: key,
                  time: moment(parseInt(ele[0]) * 1000).format('MM-DD HH:mm'),
                  count: Number(Number(ele[1]).toFixed(1)),
                });
              });
            });
          }

          setDataSource({
            //cpu内存利用率
            cpuMem: cpuUseDataArry.concat(rssInfoDataArry),
            //存储空间
            memLimit: pvcUsagDataArry,
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

const keyMap:any={
  deleted:'Rows deleted',
  inserted:'Rows inserted',
  read:'Rows read',
  updated:'Rows updated'



}
//getInnodbMonitor
export function useQueryInnodbMonitor() {
  const [dataSource, setDataSource] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const getInnodbMonitor = async (paramsObj: { instanceId: number; start: any; end: any, }) => {
    setLoading(true);
    await getRequest(APIS.getInnodbMonitor, { data: paramsObj })
      .then((res) => {
        if (res?.success) {
          let dataSource = res?.data;
          // let dataSource=data;
          //会话链接
         
          let bufferPoolDirtyPctData:any=[]
          let bufferPoolHitData:any=[]
          let bufferPoolUsagePctData:any=[]
          let innodbDataWrittenData:any=[]
          let innodbDataReadData:any=[];
          let rowsOpsDataArry:any=[]

         

          if (dataSource?.bufferPoolDirtyPct && dataSource?.bufferPoolDirtyPct?.length > 0) {
            dataSource?.bufferPoolDirtyPct?.map((item: any, index: number) => {
              const key = Object.keys(item)[0];
              item[key]?.map((ele: any) => {
                bufferPoolDirtyPctData.push({
                  category: key,
                  time: moment(parseInt(ele[0]) * 1000).format('MM-DD HH:mm'),
                  count: Number(Number(ele[1]).toFixed(1)),
                });
              });
            });
          }
          /* ------------------------------ */
          if (dataSource?.bufferPoolHit && dataSource?.bufferPoolHit?.length > 0) {
            dataSource?.bufferPoolHit?.map((item: any, index: number) => {
              const key = Object.keys(item)[0];
              item[key]?.map((ele: any) => {
                bufferPoolHitData.push({
                  category: key,
                  time: moment(parseInt(ele[0]) * 1000).format('MM-DD HH:mm'),
                  count: Number(Number(ele[1]).toFixed(1)),
                });
              });
            });
          }
           /* ------------------------------ */
           if (dataSource?.bufferPoolUsagePct && dataSource?.bufferPoolUsagePct?.length > 0) {
            dataSource?.bufferPoolUsagePct?.map((item: any, index: number) => {
              const key = Object.keys(item)[0];
              item[key]?.map((ele: any) => {
                bufferPoolUsagePctData.push({
                  category: key,
                  time: moment(parseInt(ele[0]) * 1000).format('MM-DD HH:mm'),
                  count: Number(Number(ele[1]).toFixed(1)),
                });
              });
            });
          }
           /* ------------------------------ */
           if (dataSource?.innodbDataWritten && dataSource?.innodbDataWritten?.length > 0) {
            dataSource?.innodbDataWritten?.map((item: any, index: number) => {
              const key = Object.keys(item)[0];
              item[key]?.map((ele: any) => {
                innodbDataWrittenData.push({
                  category: key,
                  time: moment(parseInt(ele[0]) * 1000).format('MM-DD HH:mm'),
                  count: Number(Number(ele[1]).toFixed(1)),
                });
              });
            });
          }

          /* ------------------------------ */
            if (dataSource?.innodbDataRead && dataSource?.innodbDataRead?.length > 0) {
                dataSource?.innodbDataRead?.map((item: any, index: number) => {
                  const key = Object.keys(item)[0];
                  item[key]?.map((ele: any) => {
                    innodbDataReadData.push({
                        category: key,
                        time: moment(parseInt(ele[0]) * 1000).format('MM-DD HH:mm'),
                        count: Number(Number(ele[1]).toFixed(1)),
                      });
                    });
                   });
                }
            

         /* ------------------------------ */
         if (dataSource?.rowsOps && dataSource?.rowsOps?.length > 0) {
          dataSource?.rowsOps?.map((item: any, index: number) => {
            const key = Object.keys(item)[0];
            item[key]?.map((ele: any) => {
              rowsOpsDataArry.push({
                category: keyMap[key]||key,
                time: moment(parseInt(ele[0]) * 1000).format('MM-DD HH:mm'),
                count: Number(Number(ele[1]).toFixed(1)),
              });
            });
          });
        }
         
          setDataSource({
            //脏页比例
            bufferPoolDirtyPct: bufferPoolDirtyPctData,
            //读缓存命中率
            bufferPoolHit: bufferPoolHitData,
            //缓冲池使用率
            bufferPoolUsagePct: bufferPoolUsagePctData,
            //Innodb写数据
            innodbDataWritten: innodbDataWrittenData,
            //Innodb读数据
            innodbDataRead:innodbDataReadData,
            //Innodb  row ops
            rowsOps: rowsOpsDataArry,
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [dataSource, loading, getInnodbMonitor];
}
