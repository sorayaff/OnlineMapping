import React, { useState} from 'react';
import Swiper from 'react-id-swiper';
import 'react-id-swiper/lib/styles/css/swiper.css';
import { WelcomeDataSource, ExhibitDataSource, LinksDataSource } from '@/assets/data.source';
import ygzx_logo from '@/assets/home/ygzx_logo.png';
import { formatMessage, setLocale, getLocale, FormattedMessage } from 'umi/locale';
import DatasetCard from '@/components/DatasetCard';
import styles from '@/pages/index/index.less';
import { Icon } from 'antd';

const CustomPagination = () => {
  const [swiper, updateSwiper] = useState(null);

  const stopAutoPlay = () => {
    if (swiper !== null) {
      swiper.autoplay.stop();
    }
  };
  const startAutoPlay = () => {
    if (swiper !== null) {
      swiper.autoplay.start();
    }
  };

  const params = {
    effect: 'coverflow',
    grabCursor: true,
    loop: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      renderBullet: function (index, className) {
        return '<span class="' + className + '">' + (index + 1) + '</span>';
      }
    },
  };
  const style1 = {
    width: '25%',
    height: '240px',
  };


  return (
    <div onMouseEnter={stopAutoPlay} onMouseLeave={startAutoPlay}>
      <Swiper {...params} getSwiper={updateSwiper} >
        <div className={styles.home__main__webInfo} style={{ width: '75%', height: '180px' }}>
          <div className={styles.webInfo__title__box}>
            <Icon type="book"/>&nbsp;<FormattedMessage id="index.webInfo.title" />
          </div>
          <div className={styles.text__box}>
            <FormattedMessage id="index.webInfo.content" />
            <br/>
          </div>
        </div>
        {ExhibitDataSource.map((item) => (
          <div className="swiper-slide" style={style1}>
            <DatasetCard
              cardHeight={'180px'}
              cardData={item}
              key={item.id}/>
          </div>))}
      </Swiper>
    </div>
  );
};

export default CustomPagination;
