import React, { Component } from 'react';
import TDMap from '@components/TDMap';
import styles from './index.less';
import DataTabs from './components/dataTabs';
import Colormap from './components/colormap';
import LayerSlider from './components/layerSlider';
import LeftPanel from '@components/LeftPanel';
import Legend from '@/components/Legend'
import RenderAuthorized from '@/components/Authorized';
import { getAuthority } from '@/utils/authority';
import Redirect from 'umi/redirect';
import { connect } from 'dva';

const Authorized = RenderAuthorized(getAuthority());

const noMatch =
  <Redirect to={`/user/login?redirect=${window.location.href}`}/>;

@connect(({ mapView }) => ({
  mapView,
}))
class MapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      panelVisible: !!this.props.mapView.urlQuery,
    };
  }

  hidePanel = () => {
    this.setState({ panelVisible: false });
  };

  showPanel = () => {
    this.setState({ panelVisible: true });
  };

  closeLayerPlayer = () => {
    this.props.dispatch({
      type: 'mapView/closeLayerPlayer',
    });
  }
  ;


  render() {
    const { panelVisible } = this.state;
    const { dataSetList, layersForPlay, layerPlayerVisible } = this.props.mapView;
    return (
      <Authorized authority={['NORMAL', 'admin']} noMatch={noMatch}>
        <div className={styles.digitalmap_page}>
          <TDMap/>
          <LeftPanel handleShow={this.showPanel} panelVisible={panelVisible}>
            <DataTabs handleClose={this.hidePanel} visible={panelVisible}/>
          </LeftPanel>
          <Legend/>
          {/*<Colormap/>*/}
          {layerPlayerVisible && <LayerSlider handleClose={this.closeLayerPlayer} layers={layersForPlay}/>}
        </div>
      </Authorized>
    );
  }
}

export default MapView;
