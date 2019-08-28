import React from 'react';
import styles from './index.less';
import { Icon, List, Tooltip, Button, Menu, Row, Avatar, Divider } from 'antd';
import ThemeCardList from './ThemeCardList';
import SelectLang from '@/components/SelectLang';
import HeaderDropdown from '@/components/HeaderDropdown';
import Link from 'umi/link';
import { formatMessage, setLocale, getLocale, FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { WelcomeDataSource, SatelliteDataSource, LinksDataSource } from '@/assets/data.source';
import ygzx_logo from '@/assets/home/ygzx_logo.png';
import reportDataSource from './timeLineContent';
import HorizontalTimeline from 'react-horizontal-timeline';
import SwipeableViews from 'react-swipeable-views';
import CustomPagination from './CustomPagination ';


const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];

@connect(({ global, login }) => ({
  currentUser: global.currentUser,
  pageTitle: global.pageTitle,
  login,
}))
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 6, //时间轴初始index
      previous: 5,
      loadMore: false,
    };

    this.dates = reportDataSource.map((entry) => entry.date); //时间轴节点
    console.log(getLocale());
  }


  handleLoadMore = () => {
    this.setState({
      loadMore: true,
    });
  };

  handlePackUp = () => {
    this.setState({
      loadMore: false,
    });
  };

  onMenuClick = ({ key }) => {
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      });
    }
  };


  render() {
    const {
      currentUser,
    } = this.props;
    let color = '#3fffff';
    const local = getLocale();

    if (currentUser) {
      let name = currentUser.username || 'User';
      let index = name.length % 4;
      color = colorList[index];
    }
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="logout">
          <Icon type="logout"/>
          <FormattedMessage id="menu.account.logout" defaultMessage="logout"/>
        </Menu.Item>
      </Menu>
    );

    this.reportData = reportDataSource.map((report, index) => {
      const xuyan1 = report.content.slice(0, 2);
      const xuyan2 = report.content;
      const { loadMore } = this.state;
      const xuyan = loadMore ? (
        <div>
          {xuyan2.map((item) => <p style={{ fontSize: '16px' }}>{item}<br/></p>)}
          <div
            style={{
              textAlign: 'center',
              marginTop: 12,
              marginBottom: 25,
              height: 32,
              lineHeight: '32px',
            }}
          >
            <Button onClick={this.handlePackUp}><FormattedMessage id='index.packUp'/></Button>
          </div>
        </div>
      ) : (
        <div>
          {xuyan1.map((item) => <p style={{ fontSize: '16px' }}>{item}<br/></p>)}
          <div
            style={{
              textAlign: 'center',
              marginTop: 12,
              marginBottom: 25,
              height: 32,
              lineHeight: '32px',
            }}
          >
            <Button onClick={this.handleLoadMore}><FormattedMessage id='index.loadMore'/></Button>
          </div>
        </div>
      );

      return (
        <div className='container' key={index}>
          <h1 style={{ textAlign: 'center' }}>{report.date + formatMessage({ id: 'index.annualReport' })}</h1>
          <hr/>
          {xuyan}
          <ThemeCardList year={report.date} dataSource={report.themeList}/>
          {/*<ReportPreviewList dataSource={report.reportList}/>*/}
          <hr/>
        </div>
      );
    });


    return (
      <>
        <div className={styles.home__main}>
          <div className={styles.home__main__welcomeCard}>
            <div className={styles.title__box}>
              {/*登录模块*/}
              <div style={{ float: 'right' }}>
                {currentUser ? (
                  <HeaderDropdown overlay={menu}>
                    <span className={`${styles.action} ${styles.account}`}>
                      <Avatar
                        style={{ backgroundColor: color }}
                        size="large"
                        className={styles.avatar}
                      >
                        {currentUser.username || 'User'}
                      </Avatar>
                      <span className={styles.name}>{currentUser.username}</span>
                    </span>
                  </HeaderDropdown>
                ) : (
                  <span>
                    <Link to={{ pathname: '/user/login' }}>login</Link><Divider type="vertical"/>
                    <Link to={{ pathname: 'user/register' }}>register</Link>
                  </span>
                )}
              </div>
              {/*语言选择*/}
              <div className={styles.selectLang}>
                <SelectLang/>
              </div>

              {/*网站logo*/}
              <span style={{ position: 'absolute', left: '30px' }}>
                <img src={ygzx_logo}/>
              </span>

              {/*网站title*/}
              {local === 'en-US' ?
                <span style={{ top: 120, position: 'absolute', right: 30, width: 900, fontSize: 50 }}>
                     Global remote sensing monitoring of ecological environment
                </span> :
                <span style={{ top: 120, position: 'absolute', right: 30 }}>
                  <p style={{ margin: 0, fontSize: 70, letterSpacing: 8 }}>全球生态环境遥感监测</p>
                  <p style={{ margin: 0, fontSize: 50, letterSpacing: 6 }}>年度报告</p>
              </span>}
            </div>
            {/*轮播展示*/}
            <CustomPagination/>
          </div>

          {/*年报部分*/}
          <div style={{ width: '90%', height: '100px', margin: '20px auto auto' }}>
            <HorizontalTimeline
              index={this.state.value}
              minEventPadding={50}
              maxEventPadding={60}
              indexClick={(index) => {
                this.setState({ value: index, previous: this.state.value });
              }}
              values={this.dates}/>
          </div>
          <div className='text-center'>
            <SwipeableViews
              index={this.state.value}
              onChangeIndex={(value, previous) => {
                this.setState({ value: value, previous: previous });
              }}
              resistance>
              {this.reportData}
            </SwipeableViews>
          </div>
        </div>

        {/*页脚版权声明*/}
        <footer className={styles.home_footer}>
          <div> Copyright <Icon type="copyright"/>The Institute of Remote Sensing and Digital Earth, Chinese Academy of
            Sciences
          </div>
        </footer>
        {/*<Footer/>*/}
      </>
    );
  }
}

export default Home;

