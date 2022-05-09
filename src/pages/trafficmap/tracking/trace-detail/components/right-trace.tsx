import React, { useEffect, useRef, useState } from 'react';
import { Form, Button } from 'antd';
import { Tree, Switch } from 'antd';
import { Tag, Divider, Progress } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
// import TraceTable from './trace-table'
import './index.less';
// import * as d3 from 'd3';

const temp = [
  {
    id: 3565,
    name: '数据元维护',
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
        name: '元素',
        projectId: 15,
        moduleId: 133,
        parentId: 3565,
        parentTree: '/3564/3565',
        desc: null,
        belongMenu: 0,
        isMenu: 0,
        items: [],
        caseTotal: '102',
      },
      {
        id: 3567,
        name: '元素组套',
        projectId: 15,
        moduleId: 134,
        parentId: 3565,
        parentTree: '/3564/3565',
        desc: null,
        belongMenu: 0,
        isMenu: 0,
        items: [],
        caseTotal: '12',
      },
      {
        id: 3568,
        name: '片段',
        projectId: 15,
        moduleId: 135,
        parentId: 3565,
        parentTree: '/3564/3565',
        desc: null,
        belongMenu: 0,
        isMenu: 0,
        items: [],
        caseTotal: '10',
      },
    ],
    caseTotal: '124',
  },
  {
    id: 3569,
    name: '模板管理',
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
        name: '编辑器',
        projectId: 15,
        moduleId: 137,
        parentId: 3569,
        parentTree: '/3564/3569',
        desc: null,
        belongMenu: 0,
        isMenu: 0,
        items: [],
        caseTotal: '43',
      },
    ],
    caseTotal: '91',
  },
  {
    id: 3571,
    name: '病历文书书写',
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
        name: '文书目录',
        projectId: 15,
        moduleId: 139,
        parentId: 3571,
        parentTree: '/3564/3571',
        desc: null,
        belongMenu: 0,
        isMenu: 0,
        items: [],
        caseTotal: '8',
      },
      {
        id: 3573,
        name: '文书书写',
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
            name: '审签流程',
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
        caseTotal: '46',
      },
    ],
    caseTotal: '55',
  },
  {
    id: 3574,
    name: '冒烟用例',
    projectId: 15,
    moduleId: 141,
    parentId: 3564,
    parentTree: '/3564',
    desc: null,
    belongMenu: 0,
    isMenu: 0,
    items: [],
    caseTotal: '19',
  },
  {
    id: 3575,
    name: '护理文书书写',
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
        name: '健康教育评价',
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
            name: '模板维护',
            projectId: 15,
            moduleId: 151,
            parentId: 3576,
            parentTree: '/3564/3575/3576',
            desc: null,
            belongMenu: 0,
            isMenu: 0,
            items: [],
            caseTotal: '64',
          },
        ],
        caseTotal: '64',
      },
      {
        id: 3577,
        name: '体温单',
        projectId: 15,
        moduleId: 144,
        parentId: 3575,
        parentTree: '/3564/3575',
        desc: null,
        belongMenu: 0,
        isMenu: 0,
        items: [],
        caseTotal: '24',
      },
      {
        id: 3578,
        name: '护理文书',
        projectId: 15,
        moduleId: 145,
        parentId: 3575,
        parentTree: '/3564/3575',
        desc: null,
        belongMenu: 0,
        isMenu: 0,
        items: [],
        caseTotal: '1',
      },
      {
        id: 3579,
        name: '体征批量录入',
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
    caseTotal: '113',
  },
  {
    id: 3580,
    name: '血糖批量录入',
    projectId: 15,
    moduleId: 147,
    parentId: 3564,
    parentTree: '/3564',
    desc: null,
    belongMenu: 0,
    isMenu: 0,
    items: [],
    caseTotal: '12',
  },
  {
    id: 3581,
    name: '门诊电子病历对接',
    projectId: 15,
    moduleId: 148,
    parentId: 3564,
    parentTree: '/3564',
    desc: null,
    belongMenu: 0,
    isMenu: 0,
    items: [],
    caseTotal: '25',
  },
  {
    id: 3583,
    name: '门诊之情同意书对接',
    projectId: 15,
    moduleId: 150,
    parentId: 3564,
    parentTree: '/3564',
    desc: null,
    belongMenu: 0,
    isMenu: 0,
    items: [],
    caseTotal: '8',
  },
];

