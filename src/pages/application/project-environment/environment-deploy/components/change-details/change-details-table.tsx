// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import React, { useEffect, useState, useContext } from 'react';
import { Table, Select } from '@cffe/h2o-design';
import { getRequest } from '@/utils/request';
import { listRanking, listUserRanking } from './service';
import DetailContext from '@/pages/application/application-detail/context';

export interface appChangeTableProps {
  loading?: boolean;
}
export default function appChangeTable(props: appChangeTableProps) {
  const { loading } = props;
  const { Option } = Select;
  const { appData } = useContext(DetailContext);
  const [appChangeData, setAppChangeData] = useState<any[]>([]); //文件修改表格数据
  const [userRankingData, setUserRankingData] = useState<any[]>([]); //子表格文件修改人员数据
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [pageTotal, setPageTotal] = useState<number>();
  let fileName = '';
  useEffect(() => {
    const queryListRanking = () => {
      getRequest(listRanking, {
        data: { appCode: appData?.appCode, pageIndex: 1, pageSize: 5 },
      })
        .then((result) => {
          if (result.success) {
            let listRankingData = result.data.dataSource;
            setAppChangeData(listRankingData);
            setPageTotal(pageTotal);
            setPageIndex(pageIndex);
          }
        })
        .finally(() => {});
    };
  }, []);

  const expandListUserRanking = (expanded: any, record: any) => {
    fileName = record.file;
  };
  useEffect(() => {
    getRequest(listUserRanking, {
      data: { appCode: appData?.appCode, file: fileName, pageIndex: 1, pageSize: 5 },
    })
      .then((resp) => {
        if (resp.success) {
          let listUserRankingData = resp.data.dataSource[0];
          setUserRankingData(listUserRankingData);
          setPageTotal(pageTotal);
          setPageIndex(pageIndex);
        }
      })
      .finally(() => {});
  }, []);
  const pageSizeClick = (pagination: any) => {
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    // loadListData(obj);
    setPageIndex(pagination.current);
  };
  //Todo.....点击第二页时传值查询
  // const loadListData = (params: any) => {
  //   const values = formTmpl.getFieldsValue();

  //   queryList({
  //     ...values,
  //     ...params,
  //   });
  // };

  const getlistRanking = () => {
    getRequest(listRanking, {
      data: { appCode: appData?.appCode },
    })
      .then((result) => {
        let changeDetailData = result.data.dataSource;
        let arr = [];
        arr.push(changeDetailData);
      })
      .finally(() => {});
  };
  const columns = [
    {
      title: '排名',
      dataIndex: 'ranking',
      key: 'ranking',
    },
    {
      title: '统计周期',
      dataIndex: 'calculateCycle',
    },
    {
      title: '环境',
      dataIndex: 'envCode',
    },
    {
      title: '文件',
      dataIndex: 'file',
    },
    {
      title: '修改次数',
      dataIndex: 'changeTimes',
      sorter: {
        compare: (a: any, b: any) => a.modificationTimes - b.modificationTimes,
        // multiple: 1,
      },
    },
  ];
  const countList: any = [
    // {
    //   key: '1',
    //   sorter: '1',
    //   statisticalCycle: 'yyy',
    //   envCode: 'HBos-dev',
    //   file: 'xxxx',
    //   modificationTimes: '777',
    //   description: '',
    // },
    // {
    //   key: '2',
    //   sorter: '2',
    //   statisticalCycle: 'yyy',
    //   envCode: 'HBos-dev',
    //   file: 'xxxx',
    //   modificationTimes: '887',
    //   description: '',
    // },
  ];

  const expandedRowRender = () => {
    const columns = [
      { title: '排名', dataIndex: 'ranking', key: 'ranking' },
      { title: '应用Code', dataIndex: 'appCode', key: 'appCode' },
      { title: '环境Code', dataIndex: 'envCode', key: 'envCode' },
      { title: '统计周期', dataIndex: 'calculateCycle', key: 'calculateCycle' },
      { title: '文件', dataIndex: 'file', key: 'file' },
      { title: '修改人员', dataIndex: 'user', key: 'user' },
      { title: '修改次数', dataIndex: 'changeTimes', key: 'changeTimes' },
    ];
    return <Table columns={columns} dataSource={userRankingData} pagination={false} />;
  };
  const handleChange = (value: any) => {};

  return (
    <section data-loading={loading}>
      <div style={{ marginBottom: '2%', display: 'flex' }}>
        <span>查询周期：</span>
        <Select style={{ width: 120 }} onChange={handleChange}>
          <Option value="jack">最近7天</Option>
          <Option value="lucy">最近15天</Option>
          <Option value="Yiminghe">最近30天</Option>
        </Select>
        <div style={{ marginLeft: '2%' }}>
          <span>查询环境：</span>
          <Select style={{ width: 120 }} onChange={handleChange}>
            <Option value="jack">HBOS开发</Option>
            <Option value="lucy">HBOS本地</Option>
            <Option value="Yiminghe">HBOS生产</Option>
          </Select>
        </div>
      </div>
      <div>
        <header>
          <h3>应用模块变更详情</h3>
        </header>
        <div className="clusterTable" style={{ width: '90%', marginLeft: '4%', marginTop: '2%' }}>
          <Table
            rowKey="sorter"
            bordered
            columns={columns}
            dataSource={appChangeData}
            pagination={{
              total: pageTotal,
              pageSize,
              current: pageIndex,
              showSizeChanger: true,
              onShowSizeChange: (_, size) => {
                setPageSize(size);
                setPageIndex(1);
              },
              showTotal: () => `总共 ${pageTotal} 条数据`,
            }}
            onChange={pageSizeClick}
            expandable={{ expandedRowRender }}
            onExpand={expandListUserRanking}
          />
        </div>
      </div>
    </section>
  );
}
