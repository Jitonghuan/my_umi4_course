import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Form, Button, message, Tooltip } from 'antd';
import { history } from 'umi';
import { Tree, Switch } from 'antd';
import { Tag, Divider, Progress, Select, Table, Spin } from 'antd';
import TraceTime from './TraceTime';
import {
  UnorderedListOutlined,
  BranchesOutlined,
  CopyOutlined,
  TableOutlined,
  DownOutlined,
  RightOutlined,
  CodepenOutlined,
} from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
// import TraceTable from './trace-table'
import RightGraph from '../right-graph';
import { getTraceInfo, getNoiseList } from '../../../service';
import './index.less';
import DetailModal from '../detail-modal';
import * as d3 from 'd3';
import moment from '_moment@2.29.3@moment';
function TimeTree(data: any) {
  return (
    <>
      <TraceTime {...data} />
      {data?.children?.length ? data.children.map((e: any) => <TimeTree {...e} />) : <></>}
    </>
  );
}

export default function RrightTrace(props: any) {
  const { item, data, envCode, selectTime, loading, noiseChange } = props;
  console.log(data, 'data');
  const [activeBtn, setActiveBtn] = useState<string>('table');
  const [treeData, setTreeData] = useState<any>([]); //用于列表树的数据
  const [traceIdOptions, setTraceIdOptions] = useState<any>([]);
  const [selectTraceId, setSelectTraceId] = useState<any>('');
  const [visible, setVisible] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<any>({});
  const [noiseOption, setNoiseOption] = useState<any>([]);
  const [selectNoise, setSelectNoise] = useState<any>([]);
  useEffect(() => {
    const idList = selectNoise.map((item: any) => item.value);
    noiseChange(idList);
  }, [selectNoise]);
  useEffect(() => {
    if (item && item.traceIds && item?.traceIds?.length !== 0) {
      setSelectTraceId(item?.traceIds[0]);
    }
  }, [item]);
  const containerRef = useCallback(
    (node: any) => {
      if (node) {
        d3.select(node).selectAll('*').remove();
        var svg = d3.select(node).append('svg').style('height', 30).style('overflow', 'inherit');

        var x = d3
          .scaleLinear()
          .domain([0, 100])
          // .domain([0, data.reduce((max: number, e: any) => Math.max(parseInt(e.durations), max), 0)]) // This is what is written on the Axis: from 0 to 100
          .range([0, node.clientWidth]); // This is where the axis is placed: from 100px to 800px

        // Draw the axis
        svg
          .append('g')
          .attr('transform', 'translate(0,25)') // This controls the vertical position of the Axis
          .call(d3.axisTop(x));
      }
    },
    [data],
  );
  const titleList = [
    { key: 'table', label: '表格', icon: <TableOutlined /> },
    { key: 'list', label: '列表', icon: <UnorderedListOutlined /> },
    { key: 'tree', label: '树状', icon: <BranchesOutlined /> },
  ];
  const column = [
    {
      title: 'Method',
      dataIndex: 'endpointName',
      key: 'endpointName',
      width: '35%',
      ellipsis: true,
      render: (value: string) => (
        <Tooltip placement="topLeft" title={value}>
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
      ellipsis: true,
      render: (value: string) => (
        <Tooltip placement="topLeft" title={moment(Number(value)).format('YYYY-MM-DD HH:mm:ss')}>
          {moment(Number(value)).format('YYYY-MM-DD HH:mm:ss')}
        </Tooltip>
      ),
    },
    {
      title: 'Exec(ms)',
      dataIndex: 'durations',
      key: 'durations',
      render: (value: string, record: any) => `${record.endTime - record.startTime}ms`,
    },
    {
      title: 'Exec(%)',
      dataIndex: 'durations',
      key: 'durations',
      render: (value: string, record: any) => <TraceTime {...record} />,
    },
    {
      title: 'Self(ms)',
      dataIndex: 'selfDurations',
      key: 'selfDurations',
    },
    {
      title: 'API',
      dataIndex: 'component',
      key: 'component',
      ellipsis: true,
      render: (value: string) => (
        <Tooltip placement="topLeft" title={value}>
          {value}
        </Tooltip>
      ),
    },
    {
      title: 'Service',
      dataIndex: 'serviceCode',
      key: 'serviceCode',
      ellipsis: true,
      render: (value: string) => (
        <Tooltip placement="topLeft" title={value}>
          {value}
        </Tooltip>
      ),
    },
  ];

  useEffect(() => {
    const handleData = (data: any) => {
      if (!data) {
        return;
      }
      let icon = <TableOutlined />;
      if (data?.children && data?.children?.length !== 0) {
        data.children.map((e: any) => handleData(e));
      }
      data.icon = icon;
      return data;
    };
    var treeData = [handleData(data[0])];
    console.log(treeData, 'treeDAta');

    setTreeData(treeData);
  }, [data]);

  useEffect(() => {
    getNoiseList({ pageIndex: 1, pageSize: 20 }).then((res) => {
      if (res?.success) {
        const data = res?.data?.dataSource;
        const dataList = data.map((item: any) => ({ value: item?.id, label: item?.noiseReductionName }));
        setNoiseOption(dataList);
      }
    });
  }, []);

  const handleCancel = () => {
    setVisible(false);
  };

  const showModal = (value: any) => {
    setDetailData(value);
    setVisible(true);
  };

  // const closeTag = (value: any) => {
  //   const filterValue = selectNoise.filter((item: any) => {
  //     return item.value !== value.value;
  //   });
  //   setSelectNoise(filterValue);
  // };

  return (
    <div className="trace-wrapper">
      <DetailModal visible={visible} detailData={detailData} handleCancel={handleCancel}></DetailModal>
      <div className="trace-wrapper-top">
        <div style={{ fontWeight: '800' }}>
          端点：{item.endpointNames && item?.endpointNames?.length !== 0 ? item?.endpointNames[0] : '--'}
        </div>
        <div className="top-select-btn">
          <div>
            traceID:
            <Select
              options={traceIdOptions}
              value={selectTraceId}
              size="small"
              onChange={(id) => {
                setSelectTraceId(id);
              }}
              showSearch
              style={{ width: 240, marginLeft: '10px' }}
            />
            <CopyToClipboard text={selectTraceId} onCopy={() => message.success('复制成功！')}>
              <span style={{ marginLeft: 8, color: 'royalblue' }}>
                <CopyOutlined />
              </span>
            </CopyToClipboard>
          </div>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              history.push({
                pathname: '/matrix/logger/search',
                query: { envCode, ...selectTime, traceId: selectTraceId },
              });
            }}
          >
            查看日志
          </Button>
        </div>
        <div className="top-final">
          <div>
            <span>开始时间：{item?.start || '--'}</span>
            <span style={{ margin: '0px 20px' }}>
              持续时间：<Tag color="default">{item?.duration || '--'}ms</Tag>
            </span>
            <span>
              降噪:
              <Select
                mode="multiple"
                options={noiseOption}
                value={selectNoise}
                size="small"
                labelInValue
                onChange={(value) => {
                  setSelectNoise(value);
                }}
                // showSearch
                style={{ width: 180, marginLeft: '10px' }}
                autoClearSearchValue
              />
            </span>
          </div>
          <div>
            {titleList.map((item) => {
              return (
                <span
                  className="top-trace-btn"
                  style={{ backgroundColor: item.key === activeBtn ? '#137eec' : '#b0a8a8' }}
                  onClick={() => {
                    setActiveBtn(item.key);
                  }}
                >
                  {item.icon} {item.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <Divider />
      {/* <Spin spinning={loading}> */}
      <div className="trace-display">
        {activeBtn === 'list' && (
          <div className="trace-table">
            <div className="scale-warpper">
              <div ref={containerRef} className="scale" style={{ float: 'right' }}></div>
            </div>
            {/* <div ref={containerRef} className='scale' ></div> */}
            {data?.length && (
              <Tree
                treeData={treeData}
                blockNode
                defaultExpandAll={true}
                showIcon={false}
                showLine={{ showLeafIcon: false }}
                switcherIcon={<span className="span-icon"></span>}
                titleRender={(node: any) => {
                  return (
                    <div
                      className={`${!node.children || node.children.length == 0 ? 'leaf' : ''} span-item`}
                      onClick={() => {
                        setDetailData(node);
                        setVisible(true);
                      }}
                    >
                      <div className="span-item-wrapper">
                        <span className="span-title">
                          <Tooltip title={node?.endpointName || ''}>{node?.endpointName || ''}</Tooltip>
                        </span>
                        <TraceTime {...node} />
                        {/* <Progress
                              percent={(parseFloat(node?.durations) * 100) / (data.length ? data[0].durations : 0)}
                              showInfo={false}
                              size="small"
                              trailColor="transparent"
                              className="span-progress"
                            /> */}
                      </div>
                    </div>
                  );
                }}
              />
            )}
            {/* <div className="trace-table-scale">
              {treeData.map((e: any) => <TimeTree {...e} />)}
            </div> */}
          </div>
        )}
        {activeBtn === 'table' && data?.length && (
          <Table
            columns={column}
            defaultExpandAllRows={true}
            dataSource={data}
            pagination={false}
            onRow={(record: any, index: any) => {
              return {
                onClick: (event) => {
                  setDetailData(record);
                  setVisible(true);
                }, // 点击行
              };
            }}
            expandable={{
              defaultExpandAllRows: true,
              expandIcon: ({ expanded, onExpand, record }) =>
                record?.children?.length ? (
                  expanded ? (
                    <DownOutlined
                      style={{ marginRight: '3px', fontSize: '9px' }}
                      onClick={(e) => {
                        onExpand(record, e);
                        e.stopPropagation();
                      }}
                    />
                  ) : (
                    <RightOutlined
                      style={{ marginRight: '3px', fontSize: '9px' }}
                      onClick={(e) => {
                        onExpand(record, e);
                        e.stopPropagation();
                      }}
                    />
                  )
                ) : null,
              indentSize: 20,
            }}
          />
        )}
        {activeBtn === 'tree' && <RightGraph treeData={data} showModal={showModal} />}
      </div>
      {/* </Spin> */}
    </div>
  );
}
