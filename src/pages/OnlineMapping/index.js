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
import { Layout, Menu, Breadcrumb, Icon, Typography  } from 'antd';
import LayerPanel from './components/LayerPanel';
import TemplatePanel from './components/TemplatePanel';
import styles from './index.less';
import { fromJS } from 'immutable';
import canvg from 'canvg';
import MapSaverModal from './components/MapSaverModal/index';
import 'mapbox-gl/dist/mapbox-gl.css';
import { connect } from 'dva';
import Button from 'antd/lib/button';
import html2canvas from 'html2canvas';
import zheJiangGeoJson from '@/assets/zhejiang.json';
import earthquakecsv from '@/assets/earthquake.csv'
import Papa from 'papaparse'


const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

const MAPBOX_TOKEN =
  'pk.eyJ1Ijoid2F0c29ueWh4IiwiYSI6ImNrMWticjRqYjJhOTczY212ZzVnejNzcnkifQ.-0kOdd5ZzjMZGlah6aNYNg'; // Set your mapbox token here
const basemapStyle = {
  'light': 'mapbox://styles/mapbox/light-v10',
  'dark': 'mapbox://styles/mapbox/dark-v10',
  'satellite': 'mapbox://styles/mapbox/satellite-v9',
  'outdoors': 'mapbox://styles/mapbox/outdoors-v11',
  'street': 'mapbox://styles/mapbox/streets-v11',
};
const MapboxMap = ReactMapboxGl({ accessToken: MAPBOX_TOKEN, attributionControl: false, preserveDrawingBuffer: true });

 
function ElementReplace (id,property,textstring){
	 var obj= document.getElementById(id);
	 if(obj)
		 if(property=="value")
		 obj.value=textstring;
		 else if(property=="text")
		 obj.text=textstring;
		 else if(property=="innerText")
		 obj.innerText=textstring;
 }
