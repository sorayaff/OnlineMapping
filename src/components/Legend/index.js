import React, { PureComponent, useState, useEffect } from 'react';
import DiscreteLegend from './DiscreteLegend';
import ContinuousLegend from './ContinuousLegend';
import { connect } from 'dva';
import { Rnd } from 'react-rnd';

function Legend(props) {
  const [width, setWidth] = useState(200); //可拖动组件的宽
  const [height, setHeight] = useState(245); //可拖动组建的高
  const [x, setX] = useState(1200); //可拖动组件的x坐标
  const [y, setY] = useState(450); //可拖动组建的y坐标
  const { dispatch } = props;

  const colorMapId = props.colorMapId || '34ac9adc-80b9-46c1-980a-716c0988bfe3';

  const colorbar = props.currentColormap; //从mapView模型中拿到当前的色带值

  //可拖动组建的样式
  const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    boxShadow: '5px 10px 20px rgba(0,0,0,0.5)',
    background: 'rgba(255,255,255,0.08',
    margin: -20,
  };

  //控制组件可以改变大小的方向
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


  //当colorMapId发生变更时发起获取色带数据的请求
  useEffect(() => {
    dispatch({
      type: 'mapView/fetchColormapById',
      payload: {
        colorMapId: colorMapId,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorMapId]);


  //如果根据colorMapId拿到了色带数据，则根据其中的type值判断应该返回离散图例还是连续渐变图例
  //当需要返回连续渐变图例时会传递父组件的高度以便控制色带图片的样式
  if (colorbar) {
    const size = colorbar.type === 'discrete' ? null : { width: width, height: height };
    return (
      <Rnd
        style={style}
        size={size}
        position={{ x: x, y: y }}
        onDragStop={(e, d) => {
          setX(d.x);
          setY(d.y);
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          setHeight(ref.style.height);
          setWidth(ref.style.width);
          setX(position.x);
          setY(position.y);
        }}
        // enableResizing={Enable}
        bounds='body'
      >
        {colorbar.type === 'discrete' ? <DiscreteLegend colorbar={colorbar}/> :
          <ContinuousLegend colorbar={colorbar} containerHeight={height} colorMapId={colorMapId}/>}
      </Rnd>
    );
  } else {
    return (<div/>);
  }
}

export default connect(({ mapView }) => ({
  currentColormap: mapView.currentColormap,
  mapView,
}))(Legend);

