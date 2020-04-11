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
  const [ labelChecked, setlabelChecked] = useState(false);
  const [ _openKeys, setOpenKeys] = useState('');
  const [ dataSelect, setData] = useState(null);
  const [ templateSelect, setTemplate] = useState(null);
  const [ radioValue, setRadioValue] = useState("black");
  const [ fieldValue, setFieldValue] = useState("");
 
  
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

 
 
  const addDataFile = (e) =>{	  
	  mapAddData(document.getElementById("DataName").value, dataSelect, e);	  
  }  
  
  const addLayerClick= e =>{
	  var others;
	  var dataName=null;
	  if(dataSelect!='tiff') 	{
		  others = document.getElementById("DataFields").innerText;
		  dataName = document.getElementById("DataName").value;
	  }
	  else if(templateSelect=='single')
		  others = radioValue;
	  else if(templateSelect=='multi')
		  others = 'multi';
	  setLabelCheckedFalse();
	  mapAddLayer(templateSelect,
				  dataSelect,
				  dataName	,
			document.getElementById("LayerName").value,
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
	setlabelChecked(e.target.checked);

	addLabel(document.getElementById("DataName").value,
			document.getElementById("DataFields").innerText,e.target.checked);
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
	 const reader = new FileReader();
	 reader.readAsText(file);
	 reader.onload = function(){		
		fileUploaded=reader.result;
	 }	  
  }
  const uploadChange= info => {	
  
	if (info.file.status === 'done') {
		 var name = info.file.name; 
		 var splitStr = name.split(".");
		 var format = splitStr[splitStr.length-1].toUpperCase();		
		
		 if( format!= dataSelect.toUpperCase() ){
			alert("上传文件格式不符");
			return;
		 }	 		 		 
		 fieldChange();
		 addDataFile(fileUploaded);	
		 fileUploaded = null;	 		 
	} else if (info.file.status === 'error') {
		  alert("upload file failed, now use the sample file");
		  addDataFile(null);	
	}
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

      </Menu>

	 {dataSelect&&

      <div className={styles.layerinput}>
		<Text strong className={styles.layerTitle_block} >Layer_Add</Text>
		{ (dataSelect!="tiff")&&//矢量数据 名称		 		
			<div className={styles.layerInput_block}>
				<Select id="DataFields" className={styles.layerInput_block_input} value={fieldValue} onChange={fieldChange} >
					{dataFieldsArray.map((v,k)=>(
						<Option value={v} >{v}</Option>
					))	}
				</Select>
				<Checkbox id="labelAdd"	onChange={addlabelClick} className={styles.layerInput_block_add} checked={labelChecked}>添加标记</Checkbox>
				<Input id="DataName" addonBefore="DataName" className={styles.layerInput_block_input} defaultValue="data1" />   
				<Upload showUploadList={false} beforeUpload={beforeUpload} onChange={uploadChange} >
					<Button shape="round" className={styles.layerInput_block_add}  type="primary" >AddData</Button>
				</Upload>			
			</div>		  			
		}

		{ (dataSelect=="tiff")&&(templateSelect =='single')&&  //栅格数据 单波段 色系
			<div className={styles.layerInput_block}>
				<Radio.Group onChange={radioChange} size="small" value={radioValue} buttonStyle="solid" >
					<Radio.Button value={"black"}>Black</Radio.Button>
					<Radio.Button value={"green"}>Green</Radio.Button>
					<Radio.Button value={"purple"}>Purple</Radio.Button>
					<Radio.Button value={"red"}>Red</Radio.Button>
					<Radio.Button value={"rainbow"}>Rainbow</Radio.Button>
				</Radio.Group>
			</div>
		}
    
		{ templateSelect &&
		  <div className={styles.layerInput_block}>
			<Input id="LayerName" addonBefore="LayerName"className={styles.layerInput_block_input} defaultValue="layer1" />		
			<Button shape="round" className={styles.layerInput_block_add } onClick={addLayerClick} type="primary">AddLayer</Button>
		  </div>
		}
	  </div>}
	  
      <div className={styles.layerinput}>
		<Text strong className={styles.layerTitle_block} >Layer_Delete</Text>
		<div className={styles.layerInput_block}>			
			<Select id="TemplateDelete" className={styles.layerInput_block_input}   >
				<Option value="json"   >json</Option>
				<Option value="heat"   >heat</Option>	
				<Option value="cluster">cluster</Option>
				<Option value="tiff"   >tiff</Option>
			</Select>	
			<Button shape="round" className={styles.layerInput_block_add } onClick={deleteClick} type="primary">Delete</Button>			
			<Input id="LayerDelete" addonBefore="LayerName"className={styles.layerInput_block_input} defaultValue="layer1" />	
			<Button shape="round" className={styles.layerInput_block_add}  onClick={moveClick} type="primary" >MoveTop</Button>				
		
		</div>	
	  </div>

	  
    </Sider>
  )
    ;
}

export default connect(({ onlineMapping }) => ({
  onlineMapping,
}))(TemplatePanel);
