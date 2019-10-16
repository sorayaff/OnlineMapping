import { Layout, Menu, Breadcrumb, Icon, Collapse } from 'antd';
import React, { useState, useEffect } from 'react';
import FileSaver from 'file-saver';
import mapboxgl from 'mapbox-gl';
import SaveMapModal from '../MapSaverModal/index';
import styles from './index.less';
import { connect } from 'dva';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Panel } = Collapse;
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1225009_z8rjoprvtyf.js',
});

function LayerPanel(props) {
  // let rootSubmenuKeys = ['layer1', 'layer2', 'layer3'];
  // const [openKeys, setOpenKeys] = useState(['layer1']);
  //
  //
  // const onOpenChange = items => {
  //   const latestOpenKey = items.find(key => openKeys.indexOf(key) === -1);
  //   if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
  //     setOpenKeys(items);
  //   } else {
  //     setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  //   }
  // };

  const { collapsed, onCollapseChange, onBasemapChange, onControlsChange, mapInstance,dispatch } = props;
  const handleMenuClick = e => {
    if (e.keyPath.length > 1) {
      if (e.keyPath[1] === 'basemap') {
        console.log(e.key);
        onBasemapChange(e.key);
      } else if (e.keyPath[1] === 'control') {
        onControlsChange(e.key);
      }
    }
    if (e.key === 'print') {
      dispatch({
        type: 'onlineMapping/setMapSaverModalVisible',
        payload: true
      });
      // if (mapInstance) {
      //   console.log(mapInstance.getStyle());
      //   var hidden = document.createElement('div');
      //   hidden.className = 'hidden-map';
      //   document.body.appendChild(hidden);
      //   var container = document.createElement('div');
      //   container.style.width = '300px';
      //   container.style.height = '300px';
      //   hidden.appendChild(container);
      //   var zoom = mapInstance.getZoom();
      //   var center = mapInstance.getCenter();
      //   var bearing = mapInstance.getBearing();
      //   var pitch = mapInstance.getPitch();
      //   var renderMap = new mapboxgl.Map({
      //     container: container,
      //     style: mapInstance.getStyle(),
      //     interactive: false,
      //     center: center,
      //     zoom: zoom,
      //     bearing: bearing,
      //     pitch: pitch,
      //     preserveDrawingBuffer: true,
      //     fadeDuration: 0,
      //     attributionControl: false,
      //   });
      //   renderMap.once('load', function() {
      //     renderMap.getCanvas().toBlob(function(blob) {
      //       FileSaver.saveAs(blob, 'map.png');
      //     });
      //   });
      //   console.log(e);
      // }
    }

  };

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapseChange}>
      <div className={styles.logo}/>
      <Menu
        mode="inline"
        theme={'dark'}
        onClick={handleMenuClick}
      >
        <SubMenu
          key="basemap"
          title={
            <span>
              <Icon type="mail"/>
              <span>选择底图</span>
            </span>
          }
        >
          <Menu.Item key="light">light</Menu.Item>
          <Menu.Item key="dark">dark</Menu.Item>
          <Menu.Item key="streets">streets</Menu.Item>
          <Menu.Item key="outdoors">outdoors</Menu.Item>
          <Menu.Item key="satellite">satellite</Menu.Item>
        </SubMenu>
        <SubMenu
          key="addLayer"
          title={
            <span>
              <IconFont type="icon-layers"/>
              <span>添加图层</span>
            </span>
          }
        >
          <Menu.Item key="5">Option 5</Menu.Item>
          <Menu.Item key="6">Option 6</Menu.Item>
        </SubMenu>
        <Menu.Item key="print">
          <IconFont type="icon-text"/>
          <span>添加文字</span>
        </Menu.Item>
        <SubMenu
          key="control"
          title={
            <span>
              <Icon type="setting"/>
              <span>控件</span>
            </span>
          }
        >
          <Menu.Item key="rotation">指南针</Menu.Item>
          <Menu.Item key="scale">比例尺</Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  )
    ;
}

export default connect(({ onlineMapping }) => ({
  onlineMapping,
}))(LayerPanel);
