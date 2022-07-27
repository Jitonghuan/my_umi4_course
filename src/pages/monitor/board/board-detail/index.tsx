import React, { useState } from 'react'
import PageContainer from '@/components/page-container';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

const BoardDetail = () => {
  return (
    <PageContainer>
      <div style={{ backgroundColor: 'white', padding: '10px 10px 10px 10px', display: 'flex', alignItems: 'center' }}>
        <Button type='link' onClick={()=>{
          history.back()
        }}>
          <LeftOutlined /> 返回
        </Button>
        <div>
          详情页
        </div>
      </div >
      <div>

      </div>

    </PageContainer>
  )
}

export default BoardDetail
