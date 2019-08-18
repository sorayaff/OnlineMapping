import React from 'react';
import styles from './index.less';
import { Col, Row, Icon, List, Tooltip, Carousel } from 'antd';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import router from 'umi/router';
import { connect } from 'dva';
import { WelcomeDataSource, SatelliteDataSource, LinksDataSource } from '@/assets/data.source';
import banner from '@/assets/home/banner2.png';
import ygzx_logo from '@/assets/home/ygzx_logo.png';
import touxiang from '@/assets/home/touxiang.jpg';
import ReportPreviewList from './ReportPreviewList';
import DataSetTagList from './DataSetTagList';
import reportDataSource from './timeLineContent';
import HorizontalTimeline from 'react-horizontal-timeline';
import SwipeableViews from 'react-swipeable-views';
import CoverflowEffect from './CoverflowEffect'
import ReactIdSwiperCustom from 'react-id-swiper/lib/ReactIdSwiper.custom';
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
    };
    this.reportData = reportDataSource.map((report, index) => {
      return (
        <div className='container' key={index}>
          <h1 style={{textAlign:'center'}}>{report.title}</h1>
          <hr/>
          <DataSetTagList dataSource={SatelliteDataSource} linkedDataset={report.linkedDataSets}/>
          <ReportPreviewList dataSource={report.reportList}/>
          <hr/>
        </div>
      );
    });
    this.dates = reportDataSource.map((entry) => entry.date);
  }



  render() {
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
            {/*<div>*/}
            {/*  <Row>*/}
            {/*    <Col span={6}>*/}
            {/*      <div style={{ cursor: 'pointer' }}>*/}
            {/*        <img className={styles.banner} src={touxiang}/>*/}
            {/*      </div>*/}
            {/*    </Col>*/}
            {/*    <Col span={18}>*/}
            {/*      <div style={{ wordWrap: 'break-word', lineHeight: '25px' }}>*/}
            {/*        <p>*/}
            {/*          在当前全球性生态环境问题日益突出的背景下，中国政府高度重视生态环境的保护和建设，提出了生态文明建设的战略目标，在科学研究、政策制定和行动落实等层面动员和集聚了大量社会资源，致力于中国和全球生态环境的研究和保护。作为重要的技术保障措施，中国逐步建立了气象、资源、环境和海洋等地球观测卫星及其应用系统，其观测能力很大程度上满足了中国在环境、资源和减灾等方面对地球观测数据的需要。同时，作为国际地球观测组织（GEO）的创始国和联合主席国，通过GEO合作平台，中国正在努力向世界开放共享其全球地球观测数据，提供相关的信息产品和服务。*/}
            {/*        </p>*/}
            {/*        <p>*/}
            {/*          为积极应对全球变化，在中国参加GEO工作部际协调小组的领导和财政部的支持下，科学技术部于2012年启动了全球生态环境遥感监测年度报告工作。为保证年度报告工作的高效组织和报告质量，国家遥感中心（GEO中国秘书处）与遥感科学国家重点实验室通过共同组建生态环境遥感研究中心，建立起了年度报告工作的长效机制，跨部门组织国内优势科研团队参与年度报告数据生产和编写，分别成立了顾问组、专家组和编写组，从组织、人力和技术上保障了年度报告工作的有序、高效开展。2013年5月，科技部首次向国内外正式公开发布了《全球生态环境遥感监测2012年度报告》，这是我国遥感科技界第一次向全球发出中国的声音，产生了广泛和良好的影响，被誉为开创性工作。此后，确定了将每年的世界环境日（6月5日）作为年度报告的发布时间，以引起全社会更多人对环境保护的重视，让公众了解中国遥感科技界面向解决全球生态环境问题所做的工作。*/}
            {/*        </p>*/}
            {/*      </div>*/}
            {/*    </Col>*/}
            {/*  </Row>*/}
            {/*</div>*/}
          </div>

          {/*年报部分*/}
          <div style={{ width: '90%', height: '100px', margin: '0 auto' }}>
            <HorizontalTimeline
              index={this.state.value}
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

