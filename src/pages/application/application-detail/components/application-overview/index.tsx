/**
 * ApplicationOverview
 * @description 应用-概述
 * @author moting.nq
 * @create 2021-04-13 11:00
 */

import React, { useState, useEffect, useContext } from 'react';
import { Descriptions, Button, Tag, Modal } from 'antd';
import VCPageContent, {
  FilterCard,
  ContentCard,
} from '@/components/vc-page-content';
import UpdateApplication, {
  AppDataTypes,
} from '@/components/create-application';
import ModifyMember, { MemberTypes } from './modify-member';
import DetailContext from '../../context';
import { queryApps, queryAppMember } from '../../../service';
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
  const { appData, queryAppData } = useContext(DetailContext);

  const [isModifyApp, setIsModifyApp] = useState(false);
  const [isModifyMember, setIsModifyMember] = useState(false);
  const [memberData, setMemberData] = useState<MemberTypes>();

  // 请求应用成员数据
  const queryMemberData = () => {
    queryAppMember({ appCode: appData?.appCode }).then((res) => {
      setMemberData(res.data || {});
    });
  };

  useEffect(() => {
    if (!appData?.appCode) return;
    queryMemberData();
  }, [appData?.appCode]);

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
          {memberData?.owner && <Tag>{memberData?.owner}</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="开发负责人">
          {memberData?.developerOwner && (
            <Tag>{memberData?.developerOwner}</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="发布负责人">
          {memberData?.deployOwner && <Tag>{memberData?.deployOwner}</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="CodeReviewer">
          {memberData?.codeReviewer && <Tag>{memberData?.codeReviewer}</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="测试负责人">
          {memberData?.testOwner && <Tag>{memberData?.testOwner}</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="自动化测试人员">
          {memberData?.autoTestOwner && <Tag>{memberData?.autoTestOwner}</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="报警接收人">
          {memberData?.alterReceiver && <Tag>{memberData?.alterReceiver}</Tag>}
        </Descriptions.Item>
      </Descriptions>

      <UpdateApplication
        formValue={appData}
        visible={isModifyApp}
        onClose={() => setIsModifyApp(false)}
        onSubmit={() => {
          // 保存成功后，关闭抽屉，重新请求应用数据
          queryAppData?.();
          setIsModifyApp(false);
          queryMemberData();
        }}
      />

      <ModifyMember
        formValue={memberData}
        visible={isModifyMember}
        onClose={() => setIsModifyMember(false)}
        onSubmit={() => {
          // 保存成功后，关闭抽屉，重新请求成员数据
          queryMemberData();
          setIsModifyMember(false);
        }}
      />
    </ContentCard>
  );
};

ApplicationOverview.defaultProps = {};

export default ApplicationOverview;
