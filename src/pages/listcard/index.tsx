import React ,{useEffect,useState} from "react";
import { Card, Avatar,  List, Button,Typography } from "antd";
import { PlusOutlined, UserOutlined, TableOutlined } from "@ant-design/icons";
import { useRequest, request } from "umi";

const ListCard = () => {
    const { Paragraph } = Typography;
    const [dataList,setDataList]=useState<any>([]);
    const { data } = useRequest(() => request("/api/list"));
    useEffect(()=>{
      setDataList(data)
    },[ data?.data])

  console.log(data);
    const list: any[] = [];
  for (let i = 1; i < 10; i += 1) {
    list.push({
      id: i,
      title: "卡片列表",
      description:
        "Umi@4 实战 from 姬同欢， 向小虎、云谦学习",
    });
  }

  return <div>
          <List
      rowKey="id"
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
        xl: 4,
        xxl: 4,
      }}
      dataSource={dataList?.data?[{}, ...dataList?.data]:[]}
      renderItem={(item) => {
        if (item && item.id) {
            return (
              <List.Item key={item.id}>
                <Card
                  hoverable
                  actions={[
                    <a key="option1">操作一</a>,
                    <a key="option2">操作二</a>,
                  ]}
                >
                  <Card.Meta
                    avatar={
                      <Avatar
                        size={48}
                        src="https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png"
                      />
                    }
                    title={<a>{item.title}</a>}
                    description={
                      <Paragraph ellipsis={{ rows: 3 }}>
                        {item.description}
                      </Paragraph>
                    }
                  />
                </Card>
              </List.Item>
            );
          }
        return (
            <List.Item>
              <Button type="dashed" style={{ width: "100%", height: "160px" }}>
                <PlusOutlined /> 新增产品
              </Button>
            </List.Item>
          );
        
       
      }}
    />
  </div>;
};

export default ListCard;