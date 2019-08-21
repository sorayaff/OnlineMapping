/* eslint-disable */
import Cesium from 'cesium/Cesium';
import {getLocalData} from '@/utils/common'
import $ from 'jquery'
import CesiumNavigation from 'cesium-navigation-es6'

let cesiumMap = new Object();

function refreshTokenRetryCallback(resource, error) {
  if (error.statusCode === 403) {
    // 403 status code means a new token should be generated
    return getNewAccessToken()
      .then(function(token) {
        resource.queryParameters.access_token = token;
        return true;
      })
      .otherwise(function() {
        return false;
      });
  }
  return false;
}

function getResource(url) {
  return new Cesium.Resource({
    url: url,
    headers: {
      'rzpj': getLocalData({ dataName: 'rzpj' }),
    },
    retryCallback: refreshTokenRetryCallback,
    retryAttempts: 1,
  });
}

function getWmsResource(url, layerName) {
  return new Cesium.Resource({
    url: url,
    headers: {
      'rzpj': getLocalData({ dataName: 'rzpj' }),
    },
    queryParameters: {
      LAYERS: layerName,
    },
    retryCallback: refreshTokenRetryCallback,
    retryAttempts: 1,
  });
}


let viewer;

/**
 * Created by on 2019/3/6.
 */
/*******************************************************
 *  地图(图层)管理类
 *********************************************************/


cesiumMap.map = function() {
};

