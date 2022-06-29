import React, { useState, useEffect } from 'react';
import CardLayout from '@cffe/vc-b-card-layout';
import { history } from 'umi';
import { Tag, Tooltip, Popconfirm, Modal } from 'antd';
import {
  StarFilled,
  StarTwoTone,
  Html5Outlined,
  CodeOutlined,
  UserOutlined,
  DeploymentUnitOutlined,
} from '@ant-design/icons';
import './index.less';
import { queryChartReadme } from '../../hook';
const cardCls = 'all-chart-page__card';
export function isValidKey(key: string | number | symbol, object: object): key is keyof typeof object {
  return key in object;
}

export interface IProps {
  curClusterName: string;
  curChartName: string;
  dataSource: any;
  queryChartListInfo: () => any;
  getChartVersions: (chartName?: string, repository?: string) => any;
}

export default function ApplicationCardList(props: IProps) {
  const { curClusterName, curChartName, dataSource, queryChartListInfo, getChartVersions } = props;
  const [mode, setMode] = useState<boolean>(false);
  const [readMe, setReadMe] = useState<string>('');
  const [isClick, setIsClick] = useState<string>('');

  return (
    <>
      <Modal
        title="ReadMe详情"
        visible={mode}
        footer={null}
        onCancel={() => {
          setMode(false);
        }}
        width={660}
      >
        <div style={{ height: 500, overflowY: 'auto' }}>{readMe}</div>
      </Modal>
      <CardLayout>
        {dataSource.map((item: any) => (
          <div
            key={item.chartName}
            className={cardCls}
            onClick={() => {
              getChartVersions(item?.chartName, item?.repository);
              setIsClick('onClick');
            }}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <DeploymentUnitOutlined style={{ fontSize: 22, color: 'blueviolet' }} />
            </div>

            <div className={`${cardCls}-header`} style={{ position: 'relative' }}>
              {item.chartName}
            </div>
            <div className={`${cardCls}-content`}>
              <div style={{ color: 'gray' }}>
                {item?.repository}&nbsp;&nbsp; | &nbsp;&nbsp;{item.chartVersion}
              </div>
              {/* <Tooltip title={item.chartVersion} placement='topLeft'>
              <div>
                <UserOutlined /> {item.chartVersion}
              </div>
            </Tooltip> */}
            </div>
            <Tooltip title={item.description}>
              {' '}
              <div
                className="chart-description"
                style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
              >
                {item?.description}
              </div>
            </Tooltip>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <a
                onClick={() => {
                  setMode(true);
                  queryChartReadme({
                    clusterName: curClusterName,
                    repository: item?.repository,
                    chartName: item.chartName,
                    chartVersion: item.chartVersion,
                  }).then((res) => {
                    setReadMe(res);
                  });
                }}
              >
                详情
              </a>
            </div>
          </div>
        ))}
      </CardLayout>
    </>
  );
}
