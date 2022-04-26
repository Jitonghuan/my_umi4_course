import React from 'react';
import { Descriptions, Table, Tag } from 'antd';
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
      width: 188,
    },
    {
      title: '变更原因',
      dataIndex: 'modifyResion',
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
    // merging: { text: '正在合并', color: 'blue' },
    // mergeErr: { text: '合并错误', color: 'red' },
    // conflict: { text: '合并冲突', color: 'red' },
    // building: { text: '正在构建', color: 'blue' },
    // buildErr: { text: '构建错误', color: 'red' },
    // buildAborted: { text: '构建取消', color: 'orange' },
    // multiEnvDeploying: { text: '正在部署', color: 'geekblue' },
    // deployWait: { text: '等待部署', color: 'blue' },
    // deploying: { text: '正在部署', color: 'geekblue' },
    // deployWaitBatch2: { text: '等待第二批部署', color: 'green' },
    // deployErr: { text: '部署错误', color: 'red' },
    // deployAborted: { text: '部署取消', color: 'orange' },
    // deployed: { text: '部署完成', color: 'green' },
    // mergingMaster: { text: '正在合并Master', color: 'geekblue' },
    // mergeMasterErr: { text: '合并Master错误', color: 'red' },
    // deletingFeature: { text: '正在删除Feature', color: 'purple' },
    // deleteFeatureErr: { text: '删除Feature错误', color: 'red' },
    // deployFinish: { text: '发布完成', color: 'green' },
    // qualityChecking: { text: '质量检测中', color: 'geekblue' },
    // qualityFailed: { text: '质量检测失败', color: 'red' },
    // pushFeResource: { text: '正在推送前端资源', color: 'geekblue' },
    // pushFeResourceErr: { text: '推送前端资源错误', color: 'red' },
    // pushVersion: { text: '正在推送前端版本', color: 'geekblue' },
    // pushVersionErr: { text: '推送前端版本失败', color: 'red' },
    // verifyWait: { text: '等待灰度验证', color: 'geekblue' },
    // verifyFailed: { text: '灰度验证失败', color: 'red' },
  };

  const { dataSource = {}, ...rest } = props;

  let publishRecordData: any = [];
  for (const key in dataSource) {
    if (Object.prototype.hasOwnProperty.call(dataSource, key)) {
      const element = dataSource[key];
      publishRecordData.push({ label: key, value: dataSource[key] });
    }
  }

  function getJenkins(url: string) {
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
      <Descriptions.Item label="发布状态">
        {/* {dataSource?.deployStatus} */}
        {
          <Tag color={recordDisplayMap[dataSource?.deployStatus]?.color}>
            {recordDisplayMap[dataSource?.deployStatus]?.text}
          </Tag>
        }
      </Descriptions.Item>
      <Descriptions.Item label="jenkins" contentStyle={{ display: 'block' }}>
        {dataSource?.jenkinsUrl ? (
          <>
            {getJenkins(dataSource?.jenkinsUrl).map((jenkinsItem: any) => (
              <div style={{ marginBottom: '5px' }}>
                {jenkinsItem?.subJenkinsUrl && jenkinsItem.envCode ? `${jenkinsItem.envCode}：` : ''}
                <a href={jenkinsItem.subJenkinsUrl} target="_blank">
                  {jenkinsItem?.subJenkinsUrl}
                </a>
              </div>
            ))}
          </>
        ) : null}
      </Descriptions.Item>

      {dataSource?.tagName !== '' && <Descriptions.Item label="tag">{dataSource?.tagName}</Descriptions.Item>}
      <div style={{ borderTop: '1px solid #d3d7e0', height: '1px' }}></div>
      <div style={{ marginLeft: 24, display: 'block' }}>功能分支:</div>
      <div>
        <Table
          scroll={{ y: window.innerHeight - 515, x: '100%' }}
          style={{ width: '96%' }}
          columns={columns}
          dataSource={dataSource.branchInfo || []}
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
