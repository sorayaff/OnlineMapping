import React, { PureComponent, useState, useEffect } from 'react';
import styles from './index.less';
import { connect } from 'dva';
import classNames from 'classnames';
import { Rnd } from 'react-rnd';
import axios from 'axios';
import {
  Row,
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

function ContinuesLegend({ colorbar, containerHeight, colormapPic }) {
  let tempMarginTop;
  const colorbarHeight = containerHeight - 20;

  const colorbarPicStyle = {
    width: containerHeight - 20,
    top: containerHeight - 10,
  };

  return (
    <div className={classNames(styles['legendContainer'])}>
      <div className={classNames(styles['card-for-pic'])}>
        <img className={classNames(styles['pic'])} src={colormapPic} style={colorbarPicStyle}/>
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

function Legend(props) {

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
  const [colorMapPic, setColorMapPic] = useState(null);

  const colorMapId = props.colorMapId || '34ac9adc-80b9-46c1-980a-716c0988bfe3';
  const colorbar = props.currentColormap;

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
  };

  function blobToDataURI(blob, callback) {
    let reader = new FileReader();
    reader.onload = function(e) {
      callback(e.target.result);
    };
    reader.readAsDataURL(blob);
  }

  useEffect(() => {
    const { dispatch } = props;
    dispatch({
      type: 'mapView/fetchColormapById',
      payload: {
        colorMapId: colorMapId,
      },
    });
    //todo : unsafe
    const options = {
      url: '/v1.0/api/colormap/img/' + colorMapId,
      headers: {
        AccessKey: 'd26c2762b29145e796b3ccdeb4668bd6',
        SecretKey: 'ef0588377a2f072527dfc107d7c52c87',
      },
    };
    const {
      url,
      data,
      headers,
    } = options;

    axios
      .get(url, { params: data, headers: headers, timeout: 1000 * 20, responseType: 'blob' })
      .then((response) => {
        let blob = response.data;
        blobToDataURI(blob, function(data) {
          setColorMapPic(data);
        });
      })
      .catch(err => {
        console.log(err);
        return null;
      });
  }, [colorMapId, props]); // 仅在 colorMapId 更改时更新

  if (colorbar) {
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
          <ContinuesLegend colorbar={colorbar} containerHeight={height} colormapPic={colorMapPic}/>}
      </Rnd>
    );
  }
  else {
    return (<div/>);
  }
}

export default connect(({ mapView }) => ({
  currentColormap: mapView.currentColormap,
  currentColormapPic: mapView.currentColormapPic,
  mapView,
}))(Legend);

