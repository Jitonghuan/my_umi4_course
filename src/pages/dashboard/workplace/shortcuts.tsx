import { Link, Card, Typography, Space } from '@arco-design/web-react';
import { IconFile, IconStorage, IconSettings, IconMobile, IconFire } from '@arco-design/web-react/icon';
import { history } from 'umi';
import styles from './style/shortcuts.module.less';

function Shortcuts() {
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
    // {
    //   title:'日志检索',
    //   key: 'Online Promotion',
    //   icon: <IconMobile />,
    // },
    // {
    //   title: '发布申请',
    //   key: 'Marketing',
    //   icon: <IconFire />,
    // },
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

  return (
    <Card style={{ height: '120px', overflow: 'hidden' }}>
      <Typography.Title
        heading={6}
        style={{ marginTop: 0, paddingLeft: 6, display: 'flex', justifyContent: 'space-between' }}
      >
        <span>快捷入口</span>
        <Link style={{ paddingRight: 6 }}>新增快捷入口</Link>
      </Typography.Title>
      <Space>
        {shortcuts.map((shortcut) => (
          <div className={styles.item} key={shortcut.key} onClick={() => onClickShortcut(shortcut.key)}>
            <div className={styles.icon}>{shortcut.icon}</div>
            <div className={styles.title}>{shortcut.title}</div>
          </div>
        ))}
      </Space>
    </Card>
  );
}

export default Shortcuts;
