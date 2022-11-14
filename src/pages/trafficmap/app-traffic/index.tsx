import React, { useMemo, useState, useEffect } from 'react';
import PageContainer from '@/components/page-container';
import { Table, Form, Select, Input, Button } from 'antd';
import { createTableColumns } from './schema';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import { queryEnvList, queryTrafficList } from './hook';
import { history } from 'umi';
import { RedoOutlined } from '@ant-design/icons'
import './index.less'

export default function AppTrafficList() {
  const [form] = Form.useForm();
  const [envOptions, setEnvOptions] = useState([]);
  const [curEnv, setCurEnv] = useState<any>({});
  const [curEnvCode, setCurEnvCode] = useState<string>("");
  const [envOptionsLoading, setEnvOptionsLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState<boolean>(false)
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [pageTotal, setPageTotal] = useState<number>(0);
  const [keyWord, setKeyWord] = useState<string>("")
  const getDataSource = (params: { envCode: string, keyWord?: string }) => {
    setLoading(true)
    const now = new Date().getTime();
    queryTrafficList({
      envCode: params?.envCode,
      keyWord: params?.keyWord,
      start: Number((now - 5 * 60 * 1000) / 1000) + "",
      end: Number(now / 1000) + "",
    }).then((resp) => {
      setDataSource(resp)
      setPageTotal(resp?.length)
      queryTrafficList({
        envCode: params?.envCode,
        keyWord: params?.keyWord,
        start: Number((now - 5 * 60 * 1000) / 1000) + "",
        end: Number(now / 1000) + "",
        needMetric: true
      }).then((result) => {
        setDataSource(result)
        setPageTotal(result?.length)
      })
    }).finally(() => {
      setLoading(false)
    })
  }
  useEffect(() => {
    getEnvOptions()
  }, [])
  const getEnvOptions = () => {
    setEnvOptionsLoading(true)
    queryEnvList().then((res) => {
      setEnvOptions(res)
      setCurEnv(res[0])
      setCurEnvCode(res[0]?.value)
      getDataSource({ envCode: res[0]?.value })
    }).finally(() => {
      setEnvOptionsLoading(false)
    })
  }
  const columns = useMemo(() => {
    return createTableColumns({
      onView: (record, index) => {
        history.push({
          pathname: './traffic-detail'
        }, {
          envCode: curEnvCode,
          appId: record?.appId,
          appCode: record?.appCode,
          deployName: record?.deployName

        })
      },
      onAlertConfig: (record, index) => {
        history.push({
          pathname: "/matrix/monitor/alarm-rules"
        }, {
          envCode: curEnvCode,
          appCode: record?.appCode,
          envTypeCode: curEnv?.envTypeCode


        })
      },
    }) as any;
  }, [curEnvCode]);


  return (
    <PageContainer className="app-traffic-page">
      <FilterCard className="app-traffic-page-header">
        <div className="app-traffic-filter">
          <span>环境：<Select style={{ width: 220 }} loading={envOptionsLoading} options={envOptions} allowClear value={curEnvCode} showSearch onChange={(envCode, option: any) => {
            setCurEnvCode(envCode)
            setCurEnv(option)
            getDataSource({ envCode })
          }} />
          </span>
          <span className="app-traffic-filter-envName">{curEnv?.label}</span>

          <span>查询：<Input style={{ width: 280 }} placeholder="请输入应用名称或应用Code按回车键查询" onPressEnter={(e) => {
            getDataSource({ envCode: curEnvCode, keyWord: e.target.value })
            setKeyWord(e.target.value)
          }} /></span>
        </div>
      </FilterCard>
      <ContentCard>
        <div className="table-caption" style={{ marginBottom: 8 }}>
          <h3>应用流量列表</h3>
          <Button
            type="primary"
            icon={<RedoOutlined />}
            onClick={() => {
              getDataSource({ envCode: curEnvCode, keyWord: keyWord })
            }}
          >
            刷新
          </Button>
        </div>
        <Table
          columns={columns}
          loading={loading}
          scroll={{ x: '100%' }}
          dataSource={dataSource}
          pagination={{
            pageSize: pageSize,
            current: pageIndex,
            showTotal: (total) => `共 ${pageTotal} 条`,
            showSizeChanger: true,
            onShowSizeChange: (_, size) => {
              setPageSize(size);
              setPageIndex(1);
            },
            onChange: (page, size: any) => {
              setPageSize(size);
              setPageIndex(page);
            },
          }}
        />


      </ContentCard>



    </PageContainer>
  );
}
