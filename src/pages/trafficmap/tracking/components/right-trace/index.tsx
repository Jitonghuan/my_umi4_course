import React, { useEffect, useRef, useState } from 'react';
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
import './index.less';
// import * as d3 from 'd3';

const temp = [
  {
    id: 3565,
    title: '/homepage',
    projectId: 15,
    moduleId: 132,
    parentId: 3564,
    parentTree: '/3564',
    desc: null,
    belongMenu: 0,
    isMenu: 0,
    items: [
      {
        id: 3566,
        title: '/song/top',
        projectId: 15,
        moduleId: 133,
        parentId: 3565,
        parentTree: '/3564/3565',
        desc: null,
        belongMenu: 0,
        isMenu: 0,
        items: [],
      },
      {
        id: 3567,
        title: 'springCloudGateWay',
        projectId: 15,
        moduleId: 134,
        parentId: 3565,
        parentTree: '/3564/3565',
        desc: null,
        belongMenu: 0,
        isMenu: 0,
        items: [],
      },
      {
        id: 3568,
        title: 'SpringCloudGateWay',
        projectId: 15,
        moduleId: 135,
        parentId: 3565,
        parentTree: '/3564/3565',
        desc: null,
        belongMenu: 0,
        isMenu: 0,
        items: [],
      },
    ],
  },
  {
    id: 3569,
    title: '/rcmd',
    projectId: 15,
    moduleId: 136,
    parentId: 3564,
    parentTree: '/3564',
    desc: null,
    belongMenu: 0,
    isMenu: 0,
    items: [
      {
        id: 3570,
        title: '/songs',
        projectId: 15,
        moduleId: 137,
        parentId: 3569,
        parentTree: '/3564/3569',
        desc: null,
        belongMenu: 0,
        isMenu: 0,
        items: [],
      },
    ],
  },
  {
    id: 3571,
    title: 'GET:/songs',
    projectId: 15,
    moduleId: 138,
    parentId: 3564,
    parentTree: '/3564',
    desc: null,
    belongMenu: 0,
    isMenu: 0,
    items: [
      {
        id: 3572,
        title: '/cmsds',
        projectId: 15,
        moduleId: 139,
        parentId: 3571,
        parentTree: '/3564/3571',
        desc: null,
        belongMenu: 0,
        isMenu: 0,
        items: [],
      },
      {
        id: 3573,
        title: '/h2cp',
        projectId: 15,
        moduleId: 140,
        parentId: 3571,
        parentTree: '/3564/3571',
        desc: null,
        belongMenu: 0,
        isMenu: 0,
        items: [
          {
            id: 3585,
            title: '/prepared',
            projectId: 15,
            moduleId: 152,
            parentId: 3573,
            parentTree: '/3564/3571/3573',
            desc: null,
            belongMenu: 0,
            isMenu: 0,
            items: [],
            caseTotal: '9',
          },
        ],
      },
    ],
  },
  {
    id: 3574,
    title: '/tests',
    projectId: 15,
    moduleId: 141,
    parentId: 3564,
    parentTree: '/3564',
    desc: null,
    belongMenu: 0,
    isMenu: 0,
    items: [],
  },
  {
    id: 3575,
    title: '/fdsfds',
    projectId: 15,
    moduleId: 142,
    parentId: 3564,
    parentTree: '/3564',
    desc: null,
    belongMenu: 0,
    isMenu: 0,
    items: [
      {
        id: 3576,
        title: 'hahah',
        projectId: 15,
        moduleId: 143,
        parentId: 3575,
        parentTree: '/3564/3575',
        desc: null,
        belongMenu: 0,
        isMenu: 0,
        items: [
          {
            id: 3584,
            title: '/xixiix',
            projectId: 15,
            moduleId: 151,
            parentId: 3576,
            parentTree: '/3564/3575/3576',
            desc: null,
            belongMenu: 0,
            isMenu: 0,
            items: [],
          },
        ],
      },
      {
        id: 3577,
        title: '/memed',
        projectId: 15,
        moduleId: 144,
        parentId: 3575,
        parentTree: '/3564/3575',
        desc: null,
        belongMenu: 0,
        isMenu: 0,
        items: [],
      },
      {
        id: 3578,
        title: 'llallal',
        projectId: 15,
        moduleId: 145,
        parentId: 3575,
        parentTree: '/3564/3575',
        desc: null,
        belongMenu: 0,
        isMenu: 0,
        items: [],
      },
      {
        id: 3579,
        title: 'lxjlsjd',
        projectId: 15,
        moduleId: 146,
        parentId: 3575,
        parentTree: '/3564/3575',
        desc: null,
        belongMenu: 0,
        isMenu: 0,
        items: [],
        caseTotal: '24',
      },
    ],
  },
  {
    id: 3580,
    title: '/lsdjf',
    projectId: 15,
    moduleId: 147,
    parentId: 3564,
    parentTree: '/3564',
    desc: null,
    belongMenu: 0,
    isMenu: 0,
    items: [],
  },
  {
    id: 3581,
    title: '/djfdk',
    projectId: 15,
    moduleId: 148,
    parentId: 3564,
    parentTree: '/3564',
    desc: null,
    belongMenu: 0,
    isMenu: 0,
    items: [],
  },
  {
    id: 3583,
    title: '/dldlfjd',
    projectId: 15,
    moduleId: 150,
    parentId: 3564,
    parentTree: '/3564',
    desc: null,
    belongMenu: 0,
    isMenu: 0,
    items: [],
  },
];

