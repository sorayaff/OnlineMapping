import React, { Component } from 'react';
import {Icon} from 'antd'
import Link from 'umi/link'
import TDMap from '@components/TDMap';
import SelectLang from '@/components/SelectLang';
import styles from './index.less';
import DataTabs from './components/dataTabs';
import LeftPanel from '@components/LeftPanel';
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
      panelVisible: !!this.props.mapView.urlQuery.key,
    };
  }

  hidePanel = () => {
    this.setState({ panelVisible: false });
  };

  showPanel = () => {
    this.setState({ panelVisible: true });
  };

  render() {
    const { panelVisible } = this.state;
    return (
      <Authorized authority={['NORMAL', 'admin']} noMatch={noMatch}>
        <div className={styles.digitalmap_page}>
          <TDMap/>
          <div className={styles.header}>
            <Link to={{pathname: '/'}} title={"BACK TO HOME"}><Icon type="home" style={{fontSize:'20px',color:'white'}} /></Link>
            <SelectLang className ={styles.lang_box} />
          </div>
          <LeftPanel handleShow={this.showPanel} panelVisible={panelVisible}>
            <DataTabs handleClose={this.hidePanel} visible={panelVisible}/>
          </LeftPanel>
        </div>
      </Authorized>
    );
  }
}

export default MapView;
