import React from 'react';
import styles from './index.less';
import { Icon, Slider, Empty } from 'antd';
import { formatMessage, setLocale, getLocale, FormattedMessage } from 'umi/locale';
import { Rnd } from 'react-rnd';
import moment from 'moment';
import cesiumMap from '@/components/TDMap/oc.cesium';

const clientWidth = document.body.clientWidth;
const cesium_map = new cesiumMap.map();

export default class LayerSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 400,
      height: 250,
      positionX: clientWidth - 500,
      positionY: 10,
      sliderValue: 0,
    };
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
    this.setState({ sliderValue: value});
    const {datasetWithLayers,onSliderChange} =this.props;
    let layer= datasetWithLayers.layers[value];
    cesium_map.addLayer(layer,false);
    if(onSliderChange){
      onSliderChange(layer)
    }
  };

  render() {
    const { handleClose, datasetWithLayers = {} } = this.props;
    console.log(datasetWithLayers)
    const { width, height, positionX, positionY, sliderValue } = this.state;
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
            {length>0 ? <Slider min={0} max={length - 1} step={1} marks={marks} onChange={this.handleSliderChange}
              tipFormatter={(index) => {
              let unixTime = moment(layers[index].dimensionValue).valueOf();
              return moment(unixTime).format('YYYY-MM-DD');
            }
            }/>:<Empty/>}

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
      bottom: false,
      bottomLeft: false,
      bottomRight: false,
      left: true,
      right: true,
      top: false,
      topLeft: false,
      topRight: false,
    };
    const focusLayer= datasetWithLayers.layers[sliderValue];

    return <Rnd size={{ width: width, height: height }}
                position={{ x: positionX, y: positionY }}
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
            <div>
              <label>{formatMessage({ id: 'mapView.timePlayer.layer.name' })}</label> &nbsp;:&nbsp;{focusLayer?focusLayer.layerName:'' }
            </div>
            {renderSlider(datasetWithLayers)}
          </div>
        </div>
      </div>
    </Rnd>;
  };
};
