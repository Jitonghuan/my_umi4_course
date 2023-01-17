// article editor
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/15 14:50

import React, { useState, useEffect,} from 'react';
import { Modal, Table,Typography,Form,Drawer,Button,message } from 'antd';
import AceEditor from '@/components/ace-editor';
import {CopyOutlined} from '@ant-design/icons'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {useGetRollbackSQL} from './hook'
import {exportRollbackSQLApi}  from '../../../service';
const { Paragraph } = Typography;




export interface IProps {
    visiable?: boolean;
    curId?: number;
    onClose: () => any;
}

export default function CreateArticle(props: IProps) {
    const { visiable,  onClose,curId } = props;
    const [loading,setLoading]=useState<boolean>(false)
    const [dataSource,setDataSource]=useState<any>([])
    const [copySql,setCopySql]=useState<string>("")
    const [sqlForm] =Form.useForm()
    const [showSql,setShowSql]=useState<boolean>(false)
    const [downLoadDisabled, setDownLoadDisabled] = useState<boolean>(false);
    const columns=[
        {
            title: 'originalSQL',
            dataIndex: 'originalSQL',
            key: 'originalSQL',
            width:500,
            ellipsis:true,
            render:(value:string)=><span >
                 {/* <Paragraph copyable> {value?.replace(/\\n/g, '<br/>')}</Paragraph> */}
                 {/* style={{display:"inline-block",whiteSpace:"pre-line"}} */}
                <a onClick={()=>{
                      setShowSql(true)
                      sqlForm.setFieldsValue({
                        showSql:value?.replace(/\\n/g, '<br/>')
                      })
                    }}> {value?.replace(/\\n/g, '<br/>')}</a>
               
                </span>
          },
          {
            title: 'rollbackSQL',
            dataIndex: 'rollbackSQL',
            key: 'rollbackSQL',
            width:500,
            ellipsis:true,
            render:(value:string)=><span >
                 {/* <Paragraph copyable> {value?.replace(/\\n/g, '<br/>')}</Paragraph> */}
                 <a onClick={()=>{
                      setShowSql(true)
                      sqlForm.setFieldsValue({
                        showSql:value?.replace(/\\n/g, '<br/>')
                      })
                    }}> {value?.replace(/\\n/g, '<br/>')}</a>
                 </span>
          },
    ]

    useEffect(()=>{
        if(curId&&visiable){
            getRollbackSQL() 

        }

    },[curId,visiable])
    const getRollbackSQL=()=>{
        setLoading(true)
        setCopySql("")
        useGetRollbackSQL(curId).then((data)=>{
            setDataSource(data)
            let rollbackSQL:any=[];
            (data||[])?.map((item:any)=>{
              rollbackSQL.push(item?.rollbackSQL)

            })
            setCopySql(rollbackSQL?.join('\n \n ')||"")

        }).finally(()=>{
            setLoading(false)
        })
    }
   
    return (
        <>
          <Drawer title="sql详情" visible={showSql} footer={false} width={"70%"} onClose={()=>{setShowSql(false)}} destroyOnClose>
        <Form form={sqlForm} preserve={false}>
          <Form.Item name="showSql">
          <AceEditor mode="sql" height={900} readOnly={true} />
          </Form.Item>

        </Form>
       

      </Drawer>
        <Modal title="回滚sql语句" visible={visiable} destroyOnClose width={"80%"} footer={false} onCancel={onClose}>
          <div style={{display:"flex",justifyContent:"flex-end"}}>
            <div>
              <Button type="primary"
                target="_blank"
                href={`${exportRollbackSQLApi}?id=${curId}`}
                disabled={downLoadDisabled}
                style={{lineHeight:2,marginBottom:10}}
                className="downloadButton"
                onClick={() => {
                  message.info('开始导出...');
                  setDownLoadDisabled(true);
                  setTimeout(() => {
                    setDownLoadDisabled(false);
                  }, 1000*10);
                }}
              >下载所有回滚语句</Button>
            {/* <CopyToClipboard text={copySql} onCopy={() => message.success('复制成功！')}>
                 <Button type="primary" icon={<CopyOutlined />}>复制所有回滚语句</Button>
            </CopyToClipboard> */}
          
              </div>
          </div>
            <Table columns={columns} loading={loading}  scroll={{ x: '100%' }} dataSource={dataSource} />  
        </Modal>
        </>

    );
}
