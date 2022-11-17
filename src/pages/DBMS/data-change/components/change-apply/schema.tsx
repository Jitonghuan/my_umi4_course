
export const START_TIME_ENUMS = [
 
    {
      label: '一小时',
      value: 62 * 60 * 1000 ,
    },
    {
      label: '两小时',
      value: 2 * 60 * 60 * 1000+2 *60*1000,
    },
    {
      label: '三小时',
      value: 3 * 60 * 60 * 1000 +2 *60*1000,
    },
    
  ];

  export const options = [
    { label: '是', value: true },
    { label: '否', value:false},
    
  ];
  export const sqlWfTypeOptions = [
    { label: '结构变更', value: "ddl" },
    { label: '数据变更', value:"sql"},
    
  ];