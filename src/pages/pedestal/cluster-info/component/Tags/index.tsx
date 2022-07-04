

import React, { useState, useEffect } from 'react';
import { Modal, Tag, Radio, Input } from 'antd';
import { PlusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import './index.less'

const TagLine = (tag: any) => {
    const { handleAdd, handleDelete, setTag, item } = tag;

    return <div className="tag-ops-line">
        <div className="item padding">
            <label htmlFor=""></label>
            <div className="item-bottom"><CloseCircleOutlined onClick={() => handleDelete(item)} /></div>
        </div>

        < div className="item" >
            <label htmlFor="">Key</label>
            <div className="item-bottom"><Input type="text" value={item.key}
                onChange={e => setTag(Object.assign(item, { key: e.currentTarget.value }))} /></div>
        </div >

        <div className="item padding">
            <label htmlFor=""></label>
            <div className="item-bottom">=</div>
        </div>
        <div className="item">
            <label htmlFor="">Value</label>
            <div className="item-bottom"> <Input type="text" value={item.value}
                onChange={e => setTag(Object.assign(item, { value: e.currentTarget.value }))} /></div>
        </div>
        <div className="item padding">
            <label htmlFor=""></label>
            <div className="item-bottom"><PlusCircleOutlined onClick={() => handleAdd(item)} /></div>
        </div>
    </div >
}

export default function Tags(props: any) {
    const [tags, setTags] = useState<any>(props.tags || [{}]);

    const handleAdd = (tag: any) => {
        setTags(tags.concat({}));
    }
    const handleDelete = (tag: any) => {
        setTags(tags.filter((e: any) => e != tag));
    }
    const setTag = (tag: any) => {
        setTags(tags.filter((e: any) => e != tag).concat(tag));
    }

    useEffect(() => {
        if (props.onChange) {

            props.onChange(tags);
        }

    }, [tags])


    return <div>
        {tags.map((item: any) => <TagLine
            item={item}
            handleAdd={handleAdd}
            handleDelete={handleDelete}
            setTag={setTag}
        />)}
    </div>
};