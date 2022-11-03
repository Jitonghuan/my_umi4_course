import React, { useEffect, useState, useMemo, useContext, useRef } from 'react';
import { Form, Button, Table, Select, message, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { history, useLocation } from 'umi';
import { resourceDetailTableSchema } from './schema';
import clusterContext from '../context';
import CreateYaml from './create-yaml';
import YamlDetail from './yaml-detail';
import Page from '../component/page';
import { useNodeListData } from '../hook';
import { getResourceList, resourceDel, resourceUpdate, searchYaml } from '../service';
import { useResourceType, useNameSpace } from '../hook';
import debounce from 'lodash/debounce';
import { parse, stringify } from 'query-string';
import { FeContext } from '@/common/hooks';


import './index.less';
export default function ResourceDetail(props: any) {
  let location: any = useLocation();
  const query = parse(location.search);
  // const { location, children } = props;
  let sessionData = sessionStorage.getItem('cluster_resource_params') || '{}';
  const { clusterCode } = useContext(clusterContext);
  const { btnPermission } = useContext(FeContext);
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [yamlDetailVisible, setYamlDetailVisible] = useState(false);
  const [createYamlVisible, setCreateYamlVisbile] = useState(false);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [storeParams, setStoreParams] = useState<any>(
    sessionData && JSON.parse(sessionData)[clusterCode]
      ? JSON.parse(sessionData)[clusterCode]
      : {},
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [continueList, setContinueList] = useState<string[]>(['']);
  const [total, setTotal] = useState<number>(0);
  const [typeData] = useResourceType({});
  const [typeOptions, setTypeOptions] = useState<any>([]);
  const [nameSpaceData] = useNameSpace({ clusterCode, resourceType: 'namespaces' });
  const [currentRecord, setCurrentRecord] = useState<any>({});
  const [originData, setOriginData] = useState<any>([]);
  const [nodeList, setNodeList] = useState<any>([]);
  const [selectType, setSelectType] = useState<string>('');
  const [data] = useNodeListData({ clusterCode: clusterCode || '' });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [allData, setAllData] = useState<any>([]);//全量数据 用于搜索
  const [allLoading, setAllLoading] = useState(false);
  const [showPage, setShowPage] = useState(true);
  useEffect(() => {
    const dataList = data.map((item: any) => ({ label: item.nodeName, value: item.nodeName }));
    setNodeList(dataList);
  }, [data]);

  const canAdd = useMemo(() => btnPermission.includes('matrix:cluster:resource:add'), [btnPermission])

  const searchValueInput = useRef(null) as any;
  // 表格列配置
  const tableColumns = useMemo(() => {
    const showIp = dataSource.find((e: any) => e.type === 'pods')
    return resourceDetailTableSchema({
      handleDetail: (record: any, index: any) => {

        const query: any = parse(location.search);
        if (record.type === 'pods') {
          history.push({
            pathname: '/matrix/pedestal/cluster-detail/pods',
            search: stringify(Object.assign(query, {
              name: record.name,
              namespace: record.namespace,
              kind: record.kind,
              type: '',
            })),
          });
        } else if (['configmaps', 'secrets'].includes(record.type)) {
          history.push({
            pathname: '/matrix/pedestal/cluster-detail/detail',
            search: stringify(Object.assign(query, {
              kind: record?.kind,
              type: record?.type,
              namespace: record?.namespace,
              name: record?.name,
            }))
          })
        } else {
          history.push({
            pathname: '/matrix/pedestal/cluster-detail/load-detail',
            search: stringify(Object.assign(query, {
              name: record.name,
              namespace: record.namespace,
              kind: record.kind,
              type: record?.type,
              key: 'resource-detail'
            })),
          });
        }
      },
      rePublic: async (record: any, index: any, updateColumn: string) => {
        updateResource(record, updateColumn);
      },
      stop: async (record: any, index: any, updateColumn: string) => {
        updateResource(record, updateColumn);
      },
      handleYaml: (record: any, index: any) => {
        setUpdateLoading(true);
        searchYaml({
          clusterCode,
          resourceType: record?.type,
          namespace: record?.namespace,
          resourceName: record?.name,
        })
          .then((res: any) => {
            if (res?.success) {
              setCurrentRecord({ yaml: res?.data || '', name: record?.name });
              setYamlDetailVisible(true);
            }
          })
          .finally(() => {
            setUpdateLoading(false);
          });
      },
      handleDelete: (record: any, index: any) => {
        const { type, name, namespace } = record;
        setUpdateLoading(true);
        resourceDel({ resourceType: type, resourceName: name, namespace, clusterCode })
          .then((res) => {
            if (res?.success) {
              message.success('删除成功！');
              initialSearch();
            }
          })
          .finally(() => {
            setUpdateLoading(false);
          });
      },
    }).filter((col: any) => !(Array.isArray(col.dataIndex) && col.dataIndex[1] === 'ip') || showIp);
  }, [dataSource]);

  useEffect(() => {
    if (pageIndex === 1) {
      setContinueList(['']);
    }
    queryList();
    // queryAll();
  }, [pageIndex, limit]);

  useEffect(() => {
    if (typeData && typeData.length !== 0) {
      setTypeOptions(typeData);
    }
  }, [typeData]);

  useEffect(() => {
    setStoreParams(JSON.parse(sessionData)[clusterCode])
  }, [clusterCode])

  useEffect(() => {
    if (nameSpaceData?.length !== 0 && typeData?.length !== 0) {
      form.setFieldsValue({
        namespace: storeParams?.namespace || nameSpaceData[0].value,
        resourceType: storeParams?.resourceType || 'deployments',
        node: storeParams?.node || '',
      });
      setSelectType(storeParams?.resourceType || 'deployments');
      queryList(undefined, storeParams);
      queryAll(storeParams);
    } else {
      setDataSource([])
    }
  }, [nameSpaceData, typeData]);

  // useEffect(() => {
  //     const interVal = setInterval(() => { initialSearch() }, 1000 * 60)
  //     return () => { clearInterval(interVal) }
  // }, [])

  const queryList = (index = pageIndex, values = form.getFieldsValue()) => {
    if (!values.resourceType) {
      return;
    }
    setLoading(true);
    let a = index === 1 ? '' : continueList[index - 2];
    getResourceList({ ...values, index, nodeName: values.node, limit: limit, continue: a, clusterCode })
      .then((res: any) => {
        if (res?.success) {
          setDataSource(res?.data?.items || []);
          setOriginData(res?.data?.items || []);
          if (index === 1) {
            setTotal(res?.data?.total || 0);
          }
          continueList[index - 1] = res?.data?.continue || '';
          setContinueList([...continueList]);
        } else {
          setDataSource([]);
          setOriginData([]);
          setTotal(0);
          setPageIndex(1);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  // 请求全量数据
  const queryAll = (values = form.getFieldsValue()) => {
    if (!values.resourceType) {
      return;
    }
    setAllData([]);
    getResourceList({ ...values, nodeName: values.node, limit: '', clusterCode })
      .then((res: any) => {
        if (res?.success) {
          setAllData(res?.data?.items || []);
        } else {
          setAllData([]);
        }
      }).finally(() => { setAllLoading(false) })
  }

  const updateResource = (record: any, updateColumn: string) => {
    const { type, namespace, name, info } = record || {};
    const infoData = JSON.parse(JSON.stringify(info || {}));
    infoData[updateColumn] = !infoData[updateColumn];
    setUpdateLoading(true);
    resourceUpdate({
      resourceType: type,
      namespace,
      clusterCode,
      resourceName: name,
      updateBody: JSON.stringify(infoData),
    })
      .then((res) => {
        if (res?.success) {
          message.success('操作成功！');
          initialSearch();
        }
      })
      .finally(() => {
        setUpdateLoading(false);
      });
  };

  const clickLeft = () => {
    setPageIndex(pageIndex - 1);
  };

  const clickRright = () => {
    setPageIndex(pageIndex + 1);
  };

  const filter = debounce((value) => filterData(value), 500)

  const filterData = (value: string, update = true) => {
    if (!value) {
      setShowPage(true);
      setDataSource(originData);
      return;
    }
    setShowPage(false)
    // if (value && !allData.length) {
    //   setAllLoading(true)
    // }
    const data = JSON.parse(JSON.stringify(allData));
    const afterFilter: any = [];
    data.forEach((item: any) => {
      console.log((item?.type === 'pods' && item?.info?.ip?.indexOf(value) !== -1), 'judge')
      if (item.name?.indexOf(value) !== -1 || (item?.type === 'pods' && item?.info?.ip?.indexOf(value) !== -1)) {
        afterFilter.push(item);
      }
    });
    setDataSource(afterFilter);
  }


  const onSave = () => {
    setCreateYamlVisbile(false);
    initialSearch();
  };

  const initialSearch = () => {
    if (searchValueInput.current) {
      searchValueInput.current.value = ('');
    }
    setShowPage(true);
    setPageIndex(1);
    setContinueList(['']);
    queryList(1);
    queryAll();
  };

  const pageChange = (v: any) => {
    setLimit(v);
  };

  return (
    <div className="cluster-resource-detail">
      <CreateYaml
        visible={createYamlVisible}
        onClose={() => {
          setCreateYamlVisbile(false);
        }}
        onSave={onSave}
      ></CreateYaml>
      <YamlDetail
        visible={yamlDetailVisible}
        onClose={() => {
          setYamlDetailVisible(false);
        }}
        initData={currentRecord}
        onSave={() => {
          setYamlDetailVisible(false);
          initialSearch()
        }}
      ></YamlDetail>
      <div className="search-form">
        <Form
          layout="inline"
          onFinish={(value) => {
            sessionStorage.setItem('cluster_resource_params', JSON.stringify({ ...JSON.parse(sessionData), [clusterCode]: value } || {}));
            setStoreParams(value);
            initialSearch();
          }}
          form={form}
          onReset={() => {
            form.setFieldsValue({ resourceType: 'deployments', namespace: '' });
            sessionStorage.setItem('cluster_resource_params', JSON.stringify({ ...JSON.parse(sessionData), [clusterCode]: form.getFieldsValue() } || {}));
            setSelectType('deployments');
            initialSearch();
          }}
        >
          <Form.Item label="资源类型" name="resourceType" rules={[{ required: true, message: '请选择查询关键词' }]}>
            <Select
              style={{ width: 200 }}
              options={typeOptions}
              showSearch
              value={selectType}
              onChange={(value: any) => {
                setSelectType(value);
              }}
              optionFilterProp="label"
              filterOption={(input, option) => {
                return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
            ></Select>
          </Form.Item>
          {selectType !== 'namespaces' && (
            <Form.Item label="命名空间" name="namespace">
              <Select
                style={{ width: 200 }}
                options={nameSpaceData}
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) => {
                  return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
              ></Select>
            </Form.Item>
          )}
          {selectType === 'pods' && (
            <Form.Item label="节点名称" name="node">
              <Select
                style={{ width: 200 }}
                allowClear
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) => {
                  return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                options={nodeList}
              ></Select>
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <Button htmlType="reset">
              重置
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="table-caption">
        <div className="caption-left">
          <h3>资源列表</h3>
        </div>
        <div className="caption-right">
          搜索
          <Tooltip title='pods类型支持名称/IP搜索,其他类型只支持按名称搜索' placement="top">
            <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
          </Tooltip>
          ：
          <input
            ref={searchValueInput}
            style={{ width: 200 }}
            className="ant-input ant-input-sm"
            onChange={(e) => {
              filter(e.target.value)
            }}
            disabled={!allData?.length}
          ></input>
          {canAdd && <Button
            type="primary"
            onClick={() => {
              setCreateYamlVisbile(true);
            }}
            size="small"
            style={{ marginLeft: '10px' }}
          >
            创建资源
          </Button>}
        </div>
      </div>
      <div className="table-wrapper">
        <Table
          dataSource={dataSource}
          // dataSource={mockData}
          loading={loading || updateLoading || allLoading}
          bordered
          rowKey="id"
          pagination={false}
          columns={tableColumns}
        // scroll={dataSource.length > 0 ? { x: 18000 } : undefined}
        ></Table>
        <div className="flex-end" style={{ marginTop: '10px' }}>
          {showPage && <Page
            continueList={continueList}
            clickLeft={clickLeft}
            total={total}
            pageIndex={pageIndex}
            totalPage={limit ? Math.ceil(total / limit) : 1}
            clickRright={clickRright}
            pageChange={pageChange}
            defaultValue={20}
          />}
        </div>
      </div>
    </div>
  );
}
