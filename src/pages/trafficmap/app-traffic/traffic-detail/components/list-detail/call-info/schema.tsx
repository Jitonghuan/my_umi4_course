import { Space, Tooltip, Tag } from 'antd';
import moment from 'moment'

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
      title: '请求数',
      dataIndex: 'cpm',
      key: 'cpm',
      // width: 40,
    },
    {
      title: '平均RT',
      dataIndex: 'avg',
      key: 'avg',
      // width: 50,
    },
    {
      title: '成功率',
      dataIndex: 'sr',
      key: 'sr',
      // width: 50,
    },
    {
      title: '失败数',
      dataIndex: 'fail',
      key: 'fail',
      // width: 50,
    },
  ]
}

export const cpmConfig = (data = []) => {
  return {
    data,
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
    data,
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
    data,
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
    data,
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