import React, { useEffect, useState, useMemo, useContext } from 'react';

import VCForm, { IColumns } from '@cffe/vc-form';
import FEContext from '@/layouts/basic-layout/FeContext';
import VCPageContent, {
  FilterCard,
  ContentCard,
} from '@/components/vc-page-content';
import './index.less';
import VcHulkTable, { usePaginated } from '@cffe/vc-hulk-table';
import { tableSchema } from './schema';
import { getRequest } from '@/utils/request';
import { queryTestResult } from '../service';

/**
 * 自动化测试结果
 * @description 自动化测试结果页面
 * @author yyf
 * @version 1.0.0
 * @create 2021-04-09 15:04
 */
const Coms = () => {
  const feContent = useContext(FEContext);
  const { businessData = [] } = feContent || {};
  const initBusiness = businessData?.length > 0 ? businessData[0].value : '';

  // 过滤操作
  const [filter, setFilter] = useState<any>({
    business: initBusiness,
  });

  // 查询表格
  const { run: queryTableData, tableProps, reset } = usePaginated({
    requestUrl: queryTestResult,
    requestMethod: 'GET',
  });

  // 过滤操作
  const handleFilter = (vals: any) => {
    const targetFilter = {
      ...vals,
    };

    // 时间处理
    const { testTime = [undefined, undefined] } = targetFilter;
    if (testTime) {
      targetFilter.startTime = testTime[0]
        ? testTime[0].format('YYYY-MM-DD')
        : '';
      targetFilter.endTime = testTime[1]
        ? testTime[1].format('YYYY-MM-DD')
        : '';
    }
    delete targetFilter.testTime;

    setFilter(targetFilter);
  };

  // filter-columns
  const filterColumns = useMemo(() => {
    return [
      {
        label: '业务线',
        name: 'business',
        type: 'Select',
        options: businessData,
        initialValue: initBusiness,
      },
      { label: '测试时间', name: 'testTime', type: 'RangePicker' },
      { label: '机构ID', name: 'id' },
      {
        label: '测试结果',
        name: 'result',
        type: 'Select',
        options: [
          { value: 0, label: '未运行' },
          { value: 1, label: '运行中' },
          { value: 2, label: '成功' },
          { value: 3, label: '失败' },
        ],
      },
      { label: '测试环境', name: 'env', type: 'Select' },
      {
        label: '构建方式',
        name: 'buildType',
        type: 'Select',
        options: [
          { value: 1, label: '手动' },
          { value: 2, label: '自动' },
        ],
      },
    ] as IColumns[];
  }, [businessData]);

  useEffect(() => {
    queryTableData(filter);
  }, [filter]);

  const curTableColumns = useMemo(() => {
    return tableSchema.concat([
      {
        title: '操作',
        dataIndex: 'operate',
        valueType: 'action',
        actions: [
          { key: 'report', text: '测试报告' },
          { key: 'log', text: '查看日志' },
        ],
        onAction: (actionKey) => {
          console.log(actionKey);
        },
      },
    ]);
  }, []);

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
          submitText="查询"
          onSubmit={handleFilter}
          onReset={() => {
            reset();
            setFilter({ business: initBusiness });
          }}
        />
      </FilterCard>

      <ContentCard>
        <VcHulkTable columns={curTableColumns} {...tableProps} />
      </ContentCard>
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
