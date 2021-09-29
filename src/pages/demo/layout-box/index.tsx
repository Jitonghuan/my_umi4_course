// 上下布局页面
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React, { useContext, useState, useCallback } from 'react';
import {} from 'antd';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard, CardRowGroup } from '@/components/vc-page-content';

export default function DemoPageTb() {
  const themes = {
    light: {
      foreground: '#000000',
      background: '#eeeeee',
    },
    dark: {
      foreground: '#ffffff',
      background: '#222222',
    },
  };
  // 创建一个 Theme 的 Context

  const ThemeContext = React.createContext(themes.light);
  function App() {
    const [theme, setTheme] = useState('light');
    const toggleTheme = useCallback(() => {
      setTheme((theme) => (theme === 'light' ? 'dark' : 'light'));
    }, []);
    // 整个应用使用 ThemeContext.Provider 作为根组件
    return (
      // 使用 themes.dark 作为当前 Context
      <ThemeContext.Provider value={themes[theme]}>
        <button onClick={toggleTheme}>Toggle Theme</button>
        <Toolbar />
      </ThemeContext.Provider>
    );
  }

  // 在 Toolbar 组件中使用一个会使用 Theme 的 Button
  function Toolbar(props: any) {
    return (
      <div>
        <ThemedButton />
      </div>
    );
  }

  // 在 Theme Button 中使用 useContext 来获取当前的主题
  function ThemedButton() {
    const theme = useContext(ThemeContext);
    return (
      <button
        style={{
          background: theme.background,
          color: theme.foreground,
        }}
      >
        I am styled by theme context!
      </button>
    );
  }
  return (
    <PageContainer>
      <FilterCard>TOP</FilterCard>
      <CardRowGroup>
        <CardRowGroup.SlideCard width={200}>LEFT</CardRowGroup.SlideCard>
        <ContentCard>RIGHT</ContentCard>
      </CardRowGroup>
    </PageContainer>
  );
}