export default function () {
  const [treeData, setTreeData] = useState<any>([]);
  // const treeData = [
  //   {
  //     title: 'http1',
  //     key: '0-0',
  //     tags: {
  //       type: 'http',
  //       duration: '110ms',
  //     },
  //     children: [
  //       {
  //         title: 'http 1-0',
  //         key: '0-0-0',
  //         tags: {
  //           type: 'mysql',
  //           duration: '10ms',
  //         },
  //         children: [
  //           {
  //             title: 'leaf',
  //             key: '0-0-0-0',
  //             tags: {
  //               type: 'http',
  //               duration: '111ms',
  //             },
  //           },
  //           {
  //             title: 'leaf',
  //             key: '0-0-0-2',
  //             tags: {
  //               type: 'http',
  //               duration: '111ms',
  //             },
  //           },
  //         ],
  //       },
  //       {
  //         title: 'http 1-1',
  //         key: '0-0-1',
  //         tags: {
  //           type: 'redis',
  //           duration: '111ms',
  //         },
  //         children: [
  //           {
  //             title: 'leaf',
  //             key: '0-0-1-0',
  //             tags: {
  //               type: 'http',
  //               duration: '111ms',
  //             },
  //           },
  //         ],
  //       },
  //       {
  //         title: 'http 1-2',
  //         key: '0-0-2',
  //         tags: {
  //           type: 'http',
  //           duration: '111ms',
  //         },
  //         children: [
  //           {
  //             title: 'leaf',
  //             key: '0-0-2-0',
  //             tags: {
  //               type: 'http',
  //               duration: '111ms',
  //             },
  //           },
  //           {
  //             title: 'leaf',
  //             key: '0-0-2-1',
  //             tags: {
  //               type: 'dubbo',
  //               duration: '111ms',
  //             },
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     title: 'http 2',
  //     key: '0-1',
  //     tags: {
  //       type: 'grpc',
  //       duration: '50ms',
  //     },
  //     children: [
  //       {
  //         title: 'http 2-0',
  //         key: '0-1-0',
  //         tags: {
  //           type: 'http',
  //           duration: '111ms',
  //         },
  //         children: [
  //           {
  //             title: 'leaf',
  //             key: '0-1-0-0',
  //             tags: {
  //               type: 'http',
  //               duration: '80ms',
  //             },
  //           },
  //           {
  //             title: 'leaf',
  //             key: '0-1-0-1',
  //             tags: {
  //               type: 'http',
  //               duration: '150ms',
  //             },
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // ];
  const titleList = [
    { key: 'list', label: '列表', icon: <UnorderedListOutlined /> },
    { key: 'table', label: '表格', icon: <UnorderedListOutlined /> },
  ];
  useEffect(() => {
    if (temp.length !== 0) {
      temp.forEach((item: any) => {});
    }
  }, [temp]);

  const handleData = (data: any) => {
    data.forEach((i: any) => {
      i.children = i.items;
    });
  };
  return (
    <div className="trace-wrapper">
      <div className="trace-wrapper-title">
        {titleList.map((item) => {
          return (
            <span>
              {item.icon}
              {item.label}
            </span>
          );
        })}
      </div>
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
              {node.title && (
                <div style={{ width: '100%', display: 'flex' }}>
                  <span className="span-title" style={{}}>
                    {node.title}
                  </span>
                  <span className="span-detail">
                    {Object.keys(node.tags || {}).map((k: any) => (
                      <span className="span-tag" title={k}>
                        <Tag style={{ lineHeight: '14px', padding: '0 3px' }} color="blue">
                          {node.tags[k]}
                        </Tag>
                      </span>
                    ))}
                  </span>
                  <Progress
                    percent={(parseFloat(node.tags.duration) * 100) / 200}
                    showInfo={false}
                    trailColor="transparent"
                  />
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
