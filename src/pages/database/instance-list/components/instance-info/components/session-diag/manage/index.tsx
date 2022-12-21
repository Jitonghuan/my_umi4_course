import { Button, Space, Input,Table } from 'antd';
import VCCardLayout from '@cffe/vc-b-card-layout';
import './index.less';
const rootCls = 'session-manage-compo';
const layoutGrid = {
    xs: 1,
    sm: 1,
    md: 1,
    lg: 3,
    xl: 3,
    xxl: 3,
    xxxl: 3,
  };
export default function SessionManage() {
    return (
        <div className={rootCls}>
            <div>
                <div className="table-caption">
                    <div className="caption-left">
                        <h3 className={`${rootCls}__title`}>实时会话</h3>
                    </div>
                    <div className="caption-right">
                        <Button type="primary">刷新</Button>
                    </div>

                </div>

            </div>


            <div>

            </div>


            <div>
                <div className="table-caption">
                    <div className="caption-left">
                        <Space>
                            <Button type="primary">SQL限流</Button>
                            <Input placeholder="活跃会话" style={{ width: 240 }} />
                            <Input placeholder="搜索会话" style={{ width: 240 }} />


                        </Space>

                    </div>
                    <div className="caption-right">
                        <Button type="primary">结束选中会话</Button>
                    </div>

                </div>
                <Table />
            </div>
           
           
            <div>
            <h3 className={`${rootCls}__title`}>会话统计</h3>
            <VCCardLayout grid={layoutGrid} className="session-manage-content">
                <Table title={()=><span className="table-title">按用户统计</span>}/>
                <Table title={()=><span className="table-title">按访问来源统计</span>}/>
                <Table title={()=><span className="table-title">按数据库统计</span>}/>
            </VCCardLayout>

            </div>
        </div>
    )
}