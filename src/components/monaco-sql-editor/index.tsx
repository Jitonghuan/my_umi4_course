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
    subChange?:(params:{sqlContent:string,sqlType?:string})=>void;
    subSqlChange?:(params:{sqlContent:string,sqlType?:string})=>void;
    sqlCheck?:(sqlContent:string)=>void;
    isSubChangeBtn?:boolean;
    isSqlCheckBtn?:boolean;
    isSqlBueatifyBtn?:boolean;
    isSqlExecuteBtn?:boolean;
    isSqlExecutePlanBtn?:boolean;
    tableFields?:any;
   
    
  }
  const { keywords } = language
  console.log('0')
export default function SqlEditor(props:Iprops){
  const {isSqlExecutePlanBtn,isSqlBueatifyBtn,tableFields,sqlCheck,isSqlExecuteBtn,initValue="select * from user limit 10",readOnly,language="sql",height=500,theme='vs',isSubChangeBtn,isSqlCheckBtn,subChange,subSqlChange}=props;
    // const codeContainerRef = useRef(null) as any;
    console.log('1')
    const [instance, setInstance] = useState<editor.IStandaloneCodeEditor | undefined>(undefined);

    const rootCls = 'monaco-sql-editor-title';
    
    const [getVal,setGetVal]=useState<any>();
    let divNode:any;
    const codeContainerRef = useCallback((node:any) => {
        // On mount get the ref of the div and assign it the divNode
        divNode = node;
    }, []);
    let completeProvider:any
    console.log("tableFields",tableFields)
    useEffect(() => {
      console.log("1.5")
        if (divNode) {
          console.log("1.6")
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
            console.log("1.7",monacoEditor)
            setInstance(monacoEditor);
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
      console.log('2')
        if(instance){
            getSelectionVal();
        }
    },[instance])
    useEffect(()=>{
      console.log('3')
        if(instance){
            
          getValue();
            
         
            console.log('--------', getValue())
        }
        
    },[instance,getVal])
    useEffect(()=>{
      console.log('4')
        if(instance){
            monaco.editor.setTheme(theme)
        }  
    },[instance,theme])
    useEffect(()=>{
      console.log('5')
        if(instance){
            instance.layout()
        }  
    },[instance])
    useEffect(()=>{ 
      console.log('6')
        return ()=>{
            if(instance){
                instance?.dispose()
            }

        }
    },[instance])
    const getValue=()=> {
      console.log('7')
      if(instance){
        setGetVal(instance?.getModel()?.getValue())
        return instance?.getModel()?.getValue()

      }else{
        setGetVal("")
        return ""
      }
        
      };
     
      //获取选中代码
    const  getSelectionVal=()=> {
        const selection =instance?.getSelection() // 获取光标选中的值
        if (!selection) return;
        const { startLineNumber=0, endLineNumber, startColumn, endColumn }:any = selection
        const model = instance?.getModel()
  
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
              if (Object.keys(tableFields).includes(tokenNoDot)) {
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
        instance?.setPosition({ column, lineNumber })
      }
     const getPosition=()=>{
        return instance?.getPosition()
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
        return Object.keys(tableFields).map((key) => ({
          label: key,
          kind: monaco.languages.CompletionItemKind.Constant,
          insertText: key,
        }))
      };
     const  getTableSuggest=(dbName:string)=>{
        const tableNames = tableFields[dbName]
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
       if(instance){
        instance?.getModel()?.setValue(
            format(instance?.getValue(), {
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
                       console.log('8')
                         subChange({sqlContent:instance?.getValue()||"",sqlType:"query"})
                         
                         
                    }}>执行</span> } 
                   {isSqlCheckBtn&&<span className={`${rootCls}-btn`} id="two" onClick={()=>{
                       console.log('10')
                       sqlCheck(instance?.getValue()||"")
                         
                         
                    }}>sql检测</span>}  
                   {isSqlBueatifyBtn&&<span className={`${rootCls}-btn`} id="three" onClick={ formatSql}>sql美化</span>}  
                   {isSqlExecutePlanBtn&&<span className={`${rootCls}-btn`} id="four" onClick={()=>{subChange({sqlContent:instance?.getValue()||"",sqlType:"explain"})}}>执行计划</span>} 
                   {isSubChangeBtn&&<span className={`${rootCls}-btn`} id="fifth" onClick={()=>{
                       console.log('9')
                       subSqlChange({sqlContent:instance?.getValue()||""})
                         
                         
                    }}>提交变更</span> } 
                </Space>
            </div>
            {/* calc(100vh - 566px */}
            <div ref={codeContainerRef} className="editor-container" style={{height: 'calc(100vh - 560px)',minHeight:300}}  />

        </div>
    )
}