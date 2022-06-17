import { useMemo, useEffect, useState } from 'react';
import { Link, Card, Typography, Space } from '@arco-design/web-react';
import { IconFile, IconStorage, IconSettings, IconMobile, IconFire, IconSelectAll } from '@arco-design/web-react/icon';
import { history } from 'umi';
import { Modal, Form, Input, Select, Popconfirm } from 'antd';
import styles from './style/shortcuts.module.less';
import { useMyEntryMenuList, useAddMyEntryMenu, useDeleteMyEntryMenu } from './hook';
import './index.less';

function Shortcuts() {
  const [visible, setVisible] = useState<boolean>(false);
  const [editForm] = Form.useForm();
  const [loading, myEntrySource, getMyEntryMenuList] = useMyEntryMenuList();
  const [delloading, deleteMyEntryMenu] = useDeleteMyEntryMenu();
  const [addLoading, createMyEntryMenu] = useAddMyEntryMenu();

  useEffect(() => {
    getMyEntryMenuList();
  }, []);
  const IconMap = {
    IconFile: <IconFile style={{ fontSize: 28 }} />,
    IconStorage: <IconStorage style={{ fontSize: 28 }} />,
    IconSettings: <IconSettings style={{ fontSize: 28 }} />,
    IconMobile: <IconMobile style={{ fontSize: 28 }} />,
    IconFire: <IconFire style={{ fontSize: 28 }} />,
    IconSelectAll: <IconSelectAll style={{ fontSize: 28 }} />,
  };
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
      title: '发布功能',
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
  const handleDelete = (item: any) => {
    Modal.confirm({
      title: '操作提示',
      content: '确定删除吗？',
      onOk: () => {
        deleteMyEntryMenu({ id: item.id }).then(() => {
          getMyEntryMenuList();
        });
      },
    });
  };

  const handleItemClick = (item: any) => {
    Modal.confirm({
      title: '操作提示',
      content: '确定添加吗？',
      onOk: () => {
        // createMyEntryMenu({}).then(()=>{
        //   getMyEntryMenuList()
        // })
      },
    });
  };

  return (
    <>
      <Modal
        title="新增快捷入口"
        visible={visible}
        width={1000}
        onOk={handleSubmit}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <h2>可添加的快捷入口</h2>
        <div className="icon-list clearfix">
          {myEntrySource.map((item: any, index: number) => (
            <div className="icon-item" onClick={() => handleItemClick(item)}>
              {IconMap[item.icon]}
              <div className="icon-item-name">
                {/* <Popconfirm title="确认添加此快捷入口吗？" onConfirm={() => handleItemClick(1)}>  */}
                {item.label}
                {/* </Popconfirm> */}
              </div>
            </div>
          ))}
        </div>

        {/* <Form form={editForm} labelCol={{ flex: '80px' }}>
          <Form.Item label="快捷入口名称" name="title" rules={[{ required: true, message: '请输入' }]}>
            <Input style={{ width: 440 }} />
          </Form.Item>
          <Form.Item label="类型" name="type" rules={[{ required: true, message: '请输入' }]}>
            <Input style={{ width: 440 }} />
          </Form.Item>
          <Form.Item label="URL" name="content" rules={[{ required: true, message: '请输入' }]}>
            <Input.TextArea style={{ width: 440 }} placeholder="请输入完整的url链接，页面如带有参数请拼接路由参数" />
          </Form.Item>
        </Form> */}
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
            <div className={styles.item} key={shortcut.key}>
              <div className={styles.icon} onClick={() => onClickShortcut(shortcut.key)}>
                {shortcut.icon}
              </div>
              <div className={styles.title}>{shortcut.title}</div>
              <a onClick={() => handleDelete(item)}>
                <div className={styles.closeIcon}>x</div>
              </a>
            </div>
          ))}
        </Space>
      </Card>
    </>
  );
}

export default Shortcuts;