cesiumMap.map.prototype = {
  //初始化地图
  initMap: function(element) {
    this.startUp(Cesium, element);
  },
  //开始启动方法
  startUp: function(Cesium, element) {
    'use strict';
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4ZmVjNGI2Zi1kMTA3LTQ4NjEtOWY5Mi1hOTQ0NjkwYzM0Y2YiLCJpZCI6NjQyMiwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0NjQ4MjQzMH0.TmEcQVmerVoMPXZ2_xa9D2Dy5Wysy2j6_tgPeiV88aM';
    viewer = new Cesium.Viewer(element, {
      baseLayerPicker: false, //是否显示图层选择控件
      geocoder: false,   //地名查找
      homeButton: false,
      sceneModePicker: false,  //投影方式空间
      fullscreenButton: false,
      vrButton: false,
      animation: false,
      timeline: false,
      infoBox: false,
      selectionIndicator: false,
      requestRenderMode: true,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
    });
    viewer.imageryLayers.remove(viewer.imageryLayers._layers[0]);
  },
  //添加WMS地图服务  url：地图路径地址 layerName：图层名称 alpha:图层透明度
  addWmsMapLayer: function(attr) {
    const { key, url, layerName, alpha, srs, dataType } = attr;
    let imgProvider = new Cesium.WebMapServiceImageryProvider({
      url: getWmsResource(url, layerName, srs),
      serverType: 'geoserver',
      crossOrigin: 'anonymous',
      layers: layerName,
      parameters: {
        service: 'WMS',
        format: 'image/png',
        transparent: true,
      },
    });
    let layer = viewer.imageryLayers.addImageryProvider(imgProvider);
    layer.alpha = alpha;
    layer.dataType = dataType;
    layer.name = layerName;
    layer.key = key;
  },
  //添加cog图层  url：地图路径地址 layerName：图层名称 alpha:图层透明度
  addCogMapLayer: function(attr) {
    const { key, url, layerName, alpha, dataType } = attr;
    let titleimgProvider = new Cesium.UrlTemplateImageryProvider({
      url:getResource(url),
      format: 'image/png',
      layer: layerName,
    });
    let layer = viewer.imageryLayers.addImageryProvider(titleimgProvider);
    layer.alpha = alpha;
    layer.dataType = dataType || 'layer';
    layer.name = layerName;
    layer.key = key;
    return layer;
  },
  //添加切片服务
  addTmsMapLayer: function(attr) {
    const { key, url, layerName, alpha, dataType } = attr;
    let titleimgProvider = new Cesium.UrlTemplateImageryProvider({
      url:url,
      format: 'image/png',
      layer: layerName,
    });
    let layer = viewer.imageryLayers.addImageryProvider(titleimgProvider);
    layer.alpha = alpha;
    layer.dataType = dataType || 'layer';
    layer.name = layerName;
    layer.key = key;
  },
  //添加传入的图层
  addExistLayer:function(item){
    if(item.dataSource){
      Cesium.when(item.dataSource, function (dataSource) {
        // if (viewer.dataSources.indexOf(dataSource) === -1) {
        //   viewer.dataSources.add(dataSource);
        //   viewer.flyTo(dataSource);
        // }
        dataSource.show = true;
        viewer.flyTo(dataSource);
      });
    }
    else {
      let layer = viewer.imageryLayers.addImageryProvider(item.layer._imageryProvider);
      layer.alpha = item.layer.alpha;
      layer.dataType = item.layer.dataType || 'layer';
      layer.name = item.layer.name;
      layer.key = item.layer.key;
    }
  },

  addRenderLayers: function(renderLayers) {
    let attr;
    renderLayers.forEach((item) => {
      if (item.method.toLowerCase() === 'tms') {
        attr = {
          url: item.url + '?datasetId=' + item.id,
          layerName: item.layerName,
          alpha: item.opacity || 1,
          srs: 'EPSG:3857',
          key: item.key,
          dataType: 'layer',
        };
        this.addTmsMapLayer(attr);
      }
      if (item.method.toLowerCase() === 'wms') {
        attr = {
          url: item.url + '?datasetId=' + item.id,
          layerName: item.layerName,
          alpha: item.opacity || 1,
          srs: 'EPSG:4326',
          key: item.key,
          dataType: 'layer',
        };
        this.addWmsMapLayer(attr);
      }
      if (item.method.toLowerCase() === 'cog') {
        attr = {
          url: item.url,
          layerName: item.layerName,
          alpha: item.opacity || 1,
          key: item.layerName,
          dataType: 'layer',
        };
        this.addCogMapLayer(attr);
      }
    });
  },

  //添加WMTS地图服务  url：地图路径地址 layerName：图层名称 alpha:图层透
  addWmtsMapLayer: function(attr) {
    let titleimgProvider = new Cesium.WebMapTileServiceImageryProvider({
      url: attr['url'],// "http://t0.tianditu.com/cia_w/wmts,
      layer: attr['layerName'],//"tdtAnnoLayer",
      style: 'default',
      format: 'image/jpeg',
      tileMatrixSetID: 'GoogleMapsCompatible',
      show: false,
      proxy: new Cesium.DefaultProxy('/proxy/'),
    });
    let wmts = viewer.imageryLayers.addImageryProvider(titleimgProvider);
    wmts.alpha = attr['alpha'];
  },
  //添加arcgis地图服务
  addArcGisMapLayer: function(attr) {
    let titleimgProvider = new Cesium.ArcGisMapServerImageryProvider({
      url: attr['url'],
      layer: attr['layerName'],
    });
    let arcMap = viewer.imageryLayers.addImageryProvider(titleimgProvider);
    arcMap.alpha = attr['alpha'];
  },
  //移除图层
  removeLayersByKey: function(key) {
    for (let i = 0; i < viewer.imageryLayers._layers.length; i++) {
      let item = viewer.imageryLayers._layers[i];
      if (item.key === key) {
        viewer.imageryLayers.remove(item);
      }
    }
  },
  //移除传入的图层
  removeExistLayer:function(item){
    if(item.dataSource){
      Cesium.when(item.dataSource, function (dataSource) {
        dataSource.show = false;
        viewer.flyTo(dataSource);
      });
    }
    else {
      this.removeLayersByKey(item.id);
    }
  },
  removeAllLayers: function() {
    for (let i = 2; i < viewer.imageryLayers._layers.length;) {
      let item = viewer.imageryLayers._layers[i];
      viewer.imageryLayers.remove(item);
      // if (item.key !== undefined) {  //移除注册了key的图层
      //   viewer.imageryLayers.remove(item);
      // }
    }
    for (let i=0;i<viewer.dataSources._dataSources.length;){
      let item = viewer.dataSources._dataSources[i];
      viewer.dataSources.remove(item);
    }
    viewer.scene.requestRender();
  },
  removeLayerIndatasetbyName: function(key, name) {
    for (let i = 0; i < viewer.imageryLayers._layers.length; i++) {
      let item = viewer.imageryLayers._layers[i];
      if (item.key === key && item.name === name) {
        viewer.imageryLayers.remove(item.layer);
      }
    }
  },
  //加载terrain地形方法
  //url： 地形的url
  addTerrainProvider: function(url) {
    let terrainProvider = new Cesium.CesiumTerrainProvider({
      url: url,
    });
    viewer.terrainProvider = terrainProvider;
  },
  //加载3Dtile
  addCesium3DTileset: function(url) {
    viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
      url: url,//'http://172.16.6.230:8888/ruzhou3dtiles1/tileset.json',
    }));
  },
  //设置镜头位置与方向
  setView: function(x, y, h) {
    viewer.camera.setView({//镜头的经纬度、高度。镜头默认情况下，在指定经纬高度俯视（pitch=-90）地球
      destination: Cesium.Cartesian3.fromDegrees(x, y, h),//北京150000公里上空
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90),
        roll: Cesium.Math.toRadians(0),
      },
    });
  },
  changeLayerOpacity: function(key, alpha) {
    for (let i = 0; i < viewer.imageryLayers._layers.length; i++) {
      let item = viewer.imageryLayers._layers[i];
      if (item.key === key) {
        item.alpha = alpha;
      }
    }
  },
  setLayerVisibleBykey: function(key, checked) {
    for (let i = 0; i < viewer.imageryLayers._layers.length; i++) {
      let item = viewer.imageryLayers._layers[i];
      if (item.key === key) {
        item.show = checked;
      }
    }
  },
  getLayersExceptBaseMap: function() {          //返回dataType ===layer的图层
    if (viewer) {
      let arr = [];
      viewer.imageryLayers._layers.forEach((item) => {
        if (item.dataType === 'layer') {
          arr.push({ name: item.name, dataType: item.dataType, id: item.id, key: item.key });
        }
      });
      return arr;
    }
  },
  getHeight: function() {
    return 2000000;
  },
  getCenter: function() {
    return [119, 36];
  },
  addGeoJson: function(attr) {
    let vectorPromise = Cesium.GeoJsonDataSource.load(attr, {
      // stroke: Cesium.Color.RED,
      // fill: shpColor.withAlpha($('#sewerageDatasourceAlpha').val()),
      fill: Cesium.Color.RED,
      // strokeWidth: 3,
      // clampToGround : true
    });
    Cesium.when(vectorPromise, function (dataSource) {
      if (viewer.dataSources.indexOf(dataSource) == -1) {
        viewer.dataSources.add(dataSource);
        let entities = dataSource.entities.values;
        for (let i = 0; i < entities.length; i++) {
          let entity = entities[i];
          entity.billboard = undefined;
          entity.point = new Cesium.PointGraphics({
            color: Cesium.Color.RED,
            outlineColor : Cesium.Color.RED,
            scaleByDistance:new Cesium.NearFarScalar(1.5e2, 3, 8.0e6, 1)
          });
        }
        viewer.flyTo(dataSource);
      }
    });
    return vectorPromise;
  }
};

