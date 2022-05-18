/*
 * @Author: muxi.jth
 * @Date: 2022-04-14 11:20:17
 * @LastEditors: Please set LastEditors
 * @Description: 操作封网Modal
 * @FilePath: /fe-matrix/src/pages/operation/env-manage/env-list/block/index.tsx
 */
import React, { useState, useEffect } from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Spin, Form, Button, Modal, Transfer, Badge, Popconfirm, message } from 'antd';
import { getAppEnvList, blockAppEnv, getApplyWhiteList, applyWhiteList } from '../../service';
import { getRequest, postRequest } from '@/utils/request';
import './index.less';

export interface NGInfo extends Record<string, any> {
  visible: boolean;
  optType: string;
  onClose: () => any;
  initData: any;
}

export default function NGModalDetail(props: NGInfo) {
  const [createBlockForm] = Form.useForm();
  let categoryCurrent: any = [];
  const { visible, onClose, initData, optType } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [ensureLoading, setEnsureLoading] = useState<boolean>(false);
  const [appsListData, setAppsListData] = useState<any>([]);
  const [targetKeys, setTargetKeys] = useState([]); //目标选择的key值
  const [selectedKeys, setSelectedKeys] = useState<any>([]); //已经选择的key值
  const [disabled, setDisabled] = useState<boolean>(false);
  const onChange = (nextTargetKeys: any, direction: any, moveKeys: any) => {
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys: any, targetSelectedKeys: any) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onScroll = (direction: any, e: any) => {};
  let getfilterOption = (inputValue: string, option: any) => option?.title?.indexOf(inputValue) > -1;

  const handleSearch = (dir: any, value: any) => {
    console.log('search:', dir, value);
  };

  useEffect(() => {
    if (initData.envCode) {
      queryAppsListData(initData.envCode);
    }
    return () => {
      setTargetKeys([]);
      setSelectedKeys(undefined);
      setDisabled(false);
    };
  }, [visible]);

  const queryAppsListData = async (envCode: string) => {
    let canAddAppsData: any = []; //可选数据数组
    let alreadyAddAppsData: any = [];
    setLoading(true);
    const getAppListApi = optType === 'block' ? getAppEnvList : getApplyWhiteList;
    await getRequest(getAppListApi, { data: { envCode } })
      .then((res) => {
        if (res?.success) {
          let data = res?.data;
          //如果只存在可选数据，不存在目标数据
          if (data.canBlockedApps && !data.alreadyBlockedApps) {
            data.canBlockedApps?.map((item: any, index: number) => {
              canAddAppsData.push({
                key: index.toString(),
                title: item.appCode,
                appType: item.appType,
              });
            });
            setAppsListData(canAddAppsData); //如果只存在可选数据，则可选数据为整体的总数据源
          }
          //如果已选目标数据存在
          if (data.alreadyBlockedApps) {
            let arry: any = []; //存放整体的数组
            let selectedAppCode: any = []; //已选目标数据数组
            data.canBlockedApps?.map((item: any, index: number) => {
              canAddAppsData.push({
                key: index.toString(),
                title: item.appCode,
                appType: item.appType,
              }); //如果已选目标数据存在，仍旧先取出可选数据
              arry.push({
                key: index.toString(),
                title: item.appCode,
                appType: item.appType,
              });
            }); //存放整体的数组arry中放入目标数据
            data.alreadyBlockedApps?.map((item: any, index: number) => {
              arry.push({
                key: arry.length.toString(),
                title: item.appCode,
                appType: item.appType,
              });
            }); //存放整体的数组arry中继续放入已选数据，此时已选数据的key必须唯一且延续上面的可选数据的key值往下
            let arryData = arry;
            setAppsListData(arryData); //将拿到的整体全部数据放入穿梭框的dataSource源
            let keyArry: any = [];
            canAddAppsData.map((item: any) => {
              keyArry.push(item.key);
            }); //取出可选数据中所有的key值
            arryData?.filter((item: any) => {
              if (keyArry.includes(item.key) === false) {
                // selectedAppCode.push({key:item.key,title:item.title})
                categoryCurrent.push(item.title);
                selectedAppCode.push(item.key);
              }
            }); //从整体数据源中筛选，其中不包含可选数据中所有的key值，即为已选数据，则setState目标数据key数组中,视图渲染
            setTargetKeys(selectedAppCode);
          }
        } else {
          setAppsListData([]);
          setDisabled(true);
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOk = () => {
    let selectedAppCode: any = [];
    createBlockForm.validateFields().then((params) => {
      if (params.categoryCode) {
        appsListData.filter((item: any, index: number) => {
          if (params.categoryCode?.includes(item.key)) {
            selectedAppCode.push(item.title);
          }
        });
      }
      if (categoryCurrent) {
        selectedAppCode.concat(categoryCurrent);
      }
      let addParamsObj = {
        envCode: initData.envCode,
        blockAppCodes: selectedAppCode || [],
      };
      blockAppsEnv(addParamsObj).then(() => {
        onClose();
      });
    });
  };
  const blockAppsEnv = async (addParamsObj: any) => {
    setEnsureLoading(true);
    await postRequest(blockAppEnv, { data: addParamsObj })
      .then((res) => {
        if (res?.success) {
          message.success('封网成功！');
        } else {
          return;
        }
      })
      .finally(() => {
        setEnsureLoading(false);
      });
  };

  return (
    <Modal
      title={optType === 'block' ? '查看封网详情' : '查看发布审批详情'}
      visible={visible}
      width={820}
      onCancel={() => {
        onClose();
      }}
      footer={[
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            onClose();
          }}
        >
          关闭
        </Button>,
        <Popconfirm
          title="确定要对这些应用进行操作吗？"
          onConfirm={handleOk}
          okText="确定"
          cancelText="取消"
          placement="topRight"
          disabled={disabled}
        >
          <Button type="primary" danger loading={ensureLoading}>
            执行
          </Button>
        </Popconfirm>,
      ]}
    >
      <div className="block-data-info">
        <CheckCircleOutlined style={{ color: 'green' }} />
        <span style={{ marginLeft: 10, fontSize: 14 }}>
          <b>
            当前环境：{initData.envName}
            <span style={{ marginLeft: 6 }}>({initData.envCode})</span>
          </b>
        </span>
      </div>
      <Spin spinning={loading}>
        <Form form={createBlockForm}>
          <Form.Item label="选择应用" name="categoryCode" noStyle>
            <Transfer
              dataSource={appsListData}
              titles={['未封网应用', '已封网应用']}
              targetKeys={targetKeys}
              showSearch
              filterOption={getfilterOption}
              selectedKeys={selectedKeys}
              onChange={onChange}
              onSelectChange={onSelectChange}
              onScroll={onScroll}
              //   disabled={ensureDisabled}
              onSearch={handleSearch}
              render={(item) => (
                <div className="transfer-text">
                  {item.appType === 'backend' ? (
                    <Badge.Ribbon placement="end" text="后端">
                      <span className="transfer-text-backend" title={item.title}>
                        {item.title || ''}
                      </span>
                    </Badge.Ribbon>
                  ) : (
                    <Badge.Ribbon text="前端" color="cyan">
                      <span className="transfer-text-fronted" title={item.title}>
                        {item.title || ''}
                      </span>
                    </Badge.Ribbon>
                  )}
                </div>
              )}
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}
