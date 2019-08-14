import React from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import zhejiang_university from '@assets/home/zhejiang_university.png'
import nasa_logo from '@/assets/home/nasa_logo.png'
import zju_geo from '@/assets/home/zju_geo.png'
import gosat_logo from '@/assets/home/gosat_logo.png'
import logo_wordGEO from '@/assets/home/logo_wordGEO.png'
import china_geo from '@/assets/home/logo_chinaGEO.png'
import tansat_pic from '@/assets/tansat.png'
import gosat_pic from '@/assets/gosat.png'
import cloud_pic from '@/assets/cloud&aerosol.png'
import SIF_pic from '@/assets/SIF.png'
import slf_thum from '@/assets/slf_thum.png'
import xco2_thum from '@/assets/xco2.png'
import oco2_logo from '@/assets/home/OCO2_Logo.jpg'
import sentinel_5p_logo from '@/assets/home/Sentinel_5P_logo.png'
import nsmc_logo from '@/assets/home/nsmc_logo.png'
import {Typography} from 'antd';
{/*<FormattedMessage id="app.result.error.hint-btn1" defaultMessage="Thaw immediately" />*/}



export const WelcomeDataSource = {
  title:<FormattedMessage id="app.home.welcomeCard.title" defaultMessage="Welcome to the CACSD" />,
  text:{
    p1:<FormattedMessage id="app.home.welcomeCard.text.p1" defaultMessage="introduction" />,
    p2:<FormattedMessage id="app.home.welcomeCard.text.p2" defaultMessage="introduction" />,
    p3:<FormattedMessage id="app.home.welcomeCard.text.p3" defaultMessage="introduction" />,
  }
};

export const SatelliteDataSource = [
  {id:"1",name:"TanSat",imgSrc:tansat_pic,description:'TanSat',haveLink:true},
  {id:"2",name:"Cloud & Aerosol",imgSrc:cloud_pic,description:'Cloud and Aerosol',haveLink:false},
  {id:"3",name:"Solar induced Fluorescence",imgSrc:SIF_pic,description:'Solar Induced Fluorescence',haveLink:false},
  {id:"4",name:"X-CO2",imgSrc:xco2_thum,description:'X-CO2',haveLink:false},
];

export const LinksDataSource = [
  {imgSrc:logo_wordGEO,src:'http://www.geoportal.org/',imgStyle:{height:"80px",width:'100%'}},
  {imgSrc:china_geo,src:'http://www.chinageoss.org/dsp/home/index.jsp',imgStyle:{height:"60px",width:'100%'}},
  {name:"National Satellite Meteorological Center",imgSrc:nsmc_logo,src:'http://www.nsmc.org.cn/en/NSMC/Home/Index.html',imgStyle:{height:"60px",width:'70px'}},
  {imgSrc:gosat_logo,src:'http://www.gosat.nies.go.jp/en/',imgStyle:{height:"80px",width:'100%'}},
  {imgSrc:sentinel_5p_logo,src:'https://www.esa.int/Our_Activities/Observing_the_Earth/Copernicus/Sentinel-5P',imgStyle:{height:"50px",width:'100%'}},
  {name:"Orbiting Carbon Observatory-2",imgSrc:oco2_logo,src:'https://ocov2.jpl.nasa.gov/',imgStyle:{height:"80px",width:'70px'}},
  {imgSrc:zhejiang_university,src:'http://www.zju.edu.cn',imgStyle:{width:'80%',margin:'-16px 10% -16px 10%'}},
  {imgSrc:zju_geo,src:'http://gs.zju.edu.cn/chinese/',imgStyle:{width:'100%'}},
];




