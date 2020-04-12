import { Layout, Menu, Icon, Collapse } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';
import { connect } from 'dva';

const {  Sider } = Layout;
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
  const { collapsed, onCollapseChange, onBasemapChange, onControlsChange, mapControl, onLegendChange, legend, dispatch } = props;
  const handleMenuClick = e => {
    if (e.keyPath.length > 1) {
      if (e.keyPath[1] === 'basemap') {
        console.log(e.key);
        onBasemapChange(e.key);
      } else if (e.keyPath[1] === 'control') {        
			onControlsChange(e.key);
      } else if (e.keyPath[1] === 'legend'){
		onLegendChange(e.key);
	  }
    }
	if (e.key === 'print') {
      dispatch({
        type: 'onlineMapping/setMapSaverModalVisible',
        payload: true
      });

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
		
		<SubMenu
          key="legend"
          title={
            <span>
              <Icon type="bulb" />
              <span>图例</span>			  
            </span>
          }
        >
		  <Menu.Item key="discrete">
            <span>离散</span>
            <span className={styles.checkIcon}>
				{legend.get("discrete") && <Icon type='check'/>}
			</span>
          </Menu.Item>
          <Menu.Item key="continuous">
            <span>连续</span>
            <span className={styles.checkIcon}>
				{legend.get("continuous") && <Icon type='check'/>}
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
