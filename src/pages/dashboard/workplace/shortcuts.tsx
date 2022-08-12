import { useEffect, useState } from 'react';
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
  IconPlus
} from '@arco-design/web-react/icon';
import { Modal } from 'antd';
import { EditFilled } from '@ant-design/icons';
import styles from './style/shortcuts.module.less';
import { useMyEntryMenuList, useAddMyEntryMenu, useDeleteMyEntryMenu } from './hook';
import './index.less';

function Shortcuts() {
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, myEntrySource, getMyEntryMenuList] = useMyEntryMenuList();
  const [delloading, deleteMyEntryMenu] = useDeleteMyEntryMenu();
  const [addLoading, createMyEntryMenu] = useAddMyEntryMenu();

  useEffect(() => {
    getMyEntryMenuList();
  }, []);
  const IconMap: any = {
    IconFile: <IconFile style={{ fontSize: 28, color: 'EDA542' }} />,
    IconStorage: <IconStorage style={{ fontSize: 28, color: 'EDA542' }} />,
    IconSettings: <IconSettings style={{ fontSize: 28, color: 'EDA542' }} />,
    IconMobile: <IconMobile style={{ fontSize: 28, color: 'EDA542' }} />,
    IconFire: <IconFire style={{ fontSize: 28, color: 'EDA542' }} />,
    IconSelectAll: <IconSelectAll style={{ fontSize: 28, color: 'EDA542' }} />,
    IconEmail: <IconEmail style={{ fontSize: 28, color: 'EDA542' }} />,
    IconCalendar: <IconCalendar style={{ fontSize: 28, color: 'EDA542' }} />,
    IconSearch: <IconSearch style={{ fontSize: 28, color: 'EDA542' }} />,
    IconMindMapping: <IconMindMapping style={{ fontSize: 28, color: 'EDA542' }} />,
    IconTool: <IconTool style={{ fontSize: 40, color: 'c3c9d8' }} />,
  };

  function onClickShortcut(key: any) {
    window.open(`/matrix/${key}`, '_blank');
  }
  const handleSubmit = () => { };
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
      </Modal>

      {/* <Typography.Title
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
        </Typography.Title> */}
      {myEntrySource[1]?.length !== 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {myEntrySource[1]?.map((shortcut: any, index: number) => (
            <div>
              <div className={`${styles.item} icon-item`} key={index}>
                <div onClick={() => onClickShortcut(shortcut.url)}>
                  {IconMap[shortcut.icon]}
                </div>
              </div>
              <div className={styles.title} style={{ marginTop: '10px' }}>{shortcut.label}</div>
            </div>
          ))}
          <div className={`${styles.item} icon-item`} >
            <IconPlus onClick={() => { setVisible(true); console.log(11) }} />
          </div>
        </div>
      ) : (
        <div className="empty-toolip flex-column">
          <div><EditFilled style={{ color: '#2f70f4', fontSize: '16px', marginRight: '10px' }} />快捷入口</div>
          <Empty
            imgSrc="//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a0082b7754fbdb2d98a5c18d0b0edd25.png~tplv-uwbnlip3yd-webp.webp"
            description={<>暂无收藏的快捷入口～快去<a onClick={() => { setVisible(true); }}>收藏</a>吧！</>}
          />
        </div>
      )}
    </>
  );
}

export default Shortcuts;
