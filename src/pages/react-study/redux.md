<!--
 * @Author: Jitonghuan 2016670689@qq.com
 * @Date: 2023-02-09 17:04:30
 * @LastEditors: Jitonghuan 2016670689@qq.com
 * @LastEditTime: 2023-02-09 17:04:31
 * @FilePath: /my_umi4_course/src/pages/react-study/redux.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
Redux 是一个 JavaScript 库，用于管理应用程序的状态和 UI。它可以帮助开发人员构建可预测的应用程序，更容易维护和测试。

使用 Redux 的步骤如下：

1. 创建一个 store：使用 createStore() 函数创建一个 store，并将 reducer 传递给它。

2. 定义 reducer：定义一个 reducer 函数，它接收当前的状态和动作，并返回新的状态。

3. 分发 action：使用 store.dispatch() 方法分发 action，以更新应用程序的状态。

4. 订阅更新：使用 store.subscribe() 方法订阅更新，以便在状态更改时执行特定操作。

5. 使用状态：使用 store.getState() 方法获取当前应用程序状态，并使用它来更新 UI。


1. React Boilerplate：https://github.com/react-boilerplate/react-boilerplate
2. react-redux-starter-kit：https://github.com/davezuko/react-redux-starter-kit
3. React Redux Universal Hot Example：https://github.com/erikras/react-redux-universal-hot-example
4. React Redux Form：https://github.com/davidkpiano/react-redux-form
5. React Redux Universal Router：https://github.com/kriasoft/react-redux-universal-router
6. Redux Simple Starter：https://github.com/StephenGrider/ReduxSimpleStarter