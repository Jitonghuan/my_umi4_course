import { useMemo, useEffect, useState } from 'react';
import { Link, Card, Typography, Space } from '@arco-design/web-react';
import { IconFile, IconStorage, IconSettings, IconMobile, IconFire } from '@arco-design/web-react/icon';
import { history } from 'umi';
import { Modal, Form, Input, Select } from 'antd';
import styles from './style/shortcuts.module.less';

function Shortcuts() {
  const [visible, setVisible] = useState<boolean>(false);
  const [editForm] = Form.useForm();
  const shortcuts = [
    {
      title: '应用列表',
      key: 'application/list',
      icon: <IconFile />,
    },
    {
      title: '项目环境',
      key: 'application/project-environment',
      icon: <IconStorage />,
    },
    {
      title: '发布功能管理',
      key: 'publish/function',
      icon: <IconSettings />,
    },
  ];

  const recentShortcuts = [
    {
      title: '日志检索',
      key: 'Content Statistic',
      icon: <IconStorage />,
    },
    {
      title: '新建分支',
      key: 'Content Management',
      icon: <IconFile />,
    },
    {
      title: '环境管理',
      key: 'Advanced Management',
      icon: <IconSettings />,
    },
  ];

  function onClickShortcut(key: any) {
    window.open(`/matrix/${key}`, '_blank');
  }
  const handleSubmit = () => {};

  return (
    <>
      <Modal
        title="新增快捷入口"
        visible={visible}
        width={600}
        onOk={handleSubmit}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <Form form={editForm} labelCol={{ flex: '80px' }}>
          <Form.Item label="快捷入口名称" name="title" rules={[{ required: true, message: '请输入' }]}>
            <Input style={{ width: 450 }} />
          </Form.Item>
          <Form.Item label="类型" name="type" rules={[{ required: true, message: '请输入' }]}>
            <Input style={{ width: 450 }} />
          </Form.Item>
          <Form.Item label="URL" name="content" rules={[{ required: true, message: '请输入' }]}>
            <Input.TextArea style={{ width: 450 }} placeholder="请输入完整的url链接，页面如带有参数请拼接路由参数" />
          </Form.Item>
        </Form>
      </Modal>

      <Card style={{ height: '120px', overflow: 'hidden' }}>
        <Typography.Title
          heading={6}
          style={{ marginTop: 0, paddingLeft: 6, display: 'flex', justifyContent: 'space-between' }}
        >
          <span>快捷入口</span>
          <Link
            style={{ paddingRight: 6 }}
            onClick={() => {
              setVisible(true);
            }}
          >
            新增快捷入口
          </Link>
        </Typography.Title>
        <Space>
          {shortcuts.map((shortcut) => (
            <div className={styles.item} key={shortcut.key} onClick={() => onClickShortcut(shortcut.key)}>
              <div className={styles.icon}>{shortcut.icon}</div>
              <div className={styles.title}>{shortcut.title}</div>
              <div className={styles.closeIcon}>x</div>
            </div>
          ))}
        </Space>
      </Card>
    </>
  );
}

export default Shortcuts;
