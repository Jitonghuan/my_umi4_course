import React, { useState, useEffect, useMemo } from 'react';
import { Input, Table, Form, Button, Space,Select,Drawer } from 'antd';
import AceEditor from '@/components/ace-editor';
interface Iprops{
    mode:EditorMode;


}
export default function CreateTmpl(props:Iprops){
    const {mode}=props
    return(<Drawer open={mode!=="HIDE"}>
        <Form layout="horizontal" labelCol={{flex:'100px'}}>
            <Form.Item label="模版名称">
            <Input  width={300}/>
            </Form.Item>
            <Form.Item label="模版内容">
             <AceEditor height={500} />
            </Form.Item>
            <Form.Item label="模版类型">
            <Select />
            </Form.Item>
            <Form.Item label="构建类型">
            <Select />
            </Form.Item>
            <Form.Item label="应用类型">
            <Select />
            </Form.Item>
            <Form.Item label="应用语言">
               <Select />
            </Form.Item>
            <Form.Item label="应用分类">
                <Select />
            </Form.Item>
            <Form.Item label="描述">
                <Input.TextArea style={{width:300}}/>
            </Form.Item>
        </Form>

    </Drawer>)
}