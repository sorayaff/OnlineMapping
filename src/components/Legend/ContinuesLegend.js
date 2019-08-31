import classNames from 'classnames';
import styles from '@/components/Legend/index.less';
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';

function blobToDataURI(blob, callback) {
  let reader = new FileReader();
  reader.onload = function (e) {
    callback(e.target.result);
  };
  reader.readAsDataURL(blob);
}

function ContinuesLegend(props) {
  const [colorMapPic,setColorMapPic] = useState(null);
  const colorMapId = props.colorMapId;
  const colorbar = props.colorbar;
  const containerHeight = props.containerHeight;
  let tempMarginTop;
  const colorbarHeight = containerHeight - 20;

  const picBlob = props.currentColormapPic;
  if(picBlob){
    blobToDataURI(picBlob,function(data) {
      setColorMapPic(data);
    })
  }

  const colorbarPicStyle = {
    width: containerHeight - 20,
    top: containerHeight - 10,
  };

  useEffect(() => {
    const { dispatch } = props;
    dispatch({
      type: 'mapView/fetchColormapPicById',
      payload: {
        colorMapId:colorMapId
      },
    });

  },[colorMapId, props]);

  return (
    <div className={classNames(styles['legendContainer'])}>
      <div className={classNames(styles['card-for-pic'])}>
        <img className={classNames(styles['pic'])} src={colorMapPic} style={colorbarPicStyle}/>
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

export default connect(({ mapView }) => ({
  currentColormapPic:mapView.currentColormapPic,
  mapView
}))(ContinuesLegend);
