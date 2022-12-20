import React, { useState, useContext, useEffect } from 'react';
import { Button, Empty, Spin } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import DetailContext from '../../context';
import CardLayout from '@cffe/vc-b-card-layout';
// import { getTagList } from '@/pages/npm-manage/detail/server';
// import { getRequest } from '@/utils/request';
import RollbackVersion from './rollback';
import './index.less';
import axios from 'axios';

export default function VersionsManage() {
  const { npmData } = useContext(DetailContext);
  const [dataList, setDataList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tag, setTag] = useState('');
  const [activeVersion, setActiveVersion] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    void queryData();
  }, []);

  const queryData = async () => {
    setIsLoading(true);
    // const res = await getRequest(getTagList, {
    //   data: {
    //     npmName: npmData?.npmName
    //   }
    // })
    const res = await axios.get(`//registry.npm.cfuture.cc/-/package/${npmData?.npmName}/dist-tags`);
    let list = [];
    setIsLoading(false);
    if (res && res.data) {
      for (const key in res.data) {
        list.push({
          version: res.data[key],
          tag: key,
        });
      }
      setDataList(list);
    }
  };

  async function handleRollbackClick(item: any) {
    setTag(item.tag);
    setActiveVersion(item.version);
    setVisible(true);
  }

  return (
    <ContentCard className="page-fe-version">
      <div className="version-card-list clearfix">
        {isLoading && <Spin className="block-loading" />}
        {!isLoading && !dataList.length && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="发布记录为空" />}
        <CardLayout>
          {dataList.map((item) => (
            <div className="version-card-item" key={item.tag}>
              <div className="card-item-header">
                <h4>{item.tag}</h4>
              </div>
              <div className="card-item-body">
                <p>
                  当前版本: <b>{item?.version || '--'}</b>
                </p>
              </div>
              <div className="card-item-actions">
                <Button type="default" danger size="small" onClick={() => handleRollbackClick(item)}>
                  回滚
                </Button>
              </div>
            </div>
          ))}
        </CardLayout>
      </div>

      <RollbackVersion
        npmData={npmData}
        tag={tag}
        activeVersion={activeVersion}
        visible={visible}
        onClose={() => setVisible(false)}
        onSubmit={() => {
          setVisible(false);
          void queryData();
        }}
      />
    </ContentCard>
  );
}
