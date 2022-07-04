import React, { useState, useEffect } from 'react';
import CardLayout from '@cffe/vc-b-card-layout';
import { history } from 'umi';
import ReactMarkdown from 'react-markdown';
import { Tag, Tooltip, Popconfirm, Modal } from 'antd';
import { DeploymentUnitOutlined } from '@ant-design/icons';
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
  getChartValues: (params: {
    chartName: string;
    clusterName: string;
    repository: string;
    // chartVersion: string;
  }) => any;
}

export default function ApplicationCardList(props: IProps) {
  const { curClusterName, curChartName, dataSource, queryChartListInfo, getChartVersions, getChartValues } = props;
  const [mode, setMode] = useState<boolean>(false);
  const [readMe, setReadMe] = useState<string>('');
  const [isClick, setIsClick] = useState<number>();
  console.log('-------dataSource------', dataSource);

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
        <div style={{ height: 500, overflowY: 'auto' }}>
          <ReactMarkdown
            children={readMe}
            className="markdown-html"
            // escapeHtml={false}  //不进行HTML标签的转化
          />
        </div>
      </Modal>

      <CardLayout>
        {dataSource &&
          dataSource?.map((item: any, index: number) => (
            <>
              {/* <div>
      {JSON.stringify(item)}
      </div> */}
              <div
                key={item.chartName}
                className={index === isClick ? 'all-chart-page__onClickcard' : cardCls}
                onClick={() => {
                  getChartVersions(item?.chartName, item?.repository);
                  setIsClick(index);
                  getChartValues({
                    chartName: item?.chartName,
                    clusterName: curClusterName,
                    repository: item?.repository,
                  });
                }}
              >
                <div>
                  <DeploymentUnitOutlined style={{ fontSize: 22, color: 'blueviolet' }} />
                </div>

                <div className={`${cardCls}-header`} style={{ position: 'relative' }}>
                  {item.chartName}
                </div>
                <div className={`${cardCls}-content`}>
                  <div style={{ color: 'gray' }}>
                    {item?.repository}&nbsp;&nbsp; | &nbsp;&nbsp;{item.chartVersion}
                  </div>
                </div>
                <Tooltip title={item.description} placement="topLeft">
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
            </>
          ))}
      </CardLayout>
    </>
  );
}
