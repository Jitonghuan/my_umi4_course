import React from 'react';
import { Select, Input, DatePicker, Button, Form, Space, InputNumber, Radio, Checkbox } from 'antd';
import { TableSearchProps, FormProps } from './typing';

const { Item } = Form;
const { Option } = Select;
const { RangePicker } = DatePicker;

export const renderForm = (formOptions: FormProps[] = [], onSearch?: () => void) => {
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
      required = false,
      showTime,
      width,
      key,
      renderLabel=false,
      showSelectSearch,
      disable,
      extraForm,
      className,
      onChange,
      validatorMessage,
      pattern,
      rules,
      checkboxOption,
      autoSize,
      isReadOnly,
      mode,
      id,
      allowClear,
      showSearch,
      min,
      max,
      ...rest
    } = v;

    switch (type) {
      case 'select':
        return (
          <Item label={label} required={required} key={key} style={itemStyle} {...rest}>
            <Item
              name={dataIndex}
              initialValue={defaultValue}
              noStyle
              rules={
                rules || extraForm
                  ? rules
                  : [
                    {
                      required: required,
                      message: validatorMessage ?? '请选择',
                      pattern,
                    },
                  ]
              }
            >
              <Select
                placeholder={placeholder ?? '请选择'}
                allowClear={allowClear || true}
                showSearch={showSelectSearch}
                optionFilterProp="children"
                filterOption={(input, option) => (option!.children as unknown as string).includes(input)}
                style={{ width: width, ...styles }}
                onChange={onChange}
                disabled={disable}
                mode={mode}
                id={id}
              >
                {renderLabel?option?.map((item) => (
                  <Option key={item.key} value={item.key}>
                    {item.label}
                  </Option>
                )):option?.map((item) => (
                  <Option key={item.key} value={item.key}>
                    {item.value}
                  </Option>
                ))}


              </Select>
            </Item>
            {extraForm}
          </Item>
        );
      case 'input':
        return (
          <Item required={required} label={label} key={key} style={itemStyle} {...rest}>
            <Item
              initialValue={defaultValue}
              name={dataIndex}
              noStyle
              rules={
                rules || extraForm
                  ? rules
                  : [
                    {
                      required: required,
                      message: validatorMessage ?? '请输入',
                      pattern,
                    },
                  ]
              }
            >
              <Input
                placeholder={placeholder ?? '请输入'}
                style={{ width: width, ...styles }}
                onChange={onChange}
                disabled={disable}
                id={id}
                onPressEnter={onSearch}
              />
            </Item>
            {extraForm}
          </Item>
        );
      case 'date':
        return (
          <Item required={required} label={label} key={key} style={itemStyle} {...rest}>
            <Item
              initialValue={defaultValue}
              name={dataIndex}
              noStyle
              rules={
                rules || extraForm
                  ? rules
                  : [
                    {
                      required: required,
                      message: validatorMessage ?? '请选择日期',
                      pattern,
                    },
                  ]
              }
            >
              <DatePicker
                showTime={showTime}
                style={{ width: width, ...styles }}
                onChange={onChange}
                disabled={disable}
                id={id}
              />
            </Item>
            {extraForm}
          </Item>
        );
      case 'range':
        return (
          <Item required={required} label={label} key={key} style={itemStyle} {...rest}>
            <Item
              initialValue={defaultValue}
              name={dataIndex}
              noStyle
              rules={
                rules || extraForm
                  ? rules
                  : [
                    {
                      required: required,
                      message: validatorMessage ?? '请选择日期',
                      pattern,
                    },
                  ]
              }
            >
              <RangePicker
                showTime={showTime}
                style={{ width: width, ...styles }}
                onChange={onChange}
                disabled={disable}
                id={id}
              />
            </Item>
            {extraForm}
          </Item>
        );
      case 'area':
        return (
          <Item required={required} label={label} key={key} style={itemStyle} {...rest}>
            <Item
              initialValue={defaultValue}
              name={dataIndex}
              noStyle
              rules={
                rules || extraForm
                  ? rules
                  : [
                    {
                      required: required,
                      message: validatorMessage ?? '请输入',
                      pattern,
                    },
                  ]
              }
            >
              <Input.TextArea
                placeholder={placeholder ?? '请输入'}
                style={{ width: width, ...styles }}
                onChange={onChange}
                disabled={disable}
                autoSize={autoSize}
                readOnly={isReadOnly}
                id={id}
              />
            </Item>
            {extraForm}
          </Item>
        );
      case 'inputNumber':
        return (
          <Item required={required} label={label} key={key} style={itemStyle} className={className} {...rest}>
            <Item
              initialValue={defaultValue}
              name={dataIndex}
              noStyle
              rules={
                rules || extraForm
                  ? rules
                  : [
                    {
                      required: required,
                      message: validatorMessage ?? '请输入',
                      pattern,
                    },
                  ]
              }
            >
              <InputNumber
                placeholder={placeholder ?? '请输入'}
                style={{ width: width, ...styles }}
                onChange={onChange}
                disabled={disable}
                id={id}
                max={max}
                min={min}
              />
            </Item>
            {extraForm}
          </Item>
        );
      case 'radio':
        return (
          <Item required={required} label={label} key={key} style={itemStyle} {...rest}>
            <Item
              initialValue={defaultValue}
              name={dataIndex}
              noStyle
              rules={
                rules || extraForm
                  ? rules
                  : [
                    {
                      required: required,
                      message: validatorMessage ?? '请选择',
                      pattern,
                    },
                  ]
              }
            >
              <Radio.Group onChange={onChange} style={{ width: width, ...styles }} id={id}>
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
      case 'checkbox':
        return (
          <Item required={required} label={label} key={key} style={itemStyle} {...rest}>
            <Item
              initialValue={defaultValue}
              name={dataIndex}
              noStyle
              rules={
                rules || extraForm
                  ? rules
                  : [
                    {
                      required: required,
                      message: validatorMessage ?? '请选择',
                      pattern,
                    },
                  ]
              }
            >
              <Checkbox.Group options={checkboxOption} onChange={onChange} />
            </Item>
            {extraForm}
          </Item>
        );
      case 'other':
        return (
          <Item required={required} label={label} key={key} style={itemStyle} {...rest}>
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
  form,
  onSearch,
  reset,
  style,
  formExtraNode
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Form form={form} layout={formLayout} style={style}>
        {renderForm(formOptions, onSearch)}
        <Item>
          <Space size={12}>
            {showSearch && (
              <Button type="primary" onClick={onSearch}>
                {searchText}
              </Button>
            )}
            {showReset && (
              <Button onClick={reset}>
                重置
              </Button>
            )}
          </Space>
        </Item>
      </Form>
      {
        formExtraNode
      }
    </div>
  );
};

export default FormList;
