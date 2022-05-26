// user list tags
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/30 20:05

import React, { useMemo } from 'react';
import { Tag } from '@cffe/h2o-design';
import { UserOutlined } from '@ant-design/icons';
import type { TagProps } from 'antd/lib/tag';
import { stringToList } from './index';

export interface UserTagListProps extends TagProps {
  data?: string | string[];
}

export default function UserTagList({ data, color, ...others }: UserTagListProps) {
  const displayData = useMemo(() => {
    if (!data) return [];

    if (typeof data === 'string') {
      return stringToList(data);
    }

    return data;
  }, [data]);

  return (
    <div className="user-tag-list">
      {displayData.map((str, index) => (
        <Tag key={index} icon={<UserOutlined />} {...others} color="#f0f0f0" style={{ color: color || '#666' }}>
          {str}
        </Tag>
      ))}
    </div>
  );
}
