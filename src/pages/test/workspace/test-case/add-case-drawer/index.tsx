import React, { useState, useContext, useMemo, useEffect } from 'react';
import { Form, Drawer, Input, Switch, Select, Tabs, Button, message, TreeSelect } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
import { createCase, updateCase, getCategoryList, getCaseInfo } from '../../service';
import { priorityEnum } from '../../constant';
import { createSona } from '@cffe/sona';
import EditorTable from '@cffe/pc-editor-table';
import RichText from '@/components/rich-text';
import FELayout from '@cffe/vc-layout';
import './index.less';

const { TabPane } = Tabs;

export default function RightDetail(props: any) {
  const { visible, setVisible, updateCaseTable, caseId, cateId } = props;
  const userInfo = useContext(FELayout.SSOUserInfoContext);

  const [caseDescArr, setCaseDescArr] = useState<any[]>([]);
  const [stepContent, setStepContent] = useState<string | string[]>('');
  const [expectedResult, setExpectedResult] = useState<string | string[]>('');
  // const [categories, setCategories] = useState<any[]>([]);
  const [descType, setDescType] = useState('0');
  const [form] = Form.useForm();
  const sona = useMemo(() => createSona(), []);

  // useEffect(() => {
  //   getRequest(getCategoryList).then((res) => {
  //     setCategories(res.data.dataSource);
  //   });
  // }, []);

  useEffect(() => {
    if (visible) {
      if (caseId) {
        getRequest(getCaseInfo + '/' + caseId).then((res) => {
          console.log(res);
        });
      }
    }
  }, [visible]);

  const handleSave = async () => {
    void (await handleSaveAndContinue());
    void setVisible(false);
  };

  const handleSaveAndContinue = async () => {
    let finalStepContent = stepContent;
    let finalExpectedResult = expectedResult;
    if (typeof finalStepContent === 'string') {
      finalStepContent = [finalStepContent];
    }
    if (typeof finalExpectedResult === 'string') {
      finalExpectedResult = [finalExpectedResult];
    }

    const _data = form.getFieldsValue();
    const formData = {
      ..._data,
      stepContent: finalStepContent.map((item, idx) => ({ input: item, output: finalExpectedResult[idx] })),
      comment: JSON.stringify(sona.schema),
      currentUser: userInfo.userName,
      descType: +descType,
      isAuto: _data.isAuto ? 1 : 0,
      categoryId: +cateId,
    };

    const loadEnd = message.loading(`正在${caseId ? '更新' : '新增'}用例`);

    if (caseId) {
      void (await postRequest(updateCase + '/' + caseId, { data: formData }));
    } else if (cateId) {
      void (await postRequest(createCase, { data: formData }));
    }

    void loadEnd();
    void updateCaseTable();
    void message.success('新增用例成功');

    // 保存后清空表单
    void form.resetFields();
    if (descType === '0') {
      void setStepContent('');
      void setExpectedResult('');
    } else {
      void setCaseDescArr([]);
      void setStepContent([]);
      void setExpectedResult([]);
    }
  };

  const handleCancel = () => {
    void setVisible(false);
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
    labelAlign: 'left' as 'left',
  };

  return (
    <Drawer
      visible={visible}
      width="650"
      title={caseId ? '编辑用例' : '添加用例'}
      onClose={() => setVisible(false)}
      maskClosable={false}
    >
      <Form {...layout} form={form}>
        <Form.Item label="标题:" name="title">
          <Input placeholder="请输入标题" />
        </Form.Item>
        {/* <Form.Item label="所属业务:" name="categoryId">
          <Select>
            {categories.map((cate) => (
              <Select.Option value={cate.id}>{cate.categoryName}</Select.Option>
            ))}
          </Select>
        </Form.Item> */}
        <Form.Item label="优先级:" name="priority">
          <Select>
            {priorityEnum.map((item) => (
              <Select.Option value={item.value} key={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="是否自动化:" name="isAuto" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="前置条件:" name="precondition">
          <Input.TextArea placeholder="请输入前置条件"></Input.TextArea>
        </Form.Item>
        <Form.Item label="用例描述:" name="stepContent">
          <Tabs
            activeKey={descType}
            onChange={(key) => {
              void setDescType(key);
              if (key === '0') {
                void setStepContent('');
                void setExpectedResult('');
              } else {
                void setCaseDescArr([]);
                void setStepContent([]);
                void setExpectedResult([]);
              }
            }}
          >
            <TabPane tab="卡片式" key="0">
              <div className="cardtype-case-desc-wrapper">
                <Input.TextArea
                  placeholder="输入步骤描述"
                  className="step-desc"
                  value={stepContent}
                  onChange={(e) => setStepContent(e.target.value)}
                ></Input.TextArea>
                <Input.TextArea
                  placeholder="预期结果"
                  className="step-expected-results"
                  value={expectedResult}
                  onChange={(e) => setExpectedResult(e.target.value)}
                ></Input.TextArea>
              </div>
            </TabPane>
            <TabPane tab="步骤式" key="1">
              <EditorTable
                value={caseDescArr}
                onChange={(val) => {
                  void setCaseDescArr(val);
                  void setStepContent(val.map((item) => item.value));
                  void setExpectedResult(val.map((item) => item.desc));
                }}
                creator={{ record: { value: '', desc: '' } }}
                columns={[
                  {
                    title: '编号',
                    dataIndex: '__count',
                    fieldType: 'readonly',
                    colProps: { width: 60, align: 'center' },
                  },
                  { title: '步骤描述', dataIndex: 'value', required: true },
                  { title: '预期结果', dataIndex: 'desc', required: true },
                ]}
              />
            </TabPane>
          </Tabs>
        </Form.Item>
        <Form.Item label="备注" name="comment">
          <RichText sona={sona} width="100%" height="200px" />
        </Form.Item>
      </Form>

      <div className="drawer-btn-group">
        <Button type="primary" onClick={handleSave}>
          保存
        </Button>
        <Button type="primary" className="mgl-short" onClick={handleSaveAndContinue}>
          保存并继续
        </Button>
        <Button type="primary" className="mgl-short" onClick={handleCancel}>
          取消
        </Button>
      </div>
    </Drawer>
  );
}
