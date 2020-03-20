import {Typography, Input, Select, Layout, Menu, Breadcrumb, Icon, Collapse, Button, Checkbox, Radio } from 'antd';
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
var templateSelect='';


function ElementReplace (id,property,textstring){
	var obj= document.getElementById(id);
	if(obj)
		if(property=="value")
		obj.value=textstring;
		else if(property=="text")
		obj.text=textstring;
		else if(property=="innerText")
		obj.innerText=textstring;
		else if(property=="innerHTML")
		obj.innerText=textstring;
//		<Text strong className={styles.layerinput_label} >添加注记</Text>        
//				<Button shape="circle" >On</Button>
}
function windowalert(s)
{
	window.alert(s);	
}
function TemplatePanel(props) {

  let theCanvas;
  const {  dispatch, mapAddlayer,  mapSelectTemplate, dataFieldsSet, addLabel} = props;
  const dataFieldsArray = Array.from(dataFieldsSet);  
  const [ labelChecked, setlabelChecked] = useState(false);
  const [ _openKeys, setOpenKeys] = useState('');
  const [ dataSelect, setData ]= useState(null);
  const [ radioValue, setRadioValue] = useState("black"); 
  
  const setDataSelect = (e) =>{
	  templateSelect='';	  
	  setData(e);
	  ElementReplace("selectTemplateSpan","innerHTML","选择模板");
	}
  const handleMenuClick = e => {
    if (e.keyPath.length > 1) {
       if (e.keyPath[1] === 'selectTemplate') {					
         templateSelect=e.keyPath[0];
			ElementReplace("selectTemplateSpan","innerHTML","选择模板 ["+templateSelect+"]");
       }else if (e.keyPath[1] === 'addLayer') {
		   setDataSelect(e.keyPath[0]);		   
			ElementReplace("addLayerSpan","innerHTML","添加数据 ["+e.keyPath[0]+"]");
	   }
    }else
    if (e.key === 'print') {
      dispatch({
        type: 'onlineMapping/setMapSaverModalVisible',
        payload: true
      });
    }

  };
  const handleMenuChange = openkeys => {
	if(openkeys.length)
	setOpenKeys([openkeys[openkeys.length-1]]); 
	else setOpenKeys([]);
  }
  
  const setLabelCheckedFalse = e =>{
		if(labelChecked)
		setlabelChecked(false);
  }
  const buttonClick= e =>{
	  //document.getElementById("DataFields").value="  ";
	  setLabelCheckedFalse();
	  
	  if(templateSelect==''){windowalert("未选择数据与模板");return;}
	  
	  
	  mapSelectTemplate(templateSelect,
						dataSelect,
						document.getElementById("DataName").value,
						document.getElementById("LayerName").value,
						radioValue);
	  
  }
  const addlabelClick= e => {
	setlabelChecked(e.target.checked);	
	
	addLabel(document.getElementById("DataName").value,
			document.getElementById("DataFields").innerText,e.target.checked);					
  }
  const radioChange = e => {
      setRadioValue(e.target.value)
  };
  const { Option  } = Select;
  const { Text }= Typography;
 
 
  return (
    <Sider width={300} className={styles.panel} >
      <div className={styles.logo}/>
      <Menu
        mode="inline"
        theme={'dark'}
        onClick={handleMenuClick}
		onOpenChange={handleMenuChange}
		openKeys={_openKeys}
      >
		<SubMenu
          key="addLayer"
          title={
            <span>
              <IconFont type="icon-layers"/>
              <span id="addLayerSpan">添加数据</span>
            </span>
          }
        >		
          <Menu.Item key="json">json</Menu.Item>        
          <Menu.Item key="csv">csv</Menu.Item>
		  <Menu.Item key="tiff">tiff</Menu.Item>        
        </SubMenu>
        
		{ (dataSelect=="json"||dataSelect=="csv" )&&
		<SubMenu
          key="selectTemplate"
          title={
            <span>
              <Icon type="picture"/>
              <span id="selectTemplateSpan">选择模板</span>
            </span>
          }
        >
          <Menu.Item key="symbol">符号图symbol</Menu.Item>
          <Menu.Item key="heat">热力图heat</Menu.Item>
          <Menu.Item key="cluster">聚类图cluster</Menu.Item>
		</SubMenu>}

		{ (dataSelect=="tiff")&&
		<SubMenu
          key="selectTemplate"
          title={
            <span>
              <Icon type="picture"/>
              <span id="selectTemplateSpan">选择模板</span>
            </span>
          }
        >
          <Menu.Item key="single">单波段single</Menu.Item>
          <Menu.Item key="multi">多波段multi</Menu.Item>
		</SubMenu>}

        <Menu.Item key="add-text">
          <IconFont type="icon-text"/>
          <span>添加文字</span>
        </Menu.Item>
      </Menu>

	  {dataSelect&&
	  
      <div className={styles.layerinput}>
		<Text strong className={styles.layertitle_block} >Layer_Input</Text>        
        { (dataSelect=="json"||dataSelect=="csv" )&&
			<div className={styles.layerinput_block}>
				<Select id="DataFields" className={styles.layerinput_block_son}  onChange={setLabelCheckedFalse} >
					{dataFieldsArray.map((v,k)=>(
						<Option value={v} >{v}</Option>
					))	}
				</Select>
				<Checkbox id="labelAdd"	onChange={addlabelClick} className={styles.layerinput_label} checked={labelChecked}>添加标记</Checkbox>
			</div>
		}
		
		{ (dataSelect=="tiff")&&

				<div className={styles.layerinput_block}>					 
					<Radio.Group onChange={radioChange} size="small" value={radioValue} buttonStyle="solid">
						<Radio.Button value={"black"}>Black</Radio.Button>
						<Radio.Button value={"green"}>Green</Radio.Button>
						<Radio.Button value={"purple"}>Purple</Radio.Button>						
						<Radio.Button value={"red"}>Red</Radio.Button>
						<Radio.Button value={"rainbow"}>Rainbow</Radio.Button>
					</Radio.Group>					
				</div>
		}			
        <Input id="DataName" addonBefore="DataName" className={styles.layerinput_block} defaultValue="data1" />
		<Input id="LayerName" addonBefore="LayerName"className={styles.layerinput_block} defaultValue="layer1" />
		
		<Button shape="circle" className={styles.layerbutton_block } onClick={buttonClick} type="primary"> OK</Button> 
		
		
	  </div>}
    </Sider>
  )
    ;
}

export default connect(({ onlineMapping }) => ({
  onlineMapping,
}))(TemplatePanel);
