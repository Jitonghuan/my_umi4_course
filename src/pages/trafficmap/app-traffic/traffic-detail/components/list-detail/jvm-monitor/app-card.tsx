
import React, { useState, useEffect, useRef } from 'react';
import { findDOMNode } from 'react-dom';
import { Radio, Select, message, Spin, RadioChangeEvent, Drawer, Tooltip } from 'antd';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';
import { RedoOutlined, FullscreenOutlined } from '@ant-design/icons';
import { START_TIME_ENUMS } from '../../../schema';
import './index.less'

const { ColorContainer } = colorUtil.context;
export type IOperateItem = '';
export interface IProps {
  /** 标题 */
  title?: string;

  /** charts option */
  getOption?: (xAxis: string[], dataSource: any[]) => { [key: string]: any };

  /** 接口调用 */
  queryFn: (params: { [key: string]: any }) => Promise<any>;

  /** 接口请求的外部参数 */
  requestParams?: { [key: string]: any };

  /** 是否有瞬时值、累计值按钮 */
  hasRadio?: boolean;

  /** 瞬时值、累计值的初始值 */
  initialRadio?: string;
  count?: number
}

type IEchartResp = {
  count: {
    xAxis: string[];
    dataSource: string[][];
  };
  sum: {
    xAxis: string[];
    dataSource: string[][];
  };
};

const typeEnum = [
  { label: '瞬时值', value: '1' },
  { label: '累计值', value: '2' },
];

/**
 * app 应用卡片
 * @version 1.0.0
 * @create 2021-04-14 15:40
 */
