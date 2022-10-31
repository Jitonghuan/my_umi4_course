import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Button, Space, Table } from 'antd';
import { RedoOutlined } from '@ant-design/icons'
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import { createTableColumns } from './schema';
import PageContainer from '@/components/page-container';
import { getNacosNamespaces, useDeleteNamespace } from './hook';
import DetailContext from '../../context';
import CreateNamespace from './create-namespace';

import './index.less'
export default function namespace() {
  const { envCode } = useContext(DetailContext);
  const [dataSource, setDataSource] = useState<any>([]);
  const [mode, setMode] = useState<EditorMode>('HIDE');
  const [curRecord, setcurRecord] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false)
  const [delLoading, deleteNamespace] = useDeleteNamespace()
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [pageTotal, setPageTotal] = useState<number>();
  useEffect(() => {
    getTableSource()

  }, [])
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
        setDataSource([data[typeIndex], ...res])
       
      } else {
        setDataSource(res)
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
        deleteNamespace({ envCode: envCode || "", namespaceId: record?.namespaceId })
      }

    }) as any;
  }, []);
  return (<div >
    <CreateNamespace
      mode={mode}
      initData={curRecord}
      envCode={envCode || ""}
      onClose={() => setMode('HIDE')}
      onSave={() => {
        getTableSource()
        setMode('HIDE')
      }}
    />

    <ContentCard >
      <div className="namespace-table">
        <div className="namespace-table-header">
          <h3>命名空间列表</h3>
          <Space>

            <Button type="primary" onClick={() => { setMode("ADD") }}>+新建命名空间</Button>
            <Button type="primary" ghost onClick={getTableSource}><RedoOutlined />刷新</Button>

          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          bordered
          loading={loading}
          pagination={{

            pageSize: 20,

          }}
        />




      </div>
    </ContentCard >
  </div>)
}