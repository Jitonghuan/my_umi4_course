import data from './data';

// 医保上传检验单表结构
export const columns = [
    {
        title: '报告日期时间',
        dataIndex: '报告日期时间',
        key: '报告日期时间',
    },
    {
        title: '标本编号',
        dataIndex: '标本编号',
        key: '标本编号',
    },
    {
        title: '标本名称',
        dataIndex: '标本名称',
        key: '标本名称',
    },
    {
        title: '创建时间',
        dataIndex: '创建时间',
        key: '创建时间',
    },
    {
        title: '个人编号',
        dataIndex: '个人编号',
        key: '个人编号',
    },
    {
        title: '检查日期时间',
        dataIndex: '检查日期时间',
        key: '检查日期时间',
    },
    {
        title: '校验单据号',
        dataIndex: '校验单据号',
        key: '校验单据号',
    },
    {
        title: '经办时间',
        dataIndex: '经办时间',
        key: '经办时间',
    },
    {
        title: '就诊流水号',
        dataIndex: '就诊流水号',
        key: '就诊流水号',
    },
    {
        title: '科室编码',
        dataIndex: '科室编码',
        key: '科室编码',
    },
    {
        title: '科室名称',
        dataIndex: '科室名称',
        key: '科室名称',
    },
    {
        title: '医师服务编码',
        dataIndex: '医师服务编码',
        key: '医师服务编码',
    },
    {
        title: '医师姓名',
        dataIndex: '医师姓名',
        key: '医师姓名',
    },
    {
        title: '医院收费项目编码',
        dataIndex: '医院收费项目编码',
        key: '医院收费项目编码',
    },
    {
        title: '医院收费项目名称',
        dataIndex: '医院收费项目名称',
        key: '医院收费项目名称',
    },
    {
        title: '诊断编码',
        dataIndex: '诊断编码',
        key: '诊断编码',
    },
    {
        title: '诊断名称',
        dataIndex: '诊断名称',
        key: '诊断名称',
    },
    {
        title: '中心收费项目编码',
        dataIndex: '中心收费项目编码',
        key: '中心收费项目编码',
    },
    {
        title: '组织机构代码',
        dataIndex: '组织机构代码',
        key: '组织机构代码',
    }
]
// 医保上传检验单表数据
export const tableData = data.医保上传检验单表数据;

// 校验明细表结构
export const detailColumns = [
    {
        title: '参考值上限',
        dataIndex: '参考值上限',
        key: '参考值上限',
    },
    {
        title: '参考值下限',
        dataIndex: '参考值下限',
        key: '参考值下限',
    },
    {
        title: '创建时间',
        dataIndex: '创建时间',
        key: '创建时间',
    },
    {
        title: '个人编号',
        dataIndex: '个人编号',
        key: '个人编号',
    },
    {
        title: '计量单位',
        dataIndex: '计量单位',
        key: '计量单位',
    },
    {
        title: '检验单据号',
        dataIndex: '检验单据号',
        key: '检验单据号',
    },
    {
        title: '检验结果',
        dataIndex: '检验结果',
        key: '检验结果',
    },
    {
        title: '检验明细编码',
        dataIndex: '检验明细编码',
        key: '检验明细编码',
    },
    {
        title: '检验明细流水号',
        dataIndex: '检验明细流水号',
        key: '检验明细流水号',
    },
    {
        title: '检验明细名称',
        dataIndex: '检验明细名称',
        key: '检验明细名称',
    },
    {
        title: '经办日期',
        dataIndex: '经办日期',
        key: '经办日期',
    },
    {
        title: '就诊流水号',
        dataIndex: '就诊流水号',
        key: '就诊流水号',
    },
    {
        title: '异常提示',
        dataIndex: '异常提示',
        key: '异常提示',
    },
    {
        title: '组织机构代码',
        dataIndex: '组织机构代码',
        key: '组织机构代码',
    },
]

// 校验明细表数据
export const detailTableData = data.校验明细表数据;

// 两个表的交集
export const commonColumns = [...columns, ...detailColumns]
// 两个表交集的数据
export const commonTableData = data.交集的数据;