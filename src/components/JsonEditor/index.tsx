import React, { Component } from 'react';
import { Button, message, Tooltip, Modal } from 'antd';
import { Controlled as CodeMirrorEditor } from 'react-codemirror2';
import { FormatPainterOutlined, EyeOutlined } from '@ant-design/icons';
import CodeMirror from 'codemirror';
import classnames from 'classnames';
import { JsonParse } from '@/utils';

import 'codemirror/lib/codemirror.js';
import 'codemirror/addon/display/placeholder.js';
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/mode/javascript/javascript.js';

import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/lib/codemirror.css';

import './index.less';

const prefixCls = 'cf-json-editor';

export type IVariable = {
  code: string;
  name: string;
};

export interface IRefs {
  getEditorInstance(): CodeMirror.Editor;
  setEditorValue(value: string): void;
  clearEditorValue(): void;
}

export interface Iprops {
  className?: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onChange?(value: string): void;
  options?: CodeMirror.EditorConfiguration;
  style?: React.CSSProperties;
  showFormatBtn?: boolean;
  btnType?: 'format' | 'preview';
  previewModalName?: string;
  disabled?: boolean;
}

export default class JsonEditor extends Component<Iprops> {
  static defaultProps = {};

  private editorRef: CodeMirror.Editor | undefined;

  state = {
    value: this.props.value || '',
    previewVisible: false,
  };

  componentDidMount() {
    const { defaultValue = '' } = this.props;
    this.setState({
      value: defaultValue,
    });
  }

  /** 获取编辑器实例 */
  public getEditorInstance = () => {
    return this.editorRef;
  };

  /**
   * setValue
   * @param value
   */
  public setEditorValue = (value: string) => {
    this.setState({
      value,
    });
  };

  /**
   * 清空
   */
  public clearEditorValue = () => {
    if (this.state.value) {
      this.props.onChange?.('');
    }
    this.setState({
      value: '',
    });
  };

  private onBeforeChange = (
    _editor: CodeMirror.Editor,
    _data: CodeMirror.EditorChange,
    value: string,
  ) => {
    this.setState(
      {
        value,
      },
      () => {
        this.props.onChange?.(value);
      },
    );
  };

  handleFormatterValue = () => {
    const value = this.formatterJsonStr(this.editorRef?.getValue() || '');

    if (value === undefined) return;

    this.props.onChange?.(value);
    this.editorRef?.setValue(value);
  };

  handlePreview = () => {
    this.setState({
      previewVisible: true,
    });
  };

  formatterJsonStr = (jsonStr: string) => {
    if (!jsonStr) return;

    const [err, value] = JsonParse(jsonStr, true);

    if (err) {
      message.error('JSON格式错误🙅');
      return;
    }

    return JSON.stringify(value, null, 2);
  };

  render() {
    const {
      className,
      placeholder = '',
      value: propValue,
      options,
      style,
      disabled,
      showFormatBtn = true,
      btnType = 'format',
      previewModalName,
    } = this.props;

    const isPreview = btnType === 'preview';

    const { value, previewVisible } = this.state;
    const codeValue = ('value' in this.props ? propValue : value) as string;

    if (disabled) {
      return (
        <div className={classnames(prefixCls, className)} style={style}>
          <textarea
            disabled
            style={{ display: 'block', border: '0', ...style }}
            placeholder={placeholder}
          >
            {codeValue}
          </textarea>
        </div>
      );
    }

    return (
      <div className={classnames(prefixCls, className)} style={style}>
        <div className={`${prefixCls}-instance-wrapper`}>
          <CodeMirrorEditor
            className={`${prefixCls}-instance`}
            editorDidMount={(editor) => {
              this.editorRef = editor;
            }}
            options={{
              mode: {
                name: 'javascript',
                json: true,
                statementIndent: 2,
              } as any,
              theme: 'default',
              // viewportMargin: Infinity,
              autoCloseBrackets: true,
              lineNumbers: true,
              lineWrapping: true,
              placeholder: placeholder || 'please input',
              matchBrackets: true,
              foldGutter: true,
              gutters: [
                'CodeMirror-linenumbers',
                'CodeMirror-foldgutter',
                'CodeMirror-brace-fold',
                'CodeMirror-lint-markers',
              ],
              tabSize: 2,
              indentWithTabs: false,
              ...options,
            }}
            value={codeValue}
            onBeforeChange={this.onBeforeChange}
          />
        </div>
        {showFormatBtn && (
          <Tooltip title={isPreview ? '预览' : '格式化'}>
            <Button
              className={`${prefixCls}-btn-formatter`}
              icon={isPreview ? <EyeOutlined /> : <FormatPainterOutlined />}
              shape="circle"
              onClick={() =>
                isPreview ? this.handlePreview() : this.handleFormatterValue()
              }
            />
          </Tooltip>
        )}
        <Modal
          title={previewModalName}
          className={`${prefixCls}-preview-modal`}
          visible={previewVisible}
          onCancel={() => this.setState({ previewVisible: false })}
          footer={null}
          width={650}
          destroyOnClose
        >
          {previewVisible && (
            <JsonEditor
              className="preview-json"
              defaultValue={this.formatterJsonStr(this.state.value)}
              options={{
                readOnly: true,
              }}
            />
          )}
        </Modal>
      </div>
    );
  }
}
