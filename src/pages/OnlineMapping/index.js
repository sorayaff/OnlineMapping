import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import ReactMapboxGl, {
  Layer,
  Source,
  Feature,
  GeoJSONLayer,
  RotationControl,
  ScaleControl,
  MapContext,
  ZoomControl,
  Marker
} from 'react-mapbox-gl';
import { Layout, Menu, Breadcrumb, Icon, Typography, Form, Col, Row } from 'antd';
import LayerPanel from './components/LayerPanel';
import TemplatePanel from './components/TemplatePanel';
import styles from './index.less';
import { fromJS } from 'immutable';
import MapSaverModal from './components/MapSaverModal/index';
import 'mapbox-gl/dist/mapbox-gl.css';
import { connect } from 'dva';
import MapLegend from './components/MapLegend/index';


const {  Content, Footer } = Layout;
const { Text } = Typography;

const MAPBOX_TOKEN =
  'pk.eyJ1Ijoid2F0c29ueWh4IiwiYSI6ImNrMWticjRqYjJhOTczY212ZzVnejNzcnkifQ.-0kOdd5ZzjMZGlah6aNYNg';
const basemapStyle = {
  'light': 'mapbox://styles/mapbox/light-v10',
  'dark': 'mapbox://styles/mapbox/dark-v10',
  'satellite': 'mapbox://styles/mapbox/satellite-v9',
  'outdoors': 'mapbox://styles/mapbox/outdoors-v11',
  'street': 'mapbox://styles/mapbox/streets-v11',
};
const MapboxMap = ReactMapboxGl({ accessToken: MAPBOX_TOKEN, attributionControl: false, preserveDrawingBuffer: true });


