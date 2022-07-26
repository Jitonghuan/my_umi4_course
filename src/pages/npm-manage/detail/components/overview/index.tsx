import React, {useContext, useEffect, useState} from 'react';
import { Descriptions, Table } from 'antd';
import axios from 'axios';
import DetailContext from '../../context';
import './index.less';
import moment from "moment";

export default function Overview() {
  const { npmData } = useContext(DetailContext);
  const [versionList, setVersionList] = useState<any[]>([]);

  const getDeploy = () => {
    if (!npmData?.npmName) {
      return;
    }
    axios.get(`//registry.npm.cfuture.cc/${npmData?.npmName}`).then((res) => {
      if (res.status === 200 && res.data && res.data['dist-tags']) {
        const list = [];
        for (const tag in res.data['dist-tags']) {
          let version = res.data['dist-tags'][tag];
          let info =  res.data.versions[version] || {};
          list.push({
            tag,
            version,
            publishUser: info.publishUser || info._npmUser?.name,
            publishTime: moment(info['publish_time']).format('YYYY-MM-DD HH:mm:ss')
          })
        }
        setVersionList(list);
      }
    })
  }

  useEffect(() => {
    getDeploy();
  }, []);

  return (
    <div className="npm-detail-overview">
      <Descriptions
        title="基础信息"
        className="fixed"
        bordered
        column={1}
        labelStyle={{ width: 200 }}
      >
        <Descriptions.Item label="包名">{npmData?.npmName}</Descriptions.Item>
        <Descriptions.Item label="git地址">
          <a href={npmData?.gitAddress} target="_blank">
            {npmData?.gitAddress}
          </a>
        </Descriptions.Item>
        <Descriptions.Item label="owner">{npmData?.npmOwner}</Descriptions.Item>
        <Descriptions.Item label="应用描述">{npmData?.desc}</Descriptions.Item>
        <Descriptions.Item label="fnpm文档">
          <a href={`http://web.npm.cfuture.cc/package/${npmData?.npmName}`} target="_blank">
            {`http://web.npm.cfuture.cc/package/${npmData?.npmName}`}
          </a>
        </Descriptions.Item>
      </Descriptions>
      <div style={{marginTop: '25px'}}>
        <Descriptions
          title="版本信息"
          className="fixed"
          column={1}
          labelStyle={{ width: 200 }}
        />
        <Table
          scroll={{ x: '100%' }}
          style={{ width: '100%' }}
          bordered
          columns={[
            {
              title: 'Npm Tag',
              dataIndex: 'tag',
              width: 120,
            },
            {
              title: '生效版本号',
              dataIndex: 'version',
              width: 170,
            },
            {
              title: '发布人',
              dataIndex: 'publishUser',
              width: 120,
            },
            {
              title: '发布时间',
              dataIndex: 'publishTime',
              width: 180,
            },
          ]}
          dataSource={versionList}
          pagination={false}
        />
      </div>
    </div>
  )
}
