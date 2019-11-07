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
} from 'react-mapbox-gl';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import LayerPanel from './components/LayerPanel';
import styles from './index.css';
import { fromJS } from 'immutable';
import canvg from 'canvg';
import MapSaverModal from './components/MapSaverModal/index';
import 'mapbox-gl/dist/mapbox-gl.css';
import { connect } from 'dva';
import Button from 'antd/lib/button';
import html2canvas from 'html2canvas';

const { Header, Content, Footer, Sider } = Layout;

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

function OnlineMapping(props) {
  const [_collapsed, setCollapsed] = useState(false);
  const [_mapStyleKey, setMapStyleKey] = useState('light');
  const initialControl = fromJS({ 'rotation': false, 'scale': false });
  const [_control, setControl] = useState(initialControl);
  const [_map, setMap] = useState(null);
  const [isPrint, setIsPrint] = useState(false);
  const map_ref = React.useRef(null);
  const { dispatch } = props;

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
      <Layout>
        <Content>
          <div className={styles.mapContainer} ref={map_ref}>
            <MapboxMap
              style={basemapStyle[_mapStyleKey]}
              containerStyle={{ height: '100vh', width: '100%' }}
              zoom={[8]}
            >
              {_control.get('rotation') && <RotationControl/>}
              {_control.get('scale') && <ScaleControl/>}
              <MapContext.Consumer>
                {map => {
                  setMap(map);
                }}
              </MapContext.Consumer>
            </MapboxMap>
          </div>
        </Content>
      </Layout>
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
