import classNames from 'classnames';
import styles from '@/components/Legend/index.less';
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';


function blobToDataURI(blob, callback) {
  let reader = new FileReader();
  reader.onload = function(e) {
    callback(e.target.result);
  };
  reader.readAsDataURL(blob);
}

function ContinuousLegend(props) {
  const { dispatch } = props;
  const [colorMapPic, setColorMapPic] = useState(null);  //色带图片
  const colorMapId = props.colorMapId;
  const colorbar = props.colorbar;
  //传过来的高度值有可能是数字有可能是带'px'后缀的字符串，因此做一下处理
  const containerHeight = parseInt(props.containerHeight.toString().replace('px', ''));
  const colorbarHeight = containerHeight - 20;

  //拿到的是Blob格式的图片数据，需要转成DataURL后才可成为img标签的src
  const picBlob = props.currentColormapPic;
  if (picBlob) {
    blobToDataURI(picBlob, function(data) {
      setColorMapPic(data);
    });
  }

  //色带样式
  const colorbarPicStyle = {
    width: containerHeight - 20,
    top: containerHeight - 10,
  };

  //当colorMapId发生改变时请求色带图片
  useEffect(() => {
    dispatch({
      type: 'mapView/fetchColormapPicById',
      payload: {
        colorMapId: colorMapId,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorMapId]);

  //色带图片的宽度会跟着容器高而改变，然后以左上角为起点旋转90度后往下压一定高度
  return (
    <div className={classNames(styles['legendContainer'])}>
      <div className={classNames(styles['card-for-pic'])}>
        <img className={classNames(styles['pic'])} src={colorMapPic} style={colorbarPicStyle}/>
      </div>
      <div className={styles.textContainer}>
        {colorbar['legend'].map(item => {
          return (<p className={classNames(styles['text'])} style={{ bottom: colorbarHeight * item[0] }}>{item[1]}</p>);
        })}
      </div>
    </div>
  );
}

export default connect(({ mapView }) => ({
  currentColormapPic: mapView.currentColormapPic,
  mapView,
}))(ContinuousLegend);
