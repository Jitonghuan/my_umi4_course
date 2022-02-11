import React, { useState, useImperativeHandle, useEffect } from 'react';
import { Drawer, Form, Select, Button, Input } from 'antd';
import TableTransfer from '../table-transfer';
import { DEFAULT_LEVEL, LevelEnum } from '@/pages/trafficmap/constant';
import { IRelApp } from '@/pages/trafficmap/interface';
import { createRegion, getAppByRegion, updateRegion } from '@/pages/trafficmap/service';

const { Item: FormItem } = Form;
type DrawerStatusType = 'view' | 'edit' | 'create';
const TitleEnum = {
  view: '查看域',
  edit: '编辑域',
  create: '创建域',
};

const CreateRegionDrawer = React.forwardRef((props: any, ref) => {
  const [visible, setVisible] = useState(false);
  const [drawerStatus, setDrawerStatus] = useState<DrawerStatusType>('create');
  const [form] = Form.useForm();
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [appList, setAppList] = useState<IRelApp[]>([]);

  const [regionCode, setRegionCode] = useState<string>('');
  const [envCode, setEnvCode] = useState<string>('');

  const { envOptions } = props;

  useImperativeHandle(ref, () => ({
    showDrawer: () => {
      showDrawer();
      setDrawerStatus('create');
    },
    editDrawer: (data: any) => {
      showDrawer();
      form.setFieldsValue(data);
      setRegionCode(data.regionCode);
      setEnvCode(data.envCode);
      setDrawerStatus('edit');
    },
    viewDrawer: (data: any) => {
      showDrawer();
      form.setFieldsValue(data);
      setRegionCode(data.regionCode);
      setEnvCode(data.envCode);
      setDrawerStatus('view');
    },
  }));

  const showDrawer = () => {
    setVisible(true);
  };

  useEffect(() => {
    regionCode && envCode && getAppList();
  }, [regionCode, envCode]);

  /**
   * 获取域里的app
   */
  const getAppList = async () => {
    const data = {
      regionCode,
      envCode,
    };
    const httpArray = [getAppByRegion({ ...data, isRelation: 1 }), getAppByRegion({ ...data, isRelation: 0 })];
    const res: any = await Promise.all(httpArray);
    console.log(res);
    const appList = [...res[0].data, ...res[1].data];
    const newList = getTransferData(appList);
    let selectedKey = res[0].data.map((item: any) => {
      return item.appCode;
    });
    setTargetKeys(selectedKey);
    setAppList(newList);
  };

  const getTransferData = (data: any) => {
    return data.map((d: any) => {
      return {
        key: d.appCode,
        ...d,
      };
    });
  };

  const leftTableColumns = [
    {
      dataIndex: 'appName',
      title: 'appName',
    },
  ];

  const rightTableColumns = [
    {
      dataIndex: 'appName',
      title: 'appName',
    },
    {
      dataIndex: 'level',
      title: 'level',
      render: (text: string, record: any) => {
        return (
          <>
            <Select
              onMouseEnter={(e) => {
                e.preventDefault();
              }}
              value={record.level}
              options={LevelEnum}
              onChange={(value) => {
                onLevelChange(value, record);
              }}
            />
          </>
        );
      },
    },
  ];

  /**
   * 修改已添加应用的level
   * @param value 选择的level
   * @param record 修改level的data
   */
  const onLevelChange = (value: any, record: any) => {
    let data = JSON.parse(JSON.stringify(appList));
    let newData = data.map((item: any) => {
      if (item.appCode === record.appCode) {
        item.level = value;
      }
      return item;
    });
    setAppList(newData);
  };

  /**
   *
   * @param nextTargetKeys 移动之后选择的key（右边）
   * @param direction 移动的方向
   * @param moveKeys 移动的选项
   */
  const onChange = (nextTargetKeys: any, direction: any, moveKeys: any) => {
    console.log('targetKeys:', nextTargetKeys);
    console.log('direction:', direction);
    console.log('moveKeys:', moveKeys);
    const data = JSON.parse(JSON.stringify(appList));
    const dataFilter = data.map((item: any) => {
      if (nextTargetKeys.includes(item.appCode)) {
        item.level = DEFAULT_LEVEL;
      }
      return item;
    });
    console.log('dataFilter', dataFilter);
    setAppList(dataFilter);
    setTargetKeys(nextTargetKeys);
  };

  /**
   * 提交
   */
  const handleSubmit = async () => {
    const formValue = await form.validateFields();
    const relApps = appList.filter((a: any) => {
      if (targetKeys.includes(a.appCode)) {
        return a;
      }
    });
    const data = {
      envCode,
      regionCode,
      ...formValue,
      relApps,
    };
    if (drawerStatus === 'edit') {
      await updateRegion(data);
      onClose();
    } else {
      await createRegion(data);
      onClose();
    }
    await props.requestRegionList();
  };

  /**
   * 关闭Drawer
   */
  const onClose = () => {
    setVisible(false);
    form.resetFields();
    setRegionCode('');
    setEnvCode('');
    setDrawerStatus('create');
    setAppList([]);
    setTargetKeys([]);
  };

  return (
    <Drawer
      title={TitleEnum[drawerStatus]}
      visible={visible}
      onClose={() => {
        onClose();
      }}
      width={800}
      maskClosable={true}
      className="create-ticket-drawer"
      footer={
        <div className="drawer-footer">
          <Button type="primary" loading={isLoading} onClick={handleSubmit} disabled={drawerStatus == 'view'}>
            保存
          </Button>
          <Button
            type="default"
            onClick={() => {
              onClose();
            }}
          >
            取消
          </Button>
        </div>
      }
    >
      <Form form={form} labelCol={{ flex: '120px' }}>
        <FormItem label="域名" name="regionName" rules={[{ required: true, message: '请输入域名' }]}>
          <Input
            placeholder="请输入域名"
            disabled={drawerStatus == 'view' || drawerStatus == 'edit'}
            style={{ width: 320 }}
          />
        </FormItem>
        <FormItem
          label="域CODE"
          name="regionCode"
          rules={[
            {
              required: true,
              message: '输入的域Code里请不要包含中文',
              pattern: /^[^\u4e00-\u9fa5]*$/,
            },
          ]}
        >
          <Input
            placeholder="请输入域Code(不要包含中文）"
            disabled={drawerStatus == 'view' || drawerStatus == 'edit'}
            style={{ width: 320 }}
            onChange={(e) => {
              setRegionCode(e.target.value);
            }}
          />
        </FormItem>
        <FormItem label="环境" name="envCode" rules={[{ required: true, message: '请选择环境' }]}>
          <Select
            options={envOptions}
            placeholder="请选择"
            style={{ width: 320 }}
            showSearch
            disabled={drawerStatus == 'view' || drawerStatus == 'edit'}
            onChange={(value: any) => {
              setEnvCode(value);
            }}
          />
        </FormItem>
        <FormItem label="备注" name="remark">
          <Input.TextArea placeholder="请输入备注" disabled={drawerStatus == 'view'} />
        </FormItem>
        <FormItem label="选择应用" name="relApps">
          <TableTransfer
            dataSource={appList}
            targetKeys={targetKeys}
            showSearch={true}
            titles={['可添加应用', '已添加应用']}
            filterOption={(inputValue: any, item: any) => item.appName.indexOf(inputValue) !== -1}
            onChange={onChange}
            leftColumns={leftTableColumns}
            rightColumns={rightTableColumns}
            disabled={drawerStatus == 'view'}
          />
        </FormItem>
      </Form>
    </Drawer>
  );
});
export default CreateRegionDrawer;
