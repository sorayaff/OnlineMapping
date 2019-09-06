import React from 'react';
import styles from './index.less';
import { Icon, Slider, Empty, Button, Pagination,DatePicker   } from 'antd';
import { formatMessage, setLocale, getLocale, FormattedMessage } from 'umi/locale';
import { Rnd } from 'react-rnd';
import moment from 'moment';
import cesiumMap from '@/components/TDMap/oc.cesium';

const clientWidth = document.body.clientWidth;
const cesium_map = new cesiumMap.map();
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

export default class LayerSlider extends React.Component {
  interval = 4000;

  constructor(props) {
    super(props);
    this.state = {
      width: 450,
      height: 250,
      positionX: clientWidth - 550,
      positionY: 10,
      sliderValue: 0,
      isPlay: false,
      pageIndex: 0,
      layerMonths:[],
    };

  }

  componentDidMount() {
    let layers = this.props.datasetWithLayers.layers;
    let layerMonths = [];
    layers.map(item => layerMonths.push(this.transDimension(item.dimensionValue)))
    this.setState({
      layerMonths:layerMonths
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.datasetWithLayers !== this.props.datasetWithLayers) {
      this.setState({ sliderValue: 0 });
      this.stopPlayer();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.datasetWithLayers !== this.props.datasetWithLayers) {
      let layers = this.props.datasetWithLayers.layers;
      let layerMonths = [];
      layers.map(item => layerMonths.push(this.transDimension(item.dimensionValue)))
      this.setState({
        layerMonths:layerMonths
      })
    }
    console.log(this.state.layerMonths)
  }

  handleDragStop = (e, node) => {
    this.setState({
      positionX: node.x,
      positionY: node.y,
    });
  };

  handleMonthPicker = (date,dateString) => {
    let formatDate = date.format('YYYY-MM');
    const {layerMonths} = this.state;
    let index = layerMonths.indexOf(formatDate);
    console.log('找到了',layerMonths.indexOf(formatDate));
    if(index>0){
      const pageIndex = Math.round(index/10);
      this.resetPageIndex(pageIndex);
    }
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
    this.setState({ sliderValue: value });
    this.stopPlayer();
    this.sliderValueChange(value);
  };

  sliderValueChange = (value) => {
    const { datasetWithLayers, onSliderChange } = this.props;
    const { pageIndex } = this.state;
    let index = pageIndex * 10 + value;
    let layer = datasetWithLayers.layers[index];
    cesium_map.addLayer(layer, false);
    if (onSliderChange) {
      onSliderChange(layer);
    }
  };

  playLayer = () => {
    this.setState({ isPlay: true });
    const { datasetWithLayers } = this.props;
    let layers = datasetWithLayers.layers;
    let length = layers.length;
    this.sliderValueChange(this.state.sliderValue);
    this.player = setInterval(() => {
      const { sliderValue, pageIndex } = this.state;
      if (pageIndex * 10 + sliderValue < length - 1) {  //未到达所有图层右边界
        if (sliderValue < 9) {
          let newSliderValue = sliderValue + 1;
          this.sliderValueChange(newSliderValue);
          this.setState({ sliderValue: newSliderValue });
        } else {
          this.sliderValueChange(0);
          if ((pageIndex + 1) * 10 < length) {     //如果下一页存在，pageIndex+1
            this.setState({ pageIndex: pageIndex + 1, sliderValue: 0 });
          } else {
            this.setState({ pageIndex: 0, sliderValue: 0 });
          }
        }
      } else {                                    //到达所有图层右边界
        this.sliderValueChange(0);
        this.setState({ sliderValue: 0, pageIndex: 0 });
      }
    }, this.interval);
  };

  stopPlayer = () => {
    this.setState({ isPlay: false });
    clearInterval(this.player);
  };

  handleSliderRef = (n) => {
    this.sliderRef = n;
  };

  componentWillUnmount() {
    clearInterval(this.player);
  }

  resetPageIndex = (value) => {
    this.setState({ pageIndex: value });
  };

  transDimension = (value) => {
      let unixTime = moment(value).valueOf();
      return moment(unixTime).format('YYYY-MM');
  };

  renderSlider = (data) => {
    const { pageIndex, sliderValue } = this.state;
    if (data.layers) {
      const allCount = data.layers.length;
      let startKey = pageIndex * 10;
      let endKey;
      if ((pageIndex + 1) * 10 >= allCount) {
        endKey = pageIndex * 10 + allCount % 10;
      } else {
        endKey = (pageIndex + 1) * 10;
      }
      const layers = data.layers.slice(startKey, endKey);
      const isTimeDimension = data.layerDimension && data.layerDimension.type.toLowerCase() === 'timestamp';
      const length = layers.length;
      let marks = {};
      // let layerMonths = [];
      for (let i = 0; i < length; i++) {
        marks[i] = {
          style: { width: '40px', color: '#ddd' },
          label: this.transDimension(layers[i].dimensionValue),
        };
        // layerMonths.push(this.transDimension(layers[i].dimensionValue));
      }
      // this.setState({
      //   layerMonths:layerMonths
      // });
      return <div className={styles.slider_box}>
        <div className={styles.icon_wrapper}>
          {pageIndex > 0 ? (
            <Icon className={styles.slider_box_icon_click}
                  type="left-circle"
                  style={{ left: 0 }}
                  theme="filled"
                  onClick={() => this.resetPageIndex(pageIndex - 1)}
            />
          ) : null}
          {isTimeDimension ?
            <Slider min={0}
                    max={endKey - startKey - 1}
                    value={sliderValue}
                    step={1}
                    marks={marks}
                    included={false}
                    ref={(node) => this.handleSliderRef(node)}
                    onChange={this.handleSliderChange}
                    tipFormatter={(index) => this.transDimension(layers[index].dimensionValue)}/> :
            <Slider min={0} max={length - 1} step={1} onChange={this.handleSliderChange}
                    tipFormatter={(index) => layers[index].dimensionValue || index}/>}
          {(pageIndex + 1) * 10 < allCount ? (
            <Icon className={styles.slider_box_icon_click}
                  style={{ right: 0 }}
                  type="right-circle"
                  theme="filled"
                  onClick={() => this.resetPageIndex(pageIndex + 1)}
            />
          ) : null}
        </div>
      </div>;
    }
    else {
      return <div className={styles.slider_box}>
        <Empty/>
      </div>;
    }
  };

  handelPaginationChange = (page, pageSize) => {
    this.setState({ pageIndex: page - 1 });
    this.handleSliderChange(0);
  };

  render() {
    const { handleClose, datasetWithLayers = {} } = this.props;
    const { width, height, positionX, positionY, sliderValue, isPlay, pageIndex } = this.state;
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
    let allCount = 0;
    let focusLayer = null;
    if (datasetWithLayers.layers) {
      allCount = datasetWithLayers.layers.length;
      focusLayer = datasetWithLayers.layers[pageIndex + sliderValue];
    }

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
          {this.renderSlider(datasetWithLayers)}
          <div className={styles.pagination_box}>
            <Pagination simple
                        defaultCurrent={1}
                        total={allCount}
                        defaultPageSize={10}
                        current={pageIndex + 1}
                        onChange={this.handelPaginationChange}
            />
          </div>
        </div>
        <div>
          <MonthPicker onChange={this.handleMonthPicker} placeholder="Select month" />
        </div>
        <div className={styles.footer}>
          {isPlay ? <Button className={styles.play_control_btn}
                            onClick={() => this.stopPlayer()}>{formatMessage({ id: 'mapView.layer.play.stop' })}</Button> :
            <Button className={styles.play_control_btn}
                    onClick={() => this.playLayer()}>{formatMessage({ id: 'mapView.layer.play.start' })}</Button>
          }
        </div>
      </div>
    </Rnd>;
  };
};
