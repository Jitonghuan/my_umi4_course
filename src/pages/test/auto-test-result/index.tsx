import React, { useEffect, useState, useMemo, useContext } from 'react';

import { Button, Modal } from 'antd';
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
import dayjs from '_dayjs@1.10.4@dayjs';

/**
 * 自动化测试结果
 * @description 自动化测试结果页面
 * @author yyf
 * @version 1.0.0
 * @create 2021-04-09 15:04
 */
const Coms = () => {
  const feContent = useContext(FEContext);
  const { categoryData = [], envData = [] } = feContent || {};

  const [currentRecord, setCurrentRecord] = useState<any>({});
  const [operateType, setOperateType] = useState<
    'log' | 'report' | undefined
  >();

  // 过滤操作， 默认定位医共体
  const [filter, setFilter] = useState<any>({ belong: 'gmc' });

  // 查询表格
  const {
    run: queryTableData,
    tableProps,
    reset,
  } = usePaginated({
    requestUrl: queryTestResult,
    requestMethod: 'GET',
    showRequestError: true,
    pagination: {
      showTotal: ((total: number) => `总共 ${total} 条数据`) as any,
      showSizeChanger: true,
    },
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
        label: '应用分类',
        name: 'belong',
        type: 'Select',
        options: categoryData,
        initialValue: filter.belong,
      },
      { label: '测试时间', name: 'testTime', type: 'RangePicker' },
      { label: 'ID', name: 'id' },
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
      {
        label: '测试环境',
        name: 'env',
        type: 'Select',
        options: envData,
      },
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
  }, [categoryData, envData]);

  useEffect(() => {
    if (!filter.belong) {
      return;
    }
    queryTableData(filter);
  }, [filter]);

  // 表格操作项
  const handleOperate = (type: 'report' | 'log', oData: any) => {
    setCurrentRecord(oData);
    setOperateType(type);
  };

  const curTableColumns = useMemo(() => {
    return tableSchema.concat([
      {
        title: '操作',
        dataIndex: 'operate',
        render: (_, record) => {
          return (
            <React.Fragment>
              {Number(record.status) === 2 && (
                <a onClick={() => handleOperate('report', record)}>测试报告</a>
              )}
              {!!record.errorLog && (
                <a
                  style={{ marginLeft: '12px' }}
                  onClick={() => handleOperate('log', record)}
                >
                  查看日志
                </a>
              )}
            </React.Fragment>
          );
        },
      },
    ]);
  }, []);

  return (
    <VCPageContent
      height="calc(100vh - 58px)"
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
            setFilter({ belong: filter.belong });
          }}
        />
      </FilterCard>

      <ContentCard>
        <VcHulkTable columns={curTableColumns} {...tableProps} />
      </ContentCard>

      <Modal
        className={operateType === 'report' ? 'test-full-modal' : ''}
        width={operateType === 'report' ? '100%' : 800}
        visible={!!operateType}
        title={operateType === 'report' ? '查看报告' : '查看日志'}
        bodyStyle={
          operateType === 'report'
            ? {}
            : { height: '400px', overflow: 'hidden' }
        }
        onCancel={() => {
          setCurrentRecord({});
          setOperateType(undefined);
        }}
        footer={
          <Button type="primary" onClick={() => setOperateType(undefined)}>
            关闭
          </Button>
        }
      >
        {operateType === 'report' ? (
          <iframe src={currentRecord.report} width="100%" height="100%" />
        ) : (
          <div className="test-modal-log">{currentRecord.errorLog}</div>
        )}
      </Modal>
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
