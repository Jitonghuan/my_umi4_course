import PageContainer from '@/components/page-container';
import { Tabs, Radio, Space, Descriptions, Button, Input, Form } from 'antd';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
const { TabPane } = Tabs;
export default function VersionDetail() {
  return (
    <PageContainer>
      <ContentCard>
        <>
          <Tabs tabPosition="left">
            <TabPane tab="基本信息" key="1">
              <div>
                <Descriptions title="基本信息" column={2} extra={<Button type="primary">编辑</Button>}>
                  <Descriptions.Item label="产品名称">Zhou Maomao</Descriptions.Item>
                  <Descriptions.Item label="产品版本">1810000000</Descriptions.Item>
                  <Descriptions.Item label="版本描述">1810000000</Descriptions.Item>
                  <Descriptions.Item label="创建时间">empty</Descriptions.Item>
                </Descriptions>
              </div>
            </TabPane>
            <TabPane tab="产品编排" key="2">
              <Tabs>
                <TabPane tab="应用" key="1">
                  <div className="table-caption">
                    <div className="caption-left">
                      <Form layout="horizontal">
                        <Form.Item>
                          <Input style={{ width: 220 }} placeholder="请输入组件名称"></Input>
                        </Form.Item>
                        <Form.Item>
                          <Button>搜索</Button>
                        </Form.Item>
                      </Form>
                    </div>
                    <div className="caption-right">
                      <Button type="primary">添加应用</Button>
                    </div>
                  </div>
                </TabPane>
                <TabPane tab="中间件" key="2">
                  <div>
                    <Descriptions title="基本信息" column={2} extra={<Button type="primary">编辑</Button>}>
                      <Descriptions.Item label="产品名称">Zhou Maomao</Descriptions.Item>
                      <Descriptions.Item label="产品版本">1810000000</Descriptions.Item>
                      <Descriptions.Item label="版本描述">1810000000</Descriptions.Item>
                      <Descriptions.Item label="创建时间">empty</Descriptions.Item>
                    </Descriptions>
                  </div>
                </TabPane>
                <TabPane tab="基本数据" key="3">
                  <div>
                    <Descriptions title="基本信息" column={2} extra={<Button type="primary">编辑</Button>}>
                      <Descriptions.Item label="产品名称">Zhou Maomao</Descriptions.Item>
                      <Descriptions.Item label="产品版本">1810000000</Descriptions.Item>
                      <Descriptions.Item label="版本描述">1810000000</Descriptions.Item>
                      <Descriptions.Item label="创建时间">empty</Descriptions.Item>
                    </Descriptions>
                  </div>
                </TabPane>
              </Tabs>
            </TabPane>
            <TabPane tab="交付配置" key="3">
              Content of Tab 3
            </TabPane>
          </Tabs>
        </>
      </ContentCard>
    </PageContainer>
  );
}
