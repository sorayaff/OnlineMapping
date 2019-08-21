import styles from './index.less';
import React, { Component } from 'react';
import Cesium from 'cesium/Cesium';
import cesiumMap from './oc.cesium.js';
import 'cesium/Widgets/widgets.css';

let cesium_map = new cesiumMap.map();
let cesium_control = new cesiumMap.control();

class TDMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchLocData: '',
    };
  }

  componentDidMount() {
    this.setState({ cesium_map: cesium_map });
    // 初始化地球
    cesium_map.initMap('3d_map');
    // tk=fa6804bbb4f7ddb853e25d652be853ee'

    // 配置罗盘、比例尺和缩放控件
    let options = {};
    // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
    options.defaultResetView = Cesium.Rectangle.fromDegrees(80, 22, 130, 50);
    // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
    options.enableCompass = true;
    // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
    options.enableZoomControls = true;
    // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
    options.enableDistanceLegend = true;
    // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
    options.enableCompassOuterRing = true;
    cesium_control.initNavigation(options);
    cesium_control.mousePosition(document.getElementById('currentPosition'));

    let tiandituMapUrl = '/DataServer?T=img_w&x={x}&{x}&y={y}&l={z}&tk=b25c5f808773cc7465374cd017f2c91a';
    let annotationUrl = '/DataServer?T=eva_w&x={x}&{x}&y={y}&l={z}&tk=b25c5f808773cc7465374cd017f2c91a';
    // 加载天地图地图
    cesium_map.addTmsMapLayer({
      dataType: 'baseMap',
      layerName: 'tdtBaseLayer',
      url: tiandituMapUrl,
      alpha: 1,
    });
    // 加载天地图注记
    cesium_map.addTmsMapLayer({
      dataType: 'baseMap',
      layerName: 'annotationLayer',
      url: annotationUrl,
      alpha: 1,
    });
    // 地图初始视角
    cesium_map.setView(119, 36, 20000000);
    // const { dataset } = this.props;
    // let cesium_map = new cesiumMap.map();
    // let cesium_control = new cesiumMap.control();
    // this.setState({ cesium_Map: cesium_map });
    // // // 初始化地球
    // cesium_map.initMap('cesiumContainer');
    // // tk=fa6804bbb4f7ddb853e25d652be853ee'
    // let tiandituMapUrl = '/DataServer?T=img_w&x={x}&{x}&y={y}&l={z}&tk=b25c5f808773cc7465374cd017f2c91a';
    // let annotationUrl = '/DataServer?T=cia_w&x={x}&{x}&y={y}&l={z}&tk=b25c5f808773cc7465374cd017f2c91a';
    // //加载天地图地图
    // cesium_map.addTmsMapLayer({
    //   layerName: 'tdtBaseLayer',
    //   url: tiandituMapUrl,
    //   alpha: 1,
    // });
    // //加载天地图注记
    // cesium_map.addTmsMapLayer({
    //   layerName: 'annotationLayer',
    //   url: annotationUrl,
    //   alpha: 1,
    // });
    //
    // cesium_map.addCogMapLayer({
    //   url:"http://192.168.2.2:8001/tile/{x}/{y}/{z}?url=s3://obs-oceantest/obs-oceantest/workspace/ADMIN/userData/cog-tif/SIF_758nm_201702-lzw.tif&colorMap=Accent",
    // });
    //
    // // //设置镜头位置与方向
    // cesium_map.setView(116.3, 39.9, 15000000);
    // // dataset.map((item, index) => {
    // //   if (item.method && item.method.toLowerCase() === 'wms') {
    // //     return TDMap.setWmsLayer_3d(cesium_Map, item);
    // //   }else if(item.method && item.method.toLowerCase() === 'cog'){
    // //     return TDMap.setCogLayer_3d(cesium_Map,item);
    // //   } else {
    // //     return TDMap.setTmsLayer_3d(cesium_Map, item);
    // //   }
    // // });
    // cesium_control.initNavigation();
    // cesium_control.mousePosition(document.getElementById('currentPosition'));

  }

  static setWmsLayer_3d(cesium_Map, data) {
    let attr = {
      url: data.url + '?datasetId=' + data.id,
      layerName: data.layerName,
      layerType: data.layerType,
      alpha: data.opacity || 1,
      srs: 'EPSG:4326',
      key: data.key,
    };
    cesium_Map.addWmsMapLayer(attr);
  }

  static setTmsLayer_3d(cesium_Map, data) {
    let attr = {
      url: data.url + '?datasetId=' + data.id,
      layerName: data.layerName,
      layerType: data.layerType,
      alpha: data.opacity || 1,
      srs: 'EPSG:3857',
      key: data.key,
    };
    cesium_Map.addTmsMapLayer(attr);
  }

  static setCogLayer_3d(cesium_Map, data) {
    let attr = {
      url: data.url,
      datasetId: data.id,
      layerName: data.layerName,
      layerType: data.layerType,
      alpha: data.opacity || 1,
      srs: 'EPSG:3857',
      key: data.key,
    };
    cesium_Map.addCogMapLayer(attr);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('====', this.props, prevProps);
    const { cesium_Map } = this.state;

    //根据id判断轮播layer,先删除再新建
    if (this.props.updateData && cesium_Map) {
      if(prevProps.updateData && prevProps.updateData.layerName !== this.props.updateData.layerName){
        cesium_Map.removeLayerIndatasetbyName(prevProps.updateData.key, prevProps.updateData.layerName);
        if (this.props.updateData.method && this.props.updateData.method.toLowerCase() === 'wms') {
          console.log('轮播改变图层', this.props.updateData);
          TDMap.setWmsLayer_3d(cesium_Map, this.props.updateData);
        } else if(this.props.updateData.method && this.props.updateData.method.toLowerCase() === 'cog'){
          console.log('轮播改变图层', this.props.updateData);
          TDMap.setCogLayer_3d(cesium_Map, this.props.updateData);
        } else {
          console.log('轮播改变图层', this.props.updateData);
          TDMap.setTmsLayer_3d(cesium_Map, this.props.updateData);
        }
      }
      else if(!prevProps.updateData) {
        cesium_Map.removeAllLayers();
        if (this.props.updateData.method && this.props.updateData.method.toLowerCase() === 'wms') {
          console.log('轮播改变图层', this.props.updateData);
          TDMap.setWmsLayer_3d(cesium_Map, this.props.updateData);
        } else if(this.props.updateData.method && this.props.updateData.method.toLowerCase() === 'cog'){
          console.log('轮播改变图层', this.props.updateData);
          TDMap.setCogLayer_3d(cesium_Map, this.props.updateData);
        } else {
          console.log('轮播改变图层', this.props.updateData);
          TDMap.setTmsLayer_3d(cesium_Map, this.props.updateData);
        }
      }
    }

    //长度发生更新，先删除所有图层，重新添加新的图层
    // if (prevProps && prevProps.dataset.length !== this.props.dataset.length) {
    //   cesium_Map.removeAllLayers();
    //   if (this.props.dataset.length > 0) {            // 如果没有值就不加载啦
    //     this.props.dataset.map((item, index) => {
    //       if (item.method && item.method.toLowerCase() === 'wms') {
    //         return TDMap.setWmsLayer_3d(cesium_Map, item);
    //       } else if(item.method && item.method.toLowerCase() === 'cog'){
    //         return TDMap.setCogLayer_3d(cesium_Map, item);
    //       } else {
    //         return TDMap.setTmsLayer_3d(cesium_Map, item);
    //       }
    //     });
    //   }
    // } else if (this.props.dataset !== prevProps.dataset) {  //数据集透明度，是否可见等发生了更新
    //   this.props.dataset.forEach((item, index) => {
    //     cesium_Map.setLayerAlphaBykey(item.key, item.opacity);
    //     if (item.checked !== undefined) {
    //       let checked = item.checked === '1';
    //       cesium_Map.setLayerVisibleBykey(item.key, checked);
    //     }
    //   });
    // }
  }

  render() {
    function sceneSwitch() {
      let cesium_control = new cesiumMap.control();
      let node = document.getElementById('sceneSwitcher');
      let mode = node.innerText;
      cesium_control.switchSceneMode(mode, node);
    }

    return (
      <div className={styles.normal}>
        <div id="3d_map" className={styles.fullScreen_3d}>
          <div className={styles.dimensionSwitcher}>
            <button id="sceneSwitcher" onClick={sceneSwitch}>2D</button>
          </div>
        </div>
        <div id="currentPosition"/>
      </div>);
  }
}

export default TDMap;
