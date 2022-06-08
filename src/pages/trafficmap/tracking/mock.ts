export const beforeData = {
    "traceId": "b53cc380cc0f48a89502d4432b8edd41.1.16540499247470003",
    "segmentId": "b53cc380cc0f48a89502d4432b8edd41.1.16540499247470002",
    "spanId": 0,
    "parentSpanId": -1,
    "refs": [],
    "serviceCode": "hbos-doctor-station",
    "serviceInstanceName": "718aa91909564824a3615488b4fa4f88@10.200.93.65",
    "startTime": "1654049924747",
    "endTime": "1654050010456",
    "endpointName": "BDP-BizService:com.c2f.bdp.core.extensible.launch.InitRegistryStarter#onApplicationEvent",
    "type": "Local",
    "peer": "",
    "component": "Unknown",
    "isError": false,
    "layer": "Unknown",
    "tags": [
        {
            "key": "BDP身份标识（传递）",
            "value": "产品：null，场景：null，客户：null"
        },
        {
            "key": "BDP身份标识（计算）",
            "value": "{\"customerCode\":\"Fygs\",\"productCode\":\"Hbos\",\"scenarioCodes\":[]}"
        }
    ],
    "logs": [],
    "id": 0,
    "parentId": -1,
    "isMerged": false,
    "children": [
        {
            "traceId": "b53cc380cc0f48a89502d4432b8edd41.1.16540499247470003",
            "segmentId": "b53cc380cc0f48a89502d4432b8edd41.1.16540499247470002",
            "spanId": 1,
            "parentSpanId": 0,
            "refs": [],
            "serviceCode": "hbos-doctor-station",
            "serviceInstanceName": "718aa91909564824a3615488b4fa4f88@10.200.93.65",
            "startTime": "1654049939848",
            "endTime": "1654049939848",
            "endpointName": "Redisson/HMSET",
            "type": "Exit",
            "peer": "redis-master.hbos-test.svc.cluster.local:6379",
            "component": "Redisson",
            "isError": false,
            "layer": "Cache",
            "tags": [
                {
                    "key": "db.type",
                    "value": "Redis"
                },
                {
                    "key": "db.instance",
                    "value": "10.97.16.74:6379"
                },
                {
                    "key": "db.statement",
                    "value": "HMSET {bootCache}:redisson_options max-size 0 mode LRU"
                }
            ],
            "logs": [],
            "id": 1,
            "parentId": 0,
            "isMerged": false,
            "children": []
        },
        {
            "traceId": "b53cc380cc0f48a89502d4432b8edd41.1.16540499247470003",
            "segmentId": "b53cc380cc0f48a89502d4432b8edd41.1.16540499247470002",
            "spanId": 2,
            "parentSpanId": 0,
            "refs": [],
            "serviceCode": "hbos-doctor-station",
            "serviceInstanceName": "718aa91909564824a3615488b4fa4f88@10.200.93.65",
            "startTime": "1654049939917",
            "endTime": "1654049939917",
            "endpointName": "Redisson/HLEN",
            "type": "Exit",
            "peer": "redis-master.hbos-test.svc.cluster.local:6379",
            "component": "Redisson",
            "isError": false,
            "layer": "Cache",
            "tags": [
                {
                    "key": "db.type",
                    "value": "Redis"
                },
                {
                    "key": "db.instance",
                    "value": "10.97.16.74:6379"
                },
                {
                    "key": "db.statement",
                    "value": "HLEN bootCache"
                }
            ],
            "logs": [],
            "id": 2,
            "parentId": 0,
            "isMerged": false,
            "children": []
        },
        {
            "traceId": "b53cc380cc0f48a89502d4432b8edd41.1.16540499247470003",
            "segmentId": "b53cc380cc0f48a89502d4432b8edd41.1.16540499247470002",
            "spanId": 3,
            "parentSpanId": 0,
            "refs": [],
            "serviceCode": "hbos-doctor-station",
            "serviceInstanceName": "718aa91909564824a3615488b4fa4f88@10.200.93.65",
            "startTime": "1654049948321",
            "endTime": "1654049950667",
            "endpointName": "BDP-BizService:com.c2f.bdp.core.extensible.launch.InitRegistryStarter#onApplicationEvent",
            "type": "Local",
            "peer": "",
            "component": "Unknown",
            "isError": false,
            "layer": "Unknown",
            "tags": [
                {
                    "key": "BDP身份标识（传递）",
                    "value": "产品：Hbos，场景：null，客户：Fygs"
                }
            ],
            "logs": [],
            "id": 3,
            "parentId": 0,
            "isMerged": false,
            "children": [
                {
                    "traceId": "b53cc380cc0f48a89502d4432b8edd41.1.16540499247470003",
                    "segmentId": "b53cc380cc0f48a89502d4432b8edd41.1.16540499247470002",
                    "spanId": 4,
                    "parentSpanId": 3,
                    "refs": [],
                    "serviceCode": "hbos-doctor-station",
                    "serviceInstanceName": "718aa91909564824a3615488b4fa4f88@10.200.93.65",
                    "startTime": "1654049949410",
                    "endTime": "1654049950557",
                    "endpointName": "/nacos/v1/cs/configs",
                    "type": "Exit",
                    "peer": "nacos-headless.hbos-test.svc.cluster.local:8848",
                    "component": "HttpClient",
                    "isError": false,
                    "layer": "Http",
                    "tags": [
                        {
                            "key": "url",
                            "value": "http://nacos-headless.hbos-test.svc.cluster.local:8848/nacos/v1/cs/configs?dataId=&group=bdp-registry&pageNo=1&pageSize=1000&tenant=bdp-hbos&search=accurate"
                        },
                        {
                            "key": "http.method",
                            "value": "GET"
                        }
                    ],
                    "logs": [],
                    "id": 4,
                    "parentId": 3,
                    "isMerged": false,
                    "children": []
                }
            ]
        },
        {
            "traceId": "b53cc380cc0f48a89502d4432b8edd41.1.16540499247470003",
            "segmentId": "b53cc380cc0f48a89502d4432b8edd41.1.16540499247470002",
            "spanId": 5,
            "parentSpanId": 0,
            "refs": [],
            "serviceCode": "hbos-doctor-station",
            "serviceInstanceName": "718aa91909564824a3615488b4fa4f88@10.200.93.65",
            "startTime": "1654049971026",
            "endTime": "1654049971026",
            "endpointName": "Redisson/HMSET",
            "type": "Exit",
            "peer": "redis-master.hbos-test.svc.cluster.local:6379",
            "component": "Redisson",
            "isError": false,
            "layer": "Cache",
            "tags": [
                {
                    "key": "db.type",
                    "value": "Redis"
                },
                {
                    "key": "db.instance",
                    "value": "10.97.16.74:6379"
                },
                {
                    "key": "db.statement",
                    "value": "HMSET {bootCache}:redisson_options max-size 0 mode LRU"
                }
            ],
            "logs": [],
            "id": 5,
            "parentId": 0,
            "isMerged": false,
            "children": []
        },
        {
            "traceId": "b53cc380cc0f48a89502d4432b8edd41.1.16540499247470003",
            "segmentId": "b53cc380cc0f48a89502d4432b8edd41.1.16540499247470002",
            "spanId": 6,
            "parentSpanId": 0,
            "refs": [],
            "serviceCode": "hbos-doctor-station",
            "serviceInstanceName": "718aa91909564824a3615488b4fa4f88@10.200.93.65",
            "startTime": "1654049971029",
            "endTime": "1654049971030",
            "endpointName": "Redisson/HLEN",
            "type": "Exit",
            "peer": "redis-master.hbos-test.svc.cluster.local:6379",
            "component": "Redisson",
            "isError": false,
            "layer": "Cache",
            "tags": [
                {
                    "key": "db.type",
                    "value": "Redis"
                },
                {
                    "key": "db.instance",
                    "value": "10.97.16.74:6379"
                },
                {
                    "key": "db.statement",
                    "value": "HLEN bootCache"
                }
            ],
            "logs": [],
            "id": 6,
            "parentId": 0,
            "isMerged": false,
            "children": []
        },
        {
            "traceId": "b53cc380cc0f48a89502d4432b8edd41.1.16540499247470003",
            "segmentId": "b53cc380cc0f48a89502d4432b8edd41.1.16540499247470002",
            "spanId": 7,
            "parentSpanId": 0,
            "refs": [],
            "serviceCode": "hbos-doctor-station",
            "serviceInstanceName": "718aa91909564824a3615488b4fa4f88@10.200.93.65",
            "startTime": "1654049979131",
            "endTime": "1654049979181",
            "endpointName": "BDP-BizService:com.c2f.bdp.core.extensible.launch.InitRegistryStarter#onApplicationEvent",
            "type": "Local",
            "peer": "",
            "component": "Unknown",
            "isError": false,
            "layer": "Unknown",
            "tags": [
                {
                    "key": "BDP身份标识（传递）",
                    "value": "产品：Hbos，场景：null，客户：Fygs"
                }
            ],
            "logs": [],
            "id": 7,
            "parentId": 0,
            "isMerged": false,
            "children": [
                {
                    "traceId": "b53cc380cc0f48a89502d4432b8edd41.1.16540499247470003",
                    "segmentId": "b53cc380cc0f48a89502d4432b8edd41.1.16540499247470002",
                    "spanId": 8,
                    "parentSpanId": 7,
                    "refs": [],
                    "serviceCode": "hbos-doctor-station",
                    "serviceInstanceName": "718aa91909564824a3615488b4fa4f88@10.200.93.65",
                    "startTime": "1654049979146",
                    "endTime": "1654049979169",
                    "endpointName": "/nacos/v1/cs/configs",
                    "type": "Exit",
                    "peer": "nacos-headless.hbos-test.svc.cluster.local:8848",
                    "component": "HttpClient",
                    "isError": false,
                    "layer": "Http",
                    "tags": [
                        {
                            "key": "url",
                            "value": "http://nacos-headless.hbos-test.svc.cluster.local:8848/nacos/v1/cs/configs?dataId=&group=bdp-registry&pageNo=1&pageSize=1000&tenant=bdp-hbos&search=accurate"
                        },
                        {
                            "key": "http.method",
                            "value": "GET"
                        }
                    ],
                    "logs": [],
                    "id": 8,
                    "parentId": 7,
                    "isMerged": false,
                    "children": []
                }
            ]
        },
        {
            "traceId": "b53cc380cc0f48a89502d4432b8edd41.1.16540499247470003",
            "segmentId": "b53cc380cc0f48a89502d4432b8edd41.1.16540499247470002",
            "spanId": 9,
            "parentSpanId": 0,
            "refs": [],
            "serviceCode": "hbos-doctor-station",
            "serviceInstanceName": "718aa91909564824a3615488b4fa4f88@10.200.93.65",
            "startTime": "1654049998117",
            "endTime": "1654049998117",
            "endpointName": "Redisson/HMSET",
            "type": "Exit",
            "peer": "redis-master.hbos-test.svc.cluster.local:6379",
            "component": "Redisson",
            "isError": false,
            "layer": "Cache",
            "tags": [
                {
                    "key": "db.type",
                    "value": "Redis"
                },
                {
                    "key": "db.instance",
                    "value": "10.97.16.74:6379"
                },
                {
                    "key": "db.statement",
                    "value": "HMSET {bootCache}:redisson_options max-size 0 mode LRU"
                }
            ],
            "logs": [],
            "id": 9,
            "parentId": 0,
            "isMerged": false,
            "children": []
        },
        {
            "traceId": "b53cc380cc0f48a89502d4432b8edd41.1.16540499247470003",
            "segmentId": "b53cc380cc0f48a89502d4432b8edd41.1.16540499247470002",
            "spanId": 10,
            "parentSpanId": 0,
            "refs": [],
            "serviceCode": "hbos-doctor-station",
            "serviceInstanceName": "718aa91909564824a3615488b4fa4f88@10.200.93.65",
            "startTime": "1654049998119",
            "endTime": "1654049998119",
            "endpointName": "Redisson/HLEN",
            "type": "Exit",
            "peer": "redis-master.hbos-test.svc.cluster.local:6379",
            "component": "Redisson",
            "isError": false,
            "layer": "Cache",
            "tags": [
                {
                    "key": "db.type",
                    "value": "Redis"
                },
                {
                    "key": "db.instance",
                    "value": "10.97.16.74:6379"
                },
                {
                    "key": "db.statement",
                    "value": "HLEN bootCache"
                }
            ],
            "logs": [],
            "id": 10,
            "parentId": 0,
            "isMerged": false,
            "children": []
        },
        {
            "traceId": "b53cc380cc0f48a89502d4432b8edd41.1.16540499247470003",
            "segmentId": "b53cc380cc0f48a89502d4432b8edd41.1.16540499247470002",
            "spanId": 11,
            "parentSpanId": 0,
            "refs": [],
            "serviceCode": "hbos-doctor-station",
            "serviceInstanceName": "718aa91909564824a3615488b4fa4f88@10.200.93.65",
            "startTime": "1654050005840",
            "endTime": "1654050005892",
            "endpointName": "BDP-BizService:com.c2f.bdp.core.extensible.launch.InitRegistryStarter#onApplicationEvent",
            "type": "Local",
            "peer": "",
            "component": "Unknown",
            "isError": false,
            "layer": "Unknown",
            "tags": [
                {
                    "key": "BDP身份标识（传递）",
                    "value": "产品：Hbos，场景：null，客户：Fygs"
                }
            ],
            "logs": [],
            "id": 11,
            "parentId": 0,
            "isMerged": false,
            "children": [
                {
                    "traceId": "b53cc380cc0f48a89502d4432b8edd41.1.16540499247470003",
                    "segmentId": "b53cc380cc0f48a89502d4432b8edd41.1.16540499247470002",
                    "spanId": 12,
                    "parentSpanId": 11,
                    "refs": [],
                    "serviceCode": "hbos-doctor-station",
                    "serviceInstanceName": "718aa91909564824a3615488b4fa4f88@10.200.93.65",
                    "startTime": "1654050005854",
                    "endTime": "1654050005880",
                    "endpointName": "/nacos/v1/cs/configs",
                    "type": "Exit",
                    "peer": "nacos-headless.hbos-test.svc.cluster.local:8848",
                    "component": "HttpClient",
                    "isError": false,
                    "layer": "Http",
                    "tags": [
                        {
                            "key": "url",
                            "value": "http://nacos-headless.hbos-test.svc.cluster.local:8848/nacos/v1/cs/configs?dataId=&group=bdp-registry&pageNo=1&pageSize=1000&tenant=bdp-hbos&search=accurate"
                        },
                        {
                            "key": "http.method",
                            "value": "GET"
                        }
                    ],
                    "logs": [],
                    "id": 12,
                    "parentId": 11,
                    "isMerged": false,
                    "children": []
                }
            ]
        },
        {
            "traceId": "b53cc380cc0f48a89502d4432b8edd41.1.16540499247470003",
            "segmentId": "b53cc380cc0f48a89502d4432b8edd41.1.16540499247470002",
            "spanId": 13,
            "parentSpanId": 0,
            "refs": [],
            "serviceCode": "hbos-doctor-station",
            "serviceInstanceName": "718aa91909564824a3615488b4fa4f88@10.200.93.65",
            "startTime": "1654050006064",
            "endTime": "1654050006083",
            "endpointName": "/nacos/v1/cs/configs",
            "type": "Exit",
            "peer": "nacos-headless.hbos-test.svc.cluster.local:8848",
            "component": "HttpClient",
            "isError": false,
            "layer": "Http",
            "tags": [
                {
                    "key": "url",
                    "value": "http://nacos-headless.hbos-test.svc.cluster.local:8848/nacos/v1/cs/configs?dataId=&group=bdp-registry&pageNo=1&pageSize=1000&tenant=bdp-hbos&search=accurate"
                },
                {
                    "key": "http.method",
                    "value": "GET"
                }
            ],
            "logs": [],
            "id": 13,
            "parentId": 0,
            "isMerged": false,
            "children": []
        }
    ]
}