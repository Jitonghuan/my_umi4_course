/**
 * ApplicationOverview
 * @description 应用-概述
 * @author moting.nq
 * @create 2021-04-13 11:00
 */

import React, { useState } from 'react';
import { Descriptions, Button, Tag, Modal } from 'antd';
import VCPageContent, {
  FilterCard,
  ContentCard,
} from '@/components/vc-page-content';
import UpdateApplication from '@/components/create-application';
import ModifyMember from './modify-member';
import { IProps } from './types';
import './index.less';

const rootCls = 'overview-page';
const labelStyle = {
  width: 200,
};

const ApplicationOverview = (props: IProps) => {
  const [isModifyApp, setIsModifyApp] = useState(false);
  const [appData, setAppData] = useState();
  const [isModifyMember, setIsModifyMember] = useState(false);
  const [memberData, setMemberData] = useState();

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
        <Descriptions.Item label="APPCODE">Zhou Maomao</Descriptions.Item>
        <Descriptions.Item label="应用名">1810000000</Descriptions.Item>
        <Descriptions.Item label="git地址">
          Hangzhou, Zhejiang
        </Descriptions.Item>
        <Descriptions.Item label="jar包路径">empty</Descriptions.Item>
        <Descriptions.Item label="是否包含二方包">否</Descriptions.Item>
        <Descriptions.Item label="应用类型">否</Descriptions.Item>
        <Descriptions.Item label="所属">否</Descriptions.Item>
        <Descriptions.Item label="业务线">否</Descriptions.Item>
        <Descriptions.Item label="业务模块">否</Descriptions.Item>
        <Descriptions.Item label="责任人">否</Descriptions.Item>
        <Descriptions.Item label="应用描述">否</Descriptions.Item>
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
