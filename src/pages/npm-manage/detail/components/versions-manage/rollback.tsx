import React, { useState, useEffect } from 'react';
import { Modal, message, Table, Empty } from 'antd';
import { AppItemVO } from '@/pages/npm-manage/detail/interfaces';
import { datetimeCellRender } from '@/utils';
import { getVersionList, rollback } from '@/pages/npm-manage/detail/server';
import { getRequest, postRequest } from '@/utils/request';
import './index.less';

export interface RollbackVersionProps {
  npmData?: AppItemVO;
  activeVersion?: string;
  visible: boolean;
  tag: string;
  onClose: () => any;
  onSubmit: () => any;
}

const envTypeData = [
  {
    label: 'DEV',
    value: 'dev',
  },
  {
    label: 'TEST',
    value: 'test',
  },
  {
    label: 'PRE',
    value: 'pre',
  },
  {
    label: 'LATEST',
    value: 'prod',
  },
];

export default function RollbackVersion(props: RollbackVersionProps) {
  const { npmData, tag, visible, activeVersion, onClose, onSubmit } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dataList, setDataList] = useState<any[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (visible) {
      setPage(1);
      setPageSize(10);
      setDataList([]);
      setTotal(0);
      void handleSearch();
    }
  }, [visible]);

  function getEnvType() {
    if (!tag || tag === 'latest') {
      return 'prod';
    }
    const item = envTypeData.find((item) => tag.includes(item.value));
    return item?.value || 'prod';
  }

  async function handleSearch(pagination?: any) {
    setSelectedRowKeys([]);
    const res = await getRequest(getVersionList, {
      data: {
        npmName: npmData?.npmName,
        npmTag: tag === 'latest' ? '' : tag,
        npmEnvType: getEnvType(),
        pageIndex: page,
        pageSize,
        ...(pagination || {}),
      },
    });
    const { dataSource, pageInfo } = res?.data || {};
    setDataList(dataSource || []);
    setTotal(pageInfo?.total || 0);
  }

  const handleOk = async () => {
    let item = dataList.find((val) => val.id === selectedRowKeys[0]);
    if (!item) {
      return message.warning('请选择回滚版本');
    }
    let extra: any = {};
    try {
      extra = npmData?.customParams ? JSON.parse(npmData.customParams) : {};
    } catch (e) {
      console.log(e)
    }

    let param = {
      npmName: npmData?.npmName,
      npmEnvType: getEnvType(),
      tag,
      version: item.npmVersion,
    };
    await postRequest(rollback, {
      data: param,
    });

    if (extra?.linkage === 1 && extra?.relationNpm?.length) {
      for (const npmItem of extra.relationNpm) {
        let param = {
          npmName: npmItem?.npmName,
          npmEnvType: getEnvType(),
          tag,
          version: item.npmVersion,
        };
        await postRequest(rollback, {
          data: param,
        });
      }
    }

    message.success('操作成功！');
    onSubmit();
  };

  function getStatusName(status: number) {
    switch (status) {
      case 1:
        return '当前';
      case 2:
        return '历史';
      case 3:
        return '部署中';
      case 4:
        return '部署失败';
      default:
        return '';
    }
  }

  return (
    <Modal
      visible={visible}
      title="选择回滚版本"
      width={800}
      maskClosable={false}
      onCancel={onClose}
      onOk={handleOk}
      okButtonProps={{ disabled: !selectedRowKeys.length }}
    >
      <Table
        dataSource={dataList}
        rowClassName={(record) => {
          if (record.isActive === 1) {
            return 'table-color-rollback';
          } else if (record.isActive === 3) {
            return 'table-rollback-deployling';
          } else {
            return 'table-rollback';
          }
        }}
        rowSelection={{
          selectedRowKeys,
          type: 'radio',
          onChange: (nextKeys) => setSelectedRowKeys(nextKeys),
          getCheckboxProps: (record) => ({
            // 不能选择当前版本或部署中的版本
            disabled: record.isActive !== 2,
          }),
        }}
        onRow={(record) => ({
          onClick: () => {
            if (record.isActive !== 2) return;
            setSelectedRowKeys([record.id]);
          },
        })}
        rowKey="id"
        pagination={{
          total,
          pageSize,
          current: page,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
            void handleSearch({
              pageIndex: page,
              pageSize,
            });
          },
        }}
        bordered
        locale={{ emptyText: <Empty description="没有可回滚的版本" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
        title={() => (
          <div className="rollback-modal-header">
            <span>当前版本：{activeVersion || '--'}</span>
            <span>{tag}</span>
          </div>
        )}
      >
        <Table.Column dataIndex="npmVersion" title="版本号" />
        <Table.Column dataIndex="deployDesc" title="发布描述" />
        <Table.Column dataIndex="gmtCreate" title="发布时间" render={datetimeCellRender} width={200} />
        <Table.Column dataIndex="npmDeployer" title="发布人" />
        <Table.Column dataIndex="isActive" title="状态" render={(value: number) => getStatusName(value)} />
      </Table>
    </Modal>
  );
}