/**
 * Created by zhangkailun on 2019/3/20.
 */
/*******************************************************
 *  动画类
 *********************************************************/
cesiumMap.animation = function() {
};

cesiumMap.animation.prototype = {
  //路线动画
  line: function(attr) {
    let _this = this;
    let dataSource = new Cesium.CzmlDataSource();
    let czmlPath = attr['czmlPath'];
    let vehicleEntity;

    viewer.dataSources.add(dataSource);
    let partsToLoad = [{
      url: attr['name'],
      range: [0, 1500],
      requested: false,
      loaded: false,
    }];
    this.processPart(czmlPath, partsToLoad[0], dataSource);

    const preloadTimeInSeconds = 100;

    viewer.clock.onTick.addEventListener(function(clock) {
      let timeOffset = Cesium.JulianDate.secondsDifference(clock.currentTime, clock.startTime);

      partsToLoad.filter(function(part) {
        return (!part.requested) &&
          (timeOffset >= part.range[0] - preloadTimeInSeconds) &&
          (timeOffset <= part.range[1]);
      }).forEach(function(part) {
        _this.processPart(czmlPath, part, dataSource);
      });

      if (vehicleEntity) {
        let fuel = vehicleEntity.properties.fuel_remaining.getValue(clock.currentTime);
      }
    });

  },
  processPart: function(czmlPath, part, dataSource) {
    // part.requested = true;
    // dataSource.process(czmlPath + part.url).then(function() {
    //   part.loaded = true;
    //   if (!viewer.trackedEntity) {
    //     viewer.trackedEntity = vehicleEntity = dataSource.entities.getById('Vehicle');
    //   }
    // });
  },
};


/**
 * Created by zhangkailun on 2019/3/6.
 */
/*******************************************************
 *  控件类
 *********************************************************/
cesiumMap.control = function() {
};

