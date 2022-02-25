// 应用-概述
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/30 20:45

import React, { useState, useEffect, useContext, useCallback, useMemo, Fragment } from 'react';
import { Descriptions, Button } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import { FeContext } from '@/common/hooks';
import ApplicationEditor from '@/pages/application/_components/application-editor';
import MemberEditor from './member-editor';
import DetailContext from '@/pages/application/application-detail/context';
import UserTagList from '@/components/user-selector/list';
import { queryAppMember } from '@/pages/application/service';
import { AppMemberInfo } from '@/pages/application/interfaces';
import { optionsToLabelMap } from '@/utils/index';
import {
  appFeProjectTypeOptions,
  appMicroFeTypeOptions,
  deployJobUrlOptions,
} from '@/pages/application/_components/application-editor/common';
import './index.less';

const APP_TYPE_MAP = {
  frontend: '前端',
  backend: '后端',
};

const appFeProjectTypeOptionsMap = optionsToLabelMap(appFeProjectTypeOptions);
const appMicroFeTypeOptionsMap = optionsToLabelMap(appMicroFeTypeOptions);
const deployJobUrlOptionsMap = optionsToLabelMap(deployJobUrlOptions);

export default function ApplicationOverview() {
  const { appData, queryAppData } = useContext(DetailContext);
  const { categoryData = [], businessData = [] } = useContext(FeContext);

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

  const categoryDataMap = useMemo(() => optionsToLabelMap(categoryData), [categoryData]);
  const businessDataMap = useMemo(() => optionsToLabelMap(businessData), [businessData]);

  return (
    <ContentCard className="overview-page">
      <Descriptions
        title="概要"
        className="fixed"
        bordered
        column={3}
        labelStyle={{ width: 200 }}
        extra={<Button onClick={() => setIsModifyApp(true)}>修改</Button>}
      >
        <Descriptions.Item label="APPCODE">{appData?.appCode}</Descriptions.Item>
        <Descriptions.Item label="应用名">{appData?.appName}</Descriptions.Item>
        <Descriptions.Item label="应用部署名">{appData?.deploymentName}</Descriptions.Item>
        <Descriptions.Item label="应用类型">{APP_TYPE_MAP[appData?.appType!]}</Descriptions.Item>
        <Descriptions.Item label="应用分类">{categoryDataMap[appData?.appCategoryCode!] || '--'}</Descriptions.Item>
        <Descriptions.Item label="应用组">{businessDataMap[appData?.appGroupCode!] || '--'}</Descriptions.Item>
        <Descriptions.Item label="责任人">
          <UserTagList color="#1973CC" data={appData?.owner} />
        </Descriptions.Item>
        <Descriptions.Item label="git地址" span={2}>
          <a href={appData?.gitAddress} target="_blank">
            {appData?.gitAddress}
          </a>
        </Descriptions.Item>
        <Descriptions.Item label="应用描述">{appData?.desc}</Descriptions.Item>
      </Descriptions>

      {/* 开发信息 */}
      <Descriptions
        title="开发信息"
        className="fixed"
        bordered
        column={3}
        labelStyle={{ width: 200 }}
        style={{ marginTop: 36 }}
      >
        {/* 后端 */}
        {appData?.appType === 'backend' && (
          <Descriptions.Item label="应用开发语言">{appData?.appDevelopLanguage}</Descriptions.Item>
        )}
        {/* <Descriptions.Item label="基础镜像">{appData?.baseImage}</Descriptions.Item> */}
        {appData?.appDevelopLanguage === 'java' && (
          <Descriptions.Item label="是否为二方包">{{ 1: '是', 0: '否' }[appData?.isClient!]}</Descriptions.Item>
        )}
        {appData?.appDevelopLanguage === 'java' && (
          <Descriptions.Item label="是否包含二方包">
            {{ 1: '是', 0: '否' }[appData?.isContainClient!]}
          </Descriptions.Item>
        )}
        {appData?.appDevelopLanguage === 'java' && (
          <Descriptions.Item label="pom文件路径">{appData?.deployPomPath}</Descriptions.Item>
        )}
        {appData?.appType === 'backend' && (
          <Descriptions.Item label="自定义maven构建">
            {appData?.customParams ? JSON.parse(appData.customParams).custom_maven : ''}
          </Descriptions.Item>
        )}

        {/* 前端 */}
        {appData?.appType === 'frontend' && (
          <Descriptions.Item label="工程类型">
            {appFeProjectTypeOptionsMap[appData.projectType!] || '--'}
          </Descriptions.Item>
        )}
        {appData?.projectType === 'micro' && (
          <Descriptions.Item label="微前端类型">
            {appMicroFeTypeOptionsMap[appData.microFeType!] || '--'}
          </Descriptions.Item>
        )}
        {appData?.appType === 'frontend' && (
          <Descriptions.Item label="构建任务类型">
            {deployJobUrlOptionsMap[appData.deployJobUrl!] || '--'}
          </Descriptions.Item>
        )}
        {appData?.microFeType === 'mainProject' && (
          <Descriptions.Item label="路由文件">{appData.routeFile || '--'}</Descriptions.Item>
        )}
        {appData?.microFeType === 'subProject' &&
          appData?.relationMainApps?.map((group, groupIndex) => (
            <Fragment key={groupIndex}>
              <Descriptions.Item label={`关联主应用${groupIndex + 1}`}>{group.appCode}</Descriptions.Item>
              <Descriptions.Item span={2} label={`路由${groupIndex + 1}`}>
                {group.routePath}
              </Descriptions.Item>
            </Fragment>
          ))}
      </Descriptions>

      <Descriptions
        title="成员信息"
        className="fixed"
        bordered
        column={2}
        labelStyle={{ width: 200 }}
        style={{ marginTop: 36 }}
        extra={<Button onClick={() => setMemberEditorMode('EDIT')}>修改</Button>}
      >
        <Descriptions.Item label="应用Owner">
          <UserTagList color="#1973CC" data={memberData?.owner} />
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
        <Descriptions.Item label="">&nbsp;</Descriptions.Item>
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
          queryAppData?.();
          setMemberEditorMode('HIDE');
        }}
      />
    </ContentCard>
  );
}
