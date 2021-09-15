// user list tags
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/30 20:05

import React, { useMemo } from 'react';
import { Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { TagProps } from 'antd/lib/tag';
import { stringToList } from './index';

export interface UserTagListProps extends TagProps {
  data?: string | string[];
}

export default function UserTagList({ data, ...others }: UserTagListProps) {
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
        <Tag key={index} icon={<UserOutlined />} {...others}>
          {str}
        </Tag>
      ))}
    </div>
  );
}