const mockData = [
  {
    traceId: '11111111',
    spanId: 1,
    parentSpanId: 0,
    endpointName: 'homepage-level1',
    startTime: '2022-5-12 23:12:12',
    durations: '89',
  },
  {
    traceId: '11111111',
    spanId: 2,
    parentSpanId: 1,
    endpointName: 'homepage-level2',
    startTime: '2022-5-12 23:12:12',
    durations: '89',
  },
  {
    traceId: '11111111',
    spanId: 3,
    parentSpanId: 1,
    endpointName: 'homepage-level2',
    startTime: '2022-5-12 23:12:12',
    durations: '89',
  },
  {
    traceId: '11111111',
    spanId: 4,
    parentSpanId: 1,
    endpointName: 'homepage-level2',
    startTime: '2022-5-12 23:12:12',
    durations: '89',
  },
  {
    traceId: '11111111',
    spanId: 5,
    parentSpanId: 2,
    endpointName: 'homepage-level3',
    startTime: '2022-5-12 23:12:12',
    durations: '89',
  },
  {
    traceId: '11111111',
    spanId: 6,
    parentSpanId: 2,
    endpointName: 'homepage-level3',
    startTime: '2022-5-12 23:12:12',
    durations: '89',
  },
  {
    traceId: '11111111',
    spanId: 7,
    parentSpanId: 2,
    endpointName: 'homepage-level3',
    startTime: '2022-5-12 23:12:12',
    durations: '89',
  },
  {
    traceId: '11111111',
    spanId: 8,
    parentSpanId: 3,
    endpointName: 'homepage-level3',
    startTime: '2022-5-12 23:12:12',
    durations: '89',
  },
  {
    traceId: '11111111',
    spanId: 9,
    parentSpanId: 3,
    endpointName: 'homepage-level3',
    startTime: '2022-5-12 23:12:12',
    durations: '89',
  },
  {
    traceId: '11111111',
    spanId: 10,
    parentSpanId: 4,
    endpointName: 'homepage-level3',
    startTime: '2022-5-12 23:12:12',
    durations: '89',
  },
  {
    traceId: '11111111',
    spanId: 11,
    parentSpanId: 4,
    endpointName: 'homepage-level3',
    startTime: '2022-5-12 23:12:12',
    durations: '89',
  },
  {
    traceId: '11111111',
    spanId: 12,
    parentSpanId: 4,
    endpointName: 'homepage-level3',
    startTime: '2022-5-12 23:12:12',
    durations: '89',
  },
  {
    traceId: '11111111',
    spanId: 13,
    parentSpanId: 5,
    endpointName: 'homepage-level4',
    startTime: '2022-5-12 23:12:12',
    durations: '89',
  },
];

export default function RrightTrace() {
  const [treeData, setTreeData] = useState<any>([]);
  const [activeBtn, setActiveBtn] = useState<string>('list');
  const [traceIdOptions, setTraceIdOptions] = useState<any>([]);
  const [selectTraceId, setSelectTraceId] = useState<any>('11112323232');
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
  ];
  useEffect(() => {
    if (temp.length !== 0) {
      setTreeData(handleData(temp));
    }
  }, [temp]);

  useEffect(() => {
    if (mockData.length !== 0) {
      const data = listToTree(mockData);
      console.log(data, '11');
    }
  }, [mockData]);

  const switchChange = () => {};

  const handleData = (data: any) => {
    data.forEach((i: any) => {
      i.children = i.items;
      i.key = i.id;
      i.value = i.id;
      if (i.children?.length !== 0) {
        handleData(i.children);
      }
    });
    return data;
  };
  // 处理数据
  const listToTree = (list: any) => {
    let map: any = {},
      node,
      roots = [];
    for (let i = 0; i < list.length; i++) {
      map[list[i].spanId] = i; // 初始化map
      list[i].children = []; // 初始化children
    }
    console.log(map, list, 'map');
    for (let j = 0; j < list.length; j++) {
      node = list[j];
      if (node.parentSpanId !== '0') {
        list[map[node.parentSpanId]]?.children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  };
  return (
    <div className="trace-wrapper">
      <div className="trace-wrapper-top">
        <div style={{ fontWeight: '800' }}>端点：fldsjfldsjfldsfjaldsfjldsfjldsjfl</div>
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
            <span>开始时间：2022-05-09</span>
            <span style={{ margin: '0px 20px' }}>
              持续时间：<Tag color="default">95ms</Tag>
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
          <Tree
            treeData={treeData}
            blockNode
            defaultExpandAll
            showLine={{ showLeafIcon: false }}
            icon={<span className="span-icon"></span>}
            switcherIcon={<span className="span-icon"></span>}
            titleRender={(node: any) => {
              return (
                <div className={`${!node.children || node.children.length == 0 ? 'leaf' : ''} span-item`}>
                  {node?.title && (
                    <div style={{ width: '100%', display: 'flex' }}>
                      <span className="span-title" style={{}}>
                        {node.title}
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
                      {/* <Progress
                    percent={(parseFloat(node.duration) * 100) / 200}
                    showInfo={false}
                    trailColor="transparent"
                  /> */}
                    </div>
                  )}
                </div>
              );
            }}
          />
        )}
        {activeBtn === 'table' && (
          <Table
            columns={column}
            defaultExpandAllRows={true}
            dataSource={listToTree(mockData)}
            expandable={{
              expandIcon: ({ expanded, onExpand, record }) =>
                expanded ? (
                  <DownOutlined style={{ fontSize: '9px' }} onClick={(e) => onExpand(record, e)} />
                ) : (
                  <RightOutlined style={{ fontSize: '9px' }} onClick={(e) => onExpand(record, e)} />
                ),
              defaultExpandAllRows: true,
              indentSize: 20,
            }}
          />
        )}
        {activeBtn === 'tree' && <RightGraph />}
      </div>
    </div>
  );
}
