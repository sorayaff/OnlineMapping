import React, { Component } from 'react';
import TDMap from '@/components/TDMap';
import styles from './index.less';
import { Icon, Tabs } from 'antd';
import RightPanel from '@/components/RightPanel';
import LeftPanel from '@/components/LeftPanel';
import Legend from '@/components/Legend';
import RenderAuthorized from '@/components/Authorized';
import { getAuthority } from '@/utils/authority';
import Redirect from 'umi/redirect';

const Authorized = RenderAuthorized(getAuthority());

const noMatch = <Redirect to={`/user/login?redirect=${window.location.href}`}/>;

export default class MapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      panelVisible: false,
    };
  }


  hidePanel = () => {
    this.setState({ panelVisible: false });
  };
  showPanel = () => {
    this.setState({ panelVisible: true });
  };

  render() {
    const { dataSetList, updateData } = this.props;
    const { panelVisible } = this.state;
    const { TabPane } = Tabs;
    return (
      <Authorized authority={['NORMAL', 'admin']} noMatch={noMatch}>
        <div className={styles.digitalmap_page}>
          <TDMap dataset={dataSetList}
                 updateData={updateData}/>
          <LeftPanel visible={panelVisible}
                     handleClose={this.hidePanel}/>
          {!panelVisible && <div onClick={this.showPanel} className={styles.showButton}><Icon type="more"/></div>}
          <RightPanel/>
          <Legend/>
        </div>
      </Authorized>
    );
  }
}
