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
 
  let theCanvas;
  const [_openKeys,setOpenKeys] = useState('');
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

    }else
	if (e.key === 'add-text'){
	//	addtext();
	}

  };

  const onOpenChange = openkeys => {    
	console.log(openkeys);
	if(openkeys.length)
	setOpenKeys([openkeys[openkeys.length-1]]); 
	else setOpenKeys([]);
  }
  return (
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapseChange}>
      <div className={styles.logo}/>
      <Menu
	    openKeys={_openKeys}
        onOpenChange={onOpenChange}
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
		  <Menu.Item key="zoom">
            <span>放缩器</span>
            <span className={styles.checkIcon}>
              {mapControl.get('zoom') && <Icon type='check'/>}
            </span>
          </Menu.Item>
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
