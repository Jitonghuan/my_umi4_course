import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useContext,
} from 'react';
import { Input, Button } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';

import HulkTable, { ColumnProps } from '@cffe/vc-hulk-table';
import { InlineForm } from '@cffe/fe-backend-component';
import VCPageContent, {
  FilterCard,
  ContentCard,
} from '@/components/vc-page-content';
import VCMenu, { IMenuItem } from '@/components/vc-menu';

import FEContext from '@/layouts/basic-layout/FeContext';
import { filterSchema, testCaseTableSchema } from './schema';

import './index.less';

/**
 * 自动化测试
 * @description 自动化测试
 * @author yyf
 * @version 1.0.0
 * @create 2021-04-06 15:15
 */
const Coms = (props: any) => {
  const { location } = props;
  const feContent = useContext(FEContext);

  const [searchKey, setSearchKey] = useState<string>('');

  // 用例集 menuData
  const [menuData, setMenuData] = useState<IMenuItem[]>([
    {
      title: 'mis',
      key: 'mis',
      icon: <AppstoreOutlined />,
      children: [{ title: 'nurse', key: 'nurse' }],
    },
    { title: 'cis', key: 'cis' },
  ]);

  // 过滤操作 TODO
  const handleFilter = useCallback((vals) => {
    console.log(vals);
  }, []);

  // 执行脚本
  const handleRun = (caseLists: any[]) => {
    console.log(caseLists);
  };

  // table columns
  const tableColumns: ColumnProps[] = useMemo(() => {
    return testCaseTableSchema.concat([
      {
        title: '操作',
        dataIndex: 'operate',
        width: 100,
        render: (_, record) => <a onClick={() => handleRun([record])}>执行</a>,
      },
    ]);
  }, []);

  useEffect(() => {
    // TODO 搜索查询表格数据
    console.log(111);
  }, [searchKey]);

  return (
    <VCPageContent
      height="calc(100vh - 118px)"
      breadcrumbMap={feContent.breadcrumbMap}
      pathname={location.pathname}
      isFlex
    >
      <FilterCard>
        <InlineForm
          className="test-filter-form"
          {...(filterSchema as any)}
          isShowReset
          onFinish={handleFilter}
        />
      </FilterCard>

      <div className="test-page-content">
        <div className="test-page-content-sider">
          <VCMenu menuData={menuData} />
        </div>

        <div className="test-page-content-body">
          <div className="test-table-header">
            <div className="test-table-header-search">
              <Input.Search
                placeholder="输入用例名称\用例集\用例标签搜索"
                onPressEnter={(e) => setSearchKey(e.target.value)}
              />
            </div>
            <Button type="primary" onClick={() => {}}>
              批量执行
            </Button>
            <Button
              type="primary"
              onClick={() => {}}
              style={{ marginLeft: '12px' }}
            >
              查看结果
            </Button>
          </div>
          <HulkTable columns={tableColumns} />
        </div>
      </div>
    </VCPageContent>
  );
};

/**
 * 默认值
 */
Coms.defaultProps = {
  // 属性默认值配置
};

export default Coms;
