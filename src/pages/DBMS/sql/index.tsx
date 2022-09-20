import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/sql/sql';
import 'codemirror/mode/shell/shell';
import 'codemirror/addon/display/placeholder';
import 'codemirror/addon/hint/show-hint.css'; // 用来做代码提示
import 'codemirror/addon/hint/show-hint.js'; // 用来做代码提示
import 'codemirror/addon/hint/sql-hint.js'; // 用来做代码提示

export default class SqlConsole extends React.Component {
  // 语法提示，自动补全，语言高亮，主题切换，自适应，单行选中，格式化，主题切换
    state = {};
    static defaultProps = {
       useFocus: true,
        options: {
            mode: 'text/x-mysql',
            lineNumbers: true,
            styleActiveLine: true,
            cursorHeight: 1,
            autofocus: true,
            extraKeys: {
            }
        }
    }

    render() {
        const { options } = this.props;
        return (
          <>
        <div style={{ width: '100%', height: '100%', fontSize: '16px' }}>
            <CodeMirror
                value="select * from word"
                options={options}
                onInputRead={(editor, change) => {
//库和表名显示，一般是库名中包含一个表名数组，但是要在第一级显示，也需要把表名加进去
                 var data = { test: ['t_user', 'menu', 'auth_info'], t_user: [], menu: [''], default: ['tableinfo'] };
                    editor.setOption('hintOptions', {
                        tables: data,
                        completeSingle: false
                    });
                    editor.execCommand('autocomplete');
                }}
            />
        </div>
        </>
        );
    }
}
