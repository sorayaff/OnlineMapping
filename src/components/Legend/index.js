import React, { PureComponent, useState, useEffect } from 'react';
import DiscreteLegend from './DiscreteLegend';
import ContinuesLegend from './ContinuesLegend'
import { connect } from 'dva';
import { Rnd } from 'react-rnd';

function Legend(props) {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(200);
  const [x, setX] = useState(1200);
  const [y, setY] = useState(500);

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

  useEffect(() => {
    const { dispatch } = props;
    dispatch({
      type: 'mapView/fetchColormapById',
      payload: {
        colorMapId:colorMapId
      },
    });
  },[colorMapId, props]);

  if(colorbar){
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
          <ContinuesLegend colorbar={colorbar} containerHeight={height} colorMapId={colorMapId}/>}
      </Rnd>
    );
  }
  else{
    return (<div/>)
  }
}

export default connect(({ mapView }) => ({
  currentColormap:mapView.currentColormap,
  mapView
}))(Legend);

