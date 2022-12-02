import { Space, Tooltip, Tag } from 'antd';
import { getColor } from '../../../../schema';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { sortTime } from '@/utils';
import moment from 'moment'
const tooltipText = <ul>
  <li>时间窗口范围小于等于一个小时，显示为每分钟平均请求数。</li>
  <li>时间窗范围超过一个小时，显示为每个小时平均每分钟的请求数。</li>
  <li>时间窗范围超过一天，显示为每天的平均每分钟请求数。</li>
</ul>
export const columnSchema = () => {
  return [
    {
      title: '时间',
      dataIndex: 'time',
      key: 'id',
      // ellipsis: true,
      render: (text: string) => <Tooltip title={text}>{text}</Tooltip>,
      // width: 100,
    },
    {
      title: <div>请求数(次/min)
        <Tooltip title={tooltipText} placement="top">
          <QuestionCircleOutlined style={{ marginLeft: 4 }} />
        </Tooltip>
      </div>,
      dataIndex: 'cpm',
      key: 'cpm',
      // width: 40,
    },
    {
      title: '平均RT(ms)',
      dataIndex: 'avg',
      key: 'avg',
      render: (value: any) => <span style={{ color: getColor(value, 'rt') }}>{value}</span>,
      // width: 50,
    },
    {
      title: '成功率(%)',
      dataIndex: 'sr',
      key: 'sr',
      render: (value: any) => <span style={{ color: getColor(value, 'sr') }}>{value}</span>,
      // width: 50,
    },
    {
      title: '失败数(次)',
      dataIndex: 'fail',
      key: 'fail',
      // width: 50,
    },
  ]
}

export const cpmConfig = (data = []) => {
  return {
    data: splitTime(data),
    padding: 'auto',
    xField: 'time',
    yField: 'value',
    xAxis: {
      range: [0, 1],
      // tickCount: 5,
    },
    // yAxis: false,
  };
}

export const avgConfig = (data = []) => {
  return {
    data: splitTime(data),
    padding: 'auto',
    xField: 'time',
    yField: 'value',
    xAxis: {
      range: [0, 1],
      // tickCount: 5,
    },
    // yAxis: false,
  };
}

export const srConfig = (data = []) => {
  return {
    data: splitTime(data),
    padding: 'auto',
    xField: 'time',
    yField: 'value',
    xAxis: {
      range: [0, 1],
      // tickCount: 5,
    },
    // yAxis: false,
  };
}

export const failConfig = (data = []) => {
  return {
    data: splitTime(data),
    padding: 'auto',
    xField: 'time',
    yField: 'value',
    xAxis: {
      range: [0, 1],
      // tickCount: 5,
    },
    // yAxis: false,
  };
}

// 对时间进行处理 取最后的时间
export const splitTime = (arr: any) => {
  const newArray = JSON.parse(JSON.stringify(arr || '[]'))
  newArray.forEach((item: any) => {
    let timeList = item.time.split(' ');
    if (timeList.length > 1) {
      item.time = timeList[timeList.length - 1]
    } else {
      item.time = timeList[0]
    }
  })
  return newArray;
}

export const multiChartConfig = ({ cpm = [], fail = [] }) => {
  let data: any = [];
  const newSr = splitTime(sortTime(cpm)).map((item: any) => ({ name: '请求数', time: item.time, value: item.value }));
  const newFail = splitTime(sortTime(fail)).map((item: any) => ({ name: '失败数', time: item.time, value: item.value }));
  data = [...newSr, ...newFail]
  return {
    data,
    padding: 'auto',
    xField: 'time',
    yField: 'value',
    seriesField: 'name',
    // xAxis: false,
    legend: {
      position: 'top',
      itemHeight: 1,
    },
    xAxis: {
      // range: [0, 0.8],
      // tickCount: 5,
    },
    // yAxis: false,
  };
}

