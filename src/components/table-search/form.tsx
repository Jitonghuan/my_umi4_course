import React from 'react';
import { Select, Input, DatePicker, Button, Form, Space } from 'antd';
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
      onChange,
      ...rest
    } = v;

    switch (type) {
      case 'select':
        return (
          <Item
            initialValue={defaultValue}
            label={label}
            required={required}
            key={key}
            name={dataIndex}
            style={itemStyle}
            {...rest}
          >
            <Select
              placeholder={placeholder ?? '请选择'}
              allowClear
              showSearch={showSelectSearch}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
        );
      case 'input':
        return (
          <Item
            initialValue={defaultValue}
            required={required}
            label={label}
            key={key}
            name={dataIndex}
            style={itemStyle}
            {...rest}
          >
            <Input
              placeholder={placeholder ?? '请输入'}
              allowClear
              style={{ width: width, ...styles }}
              onChange={onChange}
              disabled={disable}
            />
          </Item>
        );
      case 'date':
        return (
          <Item
            initialValue={defaultValue}
            required={required}
            label={label}
            key={key}
            name={dataIndex}
            style={itemStyle}
            {...rest}
          >
            <DatePicker
              showTime={showTime}
              style={{ width: width, ...styles }}
              onChange={onChange}
              disabled={disable}
            />
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
