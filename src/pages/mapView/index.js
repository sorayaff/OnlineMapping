import React, { Component } from 'react';
import TDMap from '@components/TDMap';
import styles from './index.less';
import DataTabs from  './components/dataTabs';
import Colormap from  './components/colormap';
import LeftPanel from '@components/LeftPanel';
import RenderAuthorized from '@/components/Authorized';
import {getAuthority} from '@/utils/authority'
import Redirect from 'umi/redirect';


const Authorized = RenderAuthorized(getAuthority());

const noMatch=<Redirect to={`/user/login?redirect=${window.location.href}`} />;

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
      <Authorized authority={['NORMAL','admin']} noMatch={noMatch}>
      <div className={styles.digitalmap_page}>
        <TDMap dataset={dataSetList}
               updateData={updateData}/>
        <LeftPanel  handleShow={this.showPanel} panelVisible={panelVisible}>
          <DataTabs handleClose={this.hidePanel} visible={panelVisible} />
        </LeftPanel>
        {/*<Colormap/>*/}
      </div>
      </Authorized>
    );
  }
}
