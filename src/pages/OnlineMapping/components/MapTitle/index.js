import React from 'react';
import styles from './index.less';
import { connect } from 'dva';


function MapTitle(props){
  const { titleText } = props;
  return(
    <span  className={styles.title} >
      {titleText}
    </span>
  );
}
export default connect(({ onlineMapping }) => ({
  onlineMapping,
}))(MapTitle);
