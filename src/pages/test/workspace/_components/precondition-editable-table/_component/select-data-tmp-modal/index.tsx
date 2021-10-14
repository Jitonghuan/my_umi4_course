import React, { useState } from 'react';
import { Modal, Space, Button } from 'antd';
import DebounceSelect from '@/components/debounce-select';
import * as APIS from '../../../../service';
import { getRequest } from '@/utils/request';

interface ISelectCaseModal {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onSelect: (value: any) => void;
}

export default function SelectCaseModal(props: ISelectCaseModal) {
  const [curSelectData, setCurSelectData] = useState<any>();

  const loadDataTmpOptions = async (keyword: string) => {
    const result = await getRequest(APIS.queryDataFactory, {
      data: {
        name: keyword?.trim() || '',
        pageIndex: 1,
        pageSize: 50,
      },
    });

    return (result.data?.dataSource || []).map((n: any) => ({
      value: n.id,
      label: `${n.name}-${n.desc}`,
      data: n,
    }));
  };

  const handleSqlSelect = (_: any, item: any) => {
    setCurSelectData(item);
  };

  const submit = () => {
    props.onSelect({ ...curSelectData.data, title: curSelectData.label });
    props.setVisible(false);
  };

  return (
    <Modal
      visible={props.visible}
      onCancel={() => props.setVisible(false)}
      title="选择数据模板"
      footer={
        <Space>
          <Button type="primary" onClick={submit}>
            确定
          </Button>
          <Button type="primary" onClick={() => props.setVisible(false)}>
            取消
          </Button>
        </Space>
      }
    >
      <DebounceSelect
        fetchOnMount
        fetchOptions={loadDataTmpOptions}
        onSelect={handleSqlSelect}
        style={{ width: '100%' }}
        autoFocus
        suffixIcon={null}
        placeholder="输入数据模板名称搜索"
      />
    </Modal>
  );
}
