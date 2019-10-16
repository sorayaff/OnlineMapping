import React, { useState, useEffect } from 'react';
import ReactMapboxGl, { Layer, Source, Feature, GeoJSONLayer,RotationControl,ScaleControl,MapContext } from 'react-mapbox-gl';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import LayerPanel from './components/LayerPanel';
import styles from './index.css';
import {fromJS} from 'immutable';
import MapSaverModal from './components/MapSaverModal/index';
import 'mapbox-gl/dist/mapbox-gl.css';
import { connect } from 'dva';

const { Header, Content, Footer, Sider } = Layout;

const MAPBOX_TOKEN =
  'pk.eyJ1Ijoid2F0c29ueWh4IiwiYSI6ImNrMWticjRqYjJhOTczY212ZzVnejNzcnkifQ.-0kOdd5ZzjMZGlah6aNYNg'; // Set your mapbox token here
const basemapStyle = {
  'light':'mapbox://styles/mapbox/light-v10',
  'dark':'mapbox://styles/mapbox/dark-v10',
  'satellite':'mapbox://styles/mapbox/satellite-v9',
  'outdoors':'mapbox://styles/mapbox/outdoors-v11',
  'street':'mapbox://styles/mapbox/streets-v11',
};
const MapboxMap = ReactMapboxGl({accessToken:MAPBOX_TOKEN,attributionControl:false});

function OnlineMapping(props) {
  const [_collapsed, setCollapsed] = useState(false);
  const [_mapStyleKey, setMapStyleKey] = useState('light');
  const initialControl = fromJS({'rotation':false,'scale':false});
  const [_control,setControl] = useState(initialControl);
  const [_map,setMap] = useState(null);
  const { dispatch } = props;

  const onCollapse = collapsed => {
    console.log(collapsed);
    setCollapsed(collapsed);
  };

  const onBasemapChange = mapStyleKey => {
    console.log(mapStyleKey);
    if(mapStyleKey){
      setMapStyleKey(mapStyleKey);
    }
  };
  const onControlsChange = (controlKey) => {
    setControl(_control.update(controlKey,v => !v));
    console.log(_control,_mapStyleKey)
  };
  const handleModalCancel = () => {
    dispatch({
      type: 'onlineMapping/setMapSaverModalVisible',
      payload: false
    });
  };

  return (
    <Layout className={styles.normal}>
      <LayerPanel
        collapsed={_collapsed}
        onCollapseChange={onCollapse}
        onBasemapChange = {onBasemapChange}
        onControlsChange = {onControlsChange}
        mapInstance = {_map}
      />
      <Layout>
        <Content className={styles.mapContainer}>
          <MapboxMap
            style={basemapStyle[_mapStyleKey]}
            containerStyle={{height:'100vh',width:'100%'}}
            zoom={[8]}>
            {_control.get('rotation') && <RotationControl/>}
            {_control.get('scale') && <ScaleControl/>}
            <MapContext.Consumer>
              { map => {
                setMap(map)
              }}
            </MapContext.Consumer>
          </MapboxMap>
        </Content>
      </Layout>
      <MapSaverModal
        visible = {props.mapSaverModalVisible}
        handleCancel={handleModalCancel}
      />
    </Layout>
  );
}

export default connect(({ onlineMapping }) => ({
  mapSaverModalVisible:onlineMapping.mapSaverModalVisible,
  onlineMapping,
}))(OnlineMapping);
