import React from 'react';
import styles from './index.less';
import { Icon, List, Tooltip, Button } from 'antd';
import ThemeCardList from './ThemeCardList';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import router from 'umi/router';
import { connect } from 'dva';
import { WelcomeDataSource, SatelliteDataSource, LinksDataSource } from '@/assets/data.source';
import ygzx_logo from '@/assets/home/ygzx_logo.png';
import ReportPreviewList from './ReportPreviewList';
import DataSetTagList from './DataSetTagList';
import reportDataSource from './timeLineContent';
import HorizontalTimeline from 'react-horizontal-timeline';
import SwipeableViews from 'react-swipeable-views';
import CoverflowEffect from './CoverflowEffect';
import { IconFont } from '@/utils/common';
import RouterWrapper from '@/pages/.umi/router';


@connect(({ home, loading }) => ({
  home,
}))
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      previous: 0,
      loadMore: false,
    };
    this.dates = reportDataSource.map((entry) => entry.date);
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
  }


  render() {
    this.reportData = reportDataSource.map((report, index) => {
      const xuyan1 = report.content.slice(0,2);
      const xuyan2 = report.content;
      const {loadMore} = this.state;
      const xuyan = loadMore ? (
        <div>
          {xuyan2.map((item) => <p style={{ fontSize: '16px' }}>{item}<br/></p>)}
          <div
            style={{
              textAlign: 'center',
              marginTop: 12,
              marginBottom:25,
              height: 32,
              lineHeight: '32px',
            }}
          >
            <Button onClick={this.handlePackUp}>pack up</Button>
          </div>
        </div>
      ) : (
        <div>
          {xuyan1.map((item) => <p style={{ fontSize: '16px' }}>{item}<br/></p>)}
          <div
            style={{
              textAlign: 'center',
              marginTop: 12,
              marginBottom:25,
              height: 32,
              lineHeight: '32px',
            }}
          >
            <Button onClick={this.handleLoadMore}>load more</Button>
          </div>
        </div>
      );
      return (
        <div className='container' key={index}>
          <h1 style={{ textAlign: 'center' }}>{report.title}</h1>
          <hr/>
          {xuyan}
          <ThemeCardList dataSource={report.themeList}/>
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
                  <span>
                    <img src={ygzx_logo}/>
                  </span>
              <span style={{ top: 120, position: 'relative', right: 30 }}>
                     Global remote sensing monitoring of ecological environment
                  </span>
            </div>
            {/*前言*/}

            <CoverflowEffect/>
          </div>

          {/*年报部分*/}
          <div style={{ width: '90%', height: '100px', margin: '0 auto' }}>
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

