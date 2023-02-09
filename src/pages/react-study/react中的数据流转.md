<!--
 * @Author: Jitonghuan 2016670689@qq.com
 * @Date: 2023-02-09 16:59:38
 * @LastEditors: Jitonghuan 2016670689@qq.com
 * @LastEditTime: 2023-02-09 16:59:39
 * @FilePath: /my_umi4_course/src/pages/react-study/react中的数据流转.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2023-02-01 17:02:33
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2023-02-02 15:41:49
 * @FilePath: /oh-my-kanban/学习笔记/react 中的数据流转.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# React 单向数据流
- 什么是数据流？
提到数据流，要先提一下 **函数响应式编程（Functional Reactive Programming）**，顾名思义，函数响应式编程是一种利用函数式编程的部件进行响应式编程的编程范式。
>数据流（Data Flow）则是其中响应式编程的重要概念，响应式编程将程序逻辑建模成为在运算（Operation）之间流动的数据及其变化。

- React 的数据流包含哪些数据？
React 的数据流主要包含了三种数据：属性 props、状态 state 和上下文 context。
# Props
自定义 React 组件接受一组输入参数，用于改变组件运行时的行为，这组参数就是 props。
在声明函数组件时，函数的第一个参数就是 props。
以下两种写法都很常见：
 >一个是在组件内部读取 props 对象的属性；
 >另一个是通过 ES6 的解构赋值语法（Destructuring Assignment）展开函数参数，直接在组件内部读取单个 prop 变量。

// 1
function MyComponent(props) {
  return (
    <ul>
      <li>{props.prop1}</li>
      <li>{props.prop2}</li>
    </ul>
  );
}

// 2
function MyComponent({ prop1, prop2 }) {
  return (
    <ul>
      <li>{prop1}</li>
      <li>{prop2}</li>
    </ul>
  );
}
需要注意的是，无论是哪种写法，props 都是不可变的，不能在组件内改写从外面传进来的 props。
props 的数据流向是单向的，只能从父组件流向子组件，而不能从子组件流回父组件，也不能从当前组件流向平级组件。
# State 
在 props 之外，组件也可以拥有自己的数据。对于一个函数而言，“自己的数据”一般是指函数内声明的变量。
而对一个函数组件来说，因为每次渲染函数体都会重新执行，函数体内变量也会被重新声明，如果需要组件在它的生命周期期间拥有一个“稳定存在”的数据，那就需要为组件引入一个专有的概念，即 state。
在函数组件中使用 state，需要调用 useState / useReducer Hooks。
不过需要反复强调的是，state 与 props 一样，也是不可变的。需要修改 state 时，不能直接给 state 变量赋值，而是必须调用 state 更新函数，即 setXxx / dispatch 或 this.setState 。
- 什么是state改变？
当组件的 state 发生改变时，组件将重新渲染。那什么才算是改变呢？
从底层实现来看，React 框架是用 Object.is() 来判断两个值是否不同的。
尤其注意，当新旧值都是对象、数组、函数时，判断依据是它们的值引用是否不同。

**对同一个对象属性的修改不会改变对象的值引用，对同一个数组成员的修改也不会改变数组的值引用**，在 React 中都不认为是变化。所以在更新这类 state 时，需要新建对象、数组：**即使用setState**
# Context
从数据流的角度看，context 的数据流向也是单向的，只能从声明了 Context.Provider 的当前组件传递给它的子组件树，即子组件和后代组件。而不能向父组件或祖先组件传递，也不能向当前子组件树之外的其他分支组件树传递。
# React 单向数据流
React 是一种声明式的前端框架，在 React 的数据流上也体现了这一点。在典型场景下，你可以通过声明这三种数据来设计 React 应用的数据流，进而控制应用的交互和逻辑。

# 虽然说 props、state 和 context 是不同的概念，但从一棵组件树的多个组件来看，同一条数据在引用不变的前提下，在传递过程中却可以具有多重身份。




