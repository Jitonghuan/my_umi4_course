// configmap/secrets 详情界面
import React, { useEffect, useCallback, useRef, useState, useMemo, useContext } from 'react';
import { Form, Button, Input, Tag, Empty, Alert, message, Pagination, Space, Popconfirm } from 'antd';
import { EyeInvisibleOutlined, MinusCircleOutlined, LeftOutlined, EyeOutlined, RedoOutlined } from '@ant-design/icons';
import AddTagModal from '@/pages/pedestal/cluster-detail/load-detail/add-modal';
import TagConfirm from '@/components/tag-confirm';
import AddData from './add-data';
import { history, useLocation, } from 'umi';
import { parse, stringify } from 'query-string';
import clusterContext from '../../context';
import { getResourceList, resourceUpdate, resourceDel } from '../../service';

import './index.less'
const mock: any = { first: '标签1' }
const mockData = { info: {} }
export default function CsDetail(props: any) {
    const location: any = useLocation();
    const query = parse(location.search);
    const { type, kind, name, namespace } = query || {};
    const { clusterCode, clusterName } = useContext(clusterContext);
    const [form] = Form.useForm();
    const [addTag, setAddTag] = useState<boolean>(false);
    const [tagLoading, setTagLoading] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);
    const [data, setData] = useState<any>({});
    const [addType, setAddType] = useState<string>('tag');
    const [loading, setLoading] = useState<boolean>(false);
    const [secret, setSecret] = useState<boolean>(true);
    const [hasChange, setHasChange] = useState<boolean>(false);
    const [saveLoading, setSaveLoading] = useState<boolean>(false);
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({} as any), []);
    useEffect(() => {
        form.setFieldsValue({ 'base-tags': [undefined] });
        queryData()
    }, []);
    useEffect(() => {
        if (data?.data) {
            const v = data?.data || {};
            const array = Object.keys(v).map((item) => ({ key: item, value: v[item] }))
            form.setFieldsValue({ 'base-data': array })
        }
    }, [data])

    const queryData = () => {
        getResourceList({ clusterCode, resourceName: name, resourceType: type, namespace: namespace })
            .then((res: any) => {
                if (res?.success) {
                    const { items } = res?.data || [];
                    if (items && items[0]) {
                        setData(items[0].info || {});
                    }
                } else {
                    setData({});
                }
            })
            .finally(() => {
            });
    };
    // 新增标签/注释
    const onSave = (params: any) => {
        const requstParams = JSON.parse(JSON.stringify(data));
        const value = params['tags'];
        if (addType === 'tag') {
            // 新增标签
            requstParams.labels = requstParams?.labels || {};
            for (const item of value) {
                if (Object.keys(requstParams.labels).includes(item.key)) {
                    message.error('存在重复的key！');
                    return false;
                }
                requstParams.labels[item.key] = item.value;
            }
        } else {
            // 新增注释
            requstParams.annotations = requstParams?.annotations || {};
            for (const item of value) {
                if (Object.keys(requstParams.annotations).includes(item.key)) {
                    message.error('存在重复的key！');
                    return false;
                }
                requstParams.annotations[item.key] = item.value;
            }
        }
        setTagLoading(true);
        resourceUpdate({
            resourceType: type,
            namespace: namespace,
            clusterCode,
            resourceName: name,
            updateBody: JSON.stringify(requstParams),
        })
            .then((res) => {
                if (res?.success) {
                    message.success('操作成功！');
                    queryData();
                    setAddTag(false);
                }
            })
            .finally(() => {
                setTagLoading(false);
            });
    }
    // 删除标签/注释/data
    const handleClose = async (key: string, updateParams: string) => {
        const infoData = JSON.parse(JSON.stringify(data));
        if (updateParams === 'tag') {
            infoData.labels[key] = undefined;
        }
        if (updateParams === 'annotations') {
            infoData.annotations[key] = undefined;
        }
        if (updateParams === 'data') {
            infoData.data[key] = undefined;
          
        }
        const res: any = await resourceUpdate({
            resourceType: type,
            namespace: namespace,
            clusterCode,
            resourceName: name,
            updateBody: JSON.stringify(infoData),
        });
        if (res?.success) {
            message.success('操作成功！');
            if (updateParams === 'annotations') {
                initSearch()
            } else {
                queryData();
            }
        }
    };
    // 新增data
    const saveData = (params: any) => {
        const requstParams = JSON.parse(JSON.stringify(data));
        const value = params['base-data'];
        requstParams.data = requstParams?.data || {};
        for (const i of value) {
            // if (Object.keys(requstParams.data).includes(i.key)) {
            //     message.error('存在重复的key！');
            //     return false;
            // }
            requstParams.data[i.key] = type === 'secrets' ? btoa(i.value) : i.value;
        }
        setLoading(true);
        setSaveLoading(true)
        resourceUpdate({
            resourceType: type,
            namespace: namespace,
            clusterCode,
            resourceName: name,
            updateBody: JSON.stringify(requstParams),
        })
            .then((res) => {
                if (res?.success) {
                    message.success('操作成功！');
                    setVisible(false);
                    initSearch();
                }
            })
            .finally(() => {
                setLoading(false);
                setSaveLoading(false)

            });
    }
    // 转码/解码
    const handleSecret = (isSecret: boolean) => {
        setSecret(isSecret);
        const values = form.getFieldsValue()['base-data'];
        let res: any = [];
        if (isSecret) {
            res = values.map((item: any) => ({ ...item, value: btoa(item.value) }))
        } else {
            res = values.map((item: any) => ({ ...item, value: atob(item.value) }))
        }
        form.setFieldsValue({ 'base-data': res })
    }
    // 检测data表单的数据是否有变动
    const handleValuesChange = (item: any, allValue: any) => {
        const v = data?.data || {};
        const array = Object.keys(v).map((item) => ({ key: item, value: type === 'secrets' ? atob(v[item]) : v[item] }))
        const originStr = JSON.stringify(array)
        if (originStr === JSON.stringify(allValue['base-data'] || {})) {
            setHasChange(false)
        } else {
            setHasChange(true)
        }
    }

    const initSearch = () => {
        queryData();
        setSecret(true);
        setHasChange(false)
    }
    return (
        <div className='cs-detail'>
            <AddTagModal
                visible={addTag}
                onCancel={() => {
                    setAddTag(false);
                }}
                type='tag'
                onSave={onSave}
                loading={tagLoading}
            ></AddTagModal>
            <AddData
                visible={visible}
                onCancel={() => { setVisible(false); }}
                onSave={saveData}
                loading={loading}
            >
            </AddData>
            {/* data部分 */}
            <div className='flex-space-between'>
                <p>
                    <LeftOutlined
                        style={{ fontSize: '18px' }}
                        onClick={() => {
                            history.push({
                                pathname: `/matrix/pedestal/cluster-detail/resource-detail`,
                                search: stringify(query)
                            });
                        }}
                    />
                    <span className='return-name'>{name}</span>

                    {type === 'secrets' ? <Tag color='blue' style={{ marginLeft: '10px' }}>{data?.secretType || '---'}</Tag> : null}
                </p>
                <p>
                    <Button
                        icon={<RedoOutlined />}
                        onClick={() => {
                            initSearch()
                        }}
                        style={{ margin: '0px 10px' }}
                        size="small"
                    >
                        刷新
          </Button>
                </p>
            </div>

            <div>
                <div className='flex-space-between'>
                    <div className='title'>Data：
                    {/* {hasChange ? <span style={{ color: 'red', fontSize: '14px' }}>检测到有数据变动且未保存,请点击右侧保存更改</span> : null} */}
                    </div>
                    <div>
                        {type === 'secrets' && Object.keys(data?.data || {}).length ?
                            secret ?
                                <EyeInvisibleOutlined style={{ marginRight: '10px', fontSize: '20px' }} onClick={() => { handleSecret(false) }} /> :
                                <EyeOutlined style={{ marginRight: '10px', fontSize: '20px' }} onClick={() => { handleSecret(true) }} />
                            : null}
                        <Button
                            size="small"
                            disabled={!hasChange}
                            style={{ marginRight: '10px' }}
                            onClick={() => {
                                saveData(form.getFieldsValue())
                            }}
                            loading={saveLoading}
                        >
                            保存更改
                 </Button>
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => {
                                setVisible(true)
                            }}
                        >
                            新增
                 </Button>
                    </div>
                </div>
                {Object.keys(data?.data || {}).length ?
                    <Form form={form} name="base" autoComplete="off" colon={false} onValuesChange={handleValuesChange}>
                        <Form.List name="base-data" >
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field, index) => (
                                        <Space key={field.key} align="center" >
                                            <Form.Item
                                                noStyle
                                                shouldUpdate={(prevValues, curValues) =>
                                                    true
                                                }
                                            >
                                                {() => (
                                                    <Form.Item
                                                        {...field}
                                                        className="v-item"
                                                        // style={{ marginTop: '-43px' }}
                                                        label={index === 0 ? 'KEY' : ''}
                                                        name={[field.name, 'key']}
                                                    >
                                                        <Input.TextArea disabled autoSize={{ minRows: 3, maxRows: 10 }} style={{ width: '350px' }} />
                                                    </Form.Item>
                                                )}
                                            </Form.Item>

                                            <Form.Item
                                                className="v-item"
                                                shouldUpdate={(prevValues, curValues) =>
                                                    true
                                                }
                                                {...field}
                                                label={index === 0 ? 'VALUE' : ''}
                                                name={[field.name, 'value']}
                                            >
                                                <Input.TextArea disabled={type === 'secrets' && secret} autoSize={{ minRows: 3, maxRows: 10 }} style={{ width: '450px' }} />
                                            </Form.Item>
                                            {/* <div
                                                className="v-item"
                                            > */}
                                            {/* {form.getFieldValue('base-data')[index].secret && <EyeInvisibleOutlined style={{ fontSize: '14px' }}
                                                onClick={() => {
                                                    form.setFieldValue(['base-data', index, 'secret'], false);
                                                    form.setFieldValue(['base-data', index, 'value'], atob(form.getFieldValue(['base-data', index, 'value'])))
                                                    forceUpdate();
                                                }}
                                            />}
                                            {!form.getFieldValue('base-data')[index].secret && <EyeOutlined
                                                onClick={() => {
                                                    form.setFieldValue(['base-data', index, 'secret'], true)
                                                    form.setFieldValue(['base-data', index, 'value'], btoa(form.getFieldValue(['base-data', index, 'value'])))
                                                    forceUpdate();

                                                }}
                                            />} */}
                                            {/* </div> */}
                                            <Popconfirm title='确定要删除吗？' onConfirm={() => {
                                                const item = form.getFieldsValue()['base-data'][index];
                                                handleClose(item?.key, 'data')
                                            }}>
                                                <MinusCircleOutlined style={{ marginLeft: '10px' }} className="tag-icon" />
                                            </Popconfirm>
                                        </Space>
                                    ))}
                                </>
                            )}
                        </Form.List>
                    </Form> :
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                }
            </div>
            {/* label部分 */}
            <div>
                <div className='flex-space-between'>
                    <div className='title'>Labels:</div>
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                            setAddType('tag');
                            setAddTag(true);
                        }}
                    >
                        新增
                 </Button>
                </div>
                <div className="tag-wrapper">
                    {Object.keys(data?.labels || {}).map((item: any) => {
                        return (
                            <TagConfirm
                                content={`${item}:${data?.labels[item]}`}
                                title='你确定要删除该标签吗？'
                                onConfirm={() => { handleClose(item, 'tag') }}
                                style={{ marginTop: '5px' }}
                            >
                            </TagConfirm>
                        );
                    })}
                </div>
            </div>
            {/* 注释部分 */}
            <div>
                <div className='flex-space-between'>
                    <div className='title'>Annotions:</div>
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                            setAddType('annotation');
                            setAddTag(true);
                        }}
                    >
                        新增
                 </Button>
                </div>
                <div className="tag-wrapper">
                    {Object.keys(data?.annotations || {}).map((item: any) => {
                        return (
                            <TagConfirm
                                content={`${item}:${data?.annotations[item]}`}
                                title='你确定要删除吗？'
                                onConfirm={() => { handleClose(item, 'annotations') }}
                                style={{ marginTop: '5px' }}
                            >
                            </TagConfirm>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}