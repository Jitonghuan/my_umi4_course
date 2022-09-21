/**
 * VS Code SQL编辑器
 *
 * 通过 getEditorVal 函数向外传递编辑器即时内容
 * 通过 initValue 用于初始化编辑器内容。
 * 编辑器默认 sql 语言，支持的语言请参考 node_modules\monaco-editor\esm\vs\basic-languages 目录下~
 * 编辑器样式仅有   'vs', 'vs-dark', 'hc-black' 三种
 */
 import React,{useRef,useState,useEffect,useCallback} from 'react';
 import * as monaco from 'monaco-editor';
 import {  Tabs,Form,Space,Button,Select,message } from 'antd';
 import { editor } from 'monaco-editor/esm/vs/editor/editor.api';
 import 'monaco-editor/esm/vs/editor/contrib/find/findController.js';
 //@ts-ignore
 import { language } from 'monaco-editor/esm/vs/basic-languages/sql/sql';
 import { format } from 'sql-formatter';
 import './index.less'
 export const hintData:any = {
    adbs: ['dim_realtime_recharge_paycfg_range', 'dim_realtime_recharge_range'],
    dimi: ['ads_adid', 'ads_spec_adid_category'],
  }

 export interface Iprops {
    initValue?:string;
    readOnly?:boolean;
    language?:string;
    height?:number,
    theme?:string,
    subChange?:()=>void;
    isSubChangeBtn?:boolean;
    isSqlCheckBtn?:boolean;
    isSqlBueatifyBtn?:boolean;
    isSqlExecuteBtn?:boolean;
    isSqlExecutePlanBtn?:boolean;
  }
  const { keywords } = language
  
