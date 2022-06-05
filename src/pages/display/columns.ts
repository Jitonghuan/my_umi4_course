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

export const detailColumns = [
    {
        title: '参考值上限',
        dataIndex: 'referenceValueUp',
        key: 'referenceValueUp',
    },
    {
        title: '参考值下限',
        dataIndex: 'referenceValueDown',
        key: 'referenceValueDown',
    },
    {
        title: '创建时间',
        dataIndex: 'creatTime',
        key: 'creatTime',
    },
    {
        title: '个人编号',
        dataIndex: 'onePersonId',
        key: 'onePersonId',
    },
    {
        title: '计量单位',
        dataIndex: 'measureUnitName',
        key: 'measureUnitName',
    },
    {
        title: '检验单据号',
        dataIndex: 'labReportNo',
        key: 'labReportNo',
    },
    {
        title: '检验结果',
        dataIndex: 'labResultValue',
        key: 'labResultValue',
    },
    {
        title: '检验明细编码',
        dataIndex: 'labDetailCode',
        key: 'labDetailCode',
    },
    {
        title: '检验明细流水号',
        dataIndex: 'labDetailNo',
        key: 'labDetailNo',
    },
    {
        title: '检验明细名称',
        dataIndex: 'labDetailName',
        key: 'labDetailName',
    },
    {
        title: '经办日期',
        dataIndex: 'agentDateTime',
        key: 'agentDateTime',
    },
    {
        title: '就诊流水号',
        dataIndex: 'visitSeriNo',
        key: 'visitSeriNo',
    },
    {
        title: '异常提示',
        dataIndex: 'abnInfor',
        key: 'abnInfor',
    },
    {
        title: '组织机构代码',
        dataIndex: 'orgCode',
        key: 'orgCode',
    },
]