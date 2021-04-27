import React, { useEffect, useMemo, useState, useContext } from 'react';
import { Card, Empty, message, Select, Tree, Input, Button } from 'antd';
import { history } from 'umi';
import _ from 'lodash';

import HulkTable, { ColumnProps, usePaginated } from '@cffe/vc-hulk-table';
import VCForm, { IColumns } from '@cffe/vc-form';
import { FilterCard } from '@/components/vc-page-content';
import { IMenuItem } from '@/components/vc-menu';
import MatrixPageContent from '@/components/matrix-page-content';
import PageLoading from '@cffe/vc-loading';

import FEContext from '@/layouts/basic-layout/FeContext';
import { testCaseTableSchema } from './schema';
import { queryAutoTest, queryAutoTextGroup, createAutoTest } from '../service';
import ds from '@config/defaultSettings';

import './index.less';
import { getRequest, postRequest } from '@/utils/request';

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
  const { belongData = [], envData = [] } = feContent || {};

  // 业务线数据
  const [belong, setBelong] = useState<string>('gmc');
  // 左侧用例集数据
  const [treeLoading, setTreeLoading] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<IMenuItem[]>([]);

  // tree select key
  const [treeSelectKeys, setTreeSelectKeys] = useState<string[]>([]);

  // 搜索
  const [searchKey, setSearchKey] = useState<string>('');

  // 表格选中数据
  const [tableSelect, setTableSelect] = useState<React.Key[]>([]);

  // 执行环境选择
  const [envVal, setEnvVal] = useState<string>();

  // 查询 tree 数据
  const queryTreeData = async () => {
    setTreeLoading(true);
    const resp = await getRequest(queryAutoTextGroup, {
      data: {
        belong,
      },
    });
    setTreeLoading(false);

    const { data = [] } = resp;

    if (!data || data.length === 0) {
      message.error(resp.errorMsg);
      return;
    }

    // 设置初始化选中 key,(04.27备注，默认不选中，查全部)
    // if (data.length > 0) {
    //   setTreeSelectKeys([data[0].preGroupName]);
    // }

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
    pagination: {
      showTotal: ((total: number) => `总共 ${total} 条数据`) as any,
      showSizeChanger: true,
    },
  });

  // 执行脚本
  const handleOperate = async (
    type: 'run' | 'runall' | 'result',
    record?: any,
  ) => {
    if (type === 'result') {
      history.push(`${ds.pagePrefix}/test/result`);
      return;
    }

    // 传递参数
    const caseList =
      type === 'run'
        ? [
            {
              groupName: record.groupName,
              testCase: record.testCase,
            },
          ]
        : tableSelect.map((el: any) => ({
            groupName: el.groupName,
            testCase: el.testCase,
          }));

    const groupNameArr =
      treeSelectKeys.length > 0 ? treeSelectKeys[0].split('-') : [];
    const params = {
      belong,
      env: envVal,
      preGroupName: groupNameArr.length > 0 ? groupNameArr[0] : undefined,
      groupName: groupNameArr.length > 1 ? groupNameArr[1] : undefined,
      caseList,
    };

    const resp = await postRequest(createAutoTest, {
      data: {
        ...params,
      },
    });

    if (!resp.success) {
      message.error(resp.errorMsg);
      return;
    }

    message.success('执行成功');

    if (type === 'runall') {
      setTableSelect([]);
    }
  };

  // table columns
  const tableColumns: ColumnProps[] = testCaseTableSchema.concat([
    {
      title: '操作',
      dataIndex: 'operate',
      width: 60,
      render: (_, record) => (
        <a onClick={() => handleOperate('run', record)}>执行</a>
      ),
    },
  ]);

  useEffect(() => {
    // 业务线切换
    if (!!belong) {
      queryTreeData();
    }
  }, [belong]);

  useEffect(() => {
    setEnvVal(envData.length > 0 ? envData[0].value : undefined);
  }, []);

  // 触发查询表格数据
  const handleQueryTable = () => {
    const [preGroupName, groupName] =
      treeSelectKeys?.length > 0 ? treeSelectKeys[0].split('-') : ['', ''];

    // 只有存在业务线和测试集数据的时候才可以获取表格数据
    if (belong) {
      queryTableData({
        belong,
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
        name: 'belong',
        label: '所属',
        type: 'Select',
        options: belongData,
        initialValue: belong,
      },
    ] as IColumns[];
  }, [belongData, belong]);

  // 表格相关重置, 翻页重置，搜索重置，表格选中重置
  const handleResetTable = () => {
    reset();
    setSearchKey('');
    setTableSelect([]);
  };

  return (
    <MatrixPageContent isFlex>
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
            setBelong(value);
          }}
        />
      </FilterCard>

      <div className="test-page-content">
        <Card className="test-page-content-sider">
          {treeLoading && <PageLoading mode="module" text={null} />}
          {treeData.length > 0 ? (
            <Tree
              selectedKeys={treeSelectKeys}
              className="hide-file-icon"
              showLine={{ showLeafIcon: false }}
              defaultExpandAll
              treeData={treeData}
              onSelect={(val) => {
                handleResetTable();
                setTreeSelectKeys(val as string[]);
              }}
            />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </Card>

        <Card className="test-page-content-body">
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
                onSearch={() => {
                  reset();
                  handleQueryTable();
                }}
              />
            </div>
            <Select
              value={envVal}
              onChange={setEnvVal}
              className="test-table-header-env"
              options={envData}
              placeholder="请选择环境"
            />
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
              onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
                setTableSelect(selectedRows);
              },
            }}
          />
        </Card>
      </div>
    </MatrixPageContent>
  );
};

export default Coms;
