import React, { useState } from 'react';
import { Modal, Tag, Radio, Input } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

const tagsss = [{ key: '1111111', value: 'value', type: 'base' }, { key: '111111321', value: '322332424', type: 'base' }, { key: '32', value: 'val3232ue', type: 'base' }]
export default function SetTag(props: any) {
    const { visible, onCancel, tagss = tagsss } = props;
    const [tags, setTags] = useState<any>(tagss);

    const [tagType, setTagType] = useState<string>('base')
    const [addTag, setAddTags] = useState<any>({});
    const handleSubmit = () => {

    }
    const handleAdd = (tag: any, tags: any) => {
        if (tag.key && tag.value) {
            setTags(tags.concat(tag));
            setAddTags({});
        }
    }
    return (
        <Modal width={600} title="显示详情" visible={visible} footer={true} onOk={handleSubmit} onCancel={onCancel}>
            <p>已有标签</p>
            <div className='tag-wrapper'>
                {tags.map((item: any) => {
                    return <Tag color="green" closable>{item.value}</Tag>
                })}
            </div>
            <div style={{ marginBottom: '10px' }}>
                标签类型： <Radio.Group value={tagType} onChange={(e) => { setTagType(e.target.value) }}>
                    <Radio value="base">基础标签 </Radio>
                    <Radio value="dirty"> 污点标签 </Radio>
                </Radio.Group>
            </div>

            <div className="tag-adder">
                <div className="item">
                    <label htmlFor="">Key</label>
                    <div className="item-bottom"><Input type="text" value={addTag.key} onChange={e => setAddTags({ ...addTag, key: e.currentTarget.value })} /></div>
                </div>

                <div className="item padding">
                    <label htmlFor=""></label>
                    <div className="item-bottom">=</div>
                </div>
                <div className="item">
                    <label htmlFor="">Value</label>
                    <div className="item-bottom"> <Input type="text" value={addTag.value} onChange={e => setAddTags({ ...addTag, value: e.currentTarget.value })} /></div>
                </div>
                {
                    tagType === 'dirty' && <div className="item behavior" >
                        <label htmlFor="">Behavior</label>
                        <div className="item-bottom"> <Input type="text" value={addTag.behavior} onChange={e => setAddTags({ ...addTag, behavior: e.currentTarget.value })} /></div>
                    </div>
                }
                <div className="item padding">
                    <label htmlFor=""></label>
                    <div className="item-bottom"><PlusCircleOutlined onClick={() => handleAdd(addTag, tags)} /></div>
                </div>
            </div>
        </Modal>
    )
}