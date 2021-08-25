/**
 * ApplicationOverview
 * @description 应用-概述
 * @author moting.nq
 * @create 2021-04-13 11:00
 */

import React, { useState, useEffect, useContext } from 'react';
import { Descriptions, Button, Tag } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import FEContext from '@/layouts/basic-layout/fe-context';
import ApplicationEditor from '@/pages/application/_components/application-editor';
import ModifyMember, { MemberTypes } from './modify-member';
import DetailContext from '@/pages/application/application-detail/context';
import { queryAppMember } from '@/pages/application/service';
import './index.less';

const rootCls = 'overview-page';
const labelStyle = {
  width: 200,
};
const APP_TYPE_MAP = {
  frontend: '前端',
  backend: '后端',
};

export default function ApplicationOverview() {
  const { appData, queryAppData } = useContext(DetailContext);
  const { categoryData = [], businessData = [] } = useContext(FEContext);

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
        bordered
        column={3}
        labelStyle={labelStyle}
        extra={<Button onClick={() => setIsModifyApp(true)}>修改</Button>}
      >
        <Descriptions.Item label="APPCODE">{appData?.appCode}</Descriptions.Item>
        <Descriptions.Item label="应用名">{appData?.appName}</Descriptions.Item>
        <Descriptions.Item label="git地址">{appData?.gitAddress}</Descriptions.Item>
        <Descriptions.Item label="git组">{appData?.gitGroup}</Descriptions.Item>
        {appData?.appDevelopLanguage === 'java' && (
          <Descriptions.Item label="pom文件路径">{appData?.deployPomPath}</Descriptions.Item>
        )}
        {appData?.appType === 'backend' && (
          <Descriptions.Item label="应用开发语言">{appData?.appDevelopLanguage}</Descriptions.Item>
        )}
        <Descriptions.Item label="应用部署名称">{appData?.deploymentName}</Descriptions.Item>
        {/* <Descriptions.Item label="基础镜像">{appData?.baseImage}</Descriptions.Item> */}
        <Descriptions.Item label="应用分类">
          {categoryData?.find((v) => v.categoryCode === appData?.appCategoryCode)?.categoryName || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="应用组">
          {businessData?.find((v) => v.groupCode === appData?.appGroupCode)?.groupName || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="应用类型">{APP_TYPE_MAP[appData?.appType!]}</Descriptions.Item>
        {appData?.appDevelopLanguage === 'java' && (
          <Descriptions.Item label="是否为二方包">{{ 1: '是', 0: '否' }[appData?.isClient!]}</Descriptions.Item>
        )}
        {appData?.appDevelopLanguage === 'java' && (
          <Descriptions.Item label="是否包含二方包">
            {{ 1: '是', 0: '否' }[appData?.isContainClient!]}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="责任人">{appData?.owner}</Descriptions.Item>
        <Descriptions.Item label="应用描述">{appData?.desc}</Descriptions.Item>
      </Descriptions>

      <Descriptions
        title="成员"
        bordered
        column={1}
        labelStyle={labelStyle}
        style={{ marginTop: 36 }}
        extra={<Button onClick={() => setIsModifyMember(true)}>修改</Button>}
      >
        {/* 没有转交功能 */}
        <Descriptions.Item label="应用Owner">{memberData?.owner && <Tag>{memberData?.owner}</Tag>}</Descriptions.Item>
        <Descriptions.Item label="开发负责人">
          {memberData?.developerOwner && <Tag>{memberData?.developerOwner}</Tag>}
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
          {memberData?.alertReceiver && <Tag>{memberData?.alertReceiver}</Tag>}
        </Descriptions.Item>
      </Descriptions>

      <ApplicationEditor
        initData={appData as any}
        visible={isModifyApp}
        onClose={() => setIsModifyApp(false)}
        onSubmit={() => {
          queryAppData?.();
          setIsModifyApp(false);
          queryMemberData();
        }}
      />

      <ModifyMember
        formValue={memberData}
        appCode={appData?.appCode}
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
}
