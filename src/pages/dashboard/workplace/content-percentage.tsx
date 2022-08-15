import { Card, Grid } from '@arco-design/web-react';
import './style/contentpercentag.less';
import { BorderBox8, Decoration9 } from '@jiaminghi/data-view-react';
import { loadFull } from 'tsparticles';
import ReactCanvasNest from 'react-canvas-nest';

const { Row, Col } = Grid;
function PopularContent() {
  //粒子参数
  const options = {
    background: {
      color: {
        value: '#0d47a1',
      },
      position: '50% 50%',
      repeat: 'no-repeat',
      size: 'aotu',
    },
    // 帧数，越低越卡,默认60
    fpsLimit: 120,
    fullScreen: {
      zIndex: 1,
    },
    interactivity: {
      events: {
        // "onClick": {
        //     "enable": true,
        //     "mode": "push"
        // },
        onHover: {
          enable: true,
          mode: 'slow',
        },
      },
      modes: {
        push: {
          //点击是添加1个粒子
          quantity: 3,
        },
        bubble: {
          distance: 200,
          duration: 2,
          opacity: 0.8,
          size: 20,
          divs: {
            distance: 200,
            duration: 0.4,
            mix: false,
            selectors: [],
          },
        },
        grab: {
          distance: 400,
        },
        //击退
        repulse: {
          divs: {
            //鼠标移动时排斥粒子的距离
            distance: 200,
            //翻译是持续时间
            duration: 0.4,
            factor: 100,
            speed: 1,
            maxSpeed: 5,
            easing: 'ease-out-quad',
            selectors: [],
          },
        },
        //缓慢移动
        slow: {
          //移动速度
          factor: 2,
          //影响范围
          radius: 200,
        },
        //吸引
        attract: {
          distance: 200,
          duration: 0.4,
          easing: 'ease-out-quad',
          factor: 3,
          maxSpeed: 5,
          speed: 1,
        },
      },
    },
    //  粒子的参数
    particles: {
      //粒子的颜色
      color: {
        value: '#ffffff',
      },
      //是否启动粒子碰撞
      collisions: {
        enable: true,
      },
      //粒子之间的线的参数
      links: {
        color: {
          value: '#ffffff',
        },
        distance: 150,
        enable: true,
        warp: true,
      },
      move: {
        attract: {
          rotate: {
            x: 600,
            y: 1200,
          },
        },
        enable: true,
        outModes: {
          bottom: 'out',
          left: 'out',
          right: 'out',
          top: 'out',
        },
        speed: 2,
        warp: true,
      },
      number: {
        density: {
          enable: true,
        },
        //初始粒子数
        value: 40,
      },
      //透明度
      opacity: {
        value: 0.5,
        animation: {
          speed: 3,
          minimumValue: 0.1,
        },
      },
      //大小
      size: {
        random: {
          enable: true,
        },
        value: {
          min: 1,
          max: 3,
        },
        animation: {
          speed: 20,
          minimumValue: 0.1,
        },
      },
    },
  };

  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  const particlesLoaded = async (container: any) => {};

  return (
    <>
      <Card style={{ width: '100%' }}>
        <BorderBox8
          dur={6}
          style={{ height: 'calc(100vh - 390px)' }}
          color={['rgb(29, 193, 245)', 'blue']}
          className="percentage"
        >
          <ReactCanvasNest
            className="canvasNest"
            config={{
              pointColor: ' 0, 255, 255 ',
              lineColor: '173, 216, 230',
              pointOpacity: 0.5,
              pointR: 2,
              count: 90,
              follow: true,
            }}
            style={{ zIndex: 6 }}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 7,
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'column',
              justifyContent: 'center',
              // alignItems:'center',
              height: '100%',
              overflow: 'auto',
            }}
          >
            <Row style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '26%' }}>
              <Decoration9 style={{ width: '10vw', height: '10vw' }} dur={9}>
                <span className="textShadow"> 云原生</span>
              </Decoration9>
            </Row>
            <Row
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                height: '28%',
                paddingLeft: '8%',
                paddingRight: '8%',
              }}
            >
              <Decoration9 style={{ width: '10vw', height: '10vw' }} dur={9}>
                <span className="textShadow"> 研发协同</span>
              </Decoration9>
              <Decoration9 style={{ width: '10vw', height: '10vw' }} dur={9}>
                <span className="textShadow"> 交付运维</span>
              </Decoration9>
            </Row>
            <Row
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                width: '100%',
                height: '29%',
                paddingTop: '2%',
                paddingLeft: '4%',
                paddingRight: '4%',
              }}
            >
              <Decoration9 style={{ width: '10vw', height: '10vw' }} dur={9}>
                <span className="textShadow"> 可观测</span>
              </Decoration9>
              <Decoration9 style={{ width: '10vw', height: '10vw' }} dur={9}>
                <span className="textShadow"> 集群管理</span>
              </Decoration9>
            </Row>
          </div>
        </BorderBox8>
      </Card>
    </>
  );
}

export default PopularContent;
