import React, { useMemo, useEffect, useState, useContext } from 'react';
import { Button, Space, Input, Table, Radio, DatePicker, Tooltip } from 'antd';
import VCCardLayout from '@cffe/vc-b-card-layout';
import { getLockSession } from '../manage/hook'
import DetailContext from '../../../context'
import { datetimeCellRender } from '@/utils';
import moment from 'moment';
import './index.less';
const rootCls = 'Lock-analyze-compo';

export const START_TIME_ENUMS = [

  {
    label: '近1天',
    value: 24 * 60 * 60 * 1000,
  },
  {
    label: '近3天',
    value: 24 * 60 * 60 * 1000 * 3,
  },
  {
    label: '近1周',
    value: 24 * 60 * 60 * 1000 * 7,
  },

];
const { RangePicker } = DatePicker;
export default function LockAnalyze() {
  const { clusterId, clusterRole, instanceId } = useContext(DetailContext);
  const [dataSource, setDataSource] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [timeRange, setTimeRange] = useState<any>([]);
  const [value, setValue] = useState<number | undefined>()
  useEffect(() => {
    if (!instanceId) return
    if (instanceId) {
      getDataSource({})
    }
  }, [])
  const getDataSource = (params: {
    startTime?: string,
    stopTime?: string
  }) => {
    setLoading(true)
    setDataSource([])
    getLockSession({ instanceId, ...params }).then((res) => {
      if (res?.success) {
        setDataSource(res?.data || [])
      }

    }).finally(() => {
      setLoading(false)
    })
  }
  const onTimeChange = (value: any) => {
    setTimeRange(value);
    setValue(undefined)
    getDataSource({

      startTime: value && value[0] ? moment(value[0]).unix() + '' : undefined,
      stopTime: value && value[1] ? moment(value[1]).unix() + '' : undefined,
    });
  };
  const onChange = (e: number) => {
    setTimeRange([])
    setValue(e)
    const now = new Date().getTime();
    let start = Number((now - e));
    let end = Number(now)
    getDataSource({
      startTime: start + "",
      stopTime: end + ""
    })

  }
  return (
    <div>
      <div className="table-caption">
        <div className="caption-left">
          <Button type="primary" onClick={() => {
            setTimeRange([])
            setValue(undefined)
            getDataSource({})

          }}>刷新</Button>
        </div>
        <div className="caption-right">
          <Space>
            <Radio.Group optionType="button" buttonStyle="solid" options={START_TIME_ENUMS} value={value} onChange={(e) => { onChange(e.target.value) }} />
            <RangePicker onChange={onTimeChange}
              value={timeRange}
              showTime={{
                hideDisabledOptions: true,
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
              }}
              format="YYYY-MM-DD HH:mm:ss" />
            {/* <Button type="primary">查看</Button> */}
          </Space>
        </div>

      </div>
      <div>
        <Table dataSource={dataSource} bordered
          loading={loading}
          //252
          scroll={{ x: '100%',y:window.innerHeight-252 }}
          pagination={false}
          locale={{
            emptyText: (
              <div className="custom-table-holder">
                {loading ? '加载中……' : dataSource?.length < 1 ? '没有数据' : " "
                }
              </div>
            ),
          }}
        >
          {dataSource?.length > 0 && (
            Object.keys(dataSource[0])?.map((item: any) => {
              return (
                <>
                {item?.includes("时间")?<Table.Column title={item} dataIndex={item} width={170} key={item} ellipsis={true} render={(value) => (
                 
                  <span> {value?datetimeCellRender(value):""}</span> 
                
                )} />: item?.includes("sql")?<Table.Column title={item} dataIndex={item} width={275} key={item} ellipsis={true} render={(value) => (
                 
                  <Tooltip placement="topLeft" title={value}>
                  {value}
                </Tooltip>
                
                )} />: <Table.Column title={item} dataIndex={item} key={item} ellipsis={true} render={(value) => (
                  <Tooltip placement="topLeft" title={value}>
                    {value}
                  </Tooltip>
                )} />}
               
                </>
              )
            })

          )}
        </Table>
      </div>


    </div>
  )
}