export default function SqlEditor(props:Iprops){
    const [editorInstance, setEditorInstance] = useState<editor.IStandaloneCodeEditor | undefined>(undefined);

    const rootCls = 'monaco-sql-editor-title';
    const {isSqlExecutePlanBtn,isSqlBueatifyBtn,isSqlExecuteBtn,initValue="select * from user limit 10",readOnly,language="sql",height=500,theme='vs',isSubChangeBtn,isSqlCheckBtn}=props;
    const [getVal,setGetVal]=useState<any>();
    let divNode:any;
    const codeContainerRef = useCallback((node:any) => {
        // On mount get the ref of the div and assign it the divNode
        divNode = node;
    }, []);
    let completeProvider:any

    useEffect(() => {
        if (divNode) {
            const monacoEditor = monaco.editor.create(divNode, {
                autoIndent: "keep",
                value: 'select * from user limit 10;', // 编辑器初始显示文字
                language: 'sql', // 语言
                readOnly: readOnly, // 是否只读 Defaults to false | true
                automaticLayout: true, // 自动布局
                theme: theme, // 官方自带三种主题vs, hc-black, or vs-dark
                minimap: {
                  // 关闭小地图
                  enabled: false,
                },
                tabSize: 2, // tab缩进长度
            });
            setEditorInstance(monacoEditor);
            registerCompletion();
            // 将 initValue Property 同步到编辑器中
            monacoEditor.setValue(initValue);
            monacoEditor.focus();
            monacoEditor.layout();
          
          
            monaco.editor.setTheme(theme);

        }
        return()=>{
            if(completeProvider){
                completeProvider.dispose()
                completeProvider = null

            }

      }
    }, [codeContainerRef])
    
    useEffect(()=>{
        if(editorInstance){
            getSelectionVal();
        }
    },[editorInstance])
    useEffect(()=>{
        if(editorInstance){
            
            getValue();
            console.log('--------', getValue())
        }
        
    },[editorInstance,getVal])
    useEffect(()=>{
        if(editorInstance){
            monaco.editor.setTheme(theme)
        }  
    },[editorInstance,theme])
    useEffect(()=>{
        if(editorInstance){
            editorInstance.layout()
        }  
    },[editorInstance])
    useEffect(()=>{ 
        return ()=>{
            if(editorInstance){
                editorInstance?.dispose()
            }

        }
    },[editorInstance])
    const getValue=()=> {
        setGetVal(editorInstance?.getModel()?.getValue())
        return editorInstance?.getModel()?.getValue()
      };
     
      //获取选中代码
    const  getSelectionVal=()=> {
        const selection =editorInstance?.getSelection() // 获取光标选中的值
        if (!selection) return;
        const { startLineNumber=0, endLineNumber, startColumn, endColumn }:any = selection
        const model = editorInstance?.getModel()
  
        return model?.getValueInRange({
          startLineNumber,
          startColumn,
          endLineNumber,
          endColumn,
        })
      }
     
    const registerCompletion=()=>{
       completeProvider=
        monaco.languages.registerCompletionItemProvider('sql', {
          triggerCharacters: ['.', ...keywords],
          provideCompletionItems: (model, position) => {
            let suggestions:any= []
  
            const { lineNumber, column } = position
  
            const textBeforePointer = model.getValueInRange({
              startLineNumber: lineNumber,
              startColumn: 0,
              endLineNumber: lineNumber,
              endColumn: column,
            })
  
            const tokens = textBeforePointer.trim().split(/\s+/)
            const lastToken = tokens[tokens.length - 1] // 获取最后一段非空字符串
  
            if (lastToken.endsWith('.')) {
              const tokenNoDot = lastToken.slice(0, lastToken.length - 1)
              if (Object.keys(hintData).includes(tokenNoDot)) {
                suggestions = [...getTableSuggest(tokenNoDot)]
              }
            } else if (lastToken === '.') {
              suggestions = []
            } else {
              suggestions = [...getDBSuggest(), ...getSQLSuggest()]
            }
  
            return {
              suggestions,
            }
          },
        })
      };
      //处理光标位置
      const setPosition=(column:any, lineNumber:any)=>{
        editorInstance?.setPosition({ column, lineNumber })
      }
     const getPosition=()=>{
        return editorInstance?.getPosition()
      }
      //自定义 SQL 库表提示，并保留原有 SQL 提示

      // 获取 SQL 语法提示
     const getSQLSuggest=()=>{
          return keywords.map((key:any) => ({
            label: key,
             kind: monaco.languages.CompletionItemKind.Enum,
             insertText: key,
            }))
        };
      const getDBSuggest=()=>{
        return Object.keys(hintData).map((key) => ({
          label: key,
          kind: monaco.languages.CompletionItemKind.Constant,
          insertText: key,
        }))
      };
     const  getTableSuggest=(dbName:string)=>{
        const tableNames = hintData[dbName]
        if (!tableNames) {
          return []
        }
        return tableNames.map((name:any) => ({
          label: name,
          kind: monaco.languages.CompletionItemKind.Constant,
          insertText: name,
        }))
      }
   const formatSql=()=> {
       if(editorInstance){
        editorInstance?.getModel()?.setValue(
            format(editorInstance?.getValue(), {
              indentStyle: 'tabularLeft',
            })
          )
       }
      }

  
    return(
        <div className="monaco-sql-editor-content">
            <div className="monaco-sql-editor-title">
                <Space className={`${rootCls}-wrapper`}>
                   {isSqlExecuteBtn&&<span className={`${rootCls}-btn`} id="one" onClick={()=>{
                         console.log('--------', editorInstance?.getValue())
                    }}>执行</span> } 
                   {isSqlCheckBtn&&<span className={`${rootCls}-btn`} id="two">sql检测</span>}  
                   {isSqlBueatifyBtn&&<span className={`${rootCls}-btn`} id="three" onClick={ formatSql}>sql美化</span>}  
                   {isSqlExecutePlanBtn&&<span className={`${rootCls}-btn`} id="four">执行计划</span>} 
                   {isSubChangeBtn&&<span className={`${rootCls}-btn`} id="fifth">提交变更</span> } 
                </Space>
            </div>
            {/* calc(100vh - 566px */}
            <div ref={codeContainerRef} className="editor-container" style={{height: 'calc(100vh - 560px)',minHeight:300}}  />

        </div>
    )
}