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
import chongqinggeoJson from '@/assets/chongqing.json';
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
function windowconfirm(s)
{
	var r=window.confirm(s);
	return r;
}
function windowalert(s)
{
	window.alert(s);	
}
 function onMousemove(e){
	 var text=JSON.stringify(e.lngLat);
	 console.log(text);
 }
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
  const onLayerChange = (layername) => {
	let newArray = new Set(_layerNames);  
	if(newArray.has(layername)){
		newArray.delete(layername); 
	}else
		newArray.add(layername); 
    setLayerNames(newArray);
	var textstring="";
	for(let item of newArray){
		textstring=textstring+item+"; ";  //1,2,3
	}
    ElementReplace("FooterText","innerText",textstring);
  };
  const onFieldsChange = (fields) => {
      setFields(fields);    
  };
  const handleModalCancel = () => {
    dispatch({
      type: 'onlineMapping/setMapSaverModalVisible',
      payload: false,
    });
  };
 

  const printImg = () => {
    // HTMLCanvasElement.prototype.getContext = function(origFn) {
    //   return function(type, attribs) {
    //     attribs = attribs || {};
    //     attribs.preserveDrawingBuffer = true;
    //     return origFn.call(this, type, attribs);
    //   };
    // }(HTMLCanvasElement.prototype.getContext);
    const elem = map_ref.current;
    let nodesToRecover = [];
    let nodesToRemove = [];
    $('.mapboxgl-map').find('svg').map(function(index, node) {
      let parentNode = node.parentNode;
      let svg = node.outerHTML.trim();
      let canvas = document.createElement('canvas');
      canvg(canvas, svg);
      if (node.style.position) {
        canvas.style.position += node.style.position;
        canvas.style.left += node.style.left;
        canvas.style.top += node.style.top;
      }
      nodesToRecover.push({
        parent: parentNode,
        child: node,
      });
      parentNode.removeChild(node);

      nodesToRemove.push({
        parent: parentNode,
        child: canvas,
      });
      parentNode.appendChild(canvas);
    });
    html2canvas(document.querySelector('.mapboxgl-map'), { useCORS: true })
      .then((canvas) => {
        let link = document.createElement('a');
        link.href = canvas.toDataURL('image/jpg');
        link.download = 'screenshot.jpg';
        link.click();
      });
  };
 

	const renderclustermap=(geoJson,dataName,layerName)=>{
    if (_map.getSource(dataName))// _map.removeSource('earthquakes');
	{		
		if(!windowconfirm("数据已存在，是否使用已有数据")) {return;}
		//else
	}else	
		_map.addSource(dataName,  {
           'type': 'geojson',
           'data': geoJson,
		    'cluster': true,
			'clusterMaxZoom': 14, 
			'clusterRadius': 50
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
					5,'#f1f075',
					10,'#f28cb1'
				],
				'circle-radius': [ 
					'step',['get', 'point_count'],
					10,5,20,10,30
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
				'circle-radius': 4,
				'circle-stroke-width': 1,
				'circle-stroke-color': '#fff'
			}
});	
		onLayerChange(layerName+'-clusters');
	}
	const renderheatmap=(geoJson,dataName,layerName)=>{
   if (_map.getSource(dataName))// _map.removeSource('earthquakes');
	{		
		if(!windowconfirm("数据已存在，是否使用已有数据")) {return;}
	}else	
		_map.addSource(dataName,       {
           'type': 'geojson',
           'data': geoJson,			
        });
		_map.addLayer({
			'id': layerName+'-heat',
			'type': 'heatmap',
			'source': dataName,
			'maxzoom': 19,
			'paint': {
				'heatmap-weight': [
					'interpolate',['linear'],
					['get', 'mag'],4.5,0,6.5,1
				],
				'heatmap-intensity': [
					'interpolate',['linear'],
					['zoom'],0,1,19,3
				],
				'heatmap-color': [
					'interpolate',['linear'],
					['heatmap-density'],
					0,'rgba(33,102,172,0)',
					0.2,'rgb(103,169,207)',
					0.4,'rgb(209,229,240)',
					0.6,'rgb(253,219,199)',
					0.8,'rgb(239,138,98)',
					1,'rgb(178,24,43)'
				],
				'heatmap-radius': [
					'interpolate',['linear'],
					['zoom'],0,10,19,40
				],
				'heatmap-opacity': [
					'interpolate',['linear'],
					['zoom'],7,1,19,0
				]
			}
		});
		_map.addLayer({
			'id': layerName+'-heatpoint',
			'type': 'circle',
			'source':dataName,
			'minzoom': 7,
			'paint': {
				'circle-radius': [
					'interpolate',['linear'],['zoom'],
					7,['interpolate', ['linear'], ['get', 'mag'], 1, 1, 6, 4],
					16,['interpolate', ['linear'], ['get', 'mag'], 1, 5, 6, 50]
				],
				'circle-color': [
					'interpolate',['linear'],['get', 'mag'],
					1,'rgba(33,102,172,0)',2,'rgb(103,169,207)',3,'rgb(209,229,240)',
					4,'rgb(253,219,199)',5,'rgb(239,138,98)',6,'rgb(178,24,43)'
				],
				'circle-stroke-color': 'white',
				'circle-stroke-width': 1,
				'circle-opacity': [
					'interpolate',['linear'],['zoom'],
					7,0,8,1
				]
			}
		});
		onLayerChange(layerName+'-heat');
	}
	const renderjson=(geoJson,dataName,layerName)=>{
	if (_map.getSource(dataName))// _map.removeSource('earthquakes');
	{		
		if(!windowconfirm("数据已存在，是否使用已有数据")) {return;}
	}else	
	_map.addSource(dataName,       {
           'type': 'geojson',
           'data': geoJson
        });
	
        _map.addLayer({'id': layerName+'-boundary',
          'type': 'fill',
          'source': dataName,
          'paint': {
            'fill-color': '#FF8888',
            'fill-opacity': 0.4
          },
          'filter': ['==', '$type', 'Polygon']
        });
        _map.addLayer({'id': layerName+'-point-mag',
          'type': 'circle',
          'source': dataName,
          'paint': {
            'circle-radius': [
				'step',['get', 'mag'],
				5,
				3,7,
				5,11
			],
			'circle-color': [
				'step',	['get','mag'],
				'rgba(244,208,0,0.5)',
				3,'rgba(229,131,8,0.7)',
				5,'rgba(253,20,0,1.0)'
				
			]
          },
          'filter': ['has', 'mag']
        });
		
        _map.addLayer({'id': layerName+'-point',
          'type': 'circle',
          'source': dataName,
          'paint': {
            'circle-radius': 6,
            'circle-color': 'rgb(3,100,100)'
          },
          'filter': ['!', ['has', 'mag']],
        });
       
		onLayerChange(layerName+'-json');
  }	

  const csv2json=function(csv,callback){
	   Papa.parse(csv, {
		  download: true,
		  complete: function(results) {	 	
			var data=results.data;
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
					if(isNaN(data[i][j])||data[i][j] === "" || data[i][j] == null)
						arr=arr+'"'+data[i][j]+'"';
					else arr=arr+data[i][j]; 
					if(j+1<col)arr=arr+ ',\n';
				}
				i++;arr=arr+'}},\n';				
			}
			arr=arr.slice(0,arr.length-2)+']}';	//把最后的逗号换行号去掉
			//console.log(arr);
			var geoJson=JSON.parse(arr);
			callback(geoJson);
		}
	  });
  }
 
  var templateStyle,dataFormat,dataName,layerName;
  const selecttemplate=(e,dataformat,dataname,layername,color)=>{
	  dataName=dataname;
	  layerName=layername;
	  templateStyle=e;	  
	  dataFormat=dataformat;
	  
	  if(_map){
		if(dataformat==='json') {
			var geoJson=chongqinggeoJson;
			process(geoJson);
		}
		else if(dataformat==='csv')      {
			csv2json(earthquakecsv,function(geoJson){
				process(geoJson);
			}); 
		}
		else  if(dataformat==='tiff')  {
			var url="http://localhost:8080/{z}/{x}/{y}/"+color
			_map.addLayer({
            "id":layerName,
            "type": "raster",
            'source': {
                'type': 'raster',
                'tiles': [url]
				}
			})
			onLayerChange(layerName+'-'+color);
		}			
	}
  }	
  const process=(geoJson)=>{
	  let s=new Set();	
		for(var i in geoJson.features)
		{
			var name=Object.keys(geoJson.features[i].properties);
			for(var j=0; j<name.length;j++){
				s.add(name[j]); 
			}
		}
		onFieldsChange(s);
		if (templateStyle === 'cluster') renderclustermap(geoJson,dataName,layerName);
		else if (templateStyle === 'heat') renderheatmap(geoJson,dataName,layerName);
		else if (templateStyle === 'symbol') renderjson(geoJson,dataName,layerName);
		else windowalert("未选择模板");		
  }
  const addlayer = (e) => {
    
  };

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
              //onMouseMove={onMousemove}
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
			<Text id="FooterText" level={4} />made by LYX
		</Footer>
      </Layout>
      <TemplatePanel
        mapInstance={_map} 
		mapAddlayer={addlayer}
		mapSelectTemplate={selecttemplate}
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
