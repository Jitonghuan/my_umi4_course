import React from 'react';
import { Link, Card, Divider, Message, Typography, Space } from '@arco-design/web-react';
import { IconFile, IconStorage, IconSettings, IconMobile, IconFire } from '@arco-design/web-react/icon';
import { history } from 'umi';
import { Decoration11, BorderBox13, BorderBox12, BorderBox8 } from '@jiaminghi/data-view-react';
// import useLocale from '@/utils/useLocale';
// import locale from './locale';
import styles from './style/shortcuts.module.less';

function Shortcuts() {
  // const t = useLocale(locale);
  // http://matrix-test.cfuture.shop/matrix/application/list
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
    // history.push(`/matrix/${key}`)
  }

  return (
    <Card style={{ height: '120px', overflow: 'hidden' }}>
      {/* <BorderBox8 style={{ width: '99.8%', height: '120px', display: 'flex' }} reverse="{false}" dur={50}> */}
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
      {/* <div className={styles.shortcuts}>
          {shortcuts.map((shortcut) => (
            <div className={styles.item} key={shortcut.key} onClick={() => onClickShortcut(shortcut.key)}>
              <div className={styles.icon}>{shortcut.icon}</div>
              <div className={styles.title}>{shortcut.title}</div>
            </div>
          ))}
        </div> */}
      {/* <Divider /> */}
      {/* <div style={{paddingRight:9}}> */}
      {/* <div className={styles.recent} style={{paddingRight:9}}>最近访问</div>
      <div className={styles.shortcuts} style={{paddingRight:9}}>
        {recentShortcuts.map((shortcut) => (
          <div
            className={styles.item}
            key={shortcut.key}
            onClick={() => onClickShortcut(shortcut.key)}
          >
            <div className={styles.icon}>{shortcut.icon}</div>
            <div className={styles.title}>{shortcut.title}</div>
          </div>
        ))}
      </div> */}

      {/* </div> */}

      {/* <div style={{paddingLeft:9}}>
          1、Matrix多流水线已发布更新；
        </div>
        */}
      {/* </BorderBox8> */}
      {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography.Title heading={6}>
          快捷入口
          {t['workplace.shortcuts']}
        </Typography.Title>
        <Link>查看更多</Link>
      </div> */}
    </Card>
  );
}

export default Shortcuts;
