<!--
 * @Author: Jitonghuan 2016670689@qq.com
 * @Date: 2023-02-09 17:03:58
 * @LastEditors: Jitonghuan 2016670689@qq.com
 * @LastEditTime: 2023-02-09 17:03:59
 * @FilePath: /my_umi4_course/src/pages/react-study/Fiber协调引擎.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# 什么是Fiber协调引擎？
React 组件会渲染出一棵元素树……每次有 props、state 等数据变动时，组件会渲染出新的元素树，React 框架会与之前的树做 Diffing 对比，将元素的变动最终体现在浏览器页面的 DOM 中。这一过程就称为**协调**

在 React 的早期版本，协调是一个同步过程，这意味着当虚拟 DOM 足够复杂，或者元素渲染时产生的各种计算足够重，协调过程本身就可能超过 16ms，严重的会导致页面卡顿。而从 React v16 开始，协调从之前的同步改成了异步过程，这主要得益于新的 **Fiber 协调引擎**

- Fiber 协调引擎做的事情基本上贯穿了 React 应用的整个生命周期，包括并不限于：
创建各类 FiberNode 并组建 Fiber 树；
调度并执行各类工作（Work），如渲染函数组件、挂载或是更新 Hooks、实例化或更新类组件等；
比对新旧 Fiber，触发 DOM 变更；
获取 context 数据；
错误处理；
性能监控。
# Fiber 中的重要概念和模型
在协调过程中存在着各种动作，如调用生命周期方法或 Hooks，这在 Fiber 协调引擎中被称作是**工作（Work）**。Fiber 中最基本的模型是 **FiberNode**，用于描述一个组件需要做的或者已完成的工作，每个组件可能对应一个或多个 FiberNode。这与一个组件渲染可能会产生一个或多个 React 元素是一致的。

# 协调过程是怎样的？
当第一次渲染，React 元素树被创建出来后，Fiber 协调引擎会从 HostRoot 这个特殊的元素开始，遍历元素树，创建对应的 FiberNode 。
FiberNode 与 FiberNode 之间，并没有按照传统的 parent-children 方式建立树形结构。而是在父节点和它的第一个子节点间，利用child 和 return 属性建立了双向链表。节点与它的平级节点间，利用 sibling 属性建立了单向链表，同时平级节点的 return 属性，也都被设置成和单向链表起点的节点 return 一样的值引用。
这样做的好处是，可以在协调引擎进行工作的过程中，避免递归遍历 Fiber 树，而仅仅用两层循环来完成深度优先遍历，这个用于遍历 Fiber 树的循环被称作 workLoop。

当组件内更新 state 或有 context 更新时，React 会进入渲染阶段（Render Phase）。这一阶段是异步的，Fiber 协调引擎会启动workLoop ，从 Fiber 树的根部开始遍历，快速跳过已处理的节点；对有变化的节点，引擎会为 Current（当前）节点克隆一个 WorkInProgress（进行中）节点，将这两个 FiberNode 的 alternate 属性分别指向对方，并把更新都记录在WorkInProgress 节点上。
你可以理解成同时存在两棵 Fiber 树，一棵 Current 树，对应着目前已经渲染到页面上的内容；另一棵是 WorkInProgress 树，记录着即将发生的修改。


提交阶段又分成如下 3 个先后同步执行的子阶段：
- 变更前（Before Mutation）子阶段。这个子阶段会调用类组件的 getSnapshotBeforeUpdate 方法。
- 变更（Mutation）子阶段。这个子阶段会更新真实 DOM 树。
  - 递归提交与删除相关的副作用，包括移除 ref、移除真实 DOM、执行类组件的 componentWillUnmount 。
  - 递归提交添加、重新排序真实 DOM 等副作用。依次执行 FiberNode 上 useLayoutEffect 的清除函数。
  - 引擎用 FinishedWork 树替换 Current 树，供下次渲染阶段使用。
- 布局（Layout）子阶段。
  - 这个子阶段真实 DOM 树已经完成了变更，会调用 useLayoutEffect 的副作用回调函数，和类组件的 componentDidMount 方法。

