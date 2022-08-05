// 新增环境抽屉页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/10/25 18:30
import { getRequest, postRequest, putRequest } from '@/utils/request';
import { useState, useEffect } from 'react';
import { Drawer, Input, Button, Form, Select, Space, message, Switch, Divider, Radio, Tag } from 'antd';
import { EnvEditData } from '../env-list/index';
import { createEnv, appTypeList, updateEnv, queryNGList } from '../service';
import { envTypeCodeOptions, envTypeOptions } from './schema';
import './index.less';
import { parseParam } from '@/common/util';
export interface EnvEditorProps {
  mode?: EditorMode;
  initData?: EnvEditData;
  onSave: () => any;
  onClose: () => any;
}

export default function AddEnv(props: EnvEditorProps) {
  const [createEnvForm] = Form.useForm();
  const { mode, initData, onSave, onClose } = props;
  const [checkedOption, setCheckedOption] = useState<number>(0); //是否启用nacos
  const [nacosChecked, setNacosChecked] = useState<boolean>(false);
  const [needApplyOption, setNeedApplyOption] = useState<number>(1); //是否启用发布审批
  const [needApplyChecked, setNeedApplyChecked] = useState<boolean>(false);
  const [isBlockChangeOption, setIsBlockChangeOption] = useState<number>(0); //是否封网
  const [isBlockChecked, setIsBlockChecked] = useState<boolean>(false);
  const [categoryData, setCategoryData] = useState<any[]>([]); //应用分类
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [editEnvCode, setEditEnvCode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isUseMinio, setIsUseMinio] = useState<boolean>(false);
  const [curEnvType, setCurEnvType] = useState<string>('');
  useEffect(() => {
    selectCategory();
  }, [mode]);

  useEffect(() => {
    if (mode === 'HIDE') return;
    queryNGlist();
    createEnvForm.resetFields();
    if (mode === 'VIEW') {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
    if (mode === 'EDIT') {
      setEditEnvCode(true);
    }
    if (initData) {
      const minio = JSON.parse(initData.minioInfo || '{}');
      setIsUseMinio(minio?.useMinio || false);
      if (initData?.isBlock === 1) {
        setIsBlockChecked(true);
        setIsBlockChangeOption(1);
      } else {
        setIsBlockChecked(false);
        setIsBlockChangeOption(0);
      }

      if (initData?.useNacos === 1) {
        setNacosChecked(true);
        setCheckedOption(1);
      } else {
        setNacosChecked(false);
        setCheckedOption(0);
      }
      if (initData?.needApply === 0) {
        setNeedApplyChecked(true);
        setNeedApplyOption(0);
      } else {
        setNeedApplyChecked(false);
        setNeedApplyOption(1);
      }

      createEnvForm.setFieldsValue({
        ...initData,

        bucketName: minio.bucketName || '',
        sourceMapBkt: minio.sourceMapBkt || '',
        useMinio: minio.useMinio || false,
        isBlock: isBlockChecked,
        useNacos: nacosChecked,
        needApply: needApplyChecked,
        envCode: initData?.envCode.includes('fe-') ? initData?.envCode.slice(3) : initData?.envCode,
      });
      setCurEnvType(initData?.envModel);
    }
  }, [mode]);
  // 加载应用分类下拉选择
  const selectCategory = () => {
    getRequest(appTypeList).then((result) => {
      if (result?.success) {
        const list = (result?.data?.dataSource || [])?.map((n: any) => ({
          label: n.categoryName,
          value: n.categoryCode,
          data: n,
        }));
        setCategoryData(list);
      } else {
        return;
      }
    });
  };
  // 启用发布审批为0，不启用为1
  const handleNeedApplyChange = (checked: boolean) => {
    if (checked === true) {
      setNeedApplyChecked(true);
      setNeedApplyOption(0);
    } else {
      setNeedApplyChecked(false);
      setNeedApplyOption(1);
    }
  };
  //启用配置管理选择
  const handleNacosChange = (checked: boolean) => {
    if (checked === true) {
      setCheckedOption(1);
      setNacosChecked(true);
    } else {
      setCheckedOption(0);
      setNacosChecked(false);
    }
  };
  //是否封网
  const isBlockChange = (checked: boolean) => {
    if (checked === true) {
      setIsBlockChangeOption(1);
      setIsBlockChecked(true);
    } else {
      setIsBlockChangeOption(0);
      setIsBlockChecked(false);
    }
  };

  //查询NG实例
  const [ngInstOptions, setNgInstOptions] = useState<any>([]);
  const queryNGlist = () => {
    getRequest(queryNGList).then((res) => {
      if (res?.success) {
        let data = res?.data?.dataSource;
        let ngList = data?.map((el: any) => ({
          label: el?.ngInstName,
          value: el?.ngInstCode,
        }));
        setNgInstOptions(ngList);
      }
    });
  };
  const handleSubmit = () => {
    setLoading(true);
    if (mode === 'ADD') {
      //新增环境
      createEnvForm.validateFields().then((params) => {
        const minioInfo = {
          useMinio: isUseMinio,
          bucketName: params?.bucketName || '',
          sourceMapBkt: params.sourceMapBkt || '',
        };
        postRequest(createEnv, {
          data: {
            ...params,
            envCode: curEnvType === 'fe-exclusive' ? `fe-${params?.envCode}` : params?.envCode,

            isBlock: isBlockChangeOption,
            useNacos: checkedOption,
            needApply: needApplyOption,
            proEnvType: 'benchmark',

            minioInfo: JSON.stringify(minioInfo),
          },
        })
          .then((result) => {
            if (result.success) {
              message.success('新增环境成功！');
              onSave?.();
            } else {
              // message.error(result.errorMsg);
            }
          })
          .finally(() => {
            setLoading(false);
          });
      });
    } else if (mode === 'EDIT') {
      //编辑环境
      createEnvForm.validateFields().then((params) => {
        const minioInfo = {
          useMinio: isUseMinio,
          bucketName: params?.bucketName || '',
          sourceMapBkt: params?.sourceMapBkt || '',
        };
        putRequest(updateEnv, {
          data: {
            ...params,
            // envCode: `fe-${params?.envCode}`,
            envCode: curEnvType === 'fe-exclusive' ? `fe-${params?.envCode}` : params?.envCode,
            useMinio: undefined,
            bucketName: undefined,
            sourceMapBkt: undefined,
            minioInfo: JSON.stringify(minioInfo),
            useNacos: checkedOption,
            isBlock: isBlockChangeOption,
            needApply: needApplyOption,
            proEnvType: 'benchmark',
          },
        })
          .then((result) => {
            if (result.success) {
              message.success('编辑环境成功！');
              onSave?.();
            } else {
              // message.error(result.errorMsg);
            }
          })
          .finally(() => {
            setLoading(false);
          });
      });
    }
  };

  return (
    <Drawer
      visible={mode !== 'HIDE'}
      title={mode === 'EDIT' ? '编辑环境' : mode === 'VIEW' ? '查看环境' : '新增环境'}
      onClose={onClose}
      width={'40%'}
    >
      <div className="envAdd">
        <Form
          form={createEnvForm}
          labelCol={{ flex: '140px' }}
          onFinish={handleSubmit}
          onReset={() => {
            createEnvForm.resetFields();
          }}
        >
          <Form.Item label="环境大类：" name="envTypeCode" rules={[{ required: true, message: '这是必填项' }]}>
            <Radio.Group disabled={isDisabled} options={envTypeCodeOptions} />
          </Form.Item>
          <Form.Item label="环境类型：" name="envModel" rules={[{ required: true, message: '这是必填项' }]}>
            <Radio.Group
              disabled={mode !== 'EDIT' ? isDisabled : editEnvCode}
              options={envTypeOptions}
              onChange={(e) => setCurEnvType(e.target.value)}
            />
          </Form.Item>
          <div>
            <Form.Item label="环境名：" name="envName" rules={[{ required: true, message: '这是必填项' }]}>
              <Input style={{ width: 220 }} placeholder="请输入环境名" disabled={isDisabled}></Input>
            </Form.Item>
          </div>
          <div>
            {curEnvType === 'fe-exclusive' ? (
              <Form.Item label="环境CODE：" name="envCode" rules={[{ required: true, message: '这是必填项' }]}>
                <Input
                  addonBefore="fe-"
                  autoFocus
                  style={{ width: 220 }}
                  placeholder="请输入环境CODE"
                  disabled={mode !== 'EDIT' ? isDisabled : editEnvCode}
                ></Input>
              </Form.Item>
            ) : (
              <Form.Item label="环境CODE：" name="envCode" rules={[{ required: true, message: '这是必填项' }]}>
                <Input
                  style={{ width: 220 }}
                  placeholder="请输入环境CODE"
                  disabled={mode !== 'EDIT' ? isDisabled : editEnvCode}
                ></Input>
              </Form.Item>
            )}
          </div>
          <Form.Item label="当前环境：">
            <Tag color="geekblue">基准环境</Tag>
          </Form.Item>
          <div>
            <Form.Item label="默认分类：" name="categoryCode" rules={[{ required: true, message: '这是必选项' }]}>
              <Select showSearch style={{ width: 150 }} options={categoryData} disabled={isDisabled} />
            </Form.Item>
          </div>
          <div>
            <Form.Item name="mark" label="备注：">
              <Input.TextArea
                placeholder="请输入"
                style={{ width: 480, height: 80 }}
                disabled={isDisabled}
              ></Input.TextArea>
            </Form.Item>
          </div>
          <Divider />
          <div>
            <Form.Item name="isBlock" label="是否封网：">
              <Switch
                className="isBlock"
                onChange={isBlockChange}
                checked={isBlockChecked}
                disabled={isDisabled}
              ></Switch>
            </Form.Item>
            <Form.Item name="needApply" label="启用发布审批：">
              <Switch
                className="needApply"
                onChange={handleNeedApplyChange}
                checked={needApplyChecked}
                disabled={isDisabled}
              ></Switch>
            </Form.Item>
            <Form.Item name="useNacos" label="启用配置管理：">
              <Switch
                className="useNacos"
                onChange={handleNacosChange}
                checked={nacosChecked}
                disabled={isDisabled}
              ></Switch>
            </Form.Item>
            {mode !== 'ADD' && checkedOption === 1 && (
              <Form.Item name="nacosAddress" label="Nacos地址：">
                <Input style={{ width: 280 }} placeholder="请输入NaCos地址" disabled={isDisabled}></Input>
              </Form.Item>
            )}
            {mode === 'ADD' && checkedOption === 1 && (
              <Form.Item name="nacosAddress" label="Nacos地址：">
                <Input style={{ width: 280 }} placeholder="请输入NaCos地址" disabled={isDisabled}></Input>
              </Form.Item>
            )}
          </div>
          {/* <Form.Item name="bucketName" label="Minio Bucket名称">
            <Input style={{ width: 280 }} disabled={isDisabled} />
          </Form.Item> */}

          <Form.Item name="ngInstCode" label="NG实例">
            <Select showSearch style={{ width: 280 }} options={ngInstOptions} disabled={isDisabled} allowClear />
          </Form.Item>
          <Form.Item name="clusterName" label="集群名称" rules={[{ required: true, message: '这是必填项' }]}>
            <Input placeholder="请输入集群名称" style={{ width: 280 }} disabled={isDisabled}></Input>
          </Form.Item>
          <Form.Item label="集群类型:" name="clusterType" rules={[{ required: true, message: '这是必填项' }]}>
            <Radio.Group disabled={isDisabled}>
              <Radio value={'vm'}>虚拟机</Radio>
              <Radio value={'k8s'}>kubernetes</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="集群网络类型:" name="clusterNetType" rules={[{ required: true, message: '这是必填项' }]}>
            <Radio.Group disabled={isDisabled}>
              <Radio value={'vpc'}>私有环境(VPC)</Radio>
              <Radio value={'public'}>公有环境(Public)</Radio>
            </Radio.Group>
          </Form.Item>
          <Divider />
          <Form.Item label="是否使用Minio" name="useMinio">
            <Switch
              disabled={isDisabled}
              checked={isUseMinio}
              onChange={(v) => {
                setIsUseMinio(v);
              }}
            ></Switch>
          </Form.Item>
          {isUseMinio && (
            <>
              <Form.Item
                label="资源文件Bucket"
                name="bucketName"
                rules={[{ required: isUseMinio ? true : false, message: '这是必填项' }]}
              >
                <Input style={{ width: 280 }} placeholder="请输入资源文件Bucket" disabled={isDisabled}></Input>
              </Form.Item>
              <Form.Item
                label="sourceMapBucket"
                name="sourceMapBkt"
                rules={[{ required: isUseMinio ? true : false, message: '这是必填项' }]}
              >
                <Input style={{ width: 280 }} placeholder="请输入sourceMapBucket" disabled={isDisabled}></Input>
              </Form.Item>
            </>
          )}
          <Divider />
          {isDisabled !== true && (
            <Space size="small" style={{ marginTop: '50px', float: 'right' }}>
              <Form.Item>
                <Button type="ghost" htmlType="reset" danger onClick={onClose}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit" style={{ marginLeft: '4px' }} loading={loading}>
                  保存
                </Button>
              </Form.Item>
            </Space>
          )}
        </Form>
      </div>
    </Drawer>
  );
}
