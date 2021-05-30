// 环境列表
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/26 16:27

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { PlusSquareFilled } from '@ant-design/icons';
import type Emitter from 'events';
import FELayout from '@cffe/vc-layout';
import { CardRowGroup } from '@/components/vc-page-content';
import * as APIS from '../service';
import { getRequest, postRequest } from '@/utils/request';
import { EnvItemVO } from '../interfaces';
import './index.less';

export interface EnvListProps extends Record<string, any> {
  onItemClick?: (item: EnvItemVO, index?: number) => any;
  emitter: Emitter;
}

export default function EnvList(props: EnvListProps) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [flag, setFlag] = useState(1);
  const [addModelVisible, setAddModelVisible] = useState(false);
  const [envList, setEnvList] = useState<EnvItemVO[]>([]);
  const [addField] = Form.useForm<{ envName: string }>();
  const [hightlight, setHightlight] = useState<number>();

  useEffect(() => {
    getRequest(APIS.envList).then((result) => {
      const data: EnvItemVO[] = result.data || [];
      setEnvList(data);
      if (
        data.length &&
        (!hightlight || !data.find((n) => n.id === hightlight))
      ) {
        handleEnvItemClick(data[0], 0);
      }
      if (!data.length && hightlight) {
        handleEnvItemClick(null as any, -1);
      }
    });
  }, [flag]);

  useEffect(() => {
    props.emitter.on('ENV::REFRESH', () => {
      setFlag(Date.now());
    });
    props.emitter.on('ENV::CANCEL', () => {
      handleEnvItemClick(null as any, -1);
    });
  }, []);

  const handleAddBtnClick = useCallback(() => {
    setAddModelVisible(true);
    addField.resetFields();
  }, []);

  const handleAddConfirm = useCallback(async () => {
    const { envName } = await addField.validateFields();
    await postRequest(APIS.addEnv, {
      data: {
        envName,
        createUser: userInfo?.userName,
      },
    });
    message.success('新增成功！');
    setAddModelVisible(false);
    setFlag(Date.now());
  }, []);

  const handleAddCancel = useCallback(() => {
    setAddModelVisible(false);
  }, []);

  const handleEnvItemClick = useCallback(
    (item: EnvItemVO, index: number) => {
      setHightlight(item ? item.id : undefined);
      props.onItemClick && props.onItemClick(item, index);
    },
    [envList],
  );

  return (
    <CardRowGroup.SlideCard width={184} className="page-env-list">
      <div className="env-list-header">
        <h3>环境列表</h3>
        <a onClick={handleAddBtnClick}>
          <PlusSquareFilled style={{ fontSize: 16 }} />
        </a>
      </div>
      <ul className="env-list">
        {envList.map((item, index) => (
          <li
            key={index}
            data-active={hightlight === item.id}
            onClick={() => handleEnvItemClick(item, index)}
          >
            {item.name}
          </li>
        ))}
      </ul>
      <Modal
        visible={addModelVisible}
        title="新增环境"
        onOk={handleAddConfirm}
        onCancel={handleAddCancel}
        width={400}
        bodyStyle={{ minHeight: 140 }}
      >
        <Form form={addField} labelCol={{ span: '60px' }}>
          <Form.Item
            label="环境名称: "
            name="envName"
            rules={[{ required: true, message: '请输入环境名称' }]}
          >
            <Input placeholder="请输入" maxLength={30} />
          </Form.Item>
        </Form>
      </Modal>
    </CardRowGroup.SlideCard>
  );
}
