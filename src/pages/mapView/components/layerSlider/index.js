import React from 'react';
import styles from './index.less';
import { Icon, Slider } from 'antd';
import { formatMessage, setLocale, getLocale, FormattedMessage } from 'umi/locale';
import moment from 'moment';

export default class LayerSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { handleClose, layers } = this.props;
    const renderSlider = (layerList) => {
      let type = layerList.layerDimension.type;
      let layers = layerList.layers;
      let length = layers.length;
      if (type.toLowerCase() === 'timestamp' && length > 1) {
        let minTime = layers[0].dimensionValue;
        let maxTime = layers[length - 1].dimensionValue;
        let t2 = moment(maxTime).valueOf();
        let t1 = moment(minTime).valueOf();
        return <div style={{ width: 200 }}>
          <Slider min={t1} max={t2} tipFormatter={(value) => moment(value).format('YYYY-MM-DD HH:mm:ss')}/>
        </div>;
      }
    };

    return <div className={styles.layer_slider_box}>
      <div className={styles.title}>
        {formatMessage({ message: 'mapView.timePlayer.title' })}
        <Icon className={styles.close_icon} onClick={handleClose} type="close"/>
      </div>
      <div className={styles.content}>
        {renderSlider(layers)}
      </div>
    </div>;
  };
};
