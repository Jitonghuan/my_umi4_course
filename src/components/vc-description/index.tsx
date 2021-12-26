import React from 'react';
import { Descriptions, Table, Divider } from 'antd';
import moment from 'moment';
import type { DescriptionsProps } from 'antd/lib/descriptions';
// 发布记录字段 map
export const recordFieldMap: { [key: string]: any } = {
  deployId: '发布单Id',
  modifyUser: '发布人',
  deployedTime: '发布时间',
  envs: '发布环境',
  deployStatus: '发布状态',
  jenkinsUrl: 'jenkins',
  branchInfo: '功能分支',
  tagName: 'tag',
};

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
const funcName = (props: any) => {
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

  const { dataSource = {}, ...rest } = props;

  let publishRecordData: any = [];
  for (const key in dataSource) {
    if (Object.prototype.hasOwnProperty.call(dataSource, key)) {
      const element = dataSource[key];
      publishRecordData.push({ label: key, value: dataSource[key] });
    }
  }

  return (
    <Descriptions
      // {...rest}
      labelStyle={{ width: 90, justifyContent: 'flex-end' }}
      column={1}
    >
      <Descriptions.Item label="发布单Id">{dataSource?.deployId}</Descriptions.Item>
      <Descriptions.Item label="发布人">{dataSource?.modifyUser}</Descriptions.Item>
      <Descriptions.Item label="发布时间">
        {moment(dataSource?.deployedTime).format('YYYY-MM-DD HH:mm:ss')}
      </Descriptions.Item>
      <Descriptions.Item label="发布环境">{dataSource?.envs}</Descriptions.Item>
      <Descriptions.Item label="发布状态">{dataSource?.deployStatus}</Descriptions.Item>
      <Descriptions.Item label="jenkins">
        {' '}
        <a href={dataSource?.jenkinsUrl} target="_blank">
          {dataSource?.jenkinsUrl}
        </a>
      </Descriptions.Item>

      {dataSource?.tagName !== '' && <Descriptions.Item label="tag">{dataSource?.tagName}</Descriptions.Item>}
      <div style={{ borderTop: '1px solid #d3d7e0', height: '1px' }}></div>
      <Descriptions.Item label="功能分支" labelStyle={{}}>
        <Table
          style={{ width: '94%' }}
          columns={columns}
          dataSource={dataSource.branchInfo || []}
          pagination={false}
        ></Table>
      </Descriptions.Item>
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
