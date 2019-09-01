import React from 'react';
import styles from './index.less';
import { Icon, Slider, Empty, Button } from 'antd';
import { formatMessage, setLocale, getLocale, FormattedMessage } from 'umi/locale';
import { Rnd } from 'react-rnd';
import moment from 'moment';
import cesiumMap from '@/components/TDMap/oc.cesium';

const clientWidth = document.body.clientWidth;
const cesium_map = new cesiumMap.map();

export default class LayerSlider extends React.Component {
  interval = 4000;

  constructor(props) {
    super(props);
    this.state = {
      width: 400,
      height: 280,
      positionX: clientWidth - 500,
      positionY: 10,
      sliderValue: 0,
      isPlay: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.datasetWithLayers !== this.props.datasetWithLayers) {
      this.setState({ sliderValue: 0 });
      this.stopPlayer();
    }
  }

  handleDragStop = (e, node) => {
    this.setState({
      positionX: node.x,
      positionY: node.y,
    });
  };

  handleDrag = (e) => {
    console.log(e);
    e.stopPropagation();
  };

  handleDragStart = (e) => {
    console.log(e);
    e.stopPropagation();
  };

  handleSliderChange = (value) => {
    this.setState({ sliderValue: value, isPlay: false });
    this.stopPlayer();
    this.sliderValueChange(value);
  };

  sliderValueChange = (value) => {
    const { datasetWithLayers, onSliderChange } = this.props;
    let layer = datasetWithLayers.layers[value];
    cesium_map.addLayer(layer, false);
    if (onSliderChange) {
      onSliderChange(layer);
    }
  };

  playLayer = (data) => {
    this.setState({ isPlay: true });
    let layers = data.layers;
    let length = layers.length;
    this.sliderValueChange(this.state.sliderValue);
    this.player = setInterval(() => {
      const { sliderValue } = this.state;
      let newSldierValue;
      if (sliderValue < length - 1) {
        newSldierValue = sliderValue + 1;
        this.setState({ sliderValue: newSldierValue });
        this.sliderValueChange(newSldierValue);
      } else {
        this.sliderValueChange(0);
        this.setState({ sliderValue: 0 });
      }
    }, this.interval);
  };

  stopPlayer = () => {
    if (this.state.isPlay) {
      this.setState({ isPlay: false });
      clearInterval(this.player);
    }
  };

  handleSliderRef = (n) => {
    this.sliderRef = n;
  };

  componentWillUnmount() {
    clearInterval(this.player);
  }

  render() {
    const { handleClose, datasetWithLayers = {} } = this.props;
    const { width, height, positionX, positionY, sliderValue, isPlay } = this.state;
    const renderSlider = (data) => {
      const isTimeDimension = data.layerDimension && data.layerDimension.type.toLowerCase() === 'timestamp';
      const layers = data.layers;
      const length = layers.length;
      if (isTimeDimension) {
        if (length > 1) {
          const marks = {
            0: {
              style: { width: '40px', color: '#ddd' },
              label: layers[0].dimensionValue,
            },
            [length - 1]:
              {
                style: { width: '40px', color: '#ddd' },
                label: layers[length - 1].dimensionValue,
              },
          };
          return <div className={styles.slider_box}>
            {length > 0 ? <Slider min={0}
                                  max={length - 1}
                                  value={sliderValue}
                                  step={1}
                                  marks={marks}
                                  ref={(node) => this.handleSliderRef(node)}
                                  onChange={this.handleSliderChange}
                                  tipFormatter={(index) => {
                                    let unixTime = moment(layers[index].dimensionValue).valueOf();
                                    return moment(unixTime).format('YYYY-MM-DD');
                                  }
                                  }/> : <Empty/>}

          </div>;
        }
      }
      else {
        return <div className={styles.slider_box}>
          <Slider min={0} max={length - 1} step={1} onChange={this.handleSliderChange}
                  tipFormatter={(index) => layers[index].dimensionValue || index}/>
        </div>;
      }
    };
    const Enable = {
      bottom: true,
      bottomLeft: false,
      bottomRight: false,
      left: true,
      right: true,
      top: false,
      topLeft: false,
      topRight: false,
    };
    const focusLayer = datasetWithLayers.layers[sliderValue];

    return <Rnd size={{ width: width, height: height }}
                position={{ x: positionX, y: positionY }}
                maxHeight={400}
                onDragStop={this.handleDragStop}
                onDragStart={this.handleDragStart}
                onDrag={this.handleDrag}
                onResize={(e, direction, ref, delta, position) => {
                  this.setState({
                    width: ref.style.width,
                    height: ref.style.height,
                    positionX: position.x,
                    positionY: position.y,
                  });
                }}
                bounds="window"
                enableResizing={Enable}
    >
      <div className={styles.layerPlayer_main}>
        <div className={styles.title}>
          <span>{formatMessage({ id: 'mapView.timePlayer.title' })}</span>
          <Icon className={styles.close_icon} onClick={handleClose} title={'close'} type="close"/>
        </div>
        <div className={styles.divider}/>
        <div className={styles.content}>
          <div>
            <label>{formatMessage({ id: 'mapView.timePlayer.layer.name' })}</label> &nbsp;:&nbsp;{focusLayer ? focusLayer.layerName : ''}
          </div>
          {renderSlider(datasetWithLayers)}
        </div>
        <div className={styles.footer}>
          {isPlay ? <Button className={styles.play_control_btn} onClick={() => this.stopPlayer()}>{formatMessage({ id: 'mapView.layer.play.stop' })}</Button> :
            <Button className={styles.play_control_btn} onClick={() => this.playLayer(datasetWithLayers)}>{formatMessage({ id: 'mapView.layer.play.start' })}</Button>
          }
        </div>
      </div>
    </Rnd>;
  };
};
