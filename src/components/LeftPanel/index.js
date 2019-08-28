import React, { PureComponent } from 'react';
import {Icon } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

class LeftPanel extends PureComponent {

  render() {
    const { handleShow,panelVisible,children } = this.props;
    return (
      <div className={styles.leftPanel_main}>
        {!panelVisible && <div onClick={handleShow} className={styles.toggle_btn}><Icon type="more"/></div>}
          <div>
          {children}
        </div>
      </div>
    );
  }
}

export default LeftPanel;

