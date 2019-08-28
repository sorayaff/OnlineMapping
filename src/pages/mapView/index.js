import React, { Component } from 'react';
import TDMap from '@components/TDMap';
import styles from './index.less';
import DataTabs from  './components/dataTabs';
import Colormap from  './components/colormap';
import LeftPanel from '@components/LeftPanel';

export default class MapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      panelVisible: false
    };
  }

  hidePanel=()=>{
    this.setState({panelVisible:false})
  };

  showPanel=()=>{
    this.setState({panelVisible:true})
  };

  render() {
    const {panelVisible} = this.state;
    const { dataSetList, updateData } = this.props;
    return (
      <div className={styles.digitalmap_page}>
        <TDMap/>
        <LeftPanel  handleShow={this.showPanel} panelVisible={panelVisible}>
          <DataTabs handleClose={this.hidePanel} visible={panelVisible} />
        </LeftPanel>
        {/*<Colormap/>*/}
      </div>
    );
  }
}
