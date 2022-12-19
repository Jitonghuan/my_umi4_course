import React from 'react';
import { Descriptions, Table, Tag } from 'antd';
import moment from 'moment';
import type { DescriptionsProps } from 'antd/lib/descriptions';
import appConfig from '@/app.config';
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
      width: 188,
    },
    {
      title: '变更原因',
      dataIndex: 'modifyReason',
      width: 170,
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
      width: 60,
    },
  ];
  const recordDisplayMap: any = {
    wait: { text: '发布开始', color: 'blue' },
    process: { text: '正在发布', color: 'geekblue' },
    error: { text: '发布失败', color: 'red' },
    finish: { text: '发布完成', color: 'green' },
  };

  const { dataSource = {}, newPublish = false, ...rest } = props;
  let env = appConfig.BUILD_ENV === 'prod' ? 'prod' : 'dev';
  let envType = appConfig.envType;

  let publishRecordData: any = [];
  for (const key in dataSource) {
    if (Object.prototype.hasOwnProperty.call(dataSource, key)) {
      const element = dataSource[key];

      publishRecordData.push({ label: key || '', value: dataSource[key] || '' });
    }
  }

  function getOldJenkins(url: string) {
    try {
      return url ? JSON.parse(url) : [];
    } catch (e) {
      return url
        ? [
          {
            subJenkinsUrl: url,
          },
        ]
        : [];
    }
  }

  function getJenkins(url: string) {
    try {
      let JenkinsInfoArry = [];
      let curUrl = url ? JSON.parse(url) : {};
      for (const key in curUrl) {
        if (Object.prototype.hasOwnProperty.call(curUrl, key)) {
          const element = curUrl[key];
          JenkinsInfoArry.push({ envCode: key, JenkinsUrl: element });
        }
      }
      return JenkinsInfoArry || [];
    } catch (e) {
      return [];
    }
  }

  return (
    <Descriptions
      // {...rest}
      labelStyle={{ width: 100, justifyContent: 'flex-end' }}
      column={1}
    >
      <Descriptions.Item label="发布单Id">{dataSource?.deployId}</Descriptions.Item>
      <Descriptions.Item label="发布人">{dataSource?.modifyUser}</Descriptions.Item>
      <Descriptions.Item label="版本号">{dataSource?.version}</Descriptions.Item>
      <Descriptions.Item label="发布时间">
        {moment(dataSource?.deployedTime).format('YYYY-MM-DD HH:mm:ss')}
      </Descriptions.Item>
      <Descriptions.Item label="发布完成时间">{dataSource?.deployFinishTime}</Descriptions.Item>
      <Descriptions.Item label="发布环境">{dataSource?.envs}</Descriptions.Item>
      <Descriptions.Item label="流水线Code">{dataSource?.pipelineCode}</Descriptions.Item>
      <Descriptions.Item label="发布状态">
        {/* {dataSource?.deployStatus} */}
        {
          <Tag color={recordDisplayMap[dataSource?.deployStatus]?.color}>
            {recordDisplayMap[dataSource?.deployStatus]?.text}
          </Tag>
        }
      </Descriptions.Item>

      {!newPublish && <Descriptions.Item label="jenkins" contentStyle={{ display: 'block' }}>
        {appConfig.IS_Matrix === 'public' &&
          dataSource?.jenkinsUrl &&
          (env === 'prod' ? dataSource?.deployId > 43222 : dataSource?.deployId > 1595) ? (
          <>
            {getJenkins(dataSource?.jenkinsUrl)?.map((jenkinsItem: any) => (
              <div style={{ marginBottom: '5px' }}>
                {jenkinsItem?.JenkinsUrl && jenkinsItem?.envCode ? `${jenkinsItem?.envCode}：` : ''}
                <a href={jenkinsItem?.JenkinsUrl} target="_blank">
                  {jenkinsItem?.JenkinsUrl}
                </a>
              </div>
            ))}
          </>
        ) : null}
        {appConfig.IS_Matrix === 'private' && envType === 'base-poc' && dataSource?.deployId < 104 ? (
          <>
            {getOldJenkins(dataSource?.jenkinsUrl)?.map((jenkinsItem: any) => (
              <div style={{ marginBottom: '5px' }}>
                {jenkinsItem?.subJenkinsUrl && jenkinsItem?.envCode ? `${jenkinsItem?.envCode}：` : ''}
                <a href={jenkinsItem?.subJenkinsUrl} target="_blank">
                  {jenkinsItem?.subJenkinsUrl}
                </a>
              </div>
            ))}
          </>
        ) : appConfig.IS_Matrix === 'private' && envType === 'base-poc' && dataSource?.deployId > 104 ? (
          <>
            {getJenkins(dataSource?.jenkinsUrl)?.map((jenkinsItem: any) => (
              <div style={{ marginBottom: '5px' }}>
                {jenkinsItem?.JenkinsUrl && jenkinsItem?.envCode ? `${jenkinsItem?.envCode}：` : ''}
                <a href={jenkinsItem?.JenkinsUrl} target="_blank">
                  {jenkinsItem?.JenkinsUrl}
                </a>
              </div>
            ))}
          </>
        ) : null}

        {appConfig.IS_Matrix === 'private' && envType === 'fygs' && dataSource?.deployId < 32316 ? (
          <>
            {getOldJenkins(dataSource?.jenkinsUrl)?.map((jenkinsItem: any) => (
              <div style={{ marginBottom: '5px' }}>
                {jenkinsItem?.subJenkinsUrl && jenkinsItem?.envCode ? `${jenkinsItem?.envCode}：` : ''}
                <a href={jenkinsItem?.subJenkinsUrl} target="_blank">
                  {jenkinsItem?.subJenkinsUrl}
                </a>
              </div>
            ))}
          </>
        ) : appConfig.IS_Matrix === 'private' && envType === 'fygs' && dataSource?.deployId > 32316 ? (
          <>
            {getJenkins(dataSource?.jenkinsUrl)?.map((jenkinsItem: any) => (
              <div style={{ marginBottom: '5px' }}>
                {jenkinsItem?.JenkinsUrl && jenkinsItem?.envCode ? `${jenkinsItem?.envCode}：` : ''}
                <a href={jenkinsItem?.JenkinsUrl} target="_blank">
                  {jenkinsItem?.JenkinsUrl}
                </a>
              </div>
            ))}
          </>
        ) : null}
        {appConfig.IS_Matrix === 'private' && envType === 'zslnyy' && dataSource?.deployId < 39455 ? (
          <>
            {getOldJenkins(dataSource?.jenkinsUrl)?.map((jenkinsItem: any) => (
              <div style={{ marginBottom: '5px' }}>
                {jenkinsItem?.subJenkinsUrl && jenkinsItem?.envCode ? `${jenkinsItem?.envCode}：` : ''}
                <a href={jenkinsItem?.subJenkinsUrl} target="_blank">
                  {jenkinsItem?.subJenkinsUrl}
                </a>
              </div>
            ))}
          </>
        ) : appConfig.IS_Matrix === 'private' && envType === 'zslnyy' && dataSource?.deployId > 39455 ? (
          <>
            {getJenkins(dataSource?.jenkinsUrl)?.map((jenkinsItem: any) => (
              <div style={{ marginBottom: '5px' }}>
                {jenkinsItem?.JenkinsUrl && jenkinsItem?.envCode ? `${jenkinsItem?.envCode}：` : ''}
                <a href={jenkinsItem?.JenkinsUrl} target="_blank">
                  {jenkinsItem?.JenkinsUrl}
                </a>
              </div>
            ))}
          </>
        ) : null}
        {appConfig.IS_Matrix === 'public' &&
          dataSource?.jenkinsUrl &&
          (env === 'prod' ? dataSource?.deployId < 43222 : dataSource?.deployId < 1595) ? (
          <>
            {getOldJenkins(dataSource?.jenkinsUrl)?.map((jenkinsItem: any) => (
              <div style={{ marginBottom: '5px' }}>
                {jenkinsItem?.subJenkinsUrl && jenkinsItem?.envCode ? `${jenkinsItem?.envCode}：` : ''}
                <a href={jenkinsItem?.subJenkinsUrl} target="_blank">
                  {jenkinsItem?.subJenkinsUrl}
                </a>
              </div>
            ))}
          </>
        ) : null}
      </Descriptions.Item>}
      {dataSource?.tagName !== '' && <Descriptions.Item label="tag">{dataSource?.tagName}</Descriptions.Item>}
      <div style={{ borderTop: '1px solid #d3d7e0', height: '1px' }}></div>
      <div style={{ marginLeft: 24, display: 'block' }}>功能分支:</div>
      <div>
        <Table
          scroll={{ y: window.innerHeight - 515, x: '100%' }}
          style={{ width: '96%' }}
          columns={columns}
          dataSource={dataSource?.branchInfo || []}
          pagination={false}
        ></Table>
      </div>
      {/* <Descriptions.Item label="功能分支" labelStyle={{}}>

      </Descriptions.Item> */}
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
