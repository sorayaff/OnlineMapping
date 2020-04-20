import styles from './index.less';
import React from 'react';
import { connect } from 'dva';


class BasicLayout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      children,
    } = this.props;
    return (
      <React.Fragment>
        {children}
      </React.Fragment>
    );
  }
}

export default connect(({ global }) => ({
  currentUser: global.currentUser,
  pageTitle: global.pageTitle,
}))(props => (
  <BasicLayout {...props}/>
));

