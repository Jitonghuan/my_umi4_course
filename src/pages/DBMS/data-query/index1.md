import React, { Component } from 'react';
import Draggable from 'react-draggable';
// import styled from 'styled-components';

// 容器
const Container = styled.div`
  display: flex;
  justify-content: flex-start;
`;

// 左边内容部分
const LeftContent = styled.div`
  position: relative;
  width: ${props => props.width}px;
  height: 100vh;
  padding: 20px;
  background-color: #E6E6FA;
  overflow: hidden;
  flex-grow:1;
`;

// 拖拽部分
const DraggableBox = styled.div`
  position: absolute;
  left: ${props => props.left}px;
  top: 0;
  width: 5px;
  height: 100vh;
  background-color: ${props => props.background};
  cursor: col-resize;
  z-index: 1000;
`;

// 右边内容部分
const RightContent = styled.div`
  width: calc(100% - ${props => props.leftBoxWidth}px);
  height: 100vh;
  padding: 20px;
  background-color: #FFF;
  flex-grow:1;
  z-index: 100;
`;

const Li = styled.li`
  white-space: nowrap;
`;

class DraggableExp extends Component {
  state = {
    initialLeftBoxWidth: 150, // 左边区块初始宽度
    leftBoxWidth: 150, // 左边区块初始宽度
    leftBoxMinWidth: 100, // 左边区块最小宽度
    leftBoxMaxWidth: 300, // 左边区块最大宽度
    dragBoxBackground: 'transparent' // 拖拽盒子的背景色
  }

  // 拖动时设置拖动box背景色，同时更新左右box的宽度
  onDrag = (ev, ui) => {
    const { initialLeftBoxWidth } = this.state;
    const newLeftBoxWidth = ui.x + initialLeftBoxWidth;
    this.setState({
      leftBoxWidth: newLeftBoxWidth,
      dragBoxBackground: '#FFB6C1'
    });
  };

  // 拖拽结束，重置drag-box的背景色
  onDragStop = () => {
    this.setState({
      dragBoxBackground: 'transparent'
    });
  };

  render() {
    const { initialLeftBoxWidth, 
            leftBoxWidth, 
            leftBoxMinWidth, 
            leftBoxMaxWidth, 
            dragBoxBackground } = this.state;
    return (
      <Container>
        <LeftContent width={leftBoxWidth}>
          <h3 style={{paddingLeft: 20}}>目录</h3>
          <ul>
            <Li>目录1</Li>
            <Li>目录2</Li>
            <Li>目录3</Li>
            <Li>这是个非常长非常长非常长的目录</Li>
          </ul>
          <Draggable 
            axis="x"
            defaultPosition={{ x: 0, y: 0 }}
            bounds={{ left: leftBoxMinWidth - initialLeftBoxWidth, right: leftBoxMaxWidth - initialLeftBoxWidth }}
            onDrag={this.onDrag}
            onStop={this.onDragStop}>
            <DraggableBox
              left={initialLeftBoxWidth - 5} 
              background={dragBoxBackground} />
          </Draggable>
        </LeftContent>
        <RightContent leftBoxWidth={leftBoxWidth}>
          <h3>这里是内容块</h3>
        </RightContent>
      </Container>
    )
  }
}

export default DraggableExp;