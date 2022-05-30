import React, { useState, useEffect } from 'react';
import { Card, Spin, Typography, Grid } from '@arco-design/web-react';
import { DonutChart } from 'bizcharts';

import whiteBg from '@/assets/imgs/BGthree.png';
// import '../workplace/style/content.module.less';
import './style/contentpercentag.less';
import {
  ActiveRingChart,
  BorderBox13,
  BorderBox1,
  BorderBox12,
  BorderBox8,
  BorderBox6,
  BorderBox10,
  BorderBox11,
  Decoration9,
  BorderBox7,
  BorderBox4,
  BorderBox9,
} from '@jiaminghi/data-view-react';
import axios from 'axios';
import styles from './style/docs.module.less';

const { Row, Col } = Grid;
//
function PopularContent() {
  const data: any = {
    data: [
      {
        name: '应用',
        value: 120,
      },
      {
        name: '交付',
        value: 120,
      },
      {
        name: '运维',
        value: 78,
      },
      {
        name: '监控',
        value: 66,
      },
      {
        name: '资源',
        value: 80,
      },
      {
        name: '发布',
        value: 80,
      },
    ],
    digitalFlopStyle: {
      fontSize: 25,
      fill: '#435488',
    },
    activeRadius: '80%',
    radius: '70%',
  };

  const digitalFlopStyle = {
    fontSize: 25,
    fill: '#435488',
  };

  // const t = useLocale(locale);
  // const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetchData();#435488
    // rgb(179 194 246)
  }, []);

  return (
    <>
      <Card style={{ width: '100%' }}>
        <BorderBox8
          dur={6}
          style={{ height: 'calc(100vh - 390px)' }}
          color={['rgb(29, 193, 245)', 'blue']}
          reverse="{true}"
          className="percentage"
        >
          {/* <Typography.Title heading={3} style={{ marginTop: '0px', lineHeight: 1, padding: 14,}}>
          Matrix云原生平台
          
        </Typography.Title> */}
          {/* <div className="content-bg-mask">
      
          <div className="g-polygon g-polygon-1"></div>
          <div className="g-polygon g-polygon-2"></div>
          <div className="g-polygon g-polygon-3"></div>
        </div>
        <div className='matrix-bg' > 
        < img src= {logoBg} />
        </div> */}

          {/* <div style={{ display: 'flex', justifyContent: 'space-around' }}> */}
          {/* <div style={{ position: 'absolute' }} >
            <img src={whiteBg} style={{ top: 4, filter: 'opacity(0.3)', height: '50vh', width: '54vw' }}></img>
          </div> */}
          <div
            style={{
              paddingTop: '6vh',
              position: 'relative',
              zIndex: 4,
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Row style={{ display: 'flex', justifyContent: 'center' }}>
              <Decoration9 style={{ width: '12vw', height: '20vh' }} dur={7}>
                <span className="textShadow"> 研发协同</span>
              </Decoration9>
            </Row>
            <Row style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Decoration9 style={{ width: '12vw', height: '20vh' }} dur={7}>
                <span className="textShadow"> 云原生</span>
              </Decoration9>
              <Decoration9 style={{ width: '12vw', height: '20vh' }} dur={7}>
                <span className="textShadow"> 交付运维</span>
              </Decoration9>
            </Row>
          </div>
        </BorderBox8>
      </Card>
    </>
  );
}

export default PopularContent;
