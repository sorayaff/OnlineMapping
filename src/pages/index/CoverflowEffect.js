import React from 'react';
import Swiper from 'react-id-swiper';
import 'react-id-swiper/lib/styles/css/swiper.css';
import { WelcomeDataSource, SatelliteDataSource, LinksDataSource } from '@/assets/data.source';
import ygzx_logo from '@/assets/home/ygzx_logo.png';
import DatasetCard from '@/components/DatasetCard';

const CoverflowEffect = () => {
  const params = {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: false
    },
    pagination: {
      el: '.swiper-pagination'
    }
  }
  const style1 = {
    width:'25%',
    height:'240px'
  }

  return (
    <Swiper {...params}>
      {SatelliteDataSource.map((item) => <div className="swiper-slide" style={style1}><DatasetCard cardHeight={'180px'} cardData={item} key={item.id}/></div>)}
    </Swiper>
  )
};

export default CoverflowEffect;
