import React from 'react';
import { Descriptions, Table } from 'antd';

import type { DescriptionsProps } from 'antd/lib/descriptions';

export type IOption = {
  /** label */
  label?: string;
  /** value */
  value?: any;
};

export interface IProps extends DescriptionsProps {
  /** 数据源 */
  dataSource?: IOption[];
}

/**
 * 排版描述组件
 * @description 用于排版显示，label-value 模式
 * @author yyf
 * @version 1.0.0
 * @create 2021-04-26 14:30
 */
const funcName = (props: IProps) => {
  const { dataSource = [], ...rest } = props;
  const columns = [
    {
      title: '分支名',
      dataIndex: 'branchName',
      key: 'branchName',
    },
    {
      title: '变更原因',
      dataIndex: 'modifyResion',
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
    },
  ];

  return (
    <Descriptions {...rest}>
      {dataSource.map((el) => (
        <div>
          <Descriptions.Item label={el.label}>
            {el.label == 'jenkins' ? (
              <a href={el.value} target="_blank">
                {el.value}
              </a>
            ) : el.label === 'branchInfo' ? (
              <Descriptions.Item label="功能分支">
                <Table style={{ width: '80%' }} columns={columns} dataSource={el.value}></Table>
              </Descriptions.Item>
            ) : (
              el.value
            )}
          </Descriptions.Item>
        </div>
      ))}
    </Descriptions>

    // 添加Jenkins字段显示并以可点击链接形式展示
  );
};

/**
 * 默认值
 */
funcName.defaultProps = {
  // 属性默认值配置
};

export default funcName;
