// 产品描述页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/02/21 17:10

import { useState, useEffect,useMemo } from 'react';
import {Form, Button,Table,Typography, Descriptions,Spin} from 'antd';
import PageContainer from '@/components/page-container';
import { history,useLocation, } from 'umi';
import { parse } from 'query-string';
import moment from 'moment';
import {createTableColumns} from './schema';
import CreateVersionModal from './create-version-modal'
import { ContentCard } from '@/components/vc-page-content';
import {useEditProductDescription,useDeleteProductVersion,useQueryProductList,usePublishProductVersion,useQueryVersionNameList} from './hooks';
import './index.less';


export default function deliveryDescription() {
  let location:any = useLocation();
  const query:any = parse(location.search);
  const { Paragraph } = Typography;
  const [createVersionForm] = Form.useForm();
  const descriptionInfoData: any = location.state?.record;
  const [editableStr, setEditableStr] = useState(descriptionInfoData.productDescription);
  const [editLoading, editProductDescription] = useEditProductDescription();
  const [verisonLoading, versionOptions,queryVersionNameList]=useQueryVersionNameList();
  const [delLoading, deleteProductVersion] = useDeleteProductVersion();
  const [publishLoading, publishProductVersion] = usePublishProductVersion();
  const [tableLoading, dataSource, pageInfo, setPageInfo, queryProductVersionList] = useQueryProductList();
  const [creatVersionVisiable, setCreatVersionVisiable] = useState<boolean>(false);

  useEffect(() => {
    if (!descriptionInfoData.id) {
      return;
    }
    queryProductVersionList(descriptionInfoData.id);
    queryVersionNameList(descriptionInfoData.id)
  }, []);

  const pageSizeClick = (pagination: any) => {
    setPageInfo({ pageIndex: pagination.current });
    let obj = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    };
    queryProductVersionList(descriptionInfoData.id, obj.pageIndex, obj.pageSize);
  };

  const columns = useMemo(() => {
    return createTableColumns({
      onManage: (record, index) => {
        history.push({
          pathname: '/matrix/station/version-detail',
         }, {
            productId: descriptionInfoData.id,
            versionId: record.id,
            versionName: record.versionName,
            versionDescription: record.versionDescription,
            versionGmtCreate: record.gmtCreate,
            productName: descriptionInfoData.productName,
            productDescription: descriptionInfoData.productDescription,
            productGmtCreate: descriptionInfoData.gmtCreate,
            releaseStatus: record.releaseStatus,
          },
        );
       
      },
      onPublish: (record, index) => {
        publishProductVersion(record.id).then(() => {
          queryProductVersionList(descriptionInfoData.id);
        });
      },
      onDelete: async (record, index) => {
        deleteProductVersion(record.id).then(() => {
          queryProductVersionList(descriptionInfoData.id);
        });
      },
      
    }) as any;
  }, []);




  return (
    <PageContainer className="product-description">
      <CreateVersionModal
      visible={creatVersionVisiable}
      onCancel={()=>{setCreatVersionVisiable(false);}}
      verisonLoading={verisonLoading}
      versionOptions={versionOptions}
      productId={descriptionInfoData.id}
      onSave={()=>{
        setCreatVersionVisiable(false);
        queryProductVersionList(descriptionInfoData.id);
      }}

      />
      <ContentCard>
        <div>
          <Descriptions
            title="基本信息"
            column={2}
            className="basic-info-description"
            bordered={true}
            extra={
              <Button
                type="primary"
                onClick={() => {
                  history.push('/matrix/station/product-list');
                }}
              >
                返回
              </Button>
            }
          >
            <Descriptions.Item label="产品名称">{descriptionInfoData.productName}</Descriptions.Item>
            <Descriptions.Item label="产品描述">
              <Paragraph
                editable={{
                  onChange: (productDescription: string) => {
                    editProductDescription(descriptionInfoData.id, productDescription).then(() => {
                      setEditableStr(productDescription);
                    });
                  },
                }}
              >
                {editableStr}
              </Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label="创建时间" span={2}>
              {moment(descriptionInfoData.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
          </Descriptions>
        </div>
        <div className="version-manage">
          <div className="table-caption">
            <div className="caption-left">
              <h3>版本管理</h3>
            </div>
            <div className="caption-right">
              <Button
                type="primary"
                onClick={() => {
                  setCreatVersionVisiable(true);
                  createVersionForm.resetFields();
                }}
              >
                创建版本
              </Button>
            </div>
          </div>
          <div>
            <Spin spinning={delLoading||publishLoading}>
            <Table
              rowKey="id"
              dataSource={dataSource}
              bordered
              columns={columns}
              loading={tableLoading}
              pagination={{
                total: pageInfo.total,
                pageSize: pageInfo.pageSize,
                current: pageInfo.pageIndex,
                showSizeChanger: true,
                onShowSizeChange: (_, size) => {
                  setPageInfo({
                    pageIndex: 1,
                    pageSize: size,
                  });
                },
                showTotal: () => `总共 ${pageInfo.total} 条数据`,
              }}
              onChange={pageSizeClick}
            />

            </Spin>
          
          </div>
        </div>

      </ContentCard>
    </PageContainer>
  );
}
