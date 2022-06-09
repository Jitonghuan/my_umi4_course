// 新增任务抽屉页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/10/25 18:30

import React from 'react';
import Cron from 'qnn-react-cron';
import { Button } from 'antd';

export default function ReactCron() {
  const language = {
    // 面板标题
    paneTitle: {
      second: '秒',
      minute: '分',
      hour: '时',
      day: '日',
      month: '月',
      week: '周',
      year: '年',
    },

    // assign  指定
    assign: '指定',
    // Don't assign  不指定
    donTAssign: '不指定',

    // Every minute ...   每一秒钟、每一分钟
    everyTime: {
      second: '每一秒钟',
      minute: '每一分钟',
      hour: '每一小时',
      day: '每一日',
      month: '每一月',
      week: '每一周',
      year: '每年',
    },

    // from [a] to [b] [unit], executed once [unit]    a 到 b 每一个时间单位执行一次
    aTob: {
      second: (AInput: any, BInput: any) => (
        <span>
          从{AInput}-{BInput}秒，每秒执行一次
        </span>
      ),
      minute: (AInput: any, BInput: any) => (
        <span>
          从{AInput}-{BInput}分，每分钟执行一次
        </span>
      ),
      hour: (AInput: any, BInput: any) => (
        <span>
          从{AInput}-{BInput}时，每小时执行一次
        </span>
      ),
      day: (AInput: any, BInput: any) => (
        <span>
          从{AInput}-{BInput}日，每日执行一次
        </span>
      ),
      month: (AInput: any, BInput: any) => (
        <span>
          从{AInput}-{BInput}月，每月执行一次
        </span>
      ),
      week: (AInput: any, BInput: any) => (
        <span>
          从{AInput}-{BInput}，每星期执行一次
        </span>
      ),
      year: (AInput: any, BInput: any) => (
        <span>
          从{AInput}-{BInput}年，每年执行一次
        </span>
      ),
    },

    // from [a] [unit] start, every [b] Execute once [unit]   从 a 开始, 每一个时间单位执行一次
    aStartTob: {
      second: (AInput: any, BInput: any) => (
        <span>
          从{AInput}秒开始，每{BInput}秒执行一次
        </span>
      ),
      minute: (AInput: any, BInput: any) => (
        <span>
          从{AInput}分开始，每{BInput}分执行一次
        </span>
      ),
      hour: (AInput: any, BInput: any) => (
        <span>
          从{AInput}时开始，每{BInput}小时执行一次
        </span>
      ),
      day: (AInput: any, BInput: any) => (
        <span>
          从{AInput}日开始，每{BInput}日执行一次
        </span>
      ),
      month: (AInput: any, BInput: any) => (
        <span>
          从{AInput}月开始，每{BInput}月执行一次
        </span>
      ),

      // [n] in the NTH week of this month    本月第 n 周的 星期[n] 执行一次
      week: (AInput: any, BInput: any) => (
        <span>
          本月第{AInput}周的{BInput}执行一次
        </span>
      ),

      // 本月的最后一个 星期[n] 执行一次
      week2: (AInput: any) => <span>月的最后一个{AInput}执行一次</span>,

      year: (AInput: any, BInput: any) => (
        <span>
          从{AInput}年开始，每{BInput}年执行一次
        </span>
      ),
    },
  };

  return (
    <Cron.Provider value={{ language }}>
      <Cron
        value="* * * * * ? *"
        // 未自定义底部按钮时，用户点击确认按钮后的回调
        onOk={(value: any) => {
          console.log('cron:', value);
        }}
        // 相当于 ref
        getCronFns={(fns: any) => {
          // 获取值方法
          // fns.getValue: () => string

          // 解析Cron表达式到UI 调用该方法才可以重新渲染 【一般不使用】(value值改变后组件会自动更新渲染)
          // fns.onParse: () => Promise().then(()=>void).catch(()=>()=>void),
          this.fns = fns;
        }}
        // 自定义底部按钮后需要自行调用方法来或者值
        footer={[
          //默认值
          <>
            <Button style={{ marginRight: 10 }} onClick={() => this.fns.onParse}>
              解析到UI
            </Button>
            <Button type="primary" onClick={() => console.log(this.fns.getValue)}>
              生成
            </Button>
          </>,
        ]}
      />
    </Cron.Provider>
  );
}