cesiumMap.control.prototype = {
  //初始化指南针、比例尺控件和放大缩小工具
  initNavigation:function(options){
    CesiumNavigation(viewer, options);
  },

  //将矩阵转换为角度
  getmatrix: function() {
    const regex1 = '\\((.+?)\\)';
    let str = $('.ol_cesium3d_zhinan button:eq(1)').css('transform');
    let arr = str.match(regex1)[1].split(',');
    let a = parseFloat(arr[0]);
    let b = parseFloat(arr[1]);
    let c = parseFloat(arr[2]);
    let d = parseFloat(arr[3]);
    let e = parseFloat(arr[4]);
    let f = parseFloat(arr[5]);
    let aa = Math.round(180 * Math.asin(a) / Math.PI);
    let bb = Math.round(180 * Math.acos(b) / Math.PI);
    let cc = Math.round(180 * Math.asin(c) / Math.PI);
    let dd = Math.round(180 * Math.acos(d) / Math.PI);
    let deg = 0;
    if (aa == bb || -aa == bb) {
      deg = dd;
    } else if (-aa + bb == 180) {
      deg = 180 + cc;
    } else if (aa + bb == 180) {
      deg = 360 - cc || 360 - dd;
    }
    return deg >= 360 ? 0 : deg;
  },

  initMeasuretool: function(position, element) {
  },
  //清除绘线，面，矩形，圆
  clear3d_drawTool: function() {
    let d_Draw = new cesiumMap.draw();
    d_Draw.clearById('3d_LineString');
    d_Draw.clearById('3d_Point');
    d_Draw.clearById('3d_Polygon');
    d_Draw.clearById('3d_Box');
    d_Draw.clearById('3d_Circle');
  },
  //清除量算
  clear3d_measureTool: function() {
    let d_Draw = new cesiumMap.draw();
    d_Draw.clearById('3d_Line_measure');
    d_Draw.clearById('3d_polygon_measure');
  },
  //初始化结果面板的HTML
  initDistancehtml: function(position, element) {
  },
  //鼠标当前位置
  mousePosition: function(node) {
    let canvas = viewer.scene.canvas;
    let ellipsoid = viewer.scene.globe.ellipsoid;
    let handler = new Cesium.ScreenSpaceEventHandler(canvas);
    handler.setInputAction(function(movement) {
      //捕获椭球体，将笛卡尔二维平面坐标转为椭球体的笛卡尔三维坐标，返回球体表面的点
      let cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
      if (cartesian) {
        //将笛卡尔三维坐标转为地图坐标（弧度）
        let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
        //将地图坐标（弧度）转为十进制的度数
        let lat_String = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);
        let log_String = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);
        let alti_String = (viewer.camera.positionCartographic.height / 1000).toFixed(2);
        node.innerHTML = `${log_String}, ${lat_String}`;
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  },
  //切换二三位视图
  switchSceneMode:function(mode,node) {
    let scene = viewer.scene;
    switch (mode) {
      case "2D":
        scene.morphTo2D(0);
        node.innerText = "3D"
        break;
      case "3D":
        scene.morphTo3D(0);
        node.innerText = "2D"
        break;
      default:
        break;
    }
  }
};


/**
 * Created by on 2019/3/7.
 */
/*******************************************************
 * 覆盖物类
 *********************************************************/
cesiumMap.cover = function(bgColor, element) {
  this.element = element;
  this.handler3D = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  this.bgColor = bgColor;
  let style = new cesiumMap.style();
  if (this.bgColor == null || this.bgColor == undefined || this.bgColor == '') {
    style.popupSytle(this);
  }
};

cesiumMap.cover.prototype = {
  //添加marksname： 名称
  //lon:经度
  //lat：维度
  //height：高度
  //flag：是否弹出气泡
  addMarker: function(attr) {
    let _this = this;
    viewer.entities.add({
      name: attr['name'],
      flag: attr['flag'],
      types: 'marks',
      position: Cesium.Cartesian3.fromDegrees(parseFloat(attr['lon']), parseFloat(attr['lat']), (parseFloat(attr['height']))),
      billboard: {
        image: attr['image'],
        scale: 1,
      },
    });
    viewer.camera.zoomOut(0.0001);
    let o = new cesiumMap.operate();
    let viewattr = {
      lon: attr['lon'],
      lat: attr['lat'],
      height: 2500,
      duration: null,
    };
    o.setLocation(viewattr);
    //_this.screenPop(attr,_this);
    _this.addInfoPop(attr);
    viewer.scene.preRender.addEventListener(function() {
      _this.screenPop(attr, _this);
      _this.addInfoPop(attr);
    });
  },
  //清除mark点位
  clearMarker: function() {
    let numarr = [];
    for (let i = 0; i < viewer.entities.values.length; i++) {
      if (viewer.entities.values[i].types == 'marks') {
        numarr.push(i);
      }
    }
    numarr.sort();
    for (let i = numarr.length - 1; i >= 0; i--) {
      let j = numarr[i];
      viewer.entities.remove(viewer.entities.values[j]);
    }
    viewer.camera.zoomOut(0.0001);
  },
  //根据设置id添加指定mark点
  // 添加marks点
  // name： 名称
  //lon:经度
  //lat：维度
  //height：高度
  //flag：是否弹出气泡
  //id 指定id
  addMarkerbyId: function(attr) {
    viewer.entities.add({
      id: attr['id'],
      position: Cesium.Cartesian3.fromDegrees(parseFloat(attr['lon']), parseFloat(attr['lat']), (parseFloat(attr['height']))),
      billboard: {
        image: attr['image'],
        scale: 1,
      },
    });
    viewer.camera.zoomOut(0.0001);
  },
  //根据指定id清除mark点位
  clearMarksById: function(id) {
    if (viewer.entities.getById(id) != undefined) {
      viewer.entities.remove(viewer.entities.getById(id));
    }
    viewer.camera.zoomOut(0.0001);
  },
  //添加气泡
  addInfoPop: function(attr) {
    let _this = this;
    this.handler3D.setInputAction(function(movement) {
      let pick = viewer.scene.pick(movement.position);
      if (pick && pick.id && pick.id.flag) {
        let code = pick.id.id;
        _this.screenPop(attr, _this);
        $('.popup_' + code + '').show();
        let entity = pick.id;
        if (entity.position._value != undefined) {
          let c = viewer.scene.cartesianToCanvasCoordinates(entity.position._value);
          _this.commonTranslate(c, code);
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  },
  //被动弹出气泡
  //lon：经度
  // lat:维度
  // contents ：气泡内容
  pop: function(attr) {
    let _this = this;
    let code = _this.screenPop(attr, _this);
    $('.popup_' + code + '').show();
  },
  //添加气泡div
  screenPop: function(attr, e) {
    let des = viewer.scene.globe.ellipsoid.cartographicToCartesian(
      new Cesium.Cartographic.fromDegrees(parseFloat(attr['lon']), parseFloat(attr['lat']), parseFloat(attr['height'])));
    let position = viewer.scene.cartesianToCanvasCoordinates(des);
    if (position != undefined && position.x != 0 && position.y != 0) {
      //------------------------------------------
      let pick = viewer.scene.pick(position);
      if (pick != undefined && pick.id != undefined) {
        let code = pick.id.id;
        if ($('.popup_' + code + '').length <= 0) {
          e.initPophtml(code);
        }

        $('.leaflet-popup-content_' + code + '').empty();
        $('.leaflet-popup-content_' + code + '').append(attr['contents']);
        e.commonTranslate(position, code);

        viewer.scene.postRender.addEventListener(function() {
          let entity = pick.id;
          if (entity != undefined) {
            if (entity.name != undefined) {
              let c = viewer.scene.cartesianToCanvasCoordinates(entity.position._value);
              e.commonTranslate(c, code);
            }
          }
        });
        e.closePop(code);
      }
    }
    return code;
  },
  //气泡的旋转
  commonTranslate: function(c, code) {
    if (c != undefined) {
      let x = c.x/*+$("#"+this.element).width()*/ - ($('.leaflet-popup_' + code + '').width()) / 2;
      let y = c.y - ($('.leaflet-popup_' + code + '').height());
      $('.leaflet-popup_' + code + '').css('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)');
    }
  },
  //初始化气泡的HTML
  initPophtml: function(code) {
    let infoDiv = '<div class="popup popup_' + code + '" style="display:none;">' +
      '<div class="leaflet-popup leaflet-popup_' + code + '" style="background:' + this.bgColor + '">' +
      '<a class="leaflet-popup-close-button close_' + code + '" href="#">×</a>' +
      '<div class="leaflet-popup-content-wrapper">' +
      '<div class="leaflet-popup-content leaflet-popup-content_' + code + '"></div>' +
      '</div>' +
      '<div class="leaflet-popup-tip-container">' +
      '<div class="leaflet-popup-tip" style="background:' + this.bgColor + '"></div>' +
      '</div>' +
      '</div>' +
      '</div>';
    $('#' + this.element).append(infoDiv);
  },
  //关闭气泡
  closePop: function(code) {
    $('.close_' + code).click(function() {
      $('.popup_' + code + '').hide();
    });
  },
  //关闭所有气泡
  closeAllPop: function() {
    $('.popup').hide();
  },
  //添加图标与文字
  // name： 名称
  //lon:经度
  //lat：维度
  //height：高度
  //image :图片
  // colors： 颜色
  addImageLable: function(name, lon, lat, height, image, colors) {
    viewer.entities.add({
      name: 'featurename',
      position: Cesium.Cartesian3.fromDegrees(parseFloat(lon), parseFloat(lat), (parseFloat(height))),
      billboard: {
        image: image,
        scale: 0.5,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4000.0),  //显示范围
      },
      label: {
        text: name,//"15号楼",
        font: '14px Tahoma,Helvetica,Arial',
        color: Cesium.Color.BLACK,
        backgroundColor: Cesium.Color.WHITE,
        fillColor: Cesium.Color.fromCssColorString(colors),// new Cesium.Color( cologred[m],  colorgreen[m],  colorblue[m],  colorgeaph[m] ),
        outlineColor: new Cesium.Color(1, 1, 1, 1),
        //垂直位置
        verticalOrigin: Cesium.VerticalOrigin.BUTTON, //BUTTON
        //中心位置
        pixelOffset: new Cesium.Cartesian2(0, 20),
        // scale:0.5,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4000.0),
      },
    });

  },
};


/**
 * Created by zhangkailun on 2019/3/4.
 */
/*******************************************************
 *  绘画类
 *********************************************************/
//let 3d.Draw=new 3d.Draw(colors,width,id,alpha);
//3d.Draw.drawPoint()
/**
 * 颜色--colors
 * 宽度--width
 * 标识id--id
 * 透明度--alpha
 */

cesiumMap.draw = function(colors, width, id, alpha) {
  this.colors = colors;
  this.width = width;
  this.id = id;
  this.alpha = alpha;
  let style = new cesiumMap.style();
  if (this.colors == null || this.colors == undefined || this.colors == '') {
    style.drawStyle(this);
  }
  if (this.width == null || this.width == undefined || this.width == '') {
    style.drawWidth(this);
  }
};

cesiumMap.draw.prototype = {
  //画点
  drawPoint: function() {
    this.clearById(this.id);
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    this.leftHandle(handler, null, 'point');
    this.rightHandle(handler, null);
  },
  //画线
  drawLine: function() {
    this.clearById(this.id);
    let _this = this;
    let PolyLinePrimitive = (function() {
      function _(positions) {
        this.options = {
          id: _this.id,
          polyline: {
            show: true,
            positions: [],
            material: Cesium.Color.fromCssColorString(_this.colors).withAlpha(_this.alpha),
            width: _this.width,
          },
        };
        this.positions = positions;
        this._init();
      }

      _.prototype._init = function() {
        let _self = this;
        let _update = function() {
          return _self.positions;
        };
        //实时更新polyline.positions
        this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
        viewer.entities.add(this.options);
      };
      return _;
    })();

    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    let positions = [];
    let poly = undefined;

    this.leftHandle(handler, positions);
    this.moveHandle(handler, positions, poly, new PolyLinePrimitive(positions));
    this.rightHandle(handler, positions, 'measureDistance');
  },
  //画多边形
  drawPolygon: function() {
    this.clearById(this.id);
    let _this = this;
    let polygonPrimitive = (function() {
      function _(positions) {
        this.options = {
          id: _this.id,
          polygon: {
            show: true,
            hierarchy: [],
            material: Cesium.Color.fromCssColorString(_this.colors).withAlpha(_this.alpha),
          },
        };
        this.hierarchy = positions;
        this._init();
      }

      _.prototype._init = function() {
        let _self = this;
        let _update = function() {
          return _self.hierarchy;
        };
        //实时更新polyline.positions
        this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
        viewer.entities.add(this.options);
      };
      return _;
    })();

    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    let positions = [];
    let poly = undefined;

    this.leftHandle(handler, positions);
    this.moveHandle(handler, positions, poly, new polygonPrimitive(positions));
    this.rightHandle(handler, positions, 'measureArea');
  },
  //画矩形
  drawRectangle: function() {
    this.clearById(this.id);
    let _this = this;
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    let positions = [];
    let poly = undefined;
    //鼠标左键单击画点
    //鼠标单击画点
    handler.setInputAction(function(movement) {
      let cartesian = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
      if (positions.length == 0) {
        positions.push(cartesian.clone());
      }
      positions.push(cartesian);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    //鼠标移动
    handler.setInputAction(function(movement) {
      let cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
      if (positions.length >= 2) {
        if (!Cesium.defined(poly)) {
          let isConstant = false;
          poly = viewer.entities.add({
              id: _this.id,//'drawrect',
              rectangle: {
                coordinates: new Cesium.CallbackProperty(function(time, result) {
                  let firstpositionlat = Cesium.Math.toDegrees(viewer.scene.globe.ellipsoid.cartesianToCartographic(positions[0]).latitude);
                  let firstpositionlon = Cesium.Math.toDegrees(viewer.scene.globe.ellipsoid.cartesianToCartographic(positions[0]).longitude);
                  let endpositionlat = Cesium.Math.toDegrees(viewer.scene.globe.ellipsoid.cartesianToCartographic(positions[1]).latitude) + 0.0001;
                  let endpositionlon = Cesium.Math.toDegrees(viewer.scene.globe.ellipsoid.cartesianToCartographic(positions[1]).longitude) + 0.0001;
                  if (firstpositionlat < endpositionlat) {
                    if (firstpositionlon < endpositionlon) {
                      return Cesium.Rectangle.fromDegrees(firstpositionlon, firstpositionlat, endpositionlon, endpositionlat);
                    } else {
                      return Cesium.Rectangle.fromDegrees(endpositionlon, firstpositionlat, firstpositionlon, endpositionlat);
                    }
                  } else {
                    if (firstpositionlon > endpositionlon) {
                      return Cesium.Rectangle.fromDegrees(endpositionlon, endpositionlat, firstpositionlon, firstpositionlat);
                    } else {
                      return Cesium.Rectangle.fromDegrees(firstpositionlon, endpositionlat, endpositionlon, firstpositionlat);
                    }
                  }
                }, isConstant),
                material: Cesium.Color.fromCssColorString(_this.colors).withAlpha(_this.alpha),//  Cesium.Color.RED.withAlpha(0.4),
              },
            },
          );
        } else {
          positions.pop();
          positions.push(cartesian);
        }
      }
      viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
      viewer.camera.zoomIn(0.00001);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    //鼠标右键单击结束绘制
    this.rightHandle(handler, positions);
  },
  //画圆
  drawCircle: function() {
    this.clearById(this.id);
    let _this = this;
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    let positions = [];
    let poly = undefined;
    //鼠标左键单击画点
    //鼠标单击画点
    handler.setInputAction(function(movement) {
      let cartesian = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
      if (positions.length == 0) {
        positions.push(cartesian.clone());
        positions.push(cartesian);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    let drawdistinces = 1;
    //鼠标移动
    handler.setInputAction(function(movement) {
      let cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
      if (positions.length >= 2) {
        if (!Cesium.defined(poly)) {
          let isConstant = false;
          poly = viewer.entities.add({
              id: _this.id,
              position: positions[0],
              ellipse: {
                semiMinorAxis: new Cesium.CallbackProperty(function(time, result) {
                  return parseFloat(drawdistinces) > 0 ? parseFloat(drawdistinces) : 1;
                }, isConstant),
                semiMajorAxis: new Cesium.CallbackProperty(function(time, result) {
                  return parseFloat(drawdistinces) > 0 ? parseFloat(drawdistinces) : 1;
                }, isConstant),
                outline: true,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: _this.width,
                material: Cesium.Color.fromCssColorString(_this.colors).withAlpha(_this.alpha),// ,
              },
            },
          );
        } else {
          positions.pop();
          positions.push(cartesian);
          drawdistinces = _this.getSpaceDistance(positions);
        }
      }
      viewer.camera.zoomIn(0.00001);
      viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    //鼠标右键单击结束绘制
    this.rightHandle(handler, positions);
  },
  //绘制线段，距离量算
  measureDistance: function() {
    this.drawLine();
  },
  //绘制平面，面积量算
  measureArea: function() {
    this.drawPolygon();
  },
  //获取距离
  getSpaceDistance: function(positions) {
    let distance = 0;
    for (let i = 0; i < positions.length - 1; i++) {

      let point1cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
      let point2cartographic = Cesium.Cartographic.fromCartesian(positions[i + 1]);
      /**根据经纬度计算出距离**/
      let geodesic = new Cesium.EllipsoidGeodesic();
      geodesic.setEndPoints(point1cartographic, point2cartographic);
      let s = geodesic.surfaceDistance;
      //返回两点之间的距离
      s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
      distance = distance + s;
    }
    return distance.toFixed(2);
  },
  //获取面积
  getArea: function(positions) {
    let res = 0;
    //拆分三角曲面
    for (let i = 0; i < positions.length - 2; i++) {
      let j = (i + 1) % positions.length;
      let k = (i + 2) % positions.length;
      let totalAngle = this.getAngle(positions[i], positions[j], positions[k]);
      let dis_temp1 = this.getDistance(positions[i], positions[j]);
      let dis_temp2 = this.getDistance(positions[j], positions[k]);
      res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle));
    }
    return Math.abs((res / 1000000.0).toFixed(4));
  },
  //获取角度
  getAngle: function(p1, p2, p3) {
    let bearing21 = this.getBearing(p2, p1);
    let bearing23 = this.getBearing(p2, p3);
    let angle = bearing21 - bearing23;
    if (angle < 0) {
      angle += 360;
    }
    return angle;
  },
  //获取方向
  getBearing: function(from, to) {
    let radiansPerDegree = Math.PI / 180.0;
    let degreesPerRadian = 180.0 / Math.PI;
    let lat1 = from.x * radiansPerDegree;
    let lon1 = from.y * radiansPerDegree;
    let lat2 = to.x * radiansPerDegree;
    let lon2 = to.y * radiansPerDegree;
    let angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
    if (angle < 0) {
      angle += Math.PI * 2.0;
    }
    angle = angle * degreesPerRadian;
    return angle;
  },
  //获取两点距离
  getDistance: function(point1, point2) {
    let point1cartographic = Cesium.Cartographic.fromCartesian(point1);
    let point2cartographic = Cesium.Cartographic.fromCartesian(point2);
    /**根据经纬度计算出距离**/
    let geodesic = new Cesium.EllipsoidGeodesic();
    geodesic.setEndPoints(point1cartographic, point2cartographic);
    let s = geodesic.surfaceDistance;
    //返回两点之间的距离
    s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
    return s;
  },
  //鼠标单击左键
  //鼠标事件--handler
  //点集合--positions
  leftHandle: function(handler, positions, type) {
    let _this = this;
    handler.setInputAction(function(movement) {
      let cartesian = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
      if (type == 'point') {
        viewer.entities.add({
          position: cartesian,
          id: _this.id,
          point: {
            color: Cesium.Color.fromCssColorString(_this.colors).withAlpha(_this.alpha),//Cesium.Color.RED, #61B6FA
            pixelSize: _this.width,
          },
        });
      } else {
        if (positions.length == 0) {
          positions.push(cartesian.clone());
        }
        positions.push(cartesian);
      }
      viewer.camera.zoomIn(0.00001);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  },
  //鼠标移动
  moveHandle: function(handler, positions, poly, geometry) {
    handler.setInputAction(function(movement) {
      let cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
      if (positions.length >= 2) {
        if (!Cesium.defined(poly)) {
          poly = geometry;
        } else {
          if (cartesian != undefined) {
            positions.pop();
            cartesian.y += (1 + Math.random());
            positions.push(cartesian);
          }
        }
      }
      viewer.camera.zoomIn(0.00001);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  },
  //右键单击结束
  rightHandle: function(handler, positions, type) {
    let _this = this;
    handler.setInputAction(function(movement) {
      handler.destroy();
      if (type == 'measureDistance') {
        let drawdistinces = _this.getSpaceDistance(positions);
        $('#cesium_distance3d').empty();
        let htmlStr = '';
        htmlStr = '距离：' + drawdistinces + '米';
        $('#cesium_distance3d').append(htmlStr);

        console.log(drawdistinces + '米');
      } else if (type == 'measureArea') {
        let area = _this.getArea(positions);
        $('#cesium_distance3d').empty();
        let htmlStr = '';
        htmlStr = '面积：' + area + '平方公里';
        $('#cesium_distance3d').append(htmlStr);

        console.log(area + '平方公里');
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  },
  //清除绘画完成保留的对象
  clearById: function(id) {
    if (viewer.entities.getById(id) != undefined) {
      viewer.entities.remove(viewer.entities.getById(id));
      viewer.camera.zoomIn(0.00001);
    }
  },
};


/**
 * Created by zhangkailun on 2019/3/6.
 */
/*******************************************************
 *  相关事件类
 *********************************************************/
//Cesium.ScreenSpaceEventType.LEFT_CLICK                鼠标左键单击事件
//Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK         鼠标左键双击事件
//Cesium.ScreenSpaceEventType.LEFT_DOWN                 鼠标左键按下事件
//Cesium.ScreenSpaceEventType.LEFT_UP                   鼠标左键抬起事件
//Cesium.ScreenSpaceEventType.MIDDLE_CLICK              鼠标中键单击事​​件
//Cesium.ScreenSpaceEventType.MIDDLE_DOWN               鼠标中键按下事件
//Cesium.ScreenSpaceEventType.MIDDLE_UP                 鼠标中键抬起事件
//Cesium.ScreenSpaceEventType.MOUSE_MOVE                鼠标移动事件
//Cesium.ScreenSpaceEventType.PINCH_END                 触摸表面上的双指事件的结束
//Cesium.ScreenSpaceEventType.PINCH_MOVE                触摸表面上双指移动事件
//Cesium.ScreenSpaceEventType.PINCH_START               触摸表面上双指事件的开始
//Cesium.ScreenSpaceEventType.RIGHT_CLICK               鼠标右键单击事件
//Cesium.ScreenSpaceEventType.RIGHT_DOUBLE_CLICK        鼠标右键双击事件
//Cesium.ScreenSpaceEventType.RIGHT_DOWN                鼠标右键按下事件
//Cesium.ScreenSpaceEventType.WHEEL                     鼠标滚轮事件

cesiumMap.events = function() {
  this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
};

cesiumMap.events.prototype = {
  //鼠标对象事件
  mouseEvent: function(listener, eventType) {
    //eventType可以为Cesium.ScreenSpaceEventType
    //listener是方法
    //function one(click) {let pick = viewer.scene.pick(click.position);if(pick && pick.id){}}
    //调用方法:obj.mouseEvent(one,Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.handler.setInputAction(listener, eventType);
  },
  //移除鼠标对象事件
  removeEvent: function(eventType) {
    this.handler.removeInputAction(eventType);
  },
  //事件监听
  //event：被监听的对象
  //listener：要执行的方法
  //scope：一个可选的对象作用域
  addEventListener: function(event, listener, scope) {
    //function  one(){console.log("1111")}
    //调用方法:obj.addEventListener(viewer.scene.postRender,one)
    event.addEventListener(listener, scope);
  },
  //移除监听
  //event：被监听的对象
  //listener：方法
  //scope：一个可选的对象作用域
  removeEventListener: function(event, listener, scope) {
    event.removeEventListener(listener, scope);
  },
};

/**
 * Created by on 2019/3/6.
 */
/*******************************************************
 *  基础操作类
 *********************************************************/

cesiumMap.operate = function() {
};

cesiumMap.operate.prototype = {
  //左右旋转地图
  //radians :旋转角度 -180----180
  rotate: function(radians) {
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(viewer.scene.globe.ellipsoid.cartesianToCartographic(viewer.camera.position).longitude), Cesium.Math.toDegrees(viewer.scene.globe.ellipsoid.cartesianToCartographic(viewer.camera.position).latitude), viewer.scene.globe.ellipsoid.cartesianToCartographic(viewer.camera.position).height),
      orientation: {
        heading: Cesium.Math.toRadians(parseFloat(radians)), // east, default value is 0.0 (north)
      },
    });
  },
  //缩小地图
  // nums: 为缩放比例
  zoomout: function(nums) {
    viewer.camera.zoomOut(nums);
  },
  //放大地图
  //nums :为放大比例
  zoomIn: function(nums) {
    viewer.camera.zoomIn(nums);
  },
  //地图向上旋转倾斜
  //radians 倾斜度数 -30
  rotateUp: function(radians) {
    //向上旋转地图
    viewer.flyTo(
      viewer.entities.values
      , {
        offset: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(parseFloat(radians)),
        },
        duration: 3,
      });
  },
  //经纬度转屏幕坐标   // lon：经度，
  cartesianToCanvasCoordinates: function(lat, lon, height) {
    return viewer.scene.cartesianToCanvasCoordinates(new Cesium.Cartesian3(parseFloat(lat), parseFloat(lon), parseFloat(height)));
  },
  //转换经纬度   Cartesian3 大地坐标
  cartesian3ToLlatLon: function(Cartesian3) {
    let lat = Cesium.Math.toDegrees(viewer.scene.globe.ellipsoid.cartesianToCartographic(Cartesian3).latitude);
    let lon = Cesium.Math.toDegrees(viewer.scene.globe.ellipsoid.cartesianToCartographic(Cartesian3).longitude);
    return 'lon:' + lon + ',lat:' + lat;
  },
  flyHome: function(duration) {
    viewer.camera.flyHome(duration);
  },
  //定位
  // lon：经度，
  // lat：维度
  // height：离地面的高度
  setLocation: function(viewattr) {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(parseFloat(viewattr['lon']), parseFloat(viewattr['lat']), parseFloat(viewattr['height'])),
      duration: viewattr['duration'],
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90),
        roll: Cesium.Math.toRadians(0),
        /*heading : viewattr["heading"],
        pitch:viewattr["pitch"],*/
      },
      // duration: 8,//动画持续时间
    });
  },
  //获取中心点的坐标
  get_CesiumCenter: function() {
    //viewer.scene.globe.ellipsoid.cartesianToCartographic(viewer.camera.position).height
    let lat = Cesium.Math.toDegrees(viewer.scene.globe.ellipsoid.cartesianToCartographic(viewer.camera.position).latitude);
    let lon = Cesium.Math.toDegrees(viewer.scene.globe.ellipsoid.cartesianToCartographic(viewer.camera.position).longitude);
    return 'lon:' + lon + ',lat:' + lat;
  },
};


export default cesiumMap;
