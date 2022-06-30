// create user
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/30 10:50

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Drawer, message, Form, Button, Table, Input, Card } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import { ContentCard } from '@/components/vc-page-content';
import { roleTableColumns } from '../schema';
import { useDeleteUserRole } from '../hook';
import './index.less';

export default function MemberEditor() {
  const [delLoading, deleteUserRole] = useDeleteUserRole();
  const curRecord = history.location.state;
  console.log('curRecord', curRecord);

  const [editForm] = Form.useForm();
  const columns = useMemo(() => {
    return roleTableColumns({
      onEdit: (record, index) => {},
      onDelete: (record) => {
        deleteUserRole({ id: record?.id });
      },
    }) as any;
  }, []);

  return (
    <PageContainer className="create-user">
      <ContentCard>
        <Card style={{ width: '100%' }}>
          <Form labelCol={{ flex: '120px' }} form={editForm}>
            <Form.Item label="姓名" name="name">
              <Input style={{ width: 420 }} />
            </Form.Item>
            <Form.Item label="邮箱" name="email">
              <Input style={{ width: 420 }} />
            </Form.Item>
            <Form.Item label="手机号" name="mobile">
              <Input style={{ width: 420 }} />
            </Form.Item>
            <Form.Item style={{ marginLeft: 490 }}>
              <Button type="primary">保存</Button>
            </Form.Item>
          </Form>
        </Card>
        <div></div>
        {/* <Card style={{ width: '100%',marginTop:30 }}> */}
        <div style={{ width: '100%', marginTop: 20 }}>
          <h3 className="user-role-list-title">角色信息</h3>
          <Table columns={columns} bordered />
        </div>

        {/* </Card> */}
      </ContentCard>
    </PageContainer>
  );
}
