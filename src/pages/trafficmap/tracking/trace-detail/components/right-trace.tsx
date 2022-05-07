import React, { useEffect, useRef, useState } from 'react';
import { Form, Button } from 'antd';
import { Tree, Switch } from 'antd';
import { Tag, Divider, Progress } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
// import TraceTable from './trace-table'
import './index.less';
// import * as d3 from 'd3';

export default function () {
  const treeData = [
    {
      title: 'http1',
      key: '0-0',
      tags: {
        type: 'http',
        duration: '110ms',
      },
      children: [
        {
          title: 'http 1-0',
          key: '0-0-0',
          tags: {
            type: 'mysql',
            duration: '10ms',
          },
          children: [
            {
              title: 'leaf',
              key: '0-0-0-0',
              tags: {
                type: 'http',
                duration: '111ms',
              },
            },
            {
              title: 'leaf',
              key: '0-0-0-2',
              tags: {
                type: 'http',
                duration: '111ms',
              },
            },
          ],
        },
        {
          title: 'http 1-1',
          key: '0-0-1',
          tags: {
            type: 'redis',
            duration: '111ms',
          },
          children: [
            {
              title: 'leaf',
              key: '0-0-1-0',
              tags: {
                type: 'http',
                duration: '111ms',
              },
            },
          ],
        },
        {
          title: 'http 1-2',
          key: '0-0-2',
          tags: {
            type: 'http',
            duration: '111ms',
          },
          children: [
            {
              title: 'leaf',
              key: '0-0-2-0',
              tags: {
                type: 'http',
                duration: '111ms',
              },
            },
            {
              title: 'leaf',
              key: '0-0-2-1',
              tags: {
                type: 'dubbo',
                duration: '111ms',
              },
            },
          ],
        },
      ],
    },
    {
      title: 'http 2',
      key: '0-1',
      tags: {
        type: 'grpc',
        duration: '50ms',
      },
      children: [
        {
          title: 'http 2-0',
          key: '0-1-0',
          tags: {
            type: 'http',
            duration: '111ms',
          },
          children: [
            {
              title: 'leaf',
              key: '0-1-0-0',
              tags: {
                type: 'http',
                duration: '80ms',
              },
            },
            {
              title: 'leaf',
              key: '0-1-0-1',
              tags: {
                type: 'http',
                duration: '150ms',
              },
            },
          ],
        },
      ],
    },
  ];
  const titleList = [
    { key: 'list', label: '列表', icon: <UnorderedListOutlined /> },
    { key: 'table', label: '表格', icon: <UnorderedListOutlined /> },
  ];
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
