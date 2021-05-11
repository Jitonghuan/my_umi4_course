import React from 'react';
import {
  Select,
  Input,
  DatePicker,
  Button,
  Form,
  Space,
  InputNumber,
  Radio,
} from 'antd';
import { TableSearchProps, FormProps } from './typing';

const { Item } = Form;
const { Option } = Select;

export const renderForm = (formOptions: FormProps[] = []) => {
  if (!formOptions.length) return [];
  return formOptions.map((v) => {
    const {
      option,
      type,
      dataIndex,
      defaultValue,
      style: styles,
      itemStyle,
      placeholder,
      label,
      required,
      showTime,
      width,
      key,
      showSelectSearch,
      disable,
      extraForm,
      className,
      onChange,
      validatorMessage,
      ...rest
    } = v;

    switch (type) {
      case 'select':
        return (
          <>
            <Item
              label={label}
              required={required}
              key={key}
              style={itemStyle}
              {...rest}
            >
              <Item
                name={dataIndex}
                initialValue={defaultValue}
                noStyle
                rules={[
                  {
                    required: required,
                    message: validatorMessage ?? '请选择',
                  },
                ]}
              >
                <Select
                  placeholder={placeholder ?? '请选择'}
                  allowClear
                  showSearch={showSelectSearch}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  style={{ width: width, ...styles }}
                  onChange={onChange}
                  getPopupContainer={(triggerNode) => triggerNode.parentElement}
                  disabled={disable}
                >
                  {option?.map((item) => (
                    <Option key={item.key} value={item.key}>
                      {item.value}
                    </Option>
                  ))}
                </Select>
              </Item>
              {extraForm}
            </Item>
          </>
        );
      case 'input':
        return (
          <Item
            required={required}
            label={label}
            key={key}
            style={itemStyle}
            {...rest}
          >
            <Item
              initialValue={defaultValue}
              name={dataIndex}
              noStyle
              rules={[
                {
                  required: required,
                  message: validatorMessage ?? '请输入',
                },
              ]}
            >
              <Input
                placeholder={placeholder ?? '请输入'}
                allowClear
                style={{ width: width, ...styles }}
                onChange={onChange}
                disabled={disable}
              />
            </Item>
            {extraForm}
          </Item>
        );
      case 'date':
        return (
          <Item
            required={required}
            label={label}
            key={key}
            style={itemStyle}
            {...rest}
          >
            <Item
              initialValue={defaultValue}
              name={dataIndex}
              noStyle
              rules={[
                {
                  required: required,
                  message: validatorMessage ?? '请选择日期',
                },
              ]}
            >
              <DatePicker
                showTime={showTime}
                style={{ width: width, ...styles }}
                onChange={onChange}
                disabled={disable}
              />
            </Item>
            {extraForm}
          </Item>
        );
      case 'area':
        return (
          <Item
            required={required}
            label={label}
            key={key}
            style={itemStyle}
            {...rest}
          >
            <Item
              initialValue={defaultValue}
              name={dataIndex}
              noStyle
              rules={[
                {
                  required: required,
                  message: validatorMessage ?? '请输入',
                },
              ]}
            >
              <Input.TextArea
                placeholder={placeholder ?? '请输入'}
                style={{ width: width, ...styles }}
                onChange={onChange}
                disabled={disable}
              />
            </Item>
            {extraForm}
          </Item>
        );
      case 'inputNumber':
        return (
          <Item
            required={required}
            label={label}
            key={key}
            style={itemStyle}
            className={className}
            {...rest}
          >
            <Item
              initialValue={defaultValue}
              name={dataIndex}
              noStyle
              rules={[
                {
                  required: required,
                  message: validatorMessage ?? '请输入',
                },
              ]}
            >
              <InputNumber
                placeholder={placeholder ?? '请输入'}
                style={{ width: width, ...styles }}
                onChange={onChange}
                disabled={disable}
              />
            </Item>
            {extraForm}
          </Item>
        );
      case 'radio':
        return (
          <Item
            required={required}
            label={label}
            key={key}
            style={itemStyle}
            {...rest}
          >
            <Item
              initialValue={defaultValue}
              name={dataIndex}
              noStyle
              rules={[
                {
                  required: required,
                  message: validatorMessage ?? '请选择',
                },
              ]}
            >
              <Radio.Group
                onChange={onChange}
                style={{ width: width, ...styles }}
              >
                {option?.map((item) => (
                  <Radio key={item.key} value={item.key}>
                    {item.value}
                  </Radio>
                ))}
              </Radio.Group>
            </Item>
            {extraForm}
          </Item>
        );
      case 'other':
        return (
          <Item
            required={required}
            label={label}
            key={key}
            style={itemStyle}
            {...rest}
          >
            {extraForm}
          </Item>
        );
      default:
        return null;
    }
  });
};

const FormList: React.FC<TableSearchProps> = ({
  formOptions,
  showSearch = true,
  showReset = true,
  searchText = '搜索',
  formLayout = 'horizontal',
  onSearch,
}) => {
  const [form] = Form.useForm();

  const submit = () => {
    form.validateFields().then((value) => {
      onSearch && onSearch(value);
    });
  };

  return (
    <>
      <Form form={form} layout={formLayout}>
        {renderForm(formOptions)}
        <Space size={12}>
          {showSearch && (
            <Button type="primary" onClick={submit}>
              {searchText}
            </Button>
          )}
          {showReset && (
            <Button onClick={() => form.resetFields()}>重置</Button>
          )}
        </Space>
      </Form>
    </>
  );
};

export default FormList;
