import React, { useState, useEffect, useRef } from 'react';
import { Form, Select, Input, Button, Table, Popconfirm } from 'antd';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import Graph from './components/konva';
import { RelatedData } from './components/konva/shape';
import DetailDraw from './components/draw';
import { columns, tableData, detailColumns, detailTableData, commonColumns, commonTableData } from './columns';
import './index.less';

export default function DomainConfigs() {
  const [dataSource, setDataSource] = useState<any>(tableData);
  const [visible, setVisible] = useState(false);
  const [column, setColumn] = useState(columns);
  const [tableTitle, setTableTitle] = useState('医保上传检验单表数据');
  const graphRef = useRef<any>();
  const onSubmit = (related: RelatedData) => {
    setVisible(false);
    if (graphRef?.current) {
      graphRef.current.treeView(related);
    }
    setTableTitle('医保上传检验单表-校验明细表交集数据');
    setColumn(commonColumns);
    setDataSource(commonTableData.slice(0, 205));
  };
  const onJoin = (l: any, right: any) => {};

  const onRelative = (l: any, right: any) => {
    setVisible(true);
  };

  const changeData = (type: string) => {
    if (type === '校验明细') {
      setTableTitle('校验明细表数据');
      setColumn(detailColumns);
      setDataSource(detailTableData);
    } else {
      setColumn(column);
      setDataSource(tableData);
      setTableTitle('医保上传检验单表数据');
    }
  };

  return (
    <PageContainer className="display">
      <ContentCard className="display-wrapper">
        <DetailDraw visible={visible} setVisible={setVisible} onSubmit={onSubmit} />
        {/* <div className='display-wrapper'> */}
        <div className="konva-wrapper">
          <Graph ref={graphRef} onJoin={onJoin} onRelative={onRelative} changeData={changeData} />
        </div>
        <div className="table-title">{tableTitle}</div>
        <div className="table-wrapper">
          <Table columns={column} dataSource={dataSource} />
        </div>
        {/* </div> */}
      </ContentCard>
    </PageContainer>
  );
}
