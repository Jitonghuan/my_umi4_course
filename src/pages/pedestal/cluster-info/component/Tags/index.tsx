

import React, { useState, useEffect } from 'react';
import { Modal, Tag, Radio, Input, Select } from 'antd';
import { PlusCircleFilled, MinusCircleFilled } from '@ant-design/icons';
import './index.less'
const behaviorOptions = [
    { lable: 'NoSchedule', value: 'NoSchedule' },
    { lable: 'PreferNoSchedule', value: 'PreferNoSchedule' },
    { lable: 'NoExecute', value: 'NoExecute' },
]

const TagLine = (props: any) => {
    const { handleAdd, handleDelete, updateTags, item, tagType, index } = props;

    return <div className="tag-ops-line">
        <div className="item padding">
            <label htmlFor=""></label>
            <div className="item-bottom"><MinusCircleFilled onClick={() => handleDelete(item)} style={{ color: 'red' }} /></div>
        </div>

        < div className="item" >
            <label htmlFor="">Key</label>
            <div className="item-bottom"><Input type="text" value={item.key}
                onChange={e => updateTags(Object.assign(item, { key: e.currentTarget.value }))} /></div>
        </div >

        <div className="item padding">
            <label htmlFor=""></label>
            <div className="item-bottom">=</div>
        </div>
        <div className="item">
            <label htmlFor="">Value</label>
            <div className="item-bottom"> <Input type="text" value={item.value}
                onChange={e => updateTags(Object.assign(item, { value: e.currentTarget.value }))} /></div>
        </div>
        {
            tagType === 'dirty' && <div className="item behavior" >
                <label htmlFor="">Behavior</label>
                <div className="item-bottom">
                    <Select options={behaviorOptions} value={item.behavior}
                        onChange={value => updateTags(Object.assign(item, { behavior: value }))} style={{ width: '160px' }}></Select>
                </div>
            </div>
        }
        <div className="item padding">
            <label htmlFor=""></label>
            <div className="item-bottom"><PlusCircleFilled onClick={() => handleAdd(item)} style={{ color: 'green' }} /></div>
        </div>
    </div >
}

export default function Tags(props: any) {
    const [tags, setTags] = useState<any>([{}]);

    useEffect(() => {
        setTags(props.tags);
    }, [props.tags])

    const handleAdd = (tag: any) => {
        console.log(tags, 'tags')
        const preData = tags
        props.tagType === 'base' ? setTags(tags.concat({ key: '', value: '' })) : setTags(tags.concat({ key: '', value: '', behavior: '' }));
    }
    const handleDelete = (tag: any) => {
        setTags(tags.filter((e: any) => e != tag));
    }
    const updateTags = (tag: any) => {
        const index = tags.findIndex((e: any) => e == tag);
        tags.splice(index, 1, tag);
        setTags([...tags]);
    }

    useEffect(() => {
        if (props.onChange) {
            props.onChange(tags);
        }
    }, [tags])


    return <div>
        {tags.map((item: any, index: number) => <TagLine
            item={item}
            handleAdd={handleAdd}
            handleDelete={handleDelete}
            updateTags={updateTags}
            index={index}
            tagType={props.tagType || 'base'}
        />)}
    </div>
};