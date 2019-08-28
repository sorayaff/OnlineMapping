import styles from './index.less';
import React from 'react';
import { connect } from 'dva';
import Media from 'react-media';


class BasicLayout extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){
    this.props.dispatch({
      type: 'global/fetchUserAddress',
    })
    this.props.dispatch({
      type: 'global/fetchCurrentUser',
    });
  }

  handleLogout =()=>{
    this.props.dispatch({
      type: 'login/logout',
    });
  };

  render() {
    const {
      children,
      location: {pathname},
      currentUser
    } = this.props;
    const ignoreLayout = ['/user/login', '/user/register','/user/register-result'];
    return (
      <React.Fragment>
        {children}
      </React.Fragment>
    );
  }
}

export default connect(({ global, login }) => ({
  currentUser: global.currentUser,
  pageTitle: global.pageTitle,
  login,
}))(props => (
  <BasicLayout {...props}/>
));

