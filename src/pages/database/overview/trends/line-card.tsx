import { Line } from '@ant-design/charts';
import { colorUtil } from '@cffe/fe-datav-components';
export interface IProps {
    /** 标题 */
    title?: string;

    /** charts option */
    config?: any;


}
const { ColorContainer } = colorUtil.context;
export default function LineCard(props: IProps) {
    const { title, config } = props
    return (
        <div className="line-card" style={{ padding: '16px' }}>
            <header>
                <h3>{title}</h3>
            </header>
            <div className="line-content">
            <ColorContainer roleKeys={['color']}>
                <Line {...config} />
            </ColorContainer>


            </div>
           
        </div>)
}