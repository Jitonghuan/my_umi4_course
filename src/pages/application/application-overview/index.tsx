/**
 * ApplicationOverview
 * @description 应用-概述
 * @author moting.nq
 * @create 2021-04-13 11:00
 */

import React, { useState, useEffect } from 'react';
import { Descriptions, Button, Tag, Modal } from 'antd';
import VCPageContent, {
  FilterCard,
  ContentCard,
} from '@/components/vc-page-content';
import UpdateApplication, {
  AppDataTypes,
} from '@/components/create-application';
import ModifyMember from './modify-member';
import { queryApps } from '../service';
import { IProps } from './types';
import './index.less';

const rootCls = 'overview-page';
const labelStyle = {
  width: 200,
};
const APP_TYPE_MAP = {
  frontend: '前端',
  backend: '后端',
};

const ApplicationOverview = (props: IProps) => {
  const {
    location: {
      query: { id },
    },
  } = props;

  const [isModifyApp, setIsModifyApp] = useState(false);
  const [appData, setAppData] = useState<AppDataTypes>();
  const [isModifyMember, setIsModifyMember] = useState(false);
  const [memberData, setMemberData] = useState();

  useEffect(() => {
    if (!id) return;
    queryApps({
      id: Number(id),
      pageIndex: 1,
      pageSize: 10,
    }).then((res) => {
      if (res.list.length) {
        setAppData(res.list[0]);
        return;
      }
      setAppData(undefined);
    });
  }, [id]);

  return (
    <ContentCard className={rootCls}>
      <Descriptions
        title="概要"
        size="small"
        bordered
        column={2}
        labelStyle={labelStyle}
        extra={<Button onClick={() => setIsModifyApp(true)}>修改</Button>}
      >
        <Descriptions.Item label="APPCODE">
          {appData?.appCode}
        </Descriptions.Item>
        <Descriptions.Item label="应用名">{appData?.appName}</Descriptions.Item>
        <Descriptions.Item label="git地址">{appData?.gitlab}</Descriptions.Item>
        <Descriptions.Item label="jar包路径">
          {appData?.jarPath}
        </Descriptions.Item>
        <Descriptions.Item label="是否包含二方包">
          {appData?.isClient}
        </Descriptions.Item>
        <Descriptions.Item label="应用类型">
          {APP_TYPE_MAP[appData?.appType!]}
        </Descriptions.Item>
        <Descriptions.Item label="所属">{appData?.belong}</Descriptions.Item>
        <Descriptions.Item label="业务线">
          {appData?.lineCode}
        </Descriptions.Item>
        <Descriptions.Item label="业务模块">
          {appData?.sysCode}
        </Descriptions.Item>
        <Descriptions.Item label="责任人">{appData?.owner}</Descriptions.Item>
        <Descriptions.Item label="应用描述">{appData?.desc}</Descriptions.Item>
      </Descriptions>

      <Descriptions
        title="成员"
        size="small"
        bordered
        column={1}
        labelStyle={labelStyle}
        style={{ marginTop: 36 }}
        extra={<Button onClick={() => setIsModifyMember(true)}>修改</Button>}
      >
        {/* 没有转交功能 */}
        <Descriptions.Item label="应用Owner">
          <Tag>七号</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="开发负责人">
          <Tag>七号</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="发布负责人">
          <Tag>七号</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="CodeReviewer">
          <Tag>七号</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="测试负责人">
          <Tag>七号</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="自动化测试人员">
          <Tag>七号</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="报警接收人">
          <Tag>七号</Tag>
        </Descriptions.Item>
      </Descriptions>

      <UpdateApplication
        formValue={appData}
        visible={isModifyApp}
        onClose={() => setIsModifyApp(false)}
        onSubmit={() => {
          // 保存成功后，关闭抽屉，重新请求应用数据
          // queryAppData();
          setIsModifyApp(false);
        }}
      />

      <ModifyMember
        formValue={memberData}
        visible={isModifyMember}
        onClose={() => setIsModifyMember(false)}
        onSubmit={() => {
          // 保存成功后，关闭抽屉，重新请求成员数据
          // queryAppData();
          setIsModifyMember(false);
        }}
      />
    </ContentCard>
  );
};

ApplicationOverview.defaultProps = {};

export default ApplicationOverview;