export const mock = [
  {
    "url": "hbos-dtc/com.c2f.hbos.dtc.client.doctororder.service.IDoctorOrderApiService.validateDoctorOrder(DoctorOrderValidateRequest)",
    "endpointCPM": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 0
        },
        {
          "time": "2022-11-21 15:27",
          "value": 0
        },
        {
          "time": "2022-11-21 15:28",
          "value": 0
        },
        {
          "time": "2022-11-21 15:29",
          "value": 0
        },
        {
          "time": "2022-11-21 15:30",
          "value": 1
        },
        {
          "time": "2022-11-21 15:31",
          "value": 1
        }
      ]
    },
    "endpointAvg": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 0
        },
        {
          "time": "2022-11-21 15:27",
          "value": 0
        },
        {
          "time": "2022-11-21 15:28",
          "value": 0
        },
        {
          "time": "2022-11-21 15:29",
          "value": 0
        },
        {
          "time": "2022-11-21 15:30",
          "value": 46
        }
      ]
    },
    "endpointSR": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 0
        },
        {
          "time": "2022-11-21 15:27",
          "value": 0
        },
        {
          "time": "2022-11-21 15:28",
          "value": 0
        },
        {
          "time": "2022-11-21 15:29",
          "value": 0
        },
        {
          "time": "2022-11-21 15:30",
          "value": 0
        }
      ]
    },
    "endpointFailed": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 0
        },
        {
          "time": "2022-11-21 15:27",
          "value": 0
        },
        {
          "time": "2022-11-21 15:28",
          "value": 0
        },
        {
          "time": "2022-11-21 15:29",
          "value": 0
        },
        {
          "time": "2022-11-21 15:30",
          "value": 0
        }
      ]
    }
  },
  {
    "url": "hbos-dtc/com.c2f.hbos.dtc.client.allergy.service.IAllergyRecordApiService.queryAllergenRecordList(AllergyRecordQueryRequest)",
    "endpointCPM": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 2
        },
        {
          "time": "2022-11-21 15:27",
          "value": 2
        },
        {
          "time": "2022-11-21 15:28",
          "value": 2
        },
        {
          "time": "2022-11-21 15:29",
          "value": 2
        },
        {
          "time": "2022-11-21 15:30",
          "value": 2
        }
      ]
    },
    "endpointAvg": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 20
        },
        {
          "time": "2022-11-21 15:27",
          "value": 19
        },
        {
          "time": "2022-11-21 15:28",
          "value": 12
        },
        {
          "time": "2022-11-21 15:29",
          "value": 15
        },
        {
          "time": "2022-11-21 15:30",
          "value": 12
        }
      ]
    },
    "endpointSR": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 0
        },
        {
          "time": "2022-11-21 15:27",
          "value": 0
        },
        {
          "time": "2022-11-21 15:28",
          "value": 0
        },
        {
          "time": "2022-11-21 15:29",
          "value": 0
        },
        {
          "time": "2022-11-21 15:30",
          "value": 0
        }
      ]
    },
    "endpointFailed": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 0
        },
        {
          "time": "2022-11-21 15:27",
          "value": 0
        },
        {
          "time": "2022-11-21 15:28",
          "value": 0
        },
        {
          "time": "2022-11-21 15:29",
          "value": 0
        },
        {
          "time": "2022-11-21 15:30",
          "value": 0
        }
      ]
    }
  },
  {
    "url": "hbos-dtc/com.c2f.hbos.dtc.client.skintest.service.ISkinTestApiService.querySkinTestByPatientId(SkinTestQueryByPatientIdRequest)",
    "endpointCPM": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 2
        },
        {
          "time": "2022-11-21 15:27",
          "value": 2
        },
        {
          "time": "2022-11-21 15:28",
          "value": 1
        },
        {
          "time": "2022-11-21 15:29",
          "value": 2
        },
        {
          "time": "2022-11-21 15:30",
          "value": 1
        }
      ]
    },
    "endpointAvg": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 31
        },
        {
          "time": "2022-11-21 15:27",
          "value": 57
        },
        {
          "time": "2022-11-21 15:28",
          "value": 30
        },
        {
          "time": "2022-11-21 15:29",
          "value": 26
        },
        {
          "time": "2022-11-21 15:30",
          "value": 27
        }
      ]
    },
    "endpointSR": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 0
        },
        {
          "time": "2022-11-21 15:27",
          "value": 0
        },
        {
          "time": "2022-11-21 15:28",
          "value": 0
        },
        {
          "time": "2022-11-21 15:29",
          "value": 0
        },
        {
          "time": "2022-11-21 15:30",
          "value": 0
        }
      ]
    },
    "endpointFailed": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 0
        },
        {
          "time": "2022-11-21 15:27",
          "value": 0
        },
        {
          "time": "2022-11-21 15:28",
          "value": 0
        },
        {
          "time": "2022-11-21 15:29",
          "value": 0
        },
        {
          "time": "2022-11-21 15:30",
          "value": 0
        }
      ]
    }
  },
  {
    "url": "hbos-dtc/com.c2f.hbos.dtc.client.skintest.service.ISkinTestApiService.querySkinTestByPatientId(SkinTestQueryByPatientIdRequest)",
    "endpointCPM": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 2
        },
        {
          "time": "2022-11-21 15:27",
          "value": 2
        },
        {
          "time": "2022-11-21 15:28",
          "value": 1
        },
        {
          "time": "2022-11-21 15:29",
          "value": 2
        },
        {
          "time": "2022-11-21 15:30",
          "value": 1
        }
      ]
    },
    "endpointAvg": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 31
        },
        {
          "time": "2022-11-21 15:27",
          "value": 57
        },
        {
          "time": "2022-11-21 15:28",
          "value": 30
        },
        {
          "time": "2022-11-21 15:29",
          "value": 26
        },
        {
          "time": "2022-11-21 15:30",
          "value": 27
        }
      ]
    },
    "endpointSR": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 0
        },
        {
          "time": "2022-11-21 15:27",
          "value": 0
        },
        {
          "time": "2022-11-21 15:28",
          "value": 0
        },
        {
          "time": "2022-11-21 15:29",
          "value": 0
        },
        {
          "time": "2022-11-21 15:30",
          "value": 0
        }
      ]
    },
    "endpointFailed": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 0
        },
        {
          "time": "2022-11-21 15:27",
          "value": 0
        },
        {
          "time": "2022-11-21 15:28",
          "value": 0
        },
        {
          "time": "2022-11-21 15:29",
          "value": 0
        },
        {
          "time": "2022-11-21 15:30",
          "value": 0
        }
      ]
    }
  },
  {
    "url": "hbos-dtc/com.c2f.hbos.dtc.client.skintest.service.ISkinTestApiService.querySkinTestByPatientId(SkinTestQueryByPatientIdRequest)",
    "endpointCPM": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 2
        },
        {
          "time": "2022-11-21 15:27",
          "value": 2
        },
        {
          "time": "2022-11-21 15:28",
          "value": 1
        },
        {
          "time": "2022-11-21 15:29",
          "value": 2
        },
        {
          "time": "2022-11-21 15:30",
          "value": 1
        }
      ]
    },
    "endpointAvg": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 31
        },
        {
          "time": "2022-11-21 15:27",
          "value": 57
        },
        {
          "time": "2022-11-21 15:28",
          "value": 30
        },
        {
          "time": "2022-11-21 15:29",
          "value": 26
        },
        {
          "time": "2022-11-21 15:30",
          "value": 27
        }
      ]
    },
    "endpointSR": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 0
        },
        {
          "time": "2022-11-21 15:27",
          "value": 0
        },
        {
          "time": "2022-11-21 15:28",
          "value": 0
        },
        {
          "time": "2022-11-21 15:29",
          "value": 0
        },
        {
          "time": "2022-11-21 15:30",
          "value": 0
        }
      ]
    },
    "endpointFailed": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 0
        },
        {
          "time": "2022-11-21 15:27",
          "value": 0
        },
        {
          "time": "2022-11-21 15:28",
          "value": 0
        },
        {
          "time": "2022-11-21 15:29",
          "value": 0
        },
        {
          "time": "2022-11-21 15:30",
          "value": 0
        }
      ]
    }
  },
  {
    "url": "hbos-dtc/com.c2f.hbos.dtc.client.skintest.service.ISkinTestApiService.querySkinTestByPatientId(SkinTestQueryByPatientIdRequest)",
    "endpointCPM": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 2
        },
        {
          "time": "2022-11-21 15:27",
          "value": 2
        },
        {
          "time": "2022-11-21 15:28",
          "value": 1
        },
        {
          "time": "2022-11-21 15:29",
          "value": 2
        },
        {
          "time": "2022-11-21 15:30",
          "value": 1
        }
      ]
    },
    "endpointAvg": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 31
        },
        {
          "time": "2022-11-21 15:27",
          "value": 57
        },
        {
          "time": "2022-11-21 15:28",
          "value": 30
        },
        {
          "time": "2022-11-21 15:29",
          "value": 26
        },
        {
          "time": "2022-11-21 15:30",
          "value": 27
        }
      ]
    },
    "endpointSR": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 0
        },
        {
          "time": "2022-11-21 15:27",
          "value": 0
        },
        {
          "time": "2022-11-21 15:28",
          "value": 0
        },
        {
          "time": "2022-11-21 15:29",
          "value": 0
        },
        {
          "time": "2022-11-21 15:30",
          "value": 0
        }
      ]
    },
    "endpointFailed": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 0
        },
        {
          "time": "2022-11-21 15:27",
          "value": 0
        },
        {
          "time": "2022-11-21 15:28",
          "value": 0
        },
        {
          "time": "2022-11-21 15:29",
          "value": 0
        },
        {
          "time": "2022-11-21 15:30",
          "value": 0
        }
      ]
    }
  },
  {
    "url": "hbos-dtc/com.c2f.hbos.dtc.client.skintest.service.ISkinTestApiService.querySkinTestByPatientId(SkinTestQueryByPatientIdRequest)",
    "endpointCPM": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 2
        },
        {
          "time": "2022-11-21 15:27",
          "value": 2
        },
        {
          "time": "2022-11-21 15:28",
          "value": 1
        },
        {
          "time": "2022-11-21 15:29",
          "value": 2
        },
        {
          "time": "2022-11-21 15:30",
          "value": 1
        }
      ]
    },
    "endpointAvg": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 31
        },
        {
          "time": "2022-11-21 15:27",
          "value": 57
        },
        {
          "time": "2022-11-21 15:28",
          "value": 30
        },
        {
          "time": "2022-11-21 15:29",
          "value": 26
        },
        {
          "time": "2022-11-21 15:30",
          "value": 27
        }
      ]
    },
    "endpointSR": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 0
        },
        {
          "time": "2022-11-21 15:27",
          "value": 0
        },
        {
          "time": "2022-11-21 15:28",
          "value": 0
        },
        {
          "time": "2022-11-21 15:29",
          "value": 0
        },
        {
          "time": "2022-11-21 15:30",
          "value": 0
        }
      ]
    },
    "endpointFailed": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 0
        },
        {
          "time": "2022-11-21 15:27",
          "value": 0
        },
        {
          "time": "2022-11-21 15:28",
          "value": 0
        },
        {
          "time": "2022-11-21 15:29",
          "value": 0
        },
        {
          "time": "2022-11-21 15:30",
          "value": 0
        }
      ]
    }
  },
  {
    "url": "hbos-dtc/com.c2f.hbos.dtc.client.skintest.service.ISkinTestApiService.querySkinTestByPatientId(SkinTestQueryByPatientIdRequest)",
    "endpointCPM": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 2
        },
        {
          "time": "2022-11-21 15:27",
          "value": 2
        },
        {
          "time": "2022-11-21 15:28",
          "value": 1
        },
        {
          "time": "2022-11-21 15:29",
          "value": 2
        },
        {
          "time": "2022-11-21 15:30",
          "value": 1
        }
      ]
    },
    "endpointAvg": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 31
        },
        {
          "time": "2022-11-21 15:27",
          "value": 57
        },
        {
          "time": "2022-11-21 15:28",
          "value": 30
        },
        {
          "time": "2022-11-21 15:29",
          "value": 26
        },
        {
          "time": "2022-11-21 15:30",
          "value": 27
        }
      ]
    },
    "endpointSR": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 0
        },
        {
          "time": "2022-11-21 15:27",
          "value": 0
        },
        {
          "time": "2022-11-21 15:28",
          "value": 0
        },
        {
          "time": "2022-11-21 15:29",
          "value": 0
        },
        {
          "time": "2022-11-21 15:30",
          "value": 0
        }
      ]
    },
    "endpointFailed": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 0
        },
        {
          "time": "2022-11-21 15:27",
          "value": 0
        },
        {
          "time": "2022-11-21 15:28",
          "value": 0
        },
        {
          "time": "2022-11-21 15:29",
          "value": 0
        },
        {
          "time": "2022-11-21 15:30",
          "value": 0
        }
      ]
    }
  },
  {
    "url": "hbos-dtc/com.c2f.hbos.dtc.client.skintest.service.ISkinTestApiService.querySkinTestByPatientId(SkinTestQueryByPatientIdRequest)",
    "endpointCPM": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 2
        },
        {
          "time": "2022-11-21 15:27",
          "value": 2
        },
        {
          "time": "2022-11-21 15:28",
          "value": 1
        },
        {
          "time": "2022-11-21 15:29",
          "value": 2
        },
        {
          "time": "2022-11-21 15:30",
          "value": 1
        }
      ]
    },
    "endpointAvg": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 31
        },
        {
          "time": "2022-11-21 15:27",
          "value": 57
        },
        {
          "time": "2022-11-21 15:28",
          "value": 30
        },
        {
          "time": "2022-11-21 15:29",
          "value": 26
        },
        {
          "time": "2022-11-21 15:30",
          "value": 27
        }
      ]
    },
    "endpointSR": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 0
        },
        {
          "time": "2022-11-21 15:27",
          "value": 0
        },
        {
          "time": "2022-11-21 15:28",
          "value": 0
        },
        {
          "time": "2022-11-21 15:29",
          "value": 0
        },
        {
          "time": "2022-11-21 15:30",
          "value": 0
        }
      ]
    },
    "endpointFailed": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 0
        },
        {
          "time": "2022-11-21 15:27",
          "value": 0
        },
        {
          "time": "2022-11-21 15:28",
          "value": 0
        },
        {
          "time": "2022-11-21 15:29",
          "value": 0
        },
        {
          "time": "2022-11-21 15:30",
          "value": 0
        }
      ]
    }
  },
  {
    "url": "hbos-dtc/com.c2f.hbos.dtc.client.skintest.service.ISkinTestApiService.querySkinTestByPatientId(SkinTestQueryByPatientIdRequest)",
    "endpointCPM": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 2
        },
        {
          "time": "2022-11-21 15:27",
          "value": 2
        },
        {
          "time": "2022-11-21 15:28",
          "value": 1
        },
        {
          "time": "2022-11-21 15:29",
          "value": 2
        },
        {
          "time": "2022-11-21 15:30",
          "value": 1
        }
      ]
    },
    "endpointAvg": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 31
        },
        {
          "time": "2022-11-21 15:27",
          "value": 57
        },
        {
          "time": "2022-11-21 15:28",
          "value": 30
        },
        {
          "time": "2022-11-21 15:29",
          "value": 26
        },
        {
          "time": "2022-11-21 15:30",
          "value": 27
        }
      ]
    },
    "endpointSR": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 0
        },
        {
          "time": "2022-11-21 15:27",
          "value": 0
        },
        {
          "time": "2022-11-21 15:28",
          "value": 0
        },
        {
          "time": "2022-11-21 15:29",
          "value": 0
        },
        {
          "time": "2022-11-21 15:30",
          "value": 0
        }
      ]
    },
    "endpointFailed": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 0
        },
        {
          "time": "2022-11-21 15:27",
          "value": 0
        },
        {
          "time": "2022-11-21 15:28",
          "value": 0
        },
        {
          "time": "2022-11-21 15:29",
          "value": 0
        },
        {
          "time": "2022-11-21 15:30",
          "value": 0
        }
      ]
    }
  },
  {
    "url": "hbos-dtc/com.c2f.hbos.dtc.client.skintest.service.ISkinTestApiService.querySkinTestByPatientId(SkinTestQueryByPatientIdRequest)",
    "endpointCPM": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 2
        },
        {
          "time": "2022-11-21 15:27",
          "value": 2
        },
        {
          "time": "2022-11-21 15:28",
          "value": 1
        },
        {
          "time": "2022-11-21 15:29",
          "value": 2
        },
        {
          "time": "2022-11-21 15:30",
          "value": 1
        }
      ]
    },
    "endpointAvg": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 31
        },
        {
          "time": "2022-11-21 15:27",
          "value": 57
        },
        {
          "time": "2022-11-21 15:28",
          "value": 30
        },
        {
          "time": "2022-11-21 15:29",
          "value": 26
        },
        {
          "time": "2022-11-21 15:30",
          "value": 27
        }
      ]
    },
    "endpointSR": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 0
        },
        {
          "time": "2022-11-21 15:27",
          "value": 0
        },
        {
          "time": "2022-11-21 15:28",
          "value": 0
        },
        {
          "time": "2022-11-21 15:29",
          "value": 0
        },
        {
          "time": "2022-11-21 15:30",
          "value": 0
        }
      ]
    },
    "endpointFailed": {
      "readMetricsValues": [
        {
          "time": "2022-11-21 15:26",
          "value": 0
        },
        {
          "time": "2022-11-21 15:27",
          "value": 0
        },
        {
          "time": "2022-11-21 15:28",
          "value": 0
        },
        {
          "time": "2022-11-21 15:29",
          "value": 0
        },
        {
          "time": "2022-11-21 15:30",
          "value": 0
        }
      ]
    }
  },

]