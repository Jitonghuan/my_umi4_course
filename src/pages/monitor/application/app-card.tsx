import React from 'react';
import { Radio, Button } from 'antd';
import {
  EchartsReact,
  colorUtil,
  ChartsContext,
} from '@cffe/fe-datav-components';
import { RedoOutlined, FullscreenOutlined } from '@ant-design/icons';
import { IEchartsReactProps } from '@cffe/fe-datav-components/es/components/charts/echarts-react';

const { ColorContainer } = colorUtil.context;

export type IOperateItem = '';

export interface IProps {
  /** 标题 */
  title?: string;

  /** charts option */
  getOption?: (xAxis: string[], dataSource: any[]) => { [key: string]: any };

  /** 接口调用 */
  api?: string;
}

const typeEnum = [
  { label: '限时值', value: '1' },
  { label: '累计值', value: '2' },
];

/**
 * app 应用卡片
 * @version 1.0.0
 * @create 2021-04-14 15:40
 */
const Coms = (props: IProps) => {
  const { title, getOption = () => {} } = props;

  const curOptions: any = getOption(
    [
      '2020-12-12 11:11',
      '2020-12-12 11:11',
      '2020-12-12 11:11',
      '2020-12-12 11:11',
      '2020-12-12 11:11',
      '2020-12-12 11:11',
    ],
    [100, 200, 300, 120, 320],
  );

  return (
    <div className="monitor-app-card">
      <div className="app-header">
        <h3 className="app-title">{title}</h3>

        <span>
          <RedoOutlined className="app-operate-icon" />
          <FullscreenOutlined className="app-operate-icon" />
          <Radio.Group size="small">
            {typeEnum.map((el) => (
              <Radio.Button className="app-operate-switch" value={el.value}>
                {el.label}
              </Radio.Button>
            ))}
          </Radio.Group>
        </span>
      </div>
      <div className="app-content">
        <ColorContainer roleKeys={['color']}>
          <EchartsReact option={curOptions} />
        </ColorContainer>
      </div>
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
