
import React, { useState, useContext, useEffect, useRef, useMemo } from 'react';
import { history } from 'umi';
import { MinusOutlined, PlusCircleOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Table, Modal, Form, Input, Divider, Space } from 'antd';
import './index.less'
import Tags from "../../component/Tags";

export default function AddModal(props: any) {
    const { visible, onCancel, title } = props;
    const [data, setData] = useState([]);
    const [form] = Form.useForm()
    const onFinish = () => {

    }
    const onChange = (tags: any) => {
        console.log(tags);
    }
    return (
        <Modal title={title} width={500} visible={visible} footer={null} onCancel={onCancel}>
            <Tags tags={[{ key: 'defaultKey', value: 'defaultValue' }]} onChange={onChange} />
        </Modal>
    )
}