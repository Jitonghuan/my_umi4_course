import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Form, Button, message } from 'antd';
import { Tree, Switch } from 'antd';
import { Tag, Divider, Progress, Select, Table } from 'antd';
import {
  UnorderedListOutlined,
  BranchesOutlined,
  CopyOutlined,
  TableOutlined,
  DownOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
// import TraceTable from './trace-table'
import RightGraph from '../right-graph';
import { getTraceInfo } from '../../../service';
import './index.less';
import * as d3 from 'd3';

export default function RrightTrace(props: any) {
  const { item, data } = props;
  const [activeBtn, setActiveBtn] = useState<string>('list');
  const [treeData, setTreeData] = useState<any>([]); //用于列表树的数据
  const [traceIdOptions, setTraceIdOptions] = useState<any>([]);
  const [selectTraceId, setSelectTraceId] = useState<any>('11112323232');
  const containerRef = useCallback(
    (node: any) => {
      if (node) {
        d3.select(node).selectAll('*').remove();
        var svg = d3.select(node).append('svg').style('height', 30).style('overflow', 'inherit');

        var x = d3
          .scaleLinear()
          .domain([0, data.reduce((max: number, e: any) => Math.max(parseInt(e.durations), max), 0)]) // This is what is written on the Axis: from 0 to 100
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
    { key: 'list', label: '列表', icon: <UnorderedListOutlined /> },
    { key: 'table', label: '表格', icon: <TableOutlined /> },
    { key: 'tree', label: '树状', icon: <BranchesOutlined /> },
  ];
  const column = [
    {
      title: 'traceId',
      dataIndex: 'traceId',
      key: 'traceId',
    },
    {
      title: 'endpointName',
      dataIndex: 'endpointName',
      key: 'endpointName',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: 'Exes(ms)',
      dataIndex: 'durations',
      key: 'durations',
    },
    {
      title: 'Exec(%)',
      dataIndex: 'durations',
      key: 'durations',
      render: (value: string, record: any) => (
        <Progress
          percent={(parseFloat(value) * 100) / (data.length ? data[0].durations : 0)}
          showInfo={false}
          size="small"
          trailColor="transparent"
        />
      ),
    },
  ];

  useEffect(() => {
    const handleData = (data: any) => {
      // let icon = <span className="parent-icon"></span>;
      let icon = <TableOutlined />;
      if (data.children.length === 0) {
        icon = <span className="left-icon">111</span>;
        handleData(data.children);
      }
      data.icon = icon;
      return data;
    };
    setTreeData([handleData(data[0])]);
  }, [data]);

  const switchChange = (v: boolean) => {
    getTraceInfo({ enableNoiseReduction: v, traceID: item.traceID }).then((res) => {});
  };

  return (
    <div className="trace-wrapper">
      <div className="trace-wrapper-top">
        <div style={{ fontWeight: '800' }}>端点：{item?.endpointNames[0] || '--'}</div>
        <div className="top-select-btn">
          <div>
            traceID:
            <Select
              options={traceIdOptions}
              value={selectTraceId}
              size="small"
              onChange={(id) => {
                selectTraceId(id);
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
          <Button type="primary" size="small">
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
              降噪：
              <Switch onChange={switchChange} size="small" />
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
      <div className="trace-display">
        {activeBtn === 'list' && (
          <div>
            <div className="scale-warpper">
              <div ref={containerRef} className="scale" style={{ float: 'right' }}></div>
            </div>
            {/* <div ref={containerRef} className='scale' ></div> */}
            {treeData?.length && (
              <Tree
                treeData={treeData}
                blockNode
                defaultExpandAll={true}
                showIcon={false}
                showLine={{ showLeafIcon: false }}
                switcherIcon={<span className="span-icon"></span>}
                titleRender={(node: any) => {
                  return (
                    <div className={`${!node.children || node.children.length == 0 ? 'leaf' : ''} span-item`}>
                      {
                        node?.parentSpanId !== -1 ? (
                          <div className="span-item-wrapper">
                            <span className="span-title" style={{}}>
                              {node?.endpointName || ''}
                            </span>
                            <span className="span-detail">
                              {/* {Object.keys(node?.tags || {}).map((k: any) => (
                      <span className="span-tag" title={k}>
                        <Tag style={{ lineHeight: '14px', padding: '0 3px' }} color="blue">
                          {node.tags[k]}
                        </Tag>
                      </span>
                    ))} */}
                            </span>
                            <Progress
                              percent={(parseFloat(node?.durations) * 100) / (data.length ? data[0].durations : 0)}
                              showInfo={false}
                              size="small"
                              trailColor="transparent"
                              className="span-progress"
                            />
                          </div>
                        ) : null
                        // <div style={{ width: '100%' }}><div ref={containerRef} className="scale" style={{ float: 'right' }}></div></div>
                      }
                    </div>
                  );
                }}
              />
            )}
          </div>
        )}
        {activeBtn === 'table' && (
          <Table
            columns={column}
            defaultExpandAllRows={true}
            dataSource={data}
            pagination={false}
            expandable={{
              expandIcon: ({ expanded, onExpand, record }) =>
                record?.children?.length ? (
                  expanded ? (
                    <DownOutlined
                      style={{ marginRight: '3px', fontSize: '9px' }}
                      onClick={(e) => onExpand(record, e)}
                    />
                  ) : (
                    <RightOutlined
                      style={{ marginRight: '3px', fontSize: '9px' }}
                      onClick={(e) => onExpand(record, e)}
                    />
                  )
                ) : null,
              defaultExpandAllRows: true,
              indentSize: 20,
            }}
          />
        )}
        {activeBtn === 'tree' && <RightGraph treeData={data} />}
      </div>
    </div>
  );
}
