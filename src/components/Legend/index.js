import React, { PureComponent, useState, useRef, useEffect } from 'react';
import styles from './index.less';
import classNames from 'classnames';
import { Rnd } from 'react-rnd';
import pic from './colorbar2.png';
import {
  Radio,
  Tabs,
  Slider,
  InputNumber,
  TreeSelect,
  Row,
  Col,
  Input,
  Icon,
} from 'antd';


function DiscreteLegend({ colorbar }) {
  let tempColor, tempFont;
  return (
    <div className={classNames(styles['legendContainer'])}>
      {colorbar['legend'].map(item1 => {
        tempColor = colorbar['colors'].find(item2 => item2[0] === item1[0]);
        tempColor = tempColor[1];
        tempFont = item1[1];
        return (
          <Row>
            <div className={classNames(styles['rectangle'])} style={{ backgroundColor: tempColor, float: 'left' }}/>
            <div className={classNames(styles['rectangleFont'])} style={{ float: 'left' }}>{tempFont}</div>
          </Row>
        );
      })}
    </div>
  );
}

function ContinuesLegend({ colorbar, containerHeight }) {
  let tempMarginTop;
  const colorbarHeight = containerHeight - 20;

  const colorbarPicStyle = {
    width: containerHeight - 20,
    // eslint-disable-next-line no-template-curly-in-string
    // transform:trans,
    top: containerHeight - 10,
    // transform:'translateY(450px)'
  };


  const refContainer = useRef(null);
  //
  // useEffect(() => {
  //   // const subscription = containerHeight.subscribe();
  //   if(refContainer){
  //     refContainer.current.style.width = containerHeight;
  //     refContainer.current.style.transform = colorbarPicStyle.transform;
  //   }
  //   // return () => {
  //   //   subscription.unsubscribe();
  //   // };
  // }, [containerHeight]);

  return (
    <div className={classNames(styles['legendContainer'])}>
      <div className={classNames(styles['card-for-pic'])}>
        <img className={classNames(styles['pic'])} ref={refContainer} src={pic} style={colorbarPicStyle}/>
      </div>
      <div className={styles.textContainer}>
        {colorbar['legend'].map(item => {
          tempMarginTop = (1 - item[0]) * 8 + 0.5 + 'em';
          return (<p className={classNames(styles['text'])} style={{ bottom: colorbarHeight * item[0] }}>{item[1]}</p>);
        })}
      </div>
    </div>
  );
}

function Legend(colorbarId) {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(200);
  const [x, setX] = useState(1200);
  const [y, setY] = useState(500);
  const colorbar1 = {
    'name': 'land_use',
    'type': 'discrete',
    'colors': [
      [
        0,
        '#f7cf94',
      ],
      [
        0.125,
        '#076c07',
      ],
      [
        0.25,
        '#808000',
      ],
      [
        1.0,
        '#08306b',
      ],
    ],
    'legend': [
      [
        0,
        '耕地',
      ],
      [
        0.125,
        '草地',
      ],
      [
        1.0,
        '建筑用地',
      ],
    ],
  };
  const colorbar2 = {
    'colorMapId': '34ac9adc-80b9-46c1-980a-716c0988bfe3',
    'name': 'mycolor',
    'type': 'continuous',
    'colors': [
      [
        0,
        '#000000',
      ],
      [
        0.125,
        '#505050',
      ],
      [
        1.0,
        '#808080',
      ],
    ],
    'legend': [
      [
        0,
        '0',
      ],
      [
        0.125,
        '0.125',
      ],
      [
        1.0,
        '1.0',
      ],
    ],
    'min': 395.0,
    'max': 415.0,
  };

  const colorbar = colorbar1;


  const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'solid 1px #ddd',
    background: 'transparent',
  };

  const Enable = {
    bottom: false,
  bottomLeft: false,
  bottomRight: false,
  left: false,
  right: false,
  top: false,
  topLeft: false,
  topRight: false,
}


  return (
    <Rnd
      style={style}
      size={{ width: width, height: height }}
      position={{ x: x, y: y }}
      onDragStop={(e, d) => {
        setX(d.x);
        setY(d.y);
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        // setHeight(ref.style.height);
        // setWidth(ref.style.width);
        // setX(position.x);
        // setY(position.y);
      }}
      enableResizing={Enable}
      bounds='window'
    >
      {colorbar.type === 'discrete' ? <DiscreteLegend colorbar={colorbar}/> :
        <ContinuesLegend colorbar={colorbar} containerHeight={height}/>}
    </Rnd>

  );
}

export default Legend;
