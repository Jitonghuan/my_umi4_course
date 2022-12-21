import { Button, Space, Input,Table,Radio ,DatePicker} from 'antd';
import VCCardLayout from '@cffe/vc-b-card-layout';
import './index.less';
const rootCls = 'Lock-analyze-compo';
const options=[
    {label:"近1天",value:"1days"},
    {label:"近3天",value:"3days"},
    {label:"近1周",value:"7days"},
]
const { RangePicker } = DatePicker;
export default function LockAnalyze(){
    return (
        <div>
              <div className="table-caption">
                    <div className="caption-left">
                        <Button type="primary">刷新</Button>
                    </div>
                    <div className="caption-right">
                       <Space>
                           <Radio.Group optionType="button" buttonStyle="solid" options={options} />
                           <RangePicker />
                           <Button type="primary">查看</Button>
                       </Space>
                    </div>
                    <div>
                        <Table />
                    </div>

                </div>
            
        </div>
    )
}