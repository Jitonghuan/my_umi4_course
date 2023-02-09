<!--
 * @Author: Jitonghuan 2016670689@qq.com
 * @Date: 2023-02-09 16:59:53
 * @LastEditors: Jitonghuan 2016670689@qq.com
 * @LastEditTime: 2023-02-09 16:59:54
 * @FilePath: /my_umi4_course/src/pages/react-study/react合成事件.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
## 什么是React合成事件？
合成事件是原生 DOM 事件的一种包装，它与原生事件的接口相同，根据 W3c 规范，React 内部规范化（Normalize）了这些接口在不同浏览器之间的行为，开发者不用再担心事件处理的浏览器兼容性问题。
## 合成事件与原生 DOM 事件的区别？
* 注册事件监听函数的方式不同；
<1> 监听原生 DOM 事件基本有三种方式。
    * 与 React 合成事件类似的，以内联方式写在 HTML 标签中：
    <button id="btn" onclick="handleClick()">按钮</button>
    * 在 JS 中赋值给 DOM 元素的事件处理属性：
     document.getElementById('btn').onclick = handleClick;
    * 在 JS 中调用 DOM 元素的 addEventListener 方法（需要在合适时机调用 removeEventListener 以防内存泄漏）
     document.getElementById('btn').addEventListener('click', handleClick);
<2> 而合成事件不能通过 addEventListener 方法监听，它的 JSX 写法等同于 JS 写法;

const Button = () => (<button onClick={handleClick}>按钮</button>);
// 编译为
const Button = () => React.createElement('button', {
  onClick: handleClick
}, '按钮');
* 特定事件的行为不同
React 合成事件规范化了一些在各个浏览器间行为不一致，甚至是在不同元素上行为不一致的事件，其中有代表性的是 onChange 。
* 实际注册的目标 DOM 元素不同
合成事件的 currentTarget 也是按钮元素，这是符合 W3c 规范的；
但原生事件的 currentTarget 不再是按钮，而是 React 应用的根容器 DOM 元素：

这是因为 React 使用了事件代理模式。React 在创建根（ createRoot ）的时候，会在容器上监听所有自己支持的原生 DOM 事件。当原生事件被触发时，React 会根据事件的类型和目标元素，找到对应的 FiberNode 和事件处理函数，创建相应的合成事件并调用事件处理函数。


2、受控组件与表单
* 什么是受控组件？
以 React state 为单一事实来源（Single Source of Truth），并用 React 合成事件处理用户交互的组件，被称为“受控组件”

#  什么是事件委托？
事件委托优点：
因为仅有一个事件处理器添加在顶层的父元素，而不是在每一个子元素上都添处理器，所以这个技术效率高；
事件委托缺点：
一旦触发内部子元素，所有隶属于该元素的子元素和父元素都会被触发（由冒泡和捕获引起）。必须触发特定的事件对象，才能阻止发生上述问题。

（React中的事件代理模式。React 在创建根（ createRoot ）的时候，会在容器上监听所有自己支持的原生 DOM 事件。当原生事件被触发时，React 会根据事件的类型和目标元素，找到对应的 FiberNode 和事件处理函数，创建相应的合成事件并调用事件处理函数。）
# JavaScript事件传播是什么？

# 事件传播的触发顺序
🟢捕获阶段  –  这是触发事件后的第一个阶段。事件首先在顶层被“捕获”或者说传播。顶层即window对象，然后是document对象，再就是html元素，之后抵达最内部的元素。事件传播由上到下一直抵达到event.target（即你点击触发事件的元素）
🟢 目标阶段  –  当抵达event.target后便进入第二个阶段。当用户点击按钮，这个按钮便是event.target所指的元素。
🟢 冒泡阶段 – 这是第三个阶段。该阶段起始于event.target，一路向上传播直到重新触达顶层元素（虽然顶层父元素此时不会被再次调用）。
值得注意的是，即便事件传播分为三个主要阶段，但是目标阶段并没有被独立出来。事件监听器在捕获和冒泡阶段都在此处触发。
可以通过event.eventPhase来判断事件处于哪个阶段。
# 默认情况下，事件使用冒泡事件流，不使用捕获事件流。然而，在Firefox和Safari里，你可以显式的指定使用捕获事件流，方法是在注册事件时传入useCapture参数，将这个参数设为true。