function OnlineMapping(props) {
  const [_collapsed, setCollapsed] = useState(false);
  const [_mapStyleKey, setMapStyleKey] = useState('light');
  const [_layerNames,setLayerNames] = useState([]);
  const [_dataNames,setDataNames] = useState([]);
  const initialControl = fromJS({ 'rotation': false, 'scale': false, 'zoom':false });
  const [_control, setControl] = useState(initialControl);
  const [_map, setMap] = useState(null);
  const [isPrint, setIsPrint] = useState(false);
  const map_ref = React.useRef(null);
  const { dispatch } = props;
  const [geojsonFields, setFields]=useState(new Set());
  const onCollapse = collapsed => {
    console.log(collapsed);
    setCollapsed(collapsed);
  };
  const onBasemapChange = mapStyleKey => {
    console.log(mapStyleKey);
    if (mapStyleKey) {
      setMapStyleKey(mapStyleKey);
    }
  };
  const onControlsChange = (controlKey) => {
    setControl(_control.update(controlKey, v => !v));
    console.log(_control, _mapStyleKey);
  };
  const onDataChange = (dataname) => {			//Footer 数据相关
    let newArray = new Set(_dataNames);
	if(newArray.has(dataname))
		newArray.delete(dataname);
	newArray.add(dataname);
    setDataNames(newArray);
	var textstring="";
	for(let item of newArray)
		textstring=textstring+item+"; ";  //1,2,3
    ElementReplace("FooterData","innerText","Data: "+textstring+"| ");
  };
  const onLayerChange = (layername, addORdelete) => {		//Footer 图层相关
	let newArray = new Set(_layerNames);
	if(newArray.has(layername))
		newArray.delete(layername);	
	if(addORdelete)
		newArray.add(layername);
    setLayerNames(newArray);
	var textstring="";
	for(let item of newArray)
		textstring=textstring+item+"; ";  //1,2,3
    ElementReplace("FooterLayer","innerText","Layer: "+textstring+"| ");
  };
  const onFieldsChange = (fields) => {			//矢量数据 字段
      setFields(fields);
  };
  const handleModalCancel = () => {
    dispatch({
      type: 'onlineMapping/setMapSaverModalVisible',
      payload: false,
    });
  };


  const findField = function(geoJson, field, callback) {	
	var name=Object.keys(geoJson.features[0].properties);	
	for(var j=0; j<name.length;j++)
	if(name[j]===field){
		var array=new Array();
		var count = 0;
		for(var i in geoJson.features){
			var obj = Object.values(geoJson.features[i].properties);
			if(isNaN(obj[j])||obj[j] === "" || obj[j] == null)
				count++;				//非数字
			else array.push(obj[j]);
		}
		if(array.length>count*3){
			 array.sort(function(num1,num2){
				return num1-num2;
			})						//排序
			callback(array);
			return;
		}	
		break;
	}
	callback(new Array());	//返回空数组
  }

  const renderclustermap = (dataName,layerName,geoJson) =>{		
  if(_map.getLayer(layerName+'-clusters')){
		alert("Existed Layer");
		return;
	}
		_map.addSource(dataName,  {
           'type': 'geojson',
           'data': geoJson,
		    'cluster': true,
			'clusterMaxZoom': 14,
			'clusterRadius': 40
        });
		_map.addLayer({
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
		_map.addLayer({
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
		_map.addLayer({
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
		onLayerChange(layerName+'-clusters', true);
	}
  const renderheatmap = (dataName,layerName) =>{	
  if(_map.getLayer(layerName+'-heat')){
		alert("Existed Layer");
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
  const renderjson = (dataName,layerName, field) =>{
	if(_map.getLayer(layerName+'-json')){
		alert("Existed Layer");
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
		
	findField(_map.getSource(dataName)._data, field, function(array){				
	if(array.length < 5)	//判断此字段是否为数字字段
		field = "";			
	else {			
		_map.addLayer({		//分级图模板
		  'id': layerName+"-field",
		  'type': 'circle',
		  'source': dataName,
		  'paint': {
			'circle-radius': [
				'step',	['get',field],
				  7,  10,10, 100,13
			],
			'circle-color': [
				'step',	['get',field],
				//'interpolate',['linear'],[ field],
				'rgba(60,100,120,0.80)',
				10,'rgba(229,131,8,0.70)',
				100,'rgba(222,20,20,0.85)'
			]
		  },
		  'filter':['all', ['==', '$type', 'Point'], ['has', field] ]
		});
		_map.addLayer({		//多边形
		  'id': layerName+'-polygon',
          'type': 'fill',
          'source': dataName,
          'paint': {
			'fill-color': [
				'step',	['get',field],
				//'interpolate',['linear'],[ field],
				   'rgba(237,222,139,0.50)',
				10,'rgba(229,131,8,0.40)',
				100,'rgba(222,20,20,0.55)',
				500,'rgba(120,35,35,0.55)'
			]
          },
          'filter': ['==', '$type', 'Polygon']
        });
	}
        _map.addLayer({ //符号图模板
		  'id': layerName+'-point',
          'type': 'circle',
          'source': dataName,
          'paint': {
            'circle-radius': 6,
            'circle-color': 'rgb(100,100,100)'
          },
          'filter':['all', ['==', '$type', 'Point'], ['!has', field] ]
        });
		_map.addLayer({		//多边形
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
	});
	
	onLayerChange(layerName+'-json', true);
  }
 
  const moveLayer = (layerName,template) =>{
	 if(!_map)return;
	  var num=0;
	  if(template=='json'){		 
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
		  if(_map.getLayer(layerName+'-field') )  {
			  _map.moveLayer(layerName+'-field');
			  num++;
		  }
		  if(num)
			alert("Move Layer success");
		  
	  }else 
	  if(template=='cluster'){
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
			  alert("Move Layer success");
		  
	  }else
	  if(template=='heat'){
		  layerName=layerName+'-heat';
		  if(_map.getLayer(layerName) ){
			  _map.moveLayer(layerName);
			  alert("Move Layer success");
		  }		  
	  }else
	  if(template=='tiff'){
		  layerName=layerName+'-tiff';
		  if(_map.getLayer(layerName) ) {
			  _map.moveLayer(layerName);
			  alert("Move Layer success");
		  }
	  }
  }
  const deleteLayer = (layerName,template) =>{
	  if(!_map)return;
	  var num=0;
	  if(template=='json'){
		  if(_map.getLayer(layerName+'-polygon') ) {
			  _map.removeLayer(layerName+'-polygon');
			  num++;
		  }	  
		  if(_map.getLayer(layerName+'-field') )  {
			  _map.removeLayer(layerName+'-field');
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
			alert("Delete Layer success");
		  }
	  }else 
	  if(template=='cluster'){
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
			alert("Delete Layer success");
		  }
	  }else
	  if(template=='heat'){
		  layerName=layerName+'-heat';
		  if(_map.getLayer(layerName) ){
			  _map.removeLayer(layerName);
			  onLayerChange(layerName, false);
			  alert("Delete Layer success");
		  }		  
	  }else
	  if(template=='tiff'){
		  layerName=layerName+'-tiff';
		  if(_map.getLayer(layerName) ) {
			  _map.removeLayer(layerName);
			  onLayerChange(layerName, false);
			  alert("Delete Layer success");
		  }
	  }
  }
  const addLayer = (template,dataFormat,dataName,layerName,others) =>{
	if(_map){
		if( !_map.getSource(dataName) && dataFormat !='tiff') {
			alert("No data, Please add first");
			return;
		}        
		if(dataFormat==='tiff')  { //others=color
			 if(_map.getLayer(layerName+'-tiff')){
				alert("Existed Layer");
				return;
			}
			var url="http://localhost:8080/{z}/{x}/{y}/"+others;
			_map.addLayer({
				"id":layerName+"-tiff",
				"type": "raster",
				'source': {
					'type': 'raster',
					'tiles': [url]
					}
			})
			onLayerChange(layerName+'-tiff', true);
		}
		else if(template==='symbol') //others=field
			renderjson(dataName,layerName,others);
		else if(template==='heat')
			renderheatmap(dataName,layerName);
		else if(template==='cluster'){			
			var geoJsonData=_map.getSource(dataName)._data;
			dataName=dataName+"-cluster";
			renderclustermap(dataName,layerName,geoJsonData);
			onDataChange(dataName);		
		 }
	}
  }
  const addLabel = (dataName,field,addORdelete) => {
	 if(_map.getLayer(dataName+'-label'))
		  _map.removeLayer(dataName+'-label');
	 if(addORdelete)
	 _map.addLayer({'id': dataName+'-label',
          'type': 'symbol',
          'source': dataName,
          'layout': {
            'text-field': ['get', field],
            "text-offset": [0, 0.6],
            "text-anchor": "top"
          },
	 });
  }
 
  const csvStr2json = function(data,callback){
	var fields=new Array();
	var col=data[0].length;
	for(var i=0;i<col;i++)fields[i]=data[0][i];
	var arr=new Array();
	arr.push('{"type": "FeatureCollection","features":[\n');
	var i=1;
	while (data[i][0] != "" && data[i][0] != null ) {			
		arr=arr+'{"type": "Feature",\n"geometry":{"type":"Point","coordinates":[';
		arr=arr+data[i][0]+','+data[i][1]+ ']},\n';
		arr=arr+'"properties":{\n'
		for (var j = 2; j < col; j++) {
			arr=arr+'"'+fields[j]+'":';	
			var a=data[i][j];
			if(a == "" || a == null || a.length<=(j+1==col) )
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
		alert("csv to json fail");
		console.log(err);
		callback(null);
	}
  } 	
  const csv2Str = function(csv,callback){
	   Papa.parse(csv, {
		  download: true,
		  complete: function(results) {
			var data=results.data;
			//var callbackgeoJson = null;
			csvStr2json(data,function(callbackgeoJson){
				callback(callbackgeoJson);
			});		
		}
	  });
  }
  
  const addDataProcess = (dataName,geoJson) =>{
	  let s=new Set();
		if(geoJson == null) return;
		try{
			var name=Object.keys(geoJson.features[0].properties);
			for(var j=0; j<name.length;j++){
				s.add(name[j]);
			}	
			onFieldsChange(s);
		}
		catch(err){
			console.log(err);
			alert("read Field fail");
		}
		try{
			_map.addSource(dataName,   {
				'type': 'geojson',
				'data': geoJson
			});
			onDataChange(dataName);
			alert("Add Data Success");
		}
		catch(err){
			console.log(err);
			alert("add DataSource fail");
		}
  }
  const addData = (dataName,dataformat,file) => {
	if(!_map)return;
	if(_map.getSource(dataName)) {
		alert("Existed data");
		return;
	}
	if(dataformat==='json') {
		if(file==null)file=zheJiangGeoJson;
			else file=JSON.parse(file);
		addDataProcess(dataName,file);		
	}
	else if(dataformat==='csv')    {			
		if(file==null){				
			csv2Str(earthquakecsv,function(geoJson){
				addDataProcess(dataName,geoJson);
			});
			return;
		}
		var csv = file.split("\n");
		var row = csv.length + 1;			
		var col = csv[0].split(",").length;			
		var data = new Array(row); //先声明一维数组			
		for(var k=0;k<row;k++) {   
			data[k]=new Array(col);  							
			if(csv[k]==""||csv[k]==null||csv[k].length<2)break;
			var csvdata = csv[k].split(",");	
			if(csvdata==""||csvdata==null)break;		
			for(var j=0;j<col;j++)data[k][j]=csvdata[j]; 
		}	
		var lastField=data[0][col-1];
		data[0][col-1]=lastField.slice(0,lastField.length-1);
		csvStr2json(data,function(geoJson){
			addDataProcess(dataName,geoJson);
		});
	}
  };
  


  useEffect(()=>{
    if(_map){
      setTimeout(function() {
        _map.resize();
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
          visible={props.mapSaverModalVisible}
          mapPreview={_map}
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
