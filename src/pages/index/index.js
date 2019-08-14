import React from 'react';
import styles from './index.less';
import { Col, Row, Icon, List, Tooltip, Carousel } from 'antd';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import router from 'umi/router';
import { connect } from 'dva';
import Tmartcard from '@/components/TMartCard'
import { WelcomeDataSource, SatelliteDataSource, LinksDataSource } from '@/assets/data.source';
import banner from '@/assets/home/banner2.png';
import ygzx_logo from '@/assets/home/ygzx_logo.png';
import touxiang from '@/assets/home/touxiang.jpg';
import tx from '@/assets/home/tx.png';
import { IconFont } from '@/utils/common';
import RouterWrapper from '@/pages/.umi/router';

@connect(({ home, loading }) => ({
  home,
}))
class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  //绘制产品介绍入口卡片
  renderSatellitCard = ({ name, imgSrc, key, haveLink }) => {
    return <Col xs={12} sm={12} md={12} lg={12} xl={6} key={name}>
      <div className={styles.satelliteCard}>
        {haveLink ? <Link to={{ pathname: '/satellites', query: { key: key } }}>
            <img src={imgSrc} alt={name}/>
          </Link> :
          <Tooltip title={'waiting for implementation '}>
            <img src={imgSrc} alt={name}/>
          </Tooltip>}
      </div>
    </Col>;
  };


  render() {
    const { newsDataSource } = this.props.home;
    const { achieveDataSource } = this.props.home;
    var style = {
      width: '800px',
      height: '200px'
    };
    var stops = [
      {offset: 0.0, color: '#f00', opacity: 1.0},
      {offset: 0.5, color: '#fff', opacity: 1.0},
      {offset: 1.0, color: '#0f0', opacity: 1.0}
    ];
    var onChangeCallback = function onChangeCallback(colorStops, colorMap) {
      // colorStops: an array of color stops
      // colorMap: a d3 linear scale function
      // how to get the mapped color:
      // var mappedColor = colorMap(0.8);
    }

    function changeHandler(colors) {
      console.log(colors);
    }



    return (
      <>
        <div className={styles.home__main}>
          <div className={styles.home__main__welcomeCard}>
            <div className={styles.title__box}>
                  <span>
                    <img src={ygzx_logo}/>
                  </span>
              <span style={{ top: 120, position: 'relative' ,right:30}}>
                     Global remote sensing monitoring of ecological environment
                  </span>

            </div>
            {/*前言*/}
            <div>
              <Row>
                <Col span={6}>
                  <div style={{ cursor: 'pointer' }}>
                    <img className={styles.banner} src={touxiang}/>
                  </div>
                </Col>
                <Col span={18}>
                  <div style={{wordWrap:'break-word',lineHeight:'25px'}}>
                    <p>
                      在当前全球性生态环境问题日益突出的背景下，中国政府高度重视生态环境的保护和建设，提出了生态文明建设的战略目标，在科学研究、政策制定和行动落实等层面动员和集聚了大量社会资源，致力于中国和全球生态环境的研究和保护。作为重要的技术保障措施，中国逐步建立了气象、资源、环境和海洋等地球观测卫星及其应用系统，其观测能力很大程度上满足了中国在环境、资源和减灾等方面对地球观测数据的需要。同时，作为国际地球观测组织（GEO）的创始国和联合主席国，通过GEO合作平台，中国正在努力向世界开放共享其全球地球观测数据，提供相关的信息产品和服务。
                    </p>
                    <p>
                      为积极应对全球变化，在中国参加GEO工作部际协调小组的领导和财政部的支持下，科学技术部于2012年启动了全球生态环境遥感监测年度报告工作。为保证年度报告工作的高效组织和报告质量，国家遥感中心（GEO中国秘书处）与遥感科学国家重点实验室通过共同组建生态环境遥感研究中心，建立起了年度报告工作的长效机制，跨部门组织国内优势科研团队参与年度报告数据生产和编写，分别成立了顾问组、专家组和编写组，从组织、人力和技术上保障了年度报告工作的有序、高效开展。2013年5月，科技部首次向国内外正式公开发布了《全球生态环境遥感监测2012年度报告》，这是我国遥感科技界第一次向全球发出中国的声音，产生了广泛和良好的影响，被誉为开创性工作。此后，确定了将每年的世界环境日（6月5日）作为年度报告的发布时间，以引起全社会更多人对环境保护的重视，让公众了解中国遥感科技界面向解决全球生态环境问题所做的工作。
                    </p>
                  </div>
                </Col>
              </Row>
            </div>
            {/*大图*/}

          </div>



          <div className={styles.timeLine__box}>
            <br/>
            <ul className={styles.time__horizontal}>
              <li><b></b>2012</li>
              <li><b></b>2013</li>
              <li><b></b>2014</li>
              <li style={{ fontSize: '30px' }}><b></b>2015</li>
              <li><b></b>2012</li>
              <li><b></b>2013</li>
              <li><b></b>2014</li>
              <li><b></b>2015</li>
            </ul>
            <br/>
          </div>

          <div className={styles.home__main__left__satellites}>
            <Row type="flex" justify="space-around" aligh="middle" gutter={{ xs: 16, sm: 16, md: 16, lg: 16 }}>
              {SatelliteDataSource.map((item) => <Tmartcard cardData={item} key={item.id} />)}
            </Row>
          </div>
          {/*新闻简览*/}
          <div className={styles.home__main__left__news}>
            <div className={styles.home__main__left__news__header}>
              <Icon type="notification"/> &nbsp;<span>{formatMessage({ id: 'app.home.newsCard.title' })}</span>
              {/*<Search className={styles.news__search} placeholder="Search" onChange={this.handleSearchChange}/>*/}
              <span className={styles.news__all}
                    onClick={() => (router.push('/news'))}>{formatMessage({ id: 'app.home.newsCard.all' })}
                <Icon type="right"/></span>
            </div>
            <List
              className={styles.home__main__left__news__list}
              size="large"
              itemLayout="horizontal"
              dataSource={newsDataSource}
              bordered
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<img style={{ height: '80px', width: '80px' }} src={item.imgSrc} alt={item.title}/>}
                    title={<span><Link to={`/news/${item.id}`}>{item.title}</Link><span
                      style={{ float: 'right' }}>{item.time}</span></span>}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
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

