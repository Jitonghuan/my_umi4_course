import React, { useEffect, useMemo, useState, useContext } from 'react';
import { Tree, Input, Button } from 'antd';
import { history } from 'umi';
import _ from 'lodash';

import HulkTable, { ColumnProps, usePaginated } from '@cffe/vc-hulk-table';
import VCForm, { IColumns } from '@cffe/vc-form';
import VCPageContent, { FilterCard } from '@/components/vc-page-content';
import VCMenu, { IMenuItem } from '@/components/vc-menu';
import PageLoading from '@cffe/vc-loading';

import FEContext from '@/layouts/basic-layout/FeContext';
import { testCaseTableSchema } from './schema';
import { queryAutoTest, queryAutoTextGroup } from '../service';
import ds from '@config/defaultSettings';

import './index.less';
import { getRequest } from '@/utils/request';

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
  const { businessData = [] } = feContent || {};

  // 业务线数据
  const [business, setBusiness] = useState<string>(
    businessData?.length > 0 ? businessData[0].value : '',
  );
  // 左侧用例集数据
  const [treeLoading, setTreeLoading] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<IMenuItem[]>([]);

  // tree select key
  const [treeSelectKeys, setTreeSelectKeys] = useState<React.Key[]>([]);

  // 搜索
  const [searchKey, setSearchKey] = useState<string>('');

  // 表格选中数据
  const [tableSelect, setTableSelect] = useState<React.Key[]>([]);

  // 查询 tree 数据
  const queryTreeData = async () => {
    setTreeLoading(true);
    const resp = await getRequest(queryAutoTextGroup, {
      data: {
        business,
      },
    });
    setTreeLoading(false);

    const { data = [] } = resp;

    // 设置初始化选中 key
    if (data.length > 0) {
      setTreeSelectKeys([data[0].preGroupName]);
    }

    setTreeData(
      data.map((el: any) => ({
        key: el.preGroupName,
        title: el.preGroupName,
        children: el.groups.map((ele: any) => ({
          title: ele.groupName,
          key: `${el.preGroupName}-${ele.groupName}`,
        })),
      })),
    );
  };

  // 查询表格数据
  const { run: queryTableData, tableProps, reset } = usePaginated({
    requestUrl: queryAutoTest,
    requestMethod: 'GET',
  });

  // 执行脚本
  const handleOperate = (type: 'run' | 'runall' | 'result', record?: any) => {
    console.log(type, record);
    switch (type) {
      case 'run':
        // TODO
        break;
      case 'runall':
        // TODO
        break;
      case 'result':
        history.push(`${ds.pagePrefix}/test/result`);
        // TODO
        break;
    }
  };

  // table columns
  const tableColumns: ColumnProps[] = useMemo(() => {
    return testCaseTableSchema.concat([
      {
        title: '操作',
        dataIndex: 'operate',
        width: 100,
        render: (_, record) => (
          <a onClick={() => handleOperate('run', record)}>执行</a>
        ),
      },
    ]);
  }, []);

  useEffect(() => {
    // 业务线切换
    queryTreeData();
  }, [business]);

  // 触发查询表格数据
  const handleQueryTable = () => {
    const [preGroupName, groupName] =
      treeSelectKeys?.length > 0 ? treeSelectKeys[0].split('-') : ['', ''];

    // 只有存在业务线和测试集数据的时候才可以获取表格数据
    if (business && treeSelectKeys.length > 0) {
      queryTableData({
        business,
        searchText: searchKey,
        preGroupName,
        groupName,
      });
    }
  };

  useEffect(() => {
    handleQueryTable();
  }, [treeSelectKeys]);

  // filter columns
  const filterColumns = useMemo(() => {
    return [
      {
        name: 'business',
        label: '业务线',
        type: 'Select',
        options: businessData,
        initialValue: business,
      },
    ] as IColumns[];
  }, []);

  // 表格相关重置, 翻页重置，搜索重置，表格选中重置
  const handleResetTable = () => {
    reset();
    setSearchKey('');
    setTableSelect([]);
  };

  return (
    <VCPageContent
      height="calc(100vh - 118px)"
      breadcrumbMap={feContent.breadcrumbMap}
      pathname={location.pathname}
      isFlex
    >
      <FilterCard bodyStyle={{ paddingBottom: '12px' }}>
        <VCForm
          layout="inline"
          columns={filterColumns}
          className="test-filter-form"
          isShowReset={false}
          isShowSubmit={false}
          submitText="查询"
          onChange={(fileds) => {
            const { value } = fileds[0] || {};
            handleResetTable();
            setBusiness(value);
          }}
        />
      </FilterCard>

      <div className="test-page-content">
        <div className="test-page-content-sider">
          {treeLoading && <PageLoading mode="module" text={null} />}
          {treeData.length > 0 && (
            <Tree
              selectedKeys={treeSelectKeys}
              className="hide-file-icon"
              showLine={{ showLeafIcon: false }}
              defaultExpandAll
              treeData={treeData}
              onSelect={(val) => {
                if (val.length > 0) {
                  handleResetTable();
                  setTreeSelectKeys(val);
                }
              }}
            />
          )}
        </div>

        <div className="test-page-content-body">
          <div className="test-table-header">
            <div className="test-table-header-search">
              <Input.Search
                value={searchKey}
                placeholder="输入用例名称\用例集\用例标签搜索"
                onChange={(e) => {
                  setSearchKey(e.target.value);
                }}
                onPressEnter={(e) => {
                  reset();
                  handleQueryTable();
                }}
              />
            </div>
            <Button type="primary" onClick={() => handleOperate('runall')}>
              批量执行
            </Button>
            <Button
              type="primary"
              onClick={() => handleOperate('result')}
              style={{ marginLeft: '12px' }}
            >
              查看结果
            </Button>
          </div>
          <HulkTable
            rowKey="id"
            {...tableProps}
            columns={tableColumns}
            rowSelection={{
              type: 'checkbox',
              onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) =>
                setTableSelect(selectedRowKeys),
            }}
          />
        </div>
      </div>
    </VCPageContent>
  );
};

export default Coms;
