/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-09-19 01:19:25
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-09-19 01:34:42
 * @FilePath: /fe-matrix/src/pages/DBMS/sql/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// import * as monaco from 'monaco-editor';

/**
 * VS Code 编辑器
 *
 * 通过 getEditorVal 函数向外传递编辑器即时内容
 * 通过 initValue 用于初始化编辑器内容。
 * 编辑器默认 sql 语言，支持的语言请参考 node_modules\monaco-editor\esm\vs\basic-languages 目录下~
 * 编辑器样式仅有   'vs', 'vs-dark', 'hc-black' 三种
 */


import React,{useRef,useState} from 'react';
import codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/sql/sql';
import 'codemirror/mode/shell/shell';
import 'codemirror/addon/display/placeholder';
import 'codemirror/addon/hint/show-hint.css'; // 用来做代码提示
import 'codemirror/addon/hint/show-hint.js'; // 用来做代码提示
import 'codemirror/addon/hint/sql-hint.js'; // 用来做代码提示
import 'codemirror/theme/3024-day.css'

export default function SqlEditor(){
const editor = useRef<any>(null);
const [ref,setRef]=useState<any>();
editor.current= codemirror(ref, {
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        matchBrackets: true,
        autofocus: true,
        extraKeys: {
            "';'": completeAfter(editor)   //添加;号监听
        },
        hintOptions: { completeSingle: false },
        lineWrapping: true,//在长行时文字是换行(wrap)还是滚动(scroll)，默认为滚动(scroll)。
        mode: 'text/x-mysql',
        value: 'select * from word'
    });
    editor.current.on('inputRead', (editor:any, change:any) => {
        var data = { test: ['t_user', 'menu', 'auth_info'], t_user: [], menu: [''], default: ['tableinfo'] };
         editor.setOption('hintOptions', {
             tables: data,
             completeSingle: false
         });
         editor.execCommand('autocomplete');
     });
const  completeAfter = (editor:any) => {
    var spaces = Array(editor.getOption("indentUnit")).join(";");//分号;监听执行完后,就不会再执行inputRead输入监听了
    editor.replaceSelection(spaces);
}

    return(
        <>
        <div ref={(self) => { ref = self; }} style={{ width: '100%', height: '100%', fontSize: '16px' }}></div>
        </>
    )
}


