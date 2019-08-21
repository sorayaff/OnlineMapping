import React, { Component } from 'react';
import TDMap from '@components/TDMap';
import styles from './index.less';
import {Icon,Tabs} from 'antd'
import RightPanel from '@components/RightPanel';
import LeftPanel from '@components/LeftPanel';
import Legend from '@components/Legend';

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
    const {dataSetList, updateData} = this.props;
    const {panelVisible}=this.state;
    const {TabPane}=Tabs;
    return (
      <div className={styles.digitalmap_page}>
        <TDMap dataset={dataSetList}
               updateData={updateData}/>
        <LeftPanel visible={panelVisible}
                   handleClose={this.hidePanel}/>
        {!panelVisible && <div onClick={this.showPanel} className={styles.showButton}><Icon type="more" /></div>}
        <RightPanel/>
        <Legend/>
      </div>
    );
  }
}
