import {Typography, Input, Select, Layout, Menu, Icon,  Button, Checkbox, Radio, Upload } from 'antd';

import React, { useState } from 'react';
import styles from './index.less';
import { connect } from 'dva';

const { Sider } = Layout;
const { SubMenu } = Menu;
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1225009_f39m3y74x5s.js',
});


function TemplatePanel(props) {

  const {  dispatch, mapAddData,  mapAddLayer, mapDeleteLayer, mapMoveLayer, dataFieldsSet, addLabel} = props;
  const dataFieldsArray = Array.from(dataFieldsSet);
  const ini_field = "---------";
  dataFieldsArray.splice(0, 0, ini_field);
  const [ labelChecked, setlabelChecked] = useState(false);
  const [ _openKeys, setOpenKeys] = useState('');
  const [ dataSelect, setData] = useState(null);
  const [ templateSelect, setTemplate] = useState(null);
  const [ layerManager, setManager] = useState(false);
  const [ radioValue, setRadioValue] = useState("black");
  const [ fieldValue, setFieldValue] = useState(ini_field);
 
  
  const setTemplateSelect = (e) =>{
		var str="选择模板";
		if(e) str=str+" ["+e+"]";	
		var obj=document.getElementById("selectTemplateSpan");
		if(obj) obj.innerHTML=str;
		setTemplate(e);
  }

  const setDataSelect = (e) =>{
		setTemplateSelect(null);
		var str="添加数据";
		if(e) str=str+" ["+e+"]";	  
		document.getElementById("addLayerSpan").innerHTML=str;
		setData(e);
  }
  const handleMenuClick = e => {
    if (e.keyPath.length > 1) {
       if (e.keyPath[1] === 'selectTemplate') {
         setTemplateSelect(e.keyPath[0]);
			if(e.keyPath[0]=== 'multi')radioChangeTough('multi'); else
			if(e.keyPath[0]=== 'single') radioChangeTough('black');	
       }else if (e.keyPath[1] === 'addLayer') {
		   setDataSelect(e.keyPath[0]);			   
	   }
    }else
    if (e.key === 'manager') {
      setManager(!layerManager);
    }
	setOpenKeys([]);
  };
  const handleMenuChange = openkeys => {
	if(openkeys.length)
	setOpenKeys([openkeys[openkeys.length-1]]);
	else setOpenKeys([]);
  }

  
  const addLayerClick= e =>{
	  var layerName=document.getElementById("LayerName").value;
	  if(!layerName){
		alert("图层名不能为空");
		return;
	  }
	  var others="";
	  var dataName=null;
	  if(dataSelect!=='tiff') 	{
		  dataName = document.getElementById("DataName").value;
		  others = document.getElementById("DataFields").innerText;
		  if(others === ini_field) others="";		  
	  }
	  else if(templateSelect==='single')
		  others = radioValue;
	  else if(templateSelect==='multi')
		  others = 'multi';
	  setLabelCheckedFalse();
	  mapAddLayer(templateSelect,
				  dataSelect,
				  dataName	,
				  layerName	,
				  others);
  }
  const deleteClick = e =>{	  
	  mapDeleteLayer(
		document.getElementById("LayerDelete").value,
		document.getElementById("TemplateDelete").innerText
	  ) ; 
  }  
  const moveClick = e =>{
	  mapMoveLayer(
		document.getElementById("LayerDelete").value,
		document.getElementById("TemplateDelete").innerText
	  ) ; 
  }
  const addlabelClick= e => {
	const field = document.getElementById("DataFields").innerText;
	if(field===ini_field) {
			alert("未选中字段");
			return;
	}	
	addLabel(document.getElementById("DataName").value,
			field,
			e.target.checked);
	setlabelChecked(e.target.checked);
  }
  const fieldChange = e => {
	  console.log(e);
	  setFieldValue(e);
	  setLabelCheckedFalse();	  
  }
  const setLabelCheckedFalse = e =>{
		if(labelChecked)
		setlabelChecked(false);
  }
  const radioChangeTough = (e) => {
	setRadioValue(e);
	console.log("radioChangeTough -> "+e );
  };
  const radioChange = e => {
      setRadioValue(e.target.value);
	  console.log("radioChange -> "+e.target.value );
  };
  
  let fileUploaded = null;
  const beforeUpload = file =>{
	 if(!document.getElementById("DataName").value){
		alert("数据名不能为空");
		return;
	 }
	 const reader = new FileReader();
	 reader.readAsText(file);
	 reader.onload = function(){		
		fileUploaded=reader.result;
	 }	  
  }
  const uploadChange= info => {	
	if (info.file.status === 'error')
		 alert("文件上传失败");
	else if (info.file.status === 'done') {
		 var name = info.file.name; 
		 var splitStr = name.split(".");
		 var format = splitStr[splitStr.length-1].toUpperCase();		
		
		 if( format !== dataSelect.toUpperCase() ){
			alert("上传文件格式不符");
			return;
		 }	 		 		 
		 fieldChange(ini_field);
		 mapAddData(document.getElementById("DataName").value, dataSelect, fileUploaded);	
		 fileUploaded = null;	 		 
	} 
	
 };
 
  const { Option  } = Select;
  const { Text }= Typography;


  return (
    <Sider width={210} className={styles.panel} >
      	  
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

		{ (dataSelect==="json"||dataSelect==="csv" )&&
		<SubMenu
          key="selectTemplate"
          title={
            <span>
              <Icon type="picture"/>
              <span id="selectTemplateSpan">添加图层</span>
            </span>
          }
        >
          <Menu.Item key="json-sym">符号图symbol</Menu.Item>
		  <Menu.Item key="json-con">连续分级图continuous</Menu.Item>
		  <Menu.Item key="json-dis">离散分级图discrete</Menu.Item>
          <Menu.Item key="heat">热力图heat</Menu.Item>
          <Menu.Item key="cluster">聚类图cluster</Menu.Item>
		</SubMenu>}

		{ (dataSelect==="tiff")&&
		<SubMenu
          key="selectTemplate"
          title={
            <span>
              <Icon type="picture"/>
              <span id="selectTemplateSpan">添加图层</span>
            </span>
          }
        >
          <Menu.Item key="single">单波段single</Menu.Item>
          <Menu.Item key="multi">多波段multi</Menu.Item>
		</SubMenu>}		
      </Menu>

	 {dataSelect&&

      <div className={styles.layerinput}>
		<Text strong className={styles.layerTitle_block} >添加数据与图层</Text>
		{ (dataSelect!=="tiff")&&//矢量数据 名称		 		
			<div className={styles.layerInput_block}>
				<Select 
					id="DataFields" 
					className={styles.layerInput_block_input} 
					value={fieldValue} 
					onChange={fieldChange} 
					style={{width:'100px'}}
				>
					{dataFieldsArray.map((v,k)=>(
						<Option value={v} >{v}</Option>
					))	}
				</Select>
				<Checkbox 
					id="labelAdd"	
					onChange={addlabelClick} 
					className={styles.layerInput_block_add} 
					checked={labelChecked}
					style={{width:'60px'}}				>
					标记
				</Checkbox>
				<Input id="DataName" addonBefore="数据名" className={styles.layerInput_block_input}  style={{width:'130px'}} />   
				<Upload showUploadList={false} beforeUpload={beforeUpload} onChange={uploadChange} >
					<Button className={styles.layerInput_block_add}  type="primary" style={{width:'30px'}} shape="circle"  >
						<Icon type="plus"/>
					</Button>
				</Upload>			
			</div>		  			
		}

		{ (dataSelect==="tiff")&&(templateSelect ==='single')&&  //栅格数据 单波段 色系
			<div className={styles.layerInput_block}>
				<Radio.Group onChange={radioChange}  value={radioValue} buttonStyle="solid" >
					<Radio.Button value={"black"}>Black</Radio.Button>
					<Radio.Button value={"green"}>Green</Radio.Button>
					<Radio.Button value={"red"}>Red</Radio.Button>
					<Radio.Button value={"purple"}>Purple</Radio.Button>					
					<Radio.Button value={"rainbow"}>Rainbow</Radio.Button>
				</Radio.Group>
			</div>
		}
    
		{ templateSelect &&
		  <div className={styles.layerInput_block}>
			<Input id="LayerName" addonBefore="图层名"className={styles.layerInput_block_input}style={{width:'130px'}}   />		
			<Button  className={styles.layerInput_block_add } onClick={addLayerClick} type="primary" 
				shape="circle" style={{width:'30px'}} >
				<Icon type="plus"/>			
			</Button>
		  </div>
		}
	  </div>}
	  
	  <Menu
        mode="inline"
        theme={'dark'}
        onClick={handleMenuClick}
		onOpenChange={handleMenuChange}
		openKeys={_openKeys}
      >
	    <Menu.Item key="manager">
			 <Icon type='form'/>
			<span>管理图层</span>
			<span className={styles.checkIcon}>
			{layerManager && <Icon type='check'/>}
			</span>
		</Menu.Item>
	  </Menu>
      {layerManager && <div className={styles.layerinput}>
		<div className={styles.layerInput_block}>			
			<Select id="TemplateDelete" className={styles.layerInput_block_input} style={{width:'100px'}}  >
				<Option value="json"   >json</Option>
				<Option value="heat"   >heat</Option>	
				<Option value="cluster">cluster</Option>
				<Option value="tiff"   >tiff</Option>
			</Select>	
			<Button shape="round" 
				type="primary"
				className={styles.layerInput_block_add}  
				style={{width:'60px'}}
				onClick={moveClick}  >
				置顶
			</Button>				
			<Input id="LayerDelete" addonBefore="图层名"className={styles.layerInput_block_input} style={{width:'130px'}}  />		
			<Button shape="circle" 
				className={styles.layerInput_block_add } 
				style={{width:'30px'}}
				onClick={deleteClick} 
				type="primary" >
				<Icon type='close'/>
			</Button>
		
		</div>	
	  </div>}

	  
    </Sider>
  )
    ;
}

export default connect(({ onlineMapping }) => ({
  onlineMapping,
}))(TemplatePanel);