# 冒泡事件流
当事件在某一DOM元素被触发时，例如用户在客户名字节点上点击鼠标，事件将跟随着该节点继承自的各个父节点冒泡穿过整个的DOM节点层次，直到它 遇到依附有该事件类型处理器的节点，此时，该事件是onclick事件。在冒泡过程中的任何时候都可以终止事件的冒泡，在遵从W3C标准的浏览器里可以通过调用事件对象上的stopPropagation()方法，在Internet Explorer里可以通过设置事件对象的cancelBubble属性为true。如果不停止事件的传播，事件将一直通过DOM冒泡直至到达文档根。即从被点击的元素到此元素的祖先元素直至根元素，从下到上。
# 捕获事件流
事件的处理将从DOM层次的根开始，而不是从触发事件的目标元素开始，事件被从目标元素的所有祖先元素依次往下传递。在这个过程中，事件会被从文档 根到事件目标元素之间各个继承派生的元素所捕获，如果事件监听器在被注册时设置了useCapture属性为true,那么它们可以被分派给这期间的任何 元素以对事件做出处理；否则，事件会被接着传递给派生元素路径上的下一元素，直至目标元素。事件到达目标元素后，它会接着通过DOM节点再进行冒泡。即根元素到被点击的元素，从上到下。

# 现代事件绑定方法
使用传统事件绑定有许多缺陷，比如不能在一个对象的相同事件上注册多个事件处理函数。而浏览器和W3C也并非没有考虑到这一点，因此在现代浏览器中，它们有自己的方法绑定事件。
# W3C DOM
obj.addEventListener(evtype,fn,useCapture)——W3C提供的添加事件处理函数的方法。obj是要添 加事件的对象，evtype是事件类型，不带on前缀，fn是事件处理函数，如果useCapture是true，则事件处理函数在捕获阶段被执行，否则 在冒泡阶段执行
obj.removeEventListener(evtype,fn,useCapture)——W3C提供的删除事件处理函数的方法

## 冒泡和捕获促成了事件委托模式。

### 事件冒泡例子：
点击按钮后，发生了以下事件：

首先，按钮绑定的事件处理器被触发。
然后，父元素div的事件处理器也被触发。
多数情况下，或许你只希望绑定在按钮上的事件处理器被激活，但是父元素的事件处理器也被触发了，这就是✨事件冒泡✨；

# 在 JavaScript 中事件冒泡是如何产生的？
事件冒泡为何存在？
JavaScript 在设计事件传播模型的其中一个初衷是让事件捕获更加方便。即可以从单一源头（父元素）捕获，而非每一个子元素上添加事件处理器。

# 在 React 中事件冒泡是如何产生的？
React 并没有将事件处理器绑定在 node 上，而是 documment 的根元素（root）。当事件被触发，React 首先调用的是触发的元素（即目标阶段中你点击的元素），然后开始冒泡。
合成事件 并不默认专注在捕获阶段，除非特意设置。若需要触发捕获阶段，可将父元素div的事件监听器由onClick修改成onClickCapture

* 在 React 16 及更低版本，若在事件合成中触发冒泡阶段，冒泡阶段的发现和 JavaScript 中原生的一样，事件会一直向上至Document。
在react 17  是冒泡到root element;

# 如何在组件中终止冒泡事件?
场景：你编写了一个按钮（或者其他元素）并且你希望只有按钮上绑定的事件接听器被触发——其他父元素不被触发。

### event.stopPropagation()
这个方法可以阻止任何父元素的触发。使用该方法需要：

确保event对象作为参数传入。
stopPropagation绑定在事件监听器函数内，并在其他代码之上。

### event.stopImmediatePropagation()
假设你在同一个元素上绑定了多个事件。此时用event.stopPropagation()肯定可以阻止父元素事件的触发，但是该元素上的其他事件还是会触发。
为了防止其他事件触发，可以使用event.stopImmediatePropagation()。这个方法可以阻止父元素和该元素上其他事件的触发。

### event.preventDefault()
该方法是基于事件处理器和元素。
例如：

如果你有一张表格，并且不希望提交表格后页面刷新。
你根据功能创建自己的路由，并且不希望刷新页面。