function OnlineMapping(props) {
  const [_collapsed, setCollapsed] = useState(false);
  const [_mapStyleKey, setMapStyleKey] = useState('light');
  const [_layerNames,setLayerNames] = useState([]);
  const [_dataNames,setDataNames] = useState([]);
  const initialControl = fromJS({ 'rotation': false, 'scale': false, 'zoom':false });
  const [_control, setControl] = useState(initialControl);
  const initialLegend = fromJS({ 'discrete': false, 'continuous':false });
  const [_legend, setLegend] = useState(initialLegend);
  const [_map, setMap] = useState(null);
  const map_ref = React.useRef(null);
  const { dispatch } = props;
  const [geojsonFields, setFields]=useState(new Set());
  
  const onCollapse = collapsed => {
    setCollapsed(collapsed);	
  };
  const onBasemapChange = mapStyleKey => {
    if (mapStyleKey) 
      setMapStyleKey(mapStyleKey);    
  };
  const onControlsChange = (controlKey) => {
    setControl(_control.update(controlKey, v => !v));
  };
  const onLegendChange = (e) => {	
	setLegend(_legend.update(e, v => !v));
  }
  
  const handleModalCancel = () => {
    dispatch({
      type: 'onlineMapping/setMapSaverModalVisible',
      payload: false,
    });
  };
  
  const onDataChange = (dataname) => {					//所有数据 显示于footer
    let newArray = new Set(_dataNames);
	if (newArray.has(dataname))
		newArray.delete(dataname);
	newArray.add(dataname);
    setDataNames(newArray);
	var textstring="";
	for (let item of newArray)
		textstring = textstring + item + "; ";  
    document.getElementById("FooterData").innerText = "Data: "+textstring+"| ";
  };
  const onLayerChange = (layername, addORdelete) => {	//所有图层 显示于footer
	let newArray = new Set(_layerNames);
	if (newArray.has(layername))
		newArray.delete(layername);	
	if (addORdelete)
		newArray.add(layername);
    setLayerNames(newArray);
	var textstring="";
	for (let item of newArray)
		textstring = textstring + item + "; ";  //1,2,3
	document.getElementById("FooterLayer").innerText = "Layer: "+textstring+"| ";
  };
  const onFieldsChange = (geoJson) => {		//将矢量数据的字段名称传递给 TemplatePanel
        if(geoJson === null) return;		
		try{
			let fields=new Set();		
			var name=Object.keys(geoJson.features[0].properties);
			for (var j=0; j<name.length;j++)
				fields.add(name[j]);			
			setFields(fields);
		}
	    catch(err){
			console.log(err);
			alert("读取文件失败");
		}	  
  };

  //判断是否存在该字段、该字段是否为数字属性
  //暂无用
  const findField = function(geoJson, field, callback) {	
	var name=Object.keys(geoJson.features[0].properties);	
	for(var j=0; j<name.length;j++)
	if(name[j]===field){
		var array=new Array();
		var count = 0;
		for(var i in geoJson.features){
			var obj = Object.values(geoJson.features[i].properties);
			if(obj[j] === "" || obj[j] === null || isNaN(obj[j]))
				count++;			//本字段不是数字的条目数
			else array.push(obj[j]);
		}
		if(array.length>count*10){	//确定本字段为数字属性
			/* array.sort(function(num1,num2){
				return num1-num2;
			})	*/					//排序
			callback(true);
			return;
		}	
		break;
	}
	callback(false);
  }

  const renderclustermap = (dataName,layerName,geoJson) =>{		
		let newArray = new Set(_layerNames);
		if(newArray.has(layerName+'-cluster')){
			alert("图层已存在，请修改图层名");
			return;
		}
		//聚类图的数据源需设置相关参数，因此加载一个新的数据源
		_map.addSource(dataName,  {
           'type': 'geojson',
           'data': geoJson,
		    'cluster': true,
			'clusterMaxZoom': 14,
			'clusterRadius': 40
        });
		_map.addLayer({		//聚类点
			'id': layerName+'-clusters',
			'type': 'circle',
			'source': dataName,
			'filter': ['has', 'point_count'],
			'paint': {
				'circle-color': [
					'step',['get', 'point_count'],
					'#51bbd6',
					10,'#f1f075',
					100,'#f28cb1'
				],
				'circle-radius': [
					'step',['get', 'point_count'],
					  10,
					10,20,
					100,30
				]
			}
		});
		_map.addLayer({		//聚类群数目
			'id': layerName+'-cluster-count',
			'type': 'symbol',
			'source': dataName,
			'filter': ['has', 'point_count'],
			'layout': {
				'text-field': '{point_count_abbreviated}',
				'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
				'text-size': 12
			}
		});
		_map.addLayer({		//非聚类点符号
			'id': layerName+'-unclustered-point',
			'type': 'circle',
			'source': dataName,
			'filter': ['!', ['has', 'point_count']],
			'paint': {
				'circle-color': '#11b4da',
				'circle-radius': 6,
				'circle-stroke-width': 1,
				'circle-stroke-color': '#fff'
			}
});
		onLayerChange(layerName+'-cluster', true);
	}
  const renderheatmap = (dataName,layerName) =>{	
		let newArray = new Set(_layerNames);
		if(newArray.has(layerName+'-heat')){
			alert("图层已存在，请修改图层名");
			return;
		}
		_map.addLayer({
			'id': layerName+'-heat',
			'type': 'heatmap',
			'source': dataName,
			'maxzoom': 20,
			'filter': ['==', '$type', 'Point'],
			'paint': {				
				'heatmap-intensity': [
					'interpolate',['linear'],
					['zoom'],0,1,20,3
				],
				'heatmap-radius': [
					'interpolate',['linear'],
					['zoom'],0,2,20,40
				],
				'heatmap-opacity': [
					'interpolate',['linear'],
					['zoom'],5,1,20,0
				]
			}
		});
		onLayerChange(layerName+'-heat', true);
	}
  const rendersymbolmap = (dataName,layerName) =>{
	let newArray = new Set(_layerNames);
	if(newArray.has(layerName+'-json')){
		alert("图层已存在，请修改图层名");
		return;
	}	
    _map.addLayer({		//线
	  'id': layerName+'-boundary',
	  'type': 'line',
	  'source': dataName,		  
	  'paint': {
		'line-color':  'rgb(100,100,100)',
		'line-width': 4
	  },
	  'filter': ['==', '$type', 'LineString']
	});
	_map.addLayer({     //点符号
			  'id': layerName+'-point',
			  'type': 'circle',
			  'source': dataName,
			  'paint': {
				'circle-radius': 6,
				'circle-color': 'rgb(100,100,100)'
			  },
			  //'filter':['all', ['==', '$type', 'Point'], ['!has', field] ]
			  'filter': ['==', '$type', 'Point']
			});
	_map.addLayer({		//面符号
	  'id': layerName+'-polygon',
	  'type': 'fill',
	  'source': dataName,
	  'paint': {
		'fill-color': 'rgb(255,140,140)',
		'fill-opacity': 0.4,
		'fill-outline-color': 'rgb(120,35,35)'
	  },
	  'filter': ['==', '$type', 'Polygon']
	});
	onLayerChange(layerName+'-json', true);	  
  }
  const renderjson = (dataName,layerName, field, circleradius, color) =>{
	let newArray = new Set(_layerNames);
	if(newArray.has(layerName+'-json')){
		alert("图层已存在，请修改图层名");
		return;
	}	
	_map.addLayer({		//线
		  'id': layerName+'-boundary',
          'type': 'line',
          'source': dataName,		  
          'paint': {
			'line-color':  'rgb(100,100,100)',
			'line-width': 4
		  },
          'filter': ['==', '$type', 'LineString']
        });										
	_map.addLayer({		//点分级
	  'id': layerName+"-point",
	  'type': 'circle',
	  'source': dataName,
	  'paint': {
		'circle-radius': circleradius,
		'circle-color': color
	  },
	  'filter':['all', ['==', '$type', 'Point'], ['has', field] ]
	});
	_map.addLayer({		//面分级
	  'id': layerName+'-polygon',
	  'type': 'fill',
	  'source': dataName,
	  'paint': {
		'fill-color': color	,
		'fill-outline-color': 'rgb(35,35,35)'
	  },
	  'filter':['all', ['==', '$type', 'Polygon'], ['has', field] ]
	});	
	onLayerChange(layerName+'-json', true);
  }
 
  const addLayer = (template,dataFormat,dataName,layerName,others) =>{
	if(!_map)return;
	
	if(dataFormat==='tiff')  { //others=color 需开启springboot项目服务器获得url
		if(_map.getLayer(layerName+'-tiff')){
			alert("图层已存在，请修改图层名");
			return;
		}
		var url="http://localhost:8080/{z}/{x}/{y}/"+others;
		_map.addLayer({
			"id":layerName+"-tiff",
			"type": "raster",
			'source': {'type': 'raster', 'tiles': [url]}
		})
		onLayerChange(layerName+'-tiff', true);
	}
	else{
		if(!dataName||!_map.getSource(dataName)) {
			alert("未找到此数据 或数据名为空");
			return;
		}        
		if(template==='heat')
			renderheatmap(dataName,layerName);	
		else if(template==='json-sym') 
			rendersymbolmap(dataName,layerName);
		
		else if(template==='json-dis'){//others=field
			if(!others){alert("未选中字段");return;}
			var CircleRadius=['step',['get',others],7,10,10,100,13,500,16];
			var color=['step',['get',others],'rgba(237,222,139,0.50)',10,'rgba(229,131,8,0.50)',100,'rgba(222,20,20,0.55)',500,'rgba(100,30,30,0.75)']
			renderjson(dataName,layerName,others,CircleRadius,color);
		}
		else if(template==='json-con'){//others=field
			if(!others){alert("未选中字段");return;}
			var CircleRadius=['interpolate',['linear'],['get',others],0,5,500,20];
			var color=['interpolate',['linear'],['get',others],	0,'rgba(237,222,139,0.7)',500,'rgba(100,30,30,0.9)'];		
			renderjson(dataName,layerName,others,CircleRadius,color);		
		}	
		else if(template==='cluster'){			
			var geoJsonData=_map.getSource(dataName)._data;
			dataName=dataName+"-cluster";
			//聚类图的数据源需设置相关参数，因此加载一个新的数据源
			renderclustermap(dataName,layerName,geoJsonData);
			onDataChange(dataName);		
		}
	 }
  }
  const moveLayer = (layerName,template) =>{		//置顶图层
	 if(!_map)return;
	  var num=0;
	  if(template==='json'){		 
		  if(_map.getLayer(layerName+'-polygon') ) {
			  _map.moveLayer(layerName+'-polygon');
			  num++;
		  }	  
		  if(_map.getLayer(layerName+'-boundary') ) {
			  _map.moveLayer(layerName+'-boundary');
			  num++;
		  }
		  if(_map.getLayer(layerName+'-point') )  {
			  _map.moveLayer(layerName+'-point');
			  num++;
		  }
		  
		  if(num)
			alert("成功置顶图层");
		  
	  }else 
	  if(template==='cluster'){
		  if(_map.getLayer(layerName+'-unclustered-point') ) {
			  _map.moveLayer(layerName+'-unclustered-point');
			  num++;
		  }
		  if(_map.getLayer(layerName+'-clusters') )	{
			  _map.moveLayer(layerName+'-clusters');
			  num++;
		  }
		  if(_map.getLayer(layerName+'-cluster-count') ) {
			  _map.moveLayer(layerName+'-cluster-count');
			  num++;
		  }
		  if(num)
			  alert("成功置顶图层");
		  
	  }else
	  if(template==='heat'){
		  layerName=layerName+'-heat';
		  if(_map.getLayer(layerName) ){
			  _map.moveLayer(layerName);
			  alert("成功置顶图层");
		  }		  
	  }else
	  if(template==='tiff'){
		  layerName=layerName+'-tiff';
		  if(_map.getLayer(layerName) ) {
			  _map.moveLayer(layerName);
			  alert("成功置顶图层");
		  }
	  }
  }
  const deleteLayer = (layerName,template) =>{		//删除图层
	  if(!_map)return;
	  var num=0;
	  if(template==='json'){	
		  if(_map.getLayer(layerName+'-polygon') ) {
			  _map.removeLayer(layerName+'-polygon');
			  num++;
		  }	  
		  if(_map.getLayer(layerName+'-point') )  {
			  _map.removeLayer(layerName+'-point');
			  num++;
		  }
		  if(_map.getLayer(layerName+'-boundary') ) {
			  _map.removeLayer(layerName+'-boundary');
			  num++;
		  }
		  if(num){
			onLayerChange(layerName+'-json', false);
			alert("成功删除图层");
		  }
	  }else 
	  if(template==='cluster'){
		  if(_map.getLayer(layerName+'-clusters') )	{
			  _map.removeLayer(layerName+'-clusters');
			  num++;
		  }
		  if(_map.getLayer(layerName+'-cluster-count') ) {
			  _map.removeLayer(layerName+'-cluster-count');
			  num++;
		  }
		  if(_map.getLayer(layerName+'-unclustered-point') ) {
			  _map.removeLayer(layerName+'-unclustered-point');
			  num++;
		  }
		  if(num){
			onLayerChange(layerName+'-clusters', false);
			alert("成功删除图层");
		  }
	  }else
	  if(template==='heat'){
		  layerName=layerName+'-heat';
		  if(_map.getLayer(layerName) ){
			  _map.removeLayer(layerName);
			  onLayerChange(layerName, false);
			  alert("成功删除图层");
		  }		  
	  }else
	  if(template==='tiff'){
		  layerName=layerName+'-tiff';
		  if(_map.getLayer(layerName) ) {
			  _map.removeLayer(layerName);
			  onLayerChange(layerName, false);
			  alert("成功删除图层");
		  }
	  }
  }
 
  const csvStr2json = function(data,callback){
	var fields=new Array();
	var col=data[0].length;
	for(var i=0;i<col;i++)fields[i]=data[0][i];
	var arr=new Array();
	arr.push('{"type": "FeatureCollection","features":[\n');
	var i=1;
	while (data[i][0] !== "" && data[i][0] !== null ) {			
		arr=arr+'{"type": "Feature",\n"geometry":{"type":"Point","coordinates":[';
		arr=arr+data[i][0]+','+data[i][1]+ ']},\n';
		arr=arr+'"properties":{\n'
		for (var j = 2; j < col; j++) {
			arr=arr+'"'+fields[j]+'":';	
			var a=data[i][j];
			if(a === "" || a === null || a.length<=(j+1===col) )
				arr=arr+'""'; 
			else if(isNaN(a))
				arr=arr+'"'+a+'"';
			else arr=arr+a;
			if(j+1<col)arr=arr+ ',\n';
		}
		i++;arr=arr+'}},\n';
	}
	arr=arr.slice(0,arr.length-2)+']}';	//把最后的逗号换行号去掉
	console.log(arr);
	try{
		var geoJson=JSON.parse(arr);
		callback(geoJson);		  
	}
	catch(err){
		alert("csv转换json失败");
		console.log(err);
		callback(null);
	}
  } 	
	
  const addDataSource = (dataName,geoJson) =>{
	    onFieldsChange(geoJson);		
		try{
			_map.addSource(dataName,   {
				'type': 'geojson',
				'data': geoJson
			});
			onDataChange(dataName);
			alert("成功添加数据");
		}
		catch(err){
			console.log(err);
			alert("添加数据失败");
		}
  }
  const addData = (dataName,dataformat,fileStr) => {
	if(fileStr===null)	return;
	if(!_map)return;	
	if(_map.getSource(dataName)) {
		alert("数据已存在，请修改数据名");
		return;
	}
	if(dataformat==='json') {
		try{
			var file=JSON.parse(fileStr);
			addDataSource(dataName,file);	
		}catch(err){
			console.log(err);
			alert("Json文件解析失败");
		}			
	}
	else if(dataformat==='csv')    {			
		var csv = fileStr.split("\n");
		var row = csv.length;   // + 1;			
		var col = csv[0].split(",").length;			
		var data = new Array(row); //先声明一维数组			
		for(var k=0;k<row;k++) {   
			data[k]=new Array(col);  							
			if(csv[k]===""||csv[k]===null||csv[k].length<2)break;
			var csvdata = csv[k].split(",");	
			if(csvdata===""||csvdata===null)break;		
			for(var j=0;j<col;j++)data[k][j]=csvdata[j]; 
		}	
		//对于换行符\n的切分导致的问题
		var lastField=data[0][col-1];
		data[0][col-1]=lastField.slice(0,lastField.length-1);
		
		//data：csv对应的二维数组, 通过函数csvStr2json得到geoJson
		csvStr2json(data,function(geoJson){
			addDataSource(dataName,geoJson);
		});
	}
  };
  const addLabel = (dataName,field,addORdelete) => {
	if(_map.getLayer(dataName+'-label'))
		  _map.removeLayer(dataName+'-label');
	 if(addORdelete){
		 if(field)			 
		 _map.addLayer({'id': dataName+'-label',
			  'type': 'symbol',
			  'source': dataName,
			  'layout': {
				'text-field': ['get', field],
				"text-offset": [0, 0.6],
				"text-anchor": "top"
			  },
		 });
		else alert("未选中字段");	
	 }		
  }

  useEffect(()=>{
    if(_map){	  
      setTimeout(function() {
        _map.resize();
		//$(".mapboxgl-ctrl").hide();
      },200)
    }
  },[_collapsed, _map]);

  
  return (
    <Layout className={styles.normal}>

      <LayerPanel
        collapsed={_collapsed}
        onCollapseChange={onCollapse}
        onBasemapChange={onBasemapChange}
        onControlsChange={onControlsChange}		
        mapControl={_control}
		onLegendChange={onLegendChange}
		legend={_legend}
        mapInstance={_map}
      />
	  <Layout >
        <Content>
          <div className={styles.mapContainer} ref={map_ref}>	         		
			<MapboxMap
              style={basemapStyle[_mapStyleKey]}
              containerStyle={{ height: '95vh', width: '100%' }}
              zoom={_map?[_map.getZoom()]:[3]}
              center={_map?_map.getCenter():[108,30]}
            >
              {_control.get('rotation') && <RotationControl/>}
              {_control.get('scale') && <ScaleControl/>}
              {_control.get('zoom') &&<ZoomControl/>}

              <MapContext.Consumer>
                {map => {
                  setMap(map);
                }}
              </MapContext.Consumer>
            </MapboxMap>
			
			<MapLegend
				style_bottom={'6vh'}
				legend_discrete={_legend.get('discrete')}
				legend_continuous={_legend.get('continuous')}		
			/>
		  </div>
        </Content>
		<Footer style={{ height: '5vh', width: '100%' }}>
			<Text id = "FooterData"  level={4} />
			<Text id ="FooterLayer" level={4} />made by LYX
		</Footer>
      </Layout>
      <TemplatePanel
        mapInstance={_map}
		mapAddData={addData}
		mapAddLayer={addLayer}
		mapDeleteLayer={deleteLayer}
		mapMoveLayer={moveLayer}
		dataFieldsSet={geojsonFields}
		addLabel={addLabel}
      />

      {props.mapSaverModalVisible &&
        <MapSaverModal
		  
          visible={true}
          mapPreview={_map}
		  legend={_legend}
          handleCancel={handleModalCancel}
        />
      }

    </Layout>
  );
}

export default connect(({ onlineMapping }) => ({
  mapSaverModalVisible: onlineMapping.mapSaverModalVisible,
  onlineMapping,
}))(OnlineMapping);
