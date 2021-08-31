// 应用-概述
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/30 20:45

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Descriptions, Button } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import FEContext from '@/layouts/basic-layout/fe-context';
import ApplicationEditor from '@/pages/application/_components/application-editor';
import MemberEditor from './member-editor';
import DetailContext from '@/pages/application/application-detail/context';
import UserTagList from '@/components/user-selector/list';
import { queryAppMember } from '@/pages/application/service';
import { AppMemberInfo } from '@/pages/application/interfaces';
import './index.less';

const APP_TYPE_MAP = {
  frontend: '前端',
  backend: '后端',
};

export default function ApplicationOverview() {
  const { appData, queryAppData } = useContext(DetailContext);
  const { categoryData = [], businessData = [] } = useContext(FEContext);

  const [isModifyApp, setIsModifyApp] = useState(false);
  const [memberEditorMode, setMemberEditorMode] = useState<EditorMode>('HIDE');
  const [memberData, setMemberData] = useState<AppMemberInfo>();

  // 请求应用成员数据
  const queryMemberData = useCallback(() => {
    queryAppMember({ appCode: appData?.appCode }).then((res) => {
      setMemberData(res.data || {});
    });
  }, [appData]);

  useEffect(() => {
    if (!appData?.appCode) return;
    queryMemberData();
  }, [appData?.appCode]);

  return (
    <ContentCard className="overview-page">
      <Descriptions
        title="概要"
        bordered
        column={3}
        labelStyle={{ width: 200 }}
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
        <Descriptions.Item label="责任人">
          <UserTagList color="blue" data={appData?.owner} />
        </Descriptions.Item>
        <Descriptions.Item label="应用描述">{appData?.desc}</Descriptions.Item>
      </Descriptions>

      <Descriptions
        title="成员"
        bordered
        column={1}
        labelStyle={{ width: 200 }}
        style={{ marginTop: 36 }}
        extra={<Button onClick={() => setMemberEditorMode('EDIT')}>修改</Button>}
      >
        <Descriptions.Item label="应用Owner">
          <UserTagList color="blue" data={memberData?.owner} />
        </Descriptions.Item>
        <Descriptions.Item label="开发负责人">
          <UserTagList data={memberData?.developerOwner} />
        </Descriptions.Item>
        <Descriptions.Item label="发布负责人">
          <UserTagList data={memberData?.deployOwner} />
        </Descriptions.Item>
        <Descriptions.Item label="CodeReviewer">
          <UserTagList data={memberData?.codeReviewer} />
        </Descriptions.Item>
        <Descriptions.Item label="测试负责人">
          <UserTagList data={memberData?.testOwner} />
        </Descriptions.Item>
        <Descriptions.Item label="自动化测试人员">
          <UserTagList data={memberData?.autoTestOwner} />
        </Descriptions.Item>
        <Descriptions.Item label="报警接收人">
          <UserTagList data={memberData?.alertReceiver} />
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

      <MemberEditor
        initData={memberData}
        mode={memberEditorMode}
        onClose={() => setMemberEditorMode('HIDE')}
        onSave={() => {
          queryMemberData();
          setMemberEditorMode('HIDE');
        }}
      />
    </ContentCard>
  );
}
