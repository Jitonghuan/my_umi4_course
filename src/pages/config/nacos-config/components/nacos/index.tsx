import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Form, Input, Modal, Button, Space, Table, Spin, Empty, Upload, message, Select ,Popconfirm,Divider} from 'antd';
import { UploadOutlined, CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { createTableColumns, policyTypeOptions } from './schema';
import DetailContext from '../../context';
import { getNacosNamespaces } from '../namespace/hook';
import { getConfigList, useDeleteNamespace } from './hook';
import CreateConfig from './create-config';
import { importNacosConfigApi, exportNacosConfigApi,exportAllNacosConfigApi } from '../../../service'
import './index.less';

export default function Nacos() {
  const [form] = Form.useForm();
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { envCode, tabKey } = useContext(DetailContext);
  const [namespaces, setNamespaces] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [curNamespace, setCurNamespace] = useState<string>("");
  const [curNamespaceData, setCurNamespaceData] = useState<any>({});//当前选中的namespace数据
  const [mode, setMode] = useState<EditorMode>('HIDE');
  const [curRecord, setcurRecord] = useState<any>({});//当前table一行数据
  const [isClick, setIsClick] = useState<number>();
  const [tabelLoading, setTableLoading] = useState<boolean>(false);
  const [tableSource, setTableSource] = useState<any>([]);
  const [delLoading, deleteNamespace] = useDeleteNamespace();
  const [importVisible, setImportVisible] = useState(false);
  const [policyType, setPolicyType] = useState<string>(policyTypeOptions[0].value);
  const [downloadDisabled, setDownloadDisabled] = useState<boolean>(false);
  const [downloadAllDisabled, setDownloadAllDisabled] = useState<boolean>(false);
  const [importResult,setImportResult]=useState<any>({})
  const getNacosConfigDataSource = (params: { namespaceId: string, dataId?: string, groupId?: string, pageIndex?: number, pageSize?: number }) => {
    setTableLoading(true)
    //@ts-ignore
    getConfigList({
      envCode: envCode || "",
      ...params
    }).then((result: any) => {
      setTableSource(result?.dataSource || [])
      setTotal(result?.pageInfo?.total);
      setPageIndex(result?.pageInfo?.pageIndex);
      setPageSize(result?.pageInfo?.pageSize)

    }).finally(() => {
      setTableLoading(false)
    })

  }
  useEffect(() => {
    if (envCode) {
      getTableSource()
    }


  }, [envCode, tabKey])
  const getTableSource = () => {
    setLoading(true)
    getNacosNamespaces(envCode || "").then((res) => {
      let data = res?.slice(0)
      let typeIndex = -1
      data?.map((ele: any, index: number) => {
        if (ele?.type === 0) {
          typeIndex = index
        }
      })
      if (typeIndex !== -1) {
        res.splice(typeIndex, 1)
        setNamespaces([data[typeIndex], ...res])

        setCurNamespace(data[1]?.namespaceShowName)
        setIsClick(data[1]?.namespaceShowName);
        setCurNamespaceData(data[1])
        let params = form.getFieldsValue()
        getNacosConfigDataSource({ namespaceId: data[1]?.namespaceId ,...params})
      } else {
        setNamespaces(res)
        setCurNamespace(res[0]?.namespaceShowName)
        setCurNamespaceData(res[0])
        setIsClick(res[0]?.namespaceShowName);
        let params = form.getFieldsValue()
        getNacosConfigDataSource({ namespaceId: res[0]?.namespaceId ,...params})
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  const columns = useMemo(() => {
    return createTableColumns({
      onEdit: (record, index) => {
        setcurRecord(record)
        setMode("EDIT")
      },
      onView: (record, index) => {
        setcurRecord(record)
        setMode("VIEW")

      },
      onDelete: (record, index) => {
        let params = form.getFieldsValue()
        deleteNamespace({ envCode: envCode || "", namespaceId: curNamespaceData?.namespaceId, nacosIds: [record.nacosId] }).then(() => {
          getNacosConfigDataSource({ ...params, namespaceId: curNamespaceData?.namespaceId })
        }).then(() => {
          setSelectedRowKeys([])
        })
      }

    }) as any;
  }, [envCode, curNamespaceData?.namespaceId]);

  const pageSizeClick = (pagination: any) => {
    setPageIndex(pagination.current);
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    let params = form.getFieldsValue()
    getNacosConfigDataSource({ ...obj, ...params, namespaceId: curNamespaceData?.namespaceId })

  };
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
  
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  const uploadFiles = () => {
    return `${importNacosConfigApi}?envCode=${envCode}&namespaceId=${curNamespaceData?.namespaceId}&policy=${policyType}`;
  };
  const uploadProps = {
    name: 'uploadFile',
    action: uploadFiles,
    maxCount: 1,
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent: any) => `${parseFloat(percent.toFixed(2))}%`,
      showInfo: '上传中请不要关闭弹窗',
    },

    beforeUpload: (file: any, fileList: any) => {
      return new Promise((resolve, reject) => {
        Modal.confirm({
          title: '操作提示',
          content: `确定要上传文件：${file.name}进行配置导入吗？`,
          onOk: () => {
            return resolve(file);
          },
          onCancel: () => {
            return reject(false);
          },
        });
      });
    },
    onChange: (info: any) => {
      if (info.file.status === 'uploading') {
      }
      if (info.file.status === 'done' && info.file?.response.success) {
        setImportResult(info.file?.response?.data)
        let importResult=info.file?.response?.data
        Modal.info({
          title: '导入结果',
          width:790,
          content: (
            <div>
              <p>导入成功条目：<span className="import-result-count-sucess">{importResult?.succCount}</span></p>
              <p>未处理的条目：<span className="import-result-count-skip">{importResult?.skipCount}</span></p>
              <p>未识别的条目：<span className="import-result-count-unrecognized">{importResult?.unRecognizedCount}</span></p>
              <Divider />
              {importResult?.failData&&(
                <>
                <p> 导入失败条目：</p>
                <Table dataSource={importResult?.failData}>
                  <Table.Column dataIndex="dataId" title="DataId" />
                  <Table.Column dataIndex="groupId" title="GroupId" />
                </Table>
              </>

              )}
                {importResult?.skipData&&(
                <>
                 <p> 未处理的条目：</p>
                <Table dataSource={importResult?.skipData}>
                  <Table.Column dataIndex="dataId" title="DataId" />
                  <Table.Column dataIndex="groupId" title="GroupId" />
                </Table>
              </>

              )}
              {importResult?.unRecognizedData&&(
               <p>
               <p>未识别的条目：</p>
               <ul>
               {importResult?.unRecognizedData?.map((item:any)=>{
                   return(<>
                    <li style={{listStyleType:"disc"}}>{item}</li>
                   </>)
                 })}
               </ul>
              
              
            
               </p>
              )}
              
            </div>
          ),
          okText:"确定",
          onOk() {
        setImportVisible(false);
        let params = form.getFieldsValue()
        getNacosConfigDataSource({ ...params, namespaceId: curNamespaceData?.namespaceId })
          },
        });
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);

      } else if (info.file?.response?.success === false) {
        message.error({
          content: <>{info.file.response?.errorMsg}<CloseOutlined onClick={() => { message.destroy('upload') }} style={{ marginLeft: '10px', color: '#c6c4c4' }} /></>,
          duration: 0,
          key: 'upload',
        })
        setImportVisible(false)

      } else if (info.file.status === 'removed') {
        message.warning('上传取消！');
      }
    },
  };
 
  return (<>
    <CreateConfig
      mode={mode}
      initData={curRecord}
      envCode={envCode || ""}
      namespaceId={curNamespaceData?.namespaceId}
      onClose={() => setMode('HIDE')}
      onSave={() => {
        let params = form.getFieldsValue()
        getNacosConfigDataSource({
          ...params, namespaceId: curNamespaceData?.namespaceId, pageSize: pageSize,
          pageIndex: pageIndex
        })
        setMode('HIDE')
      }}

    />
    <Modal title="导入配置" destroyOnClose visible={importVisible} footer={false} onCancel={() => {
      setImportVisible(false)
    }}>
      <div>
        <div className="target-namespace">
          <p ><span >目标空间：</span><span className="target-namespace-name">{curNamespaceData?.namespaceShowName}</span>{curNamespaceData?.namespaceId && <span style={{ marginLeft: 10, color: "gray" }}>|</span>} <span> {curNamespaceData?.namespaceId}</span></p>

        </div>
        <div className="same-config">
          <span>相同配置:</span>
          <span style={{ marginLeft: 10 }}><Select options={policyTypeOptions} style={{ width: 220 }} defaultValue={policyTypeOptions[0].value} onChange={(value) => { setPolicyType(value) }} /></span>
        </div>
        <div className="upload-config-tooltip"><InfoCircleOutlined style={{ color: "orange" }} />文件上传后将直接导入配置，请务必谨慎操作！</div>
        <div className="upload-config-opt">
          <Upload {...uploadProps} accept=".zip">
            <Button icon={<UploadOutlined />} type="primary" ghost>
              上传文件
                  </Button>
          </Upload>
        </div>
      </div>



    </Modal>

    {/* <ContentCard > */}
    <div className="nacos-wrapper">
      <div className="nacos-content-top-wrap">
        <div className="namespace-items">
          <Spin spinning={loading}>
            {namespaces?.map((item: any, index: number) => {
              return (
                <>
                  <span
                    key={item?.namespaceShowName}
                    className={item?.namespaceShowName === isClick ? 'all-namespaces__onClick' : "all-namespaces__unClick"}
                    onClick={() => {
                      let params = form.getFieldsValue()
                      setIsClick(item?.namespaceShowName);
                      setCurNamespace(item?.namespaceShowName)
                      setCurNamespaceData(item)

                      getNacosConfigDataSource({ namespaceId: item?.namespaceId,...params })
                    }}
                  >{item?.namespaceShowName}</span>
                  {index !== namespaces?.length - 1 && <span style={{ marginLeft: 10 }}>|</span>}
                </>
              )

            })}

          </Spin>

        </div>

      </div>
      {!curNamespace && (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"请先选择namespace"} />
      )}
      {curNamespace && (<>
        <div className="nacos-content-bottom-wrap">
          <div className="namesapce-title">
            <span>当前namespace：</span> <span>{curNamespaceData?.namespaceShowName}</span>{curNamespaceData?.namespaceId && <span style={{ marginLeft: 10, color: "gray" }}>|</span>} <span> {curNamespaceData?.namespaceId}</span>
          </div>
          <div className="search-form">
            <Form layout="inline" form={form} onFinish={(values) => {
              setPageIndex(pageIndex);
              getNacosConfigDataSource({
                ...values,
                namespaceId: curNamespaceData?.namespaceId,
                pageSize: pageSize,
                pageIndex: pageIndex


              })

            }} onReset={() => {
              //setPageIndex(1);
              // setPageSize(20)
              form.resetFields()
              getNacosConfigDataSource({
                namespaceId: curNamespaceData?.namespaceId

              })
            }}>
              <Form.Item label="Data ID" name="dataId">
                <Input placeholder="添加通配符'*'进行模糊查询" style={{ width: 200 }} />

              </Form.Item >
              <Form.Item label="Group" name="groupId">
                <Input placeholder="添加通配符'*'进行模糊查询" style={{ width: 200 }} />

              </Form.Item>
              <Form.Item label="归属应用" name="appName">
                <Input placeholder="请输入应用名" style={{ width: 200 }} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">查询</Button>
              </Form.Item>
              <Form.Item>
                <Button htmlType="reset" > 重置</Button>
              </Form.Item>
              <Form.Item>
                <Button  type="primary"  disabled={downloadAllDisabled} onClick={() => {
                  setDownloadAllDisabled(true)
                  setTimeout(() => {
                    setDownloadAllDisabled(false)
                  }, 2000);
                }} href={`${exportAllNacosConfigApi}?envCode=${envCode}&namespaceId=${curNamespaceData?.namespaceId}&dataId=${form.getFieldsValue()?.dataId||""}&groupId=${form.getFieldsValue()?.groupId||""}`}> 导出查询结果</Button>
              </Form.Item>

            </Form>

          </div>
          <div className="nacos-table">
            <div className="nacos-table-header">
              <h3>配置列表</h3>
              <Space>
                {/* <Button type="primary" ghost>导出查询结果</Button> */}
                <Button type="primary" ghost onClick={() => {
                  setImportVisible(true)
                }}>导入配置</Button>
                <Button type="primary" onClick={() => { setMode("ADD") }}>+新建配置</Button>
              </Space>
            </div>
            <Table
              rowKey="nacosId"
              rowSelection={rowSelection}
              columns={columns}
              dataSource={tableSource}
              loading={tabelLoading || delLoading}
              bordered
              scroll={{ y: window.innerHeight - 440 }}
              pagination={{
                current: pageIndex,
                total,
                pageSize,
                showSizeChanger: true,
                onShowSizeChange: (_, size) => {
                  setPageSize(size);
                  setPageIndex(1); //
                },
                showTotal: () => `总共 ${total} 条数据`,
              }}
              onChange={pageSizeClick}
            />
            <div className="nacos-table-footer">

              <Space>
              <Popconfirm  title={`确认删除已选中的${hasSelected}条数据吗?`}
            onConfirm={() => {
             
                let params = form.getFieldsValue()
                deleteNamespace({ envCode: envCode || "", namespaceId: curNamespaceData?.namespaceId, nacosIds: selectedRowKeys }).then(() => {
                  getNacosConfigDataSource({ ...params, namespaceId: curNamespaceData?.namespaceId })
                }).then(() => {
                  setSelectedRowKeys([])
                })
            
              
             
            }}>
              <Button danger loading={delLoading} >删除</Button>

              </Popconfirm>
               
                <Button type="primary" disabled={downloadDisabled} onClick={() => {
                  setDownloadDisabled(true)
                  setTimeout(() => {
                    setDownloadDisabled(false)
                  }, 2000);
                }} href={`${exportNacosConfigApi}?envCode=${envCode}&namespaceId=${curNamespaceData?.namespaceId}&nacosIds=${selectedRowKeys}`} >导出选中的配置</Button>

              </Space>
            </div>



          </div>
        </div>
      </>)}
    </div>
    {/* </ContentCard> */}
  </>)
}