
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { findDOMNode } from 'react-dom';
import { Card, Select, Form, Tooltip, Tabs, Button, Row, Col,Table } from 'antd';
import { RedoOutlined, SyncOutlined } from '@ant-design/icons';
import HulkTable, { usePaginated, ColumnProps } from '@cffe/vc-hulk-table';
import VCCardLayout from '@cffe/vc-b-card-layout';
import {tableSchema} from './schema'
import { getRequest } from '@/utils/request';
import './index.less'
export default function InstanceMonitor(){
    return(
        <>
          <Card className="monitor-app-body">
          <h3 className="monitor-tabs-content-title">
            资源使用
        
          </h3>
          <Table bordered  columns={tableSchema as ColumnProps[]}  pagination={false}  onRow={(record) => {
              return {
                onClick: () => {
                 
                },
              };
            }} />
          
          </Card>
        </>
    )
}