# 对比 Event.target 和 Event.currentTarget
记住：触发事件的元素并不一定是事件监听器绑定的地方。
* event.target 是事件流中最底部的元素。
* event.currentTarget 是监听事件的元素（事件监听器绑定的地方）。

MDN表示即可以选择性地使用options对象中的capture也可以使用useCapture参数（也是可选的），两者效果相同。

// 你可以这样写：
yourElement.addEventListener(type, listener, { capture: true });

// 也可以这样写：
yourElement.addEventListener(type, listener, useCapture: true);

⚠️ 之所以可以这样操作，是因为在 JavaScript 中除非有特别设置，捕获阶段会被忽略，仅有冒泡阶段会被触发（在目标阶段之后），MDN 是这样解释的：

绑定在事件目标的事件监听器，事件处在目标阶段，而非捕获或冒泡阶段。事件监听器的捕获阶段在其他任何非捕获阶段之间被调用。
# 哪些事件不冒泡，如何处理这些事件？
以下是原生 JavaScript 中的一些例子：

blur（focusout 区别在于后者冒泡）
focus（focusin 区别在于后者冒泡）。
mouseleave（mouseout 区别在于后者冒泡）
mouseenter（mouseover 区别在于后者冒泡）。
load，unload，abort，error，beforeunload。
⚠️ 当事件被创造时，可以冒泡的事件可以通过设定bubbles选项为true，当然这些事件仍然会经历捕获阶段。
# React 16 及过往版本中的事件监听器对比 React 17 及以上
## React合成事件冒泡捕获和原生事件的差异点，以及 React 不同版本之间的差异。
1、比方说，你可能希望 React 中的onBlur和onFocus和原生JavaScript中一样，不冒泡。但在 React 这两个事件也冒泡。
event.target.value 在异步函数中曾作为无效值（Nullfied）
在 React 17 之前，如果你想在异步函数中获取一个事件，你会获得未定义。

这是因为 React 的合成事件被纳入的事件池，即事件处理器被调用后，你将无法再次获取事件，因为这些事件会被重置并放入事件池。
如果要在异步函数中稍后再获取事件信息，这样就会出现问题。
function handleChange(e){
    //event 对象已经被回收；
    setTimeout(()=>{
        console.log(e.target.value)
    },100)
}

⚠️ 唯一可以在异步函数中保留信息的的方式时调用event.persist()的方法：
function handleChange(e){
    e.persist;
    setTimeout(()=>{
        console.log(e.target.value)
    },100);
}
设定这样机制的初衷是为了提升性能，但是 React 团队通过进一步观察，发现这样做不仅没有提升性能，反而让程序员感到困惑，所以他们废置了这个机制。

⚠️ 在 React 17 之后，React 不再将合成事件对象纳入事件池。所以你可以在不借助event.persisit()方法的前提下在异步函数中获取event.target.value的值。

# 特殊情况：当需要执行父元素的时候怎么办?
🤔 假设我们希望我们的应用具备以下功能：

当用户点击内部div或者按钮元素，仅被点击的元素被触发（或如下文例子，改变电视的频道）。
当用户点击外部的父元素div，父元素被触发（这在弹出模型中常见，当用户点击模型外部，淡出关闭，或如下文例子，电视重新打开）。
目前你所知的是不论是点击父元素还是子元素，React 的合成事件会触发冒泡。
























3、合成事件的冒泡和捕获





4、什么时候使用原生 DOM 事件？
* 需要监听 React 组件树之外的 DOM 节点的事件，这也包括了 window 和 document 对象的事件。需要注意的是，在组件里监听原生 DOM 事件，属于典型的副作用，所以请务必在 useEffect 中监听，并在清除函数中及时取消监听；

 useEffect(() => {
  window.addEventListener('resize', handleResize);
  return function cleanup() {
    window.removeEventListener('resize', handleResize);
  };
}, []);

* 很多第三方框架，尤其是与 React 异构的框架，在运行时会生成额外的 DOM 节点。在 React 应用中整合这类框架时，常会有非 React 的 DOM 侵入 React 渲染的 DOM 树中。当需要监听这类框架的事件时，要监听原生 DOM 事件，而不是 React 合成事件。这同样也是 useEffect 或 useLayoutEffect 的领域。

5、