const Coms = (props: IProps) => {
  const { title, getOption = () => { }, hasRadio = false, initialRadio = '1', queryFn, requestParams = {}, count } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [curtRadio, setCurtRadio] = useState<string>(initialRadio || '1');
  const [curOptions, setCurOptions] = useState<any>({});
  const prevData = useRef<IEchartResp>({} as IEchartResp);

  // 全屏时图标数据源
  const [fullOptions, setFullOptions] = useState<any>({});
  const prevFullData = useRef<IEchartResp>({} as IEchartResp);
  const [fullDrawerShow, setFullDrawerShow] = useState<boolean>(false);

  const [fullRadio, setFullRadio] = useState<string>(initialRadio || '1');
  // 请求开始时间，由当前时间往前
  const [startTime, setStartTime] = useState<number>(requestParams.startTime || 5 * 60 * 1000);
  // 刷新频率
  const [timeRate, setTimeRate] = useState<number>(0);
  const timeRateInterval = useRef<NodeJS.Timeout>();
  const [fullLoading, setFullLoading] = useState<boolean>(false);

  const selectRef = useRef(null);

  const queryDatas = () => {
    if (!requestParams?.envCode || !requestParams?.appCode || !requestParams?.ip || !requestParams?.hostName) {
      return;
    }
    setLoading(true);
    const now = new Date().getTime();
    const startTime = requestParams?.startTime;
    const endTime = requestParams?.endTime;
    let start = 0, end = 0;
    if (requestParams?.selectTimeType === 'lastTime') {
      start = Number((now - startTime) / 1000);
      end = Number(now / 1000);
    } else {
      start = startTime;
      end = Number(endTime);
    }
    console.log(new Date(Number(start) * 1000).toLocaleString(), '-', new Date(Number(end) * 1000).toLocaleString(), 'jvm监控')
    queryFn({
      data: {
        appCode: requestParams.appCode,
        envCode: requestParams.envCode,
        ip: requestParams.ip,
        // start: Number((now - requestParams.startTime) / 1000),
        // end: Number(now / 1000),
        start: start,
        end: end,
        hostName: requestParams.hostName,
      },
    })
      .then((resp) => {
        const resource = curtRadio === '1' ? resp.count : resp.sum;
        const options = getOption(resource.xAxis, resource.dataSource);
        prevData.current = resp;

        setCurOptions(options);
      })
      .catch((err) => {
        message.error(err?.errMessage || '');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 全屏弹窗查询
  const queryFullDatas = () => {
    setFullLoading(true);
    const now = new Date().getTime();
    const startTime = requestParams?.startTime;
    const endTime = requestParams?.endTime;
    let start = 0, end = 0;
    if (requestParams?.selectTimeType === 'lastTime') {
      start = Number((now - startTime) / 1000);
      end = Number(now / 1000);
    } else {
      start = startTime;
      end = Number(endTime);
    }
    console.log(new Date(Number(start) * 1000).toLocaleString(), '-', new Date(Number(end) * 1000).toLocaleString(), 'jvm监控 全屏')
    queryFn({
      data: {
        appCode: requestParams.appCode,
        envCode: requestParams.envCode,
        ip: requestParams.ip,
        // start: Number((now - startTime) / 1000).toFixed(0),
        // end: Number(now / 1000).toFixed(0),
        start: start.toFixed(0),
        end: end.toFixed(0),
        hostName: requestParams.hostName,
      },
    })
      .then((resp) => {
        const resource = fullRadio === '1' ? resp.count : resp.sum;
        const options = getOption(resource.xAxis, resource.dataSource);
        prevFullData.current = resp;
        setFullOptions(options);
      })
      .catch((err) => {
        message.error(err?.errMessage || '');
      })
      .finally(() => {
        setFullLoading(false);
      });
  };

  useEffect(() => {
    setStartTime(requestParams.startTime);
    if (requestParams?.envCode && requestParams?.appCode && requestParams?.ip && requestParams?.hostName) {
      queryDatas();
    } else if (!requestParams?.ip) {
      prevData.current = {} as IEchartResp;
      setCurOptions(getOption([], []));
    }
  }, [JSON.stringify(requestParams)]);

  const handleRadioChange = (ev: RadioChangeEvent) => {
    const { value } = ev.target;
    if (fullDrawerShow) {
      const resource = value === '1' ? prevFullData.current.count : prevFullData.current.sum;
      const options = getOption(resource.xAxis, resource.dataSource);
      setFullOptions(options);
      setFullRadio(value);
    } else {
      if (prevData.current?.count) {
        const resource = value === '1' ? prevData.current.count : prevData.current.sum;
        const options = getOption(resource.xAxis, resource.dataSource);
        setCurOptions(options);
      } else {
        setCurOptions(getOption([], []));
      }
      setCurtRadio(value);
    }
  };

  // 全屏点击事件
  const handleFullClick = () => {
    if (!requestParams?.envCode || !requestParams?.appCode || !requestParams?.ip || !requestParams?.hostName) {
      return;
    }
    setFullRadio(curtRadio);
    setStartTime(props.requestParams?.startTime);
    setFullDrawerShow(true);
  };

  // 全屏弹窗关闭事件
  const handleFullClose = () => {
    setFullDrawerShow(false);
    setFullOptions({});
    setTimeRate(0);
    setStartTime(props.requestParams?.startTime);
    if (timeRateInterval.current) {
      clearInterval(timeRateInterval.current);
    }
  };



  useEffect(() => {
    if (fullDrawerShow) {
      queryFullDatas();
      const select = findDOMNode(selectRef.current) as HTMLDivElement;
      if (select) {
        const selector = select?.querySelectorAll('.ant-select-selection-item');
        selector?.forEach((el) => {
          el.setAttribute('title', '');
        });
      }
    }
  }, [startTime, fullDrawerShow]);

  // 修改提示框
  useEffect(() => {
    const select = findDOMNode(selectRef.current) as HTMLDivElement;
    if (select) {
      const selector = select?.querySelectorAll('.ant-select-selection-item');
      selector?.forEach((el) => {
        el.setAttribute('title', '');
      });
    }
  }, [timeRate]);

  return (
    <div className="monitor-app-card">
      <Spin spinning={loading}>
        <div className="app-header">
          <h3 className="app-title">{title}</h3>
          <span>
            <RedoOutlined
              className="app-operate-icon"
              onClick={() => {
                queryDatas();
              }}
            />
            <FullscreenOutlined className="app-operate-icon" onClick={handleFullClick} />
            {hasRadio && (
              <Radio.Group size="small" value={curtRadio} onChange={handleRadioChange}>
                {typeEnum.map((el) => (
                  <Radio.Button className="app-operate-switch" value={el.value}>
                    {el.label}
                  </Radio.Button>
                ))}
              </Radio.Group>
            )}
          </span>
        </div>
        <div className="app-content">
          <ColorContainer roleKeys={['color']}>
            <EchartsReact option={curOptions} />
          </ColorContainer>
        </div>
      </Spin>

      <Drawer title={title} visible={fullDrawerShow} width="90%" onClose={handleFullClose}>
        <Spin spinning={fullLoading}>
          <div className="monitor-time-select" ref={selectRef} style={{ textAlign: 'right' }}>
            <Tooltip title="Relative time ranges" placement="top">
              <Select
                value={startTime}
                onChange={(value) => setStartTime(value)}
                style={{ width: 150, textAlign: 'left' }}
              >
                <Select.OptGroup label="Relative time ranges"></Select.OptGroup>
                {START_TIME_ENUMS.map((time) => (
                  <Select.Option key={time.value} value={time.value}>
                    {time.label}
                  </Select.Option>
                ))}
              </Select>
            </Tooltip>

          </div>
          <div className="monitor-app-card" style={{ padding: '16px 0' }}>
            <div className="app-header" style={{ marginBottom: 12 }}>
              <h3 className="app-title">{title}</h3>
              <span>
                <RedoOutlined
                  className="app-operate-icon"
                  onClick={() => {
                    queryFullDatas();
                  }}
                />
                {hasRadio && (
                  <Radio.Group size="small" value={fullRadio} onChange={handleRadioChange}>
                    {typeEnum.map((el) => (
                      <Radio.Button className="app-operate-switch" value={el.value}>
                        {el.label}
                      </Radio.Button>
                    ))}
                  </Radio.Group>
                )}
              </span>
            </div>
            <ColorContainer roleKeys={['color']}>
              <EchartsReact option={fullOptions} style={{ height: 400 }} />
            </ColorContainer>
          </div>
        </Spin>
      </Drawer>
    </div>
  );
};

/**
 * 默认值
 */
Coms.defaultProps = {
  // 属性默认值配置
};

export default Coms;


