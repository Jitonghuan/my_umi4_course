
 export const dailTypeOptions = [
    { label: 'http(s)', value: 'http' },
    { label: 'Ping', value: 'ping' },
    { label: 'Dns', value: 'dns' },
    { label: 'Tcp', value: 'tcp' },
    { label: 'Grpc', value: 'grpc' },
  ];
  export const frequencyOptions = [
    { label: '1分钟', value: '1min' },
    { label: '5分钟', value: '5min' },
    { label: '15分钟', value: '15min' },
    { label: '30分钟', value: '30min' },
    { label: '60分钟', value: '60min' },
  ];
  export const questConfigOptions=[
    { label: 'Header', value: 'header' },
    { label: 'Authorization', value: 'authorization' },
  
  ]
  export const tcpQuestConfig=[
    { label: 'QueryResponse', value: 'QueryResponse' },
  ]
  export  const dnsTypeOptions=[ 
  { label: 'A', value: '1min' },
  { label: 'MX', value: '5min' },
  { label: 'NS', value: '15min' },
  { label: 'CNAME', value: '30min' },
  { label: 'TXT', value: '60min' },
  { label: 'ANY', value: '60min' },
  { label: 'AAAA', value: '60min' },
]
export const visitAgreementOption=[
    { label: 'tcp', value: '1min' },
    { label: 'udp', value: '5min' },
    { label: 'tcp-tls', value: '15min' },
]