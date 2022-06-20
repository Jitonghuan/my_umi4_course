import { useMemo, useEffect, useState } from 'react';
import { Link, Card, Typography, Space, Spin, Empty } from '@arco-design/web-react';
import {
  IconFile,
  IconStorage,
  IconSettings,
  IconMobile,
  IconFire,
  IconSelectAll,
  IconMinusCircle,
  IconHeart,
  IconEmail,
  IconCalendar,
  IconSearch,
  IconMindMapping,
  IconTool,
} from '@arco-design/web-react/icon';
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
    IconEmail: <IconEmail style={{ fontSize: 28 }} />,
    IconCalendar: <IconCalendar style={{ fontSize: 28 }} />,
    IconSearch: <IconSearch style={{ fontSize: 28 }} />,
    IconMindMapping: <IconMindMapping style={{ fontSize: 28 }} />,
    IconTool: <IconTool style={{ fontSize: 28 }} />,
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
      content: '您已收藏此快捷入口，确定移除吗？',
      onOk: () => {
        deleteMyEntryMenu({ id: item.id }).then(() => {
          getMyEntryMenuList();
        });
      },
    });
  };

  const handleItemClick = (item: any) => {
    if (myEntrySource[1]?.length > 6) {
      Modal.info({
        title: '操作提示',
        content: '很抱歉您最多可以添加6个快捷入口！',
      });
    } else {
      Modal.confirm({
        title: '操作提示',
        content: '确定添加此快捷入口吗？',
        onOk: () => {
          createMyEntryMenu(item.id).then(() => {
            getMyEntryMenuList();
          });
        },
      });
    }
  };

  return (
    <>
      <Modal
        title="管理快捷入口"
        visible={visible}
        width={1000}
        onOk={handleSubmit}
        onCancel={() => {
          setVisible(false);
        }}
        footer={null}
      >
        <h3>可添加的快捷入口：</h3>
        <div className="icon-list clearfix">
          <Spin loading={loading}>
            {myEntrySource[0]?.map((item: any, index: number) => (
              <>
                <div className="icon-item">
                  {IconMap[item.icon]}
                  <div className="icon-item-name">
                    <b>{item.label} </b>
                  </div>

                  <div className="close-Icon-add">
                    <IconHeart style={{ fontSize: 18 }} onClick={() => handleItemClick(item)} />
                  </div>
                </div>
              </>
            ))}
          </Spin>
        </div>
        <h3>已添加的快捷入口：</h3>
        <div className="icon-list clearfix">
          <Spin loading={loading}>
            {myEntrySource[1]?.map((item: any, index: number) => (
              <>
                <div className="icon-item">
                  {IconMap[item.icon]}
                  <div className="icon-item-name">
                    <b>{item.label} </b>
                  </div>
                  <div className="close-Icon-cancle">
                    <IconMinusCircle
                      style={{ fontSize: 18 }}
                      onClick={() => {
                        handleDelete(item);
                      }}
                    />
                  </div>
                </div>
              </>
            ))}
          </Spin>
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

      <Card style={{ height: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
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
            管理快捷入口
          </Link>
        </Typography.Title>
        {myEntrySource[1]?.length !== 0 ? (
          <Space style={{ display: 'flex' }}>
            {myEntrySource[1]?.map((shortcut: any, index: number) => (
              <div className={styles.item} key={index}>
                <div className={styles.icon} onClick={() => onClickShortcut(shortcut.url)}>
                  {IconMap[shortcut.icon]}
                </div>
                <div className={styles.title}>{shortcut.label}</div>
              </div>
            ))}
          </Space>
        ) : (
          <div className="empty-toolip">
            <Empty
              imgSrc="//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a0082b7754fbdb2d98a5c18d0b0edd25.png~tplv-uwbnlip3yd-webp.webp"
              description="您暂无收藏的快捷入口哦～快去收藏吧！"
            />
          </div>
        )}
      </Card>
    </>
  );
}

export default Shortcuts;
