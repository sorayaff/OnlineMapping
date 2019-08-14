import dateFormat from 'dateformat';
import logo_fuxi from '@assets/home/logo_fuxi.png'
import p1_1 from '@/assets/news1/1.png';
import p1_2 from '@/assets/news1/2.jpg';
import p1_3 from '@/assets/news1/3.jpg';
import p2_1 from '@/assets/news2/2-1.jpg';
import p2_2 from '@/assets/news2/2-2.jpg';
import p3_1 from '@/assets/news3/3-1.png';
import p3_2 from '@/assets/news3/3-2.png';
import empty from '@/assets/empty/empty.jpg';
import p1_1a from '@/assets/achieve1/a1-1.jpg';
import p1_2a from '@/assets/achieve1/a1-2.jpg';
import p1_3a from '@/assets/achieve1/a1-3.jpg';
import p1_4a from '@/assets/achieve1/a1-4.jpg';
import p3_1a from '@/assets/achieve3/a3-1.jpg';
import p3_2a from '@/assets/achieve3/a3-2.jpg';

export default {
  namespace: 'home',
  state: {
    newsDataSource: [],
    achieveDataSource: []
  },
  reducers: {
    // 更改日志显示
    setNews(state, {payload}) {
      return {...state, newsDataSource: payload};
    },
    setAchieve(state, {payload}) {
      return {...state, achieveDataSource: payload};
    },
  },
  effects: {
    // 获取更多日志
    * getNews({payload = {}}, {put, call}) {
      let time = String(new Date());
      let newsDataSource = [
        {imgSrc: p1_2, title: 'The Air We Breathe', time: 'May. 16, 2019', description: "Air pollution is a global environmental health problem, especially for those living in urban areas. Not only does it negatively impact our ecosystems, it considerably affects our health. According to the World Health Organization (WHO), around 8 million premature deaths per year are linked to air pollution, more than double of previous estimates.", id: 1},
        {imgSrc: empty, title: 'Prof. Li Guoqing Attended the GEO Data Technology Workshop on Behalf of IRCSD', time: 'April. 26, 2019', description: "Prof. Li Guoqing Joined the Group on Earth Observations international data community in Vienna, Austria from 23-25 April 2019 for the GEO Data Technology Workshop.", id: 2},
        {imgSrc: empty, title: 'IBUKI-2 (GOSAT-2) Successful Launch and Completion of Critical Operations Phase', time: 'April. 19, 2019', description: "The GOSAT-2 Project at the National Institute for Environmental Studies (NIES) announces that NIES has issued a press release." ,id: 3},
        ];
      yield put({type: 'setNews', payload: newsDataSource});
    },
    * getAchieve({payload = {}}, {put, call}) {
      let time = String(new Date());
      let achieveDataSource = [
        {imgSrc: p1_1a, title: 'First Global Chlorophyll Fluorescence Maps Produced by China\'s Carbon Satellite Data', time: 'April. 24, 2019', description: "Recently, Prof. Liu Liangyun and his research team, from the Institute of Remote Sensing and Digital Earth, Chinese Academy of Sciences, successfully obtained global chlorophyll fluorescence products of the second half in 2017 using the TanSat satellite data from July to December 2017." , id: 1},
        {imgSrc: empty, title: 'Important Evidence of Constant Low CO2 Windows and Impacts on the Non-closure of the Greenhouse Effect', time: 'April. 21, 2019', description: "The results showed that the horizontal, not vertical, diffusion of CO2 becomes increasingly more prominent with the decrease in atmospheric pressure to the mid-troposphere, whereas many regions, such as the Rocky Mountains and Qinghai-Tibet Plateau, have constant low values throughout the year due to the influence of high topography (up to 10.756 ppmv lower than that near the surface). " , id: 2},
        {imgSrc: p3_1a, title: 'First Global Carbon Dioxide Maps Produced by Chinese Observation Satellite', time: 'April. 19, 2019', description: "An Earth observation satellite, called TanSat, has produced its first global carbon dioxide maps. TanSat was launched by a collaborative team of researchers in China, and these maps are the first steps for the satellite to provide global carbon dioxide measurements for future climate change research.  The researchers published the maps, based on data collected in April and July 2017, in the latest edition of the journal Advances in Atmospheric Sciences, a Springer journal." , id: 3},
      ];
      yield put({type: 'setAchieve', payload: achieveDataSource});
    },
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen(({pathname, query}) => {
        if (pathname.toLowerCase() === '/') {
          dispatch({type: 'getNews'});
          dispatch({type: 'getAchieve'});
        }
      });
    },
  },
};
