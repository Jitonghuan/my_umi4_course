import React, { useState, useEffect } from 'react';
import { Radio, Button, message, Spin } from 'antd';
import {
  EchartsReact,
  colorUtil,
  ChartsContext,
} from '@cffe/fe-datav-components';
import { RedoOutlined, FullscreenOutlined } from '@ant-design/icons';
import { IEchartsReactProps } from '@cffe/fe-datav-components/es/components/charts/echarts-react';
import { getRequest } from '@/utils/request';

const { ColorContainer } = colorUtil.context;

export type IOperateItem = '';

export interface IProps {
  /** 标题 */
  title?: string;

  /** charts option */
  getOption?: (xAxis: string[], dataSource: any[]) => { [key: string]: any };

  /** 接口调用 */
  api: string;

  /** 接口请求的外部参数 */
  requestParams?: { [key: string]: any };

  /** 是否有瞬时值、累计值按钮 */
  hasRadio?: boolean;

  /** 瞬时值、累计值的初始值 */
  initialRadio?: string;
}

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
  const {
    title,
    getOption = () => {},
    hasRadio = false,
    initialRadio = '1',
    api = '',
    requestParams = {},
  } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [curtRadio, setCurtRadio] = useState<string>(initialRadio || '1');
  const [curOptions, setCurOptions] = useState<any>({});

  const queryDatas = () => {
    setLoading(true);
    getRequest(api, {
      data: requestParams,
    })
      .then((resp) => {
        const xAxis = [
          '2020-12-12 11:11',
          '2020-12-12 11:11',
          '2020-12-12 11:11',
          '2020-12-12 11:11',
          '2020-12-12 11:11',
          '2020-12-12 11:11',
        ];
        const _source = [
          [1, 2, 2, 1, 3, 2, 1],
          [200, 4, 2, 5, 3, 2, 1],
        ];
        setCurOptions(getOption(xAxis, _source));
      })
      .catch((err) => {
        message.error(err.errMessage || `${api}请求失败`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (requestParams?.envCode && requestParams?.appCode && requestParams?.ip) {
      queryDatas();
    }
  }, [JSON.stringify(requestParams)]);

  return (
    <div className="monitor-app-card">
      <Spin spinning={loading}>
        <div className="app-header">
          <h3 className="app-title">{title}</h3>

          <span>
            <RedoOutlined className="app-operate-icon" />
            <FullscreenOutlined className="app-operate-icon" />
            {hasRadio && (
              <Radio.Group
                size="small"
                value={curtRadio}
                onChange={(ev) => setCurtRadio(ev.target.value)}
              >
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
