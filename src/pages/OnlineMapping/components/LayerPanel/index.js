import { Layout, Menu, Breadcrumb, Icon, Collapse } from 'antd';
import React, { useState, useEffect } from 'react';
import FileSaver from 'file-saver';
import mapboxgl from 'mapbox-gl';
import SaveMapModal from '../MapSaverModal/index';
import styles from './index.less';
import { connect } from 'dva';
import html2canvas from 'html2canvas';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Panel } = Collapse;
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1225009_f39m3y74x5s.js',
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
  let theCanvas;

  const { collapsed, onCollapseChange, onBasemapChange, onControlsChange, mapControl, dispatch } = props;
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
              <IconFont type="icon-basemap-sate"/>
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
        <Menu.Item key="add-text">
          <IconFont type="icon-text"/>
          <span>添加文字</span>
        </Menu.Item>
        <SubMenu
          key="control"
          title={
            <span>
              <Icon type="control" />
              <span>控件</span>
            </span>
          }
        >
          <Menu.Item key="rotation">
            <span>指南针</span>
            <span className={styles.checkIcon}>
              {mapControl.get('rotation') && <Icon type='check'/>}
            </span>
          </Menu.Item>
          <Menu.Item key="scale">
            <span>比例尺</span>
            <span className={styles.checkIcon}>
              {mapControl.get('scale') && <Icon type='check'/>}
            </span>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key="print">
          <Icon type="printer" />
          <span>打印</span>
        </Menu.Item>
      </Menu>
    </Sider>
  )
    ;
}

export default connect(({ onlineMapping }) => ({
  onlineMapping,
}))(LayerPanel);
