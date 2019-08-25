import p1_2 from '@/assets/news1/2.jpg';
import empty from '@/assets/empty/empty.jpg';
/* eslint-disable max-len*/
const r2012 = [
  '    近代以来，经济和科学技术的迅猛发展，为人类创造了巨大的财富，同时，人类对地球资源的消耗和环境的破坏，导致全球性生态环境问题的日益突出，特别是全球气候变暖、水资源匮乏与污染、生物多样性锐减、土地荒漠化等重大生态环境问题，不仅影响全球经济、社会的可持续发展，而且以越来越快的速度腐蚀着人类生存的基础。\n',
  '    中国政府一贯重视生态环境建设，在科学研究、政策制定和行动落实等层面动员和集聚了大量社会资源致力于中国和全球生态环境的研究和保护。作为技术保障措施之一，中国逐步建立了气象、资源、环境和海洋等地球观测卫星及其应用系统，并在相关学科领域规划了一系列科学研究和技术开发项目，地球观测技术能力有了很大提高，在环境、资源和减灾等的数据获取和信息提取以及分析方面取得了阶段性成果。同时，通过地球观测组织（Group on Earth Observations，GEO）合作平台，中国与国际社会共享其全球生态环境遥感监测数据和相关的信息产品。',
];
const r2013 = [
  '    近代以来，全球气候变暖、水资源匮乏、环境污染、生物多样性锐减、土地荒漠化等重大生态环境问题日益突出，不仅影响全球经济、社会的可持续发展，而且以越来越快的速度威胁着人类生存的基础，得到国际社会的高度关注。\n',
  '　　中国政府一贯重视生态环境的保护和建设，在科学研究、政策制定和行动落实等层面开展生态环境研究和保护等工作。作为重要的技术保障措施，中国逐步建立了气象、资源、环境和海洋等地球观测卫星应用体系，观测能力日益提高。同时，作为地球观测组织（GEO）的创始国和联合主席国，中国正努力推动在GEO框架下向世界开放共享地球观测数据并提供相关的全球信息产品和服务。\n',
  '　　为满足全球生态环境变化监测和积极应对全球变化的需要，在中国参加GEO工作部际协调小组的领导下和国务院办公厅、财政部的支持下，科学技术部按照“部门协同、内外结合、成果集成、数据共享、国际合作”的基本思路，于2012年启动了“全球生态环境遥感监测年度报告”工作。为保证年报工作的高效组织和年报质量，国家遥感中心（GEO中国秘书处）与遥感科学国家重点实验室共同组建生态环境遥感研究中心，建立了年报工作合作的长效机制，成立了顾问组、专家组和编写组。各编写组在集成863等国家科技计划地球观测相关研究项目成果的基础上，以GEO框架下国家综合地球观测数据共享服务工作为依托，进一步整合和分析数据形成年报。',
];
/* eslint-enable max-len*/

const reportDataSource = [
  {
    date: '2012',
    title: '2012 Annual Report',
    linkedDataSets:[],
    reportList:[
      {imgSrc: p1_2, title: 'The Air We Breathe', time: 'May. 16, 2019', description: "Air pollution is a global environmental health problem, especially for those living in urban areas. Not only does it negatively impact our ecosystems, it considerably affects our health. According to the World Health Organization (WHO), around 8 million premature deaths per year are linked to air pollution, more than double of previous estimates.", id: 1},
      {imgSrc: empty, title: 'Prof. Li Guoqing Attended the GEO Data Technology Workshop on Behalf of IRCSD', time: 'April. 26, 2019', description: "Prof. Li Guoqing Joined the Group on Earth Observations international data community in Vienna, Austria from 23-25 April 2019 for the GEO Data Technology Workshop.", id: 2},
      {imgSrc: empty, title: 'IBUKI-2 (GOSAT-2) Successful Launch and Completion of Critical Operations Phase', time: 'April. 19, 2019', description: "The GOSAT-2 Project at the National Institute for Environmental Studies (NIES) announces that NIES has issued a press release." ,id: 3},
    ],
    downLoadLink:{
      'unabridged_ch':'http://www.chinageoss.org/gee/2012/ldzbsczk.pdf'
    },
    themeList:[
      {imgSrc:p1_2,title:'Growth of terrestrial vegetation'},
      {imgSrc:empty,title:'Distribution of land and water areas'}
    ],
    subtitle: 'Arena',
    content: r2012
  },
  {
    date: '2013',
    title: '2013 Annual Report',
    linkedDataSets:[],
    reportList:[
      {imgSrc: p1_2, title: 'The Air We Breathe', time: 'May. 16, 2019', description: "Air pollution is a global environmental health problem, especially for those living in urban areas. Not only does it negatively impact our ecosystems, it considerably affects our health. According to the World Health Organization (WHO), around 8 million premature deaths per year are linked to air pollution, more than double of previous estimates.", id: 1},
      {imgSrc: empty, title: 'Prof. Li Guoqing Attended the GEO Data Technology Workshop on Behalf of IRCSD', time: 'April. 26, 2019', description: "Prof. Li Guoqing Joined the Group on Earth Observations international data community in Vienna, Austria from 23-25 April 2019 for the GEO Data Technology Workshop.", id: 2},
      {imgSrc: empty, title: 'IBUKI-2 (GOSAT-2) Successful Launch and Completion of Critical Operations Phase', time: 'April. 19, 2019', description: "The GOSAT-2 Project at the National Institute for Environmental Studies (NIES) announces that NIES has issued a press release." ,id: 3},
    ],
    downLoadLink:{
      'unabridged_ch':'http://www.chinageoss.org/gee/2012/ldzbsczk.pdf'
    },
    themeList:[
      {imgSrc:p1_2,title:'Growth of terrestrial vegetation'},
      {imgSrc:empty,title:'Spatial and temporal distribution of large surface waters'},
      {imgSrc:p1_2,title:'Growth of grain and oil crops'},
      {imgSrc:empty,title:'Distribution of urban and rural construction land'}
    ],
    subtitle: 'Daggerfall',
    content: r2013
  },
  {
    date: '2014',
    title: '2014 Annual Report',
    linkedDataSets:[],
    reportList:[
      {imgSrc: p1_2, title: 'The Air We Breathe', time: 'May. 16, 2019', description: "Air pollution is a global environmental health problem, especially for those living in urban areas. Not only does it negatively impact our ecosystems, it considerably affects our health. According to the World Health Organization (WHO), around 8 million premature deaths per year are linked to air pollution, more than double of previous estimates.", id: 1},
      {imgSrc: empty, title: 'Prof. Li Guoqing Attended the GEO Data Technology Workshop on Behalf of IRCSD', time: 'April. 26, 2019', description: "Prof. Li Guoqing Joined the Group on Earth Observations international data community in Vienna, Austria from 23-25 April 2019 for the GEO Data Technology Workshop.", id: 2},
      {imgSrc: empty, title: 'IBUKI-2 (GOSAT-2) Successful Launch and Completion of Critical Operations Phase', time: 'April. 19, 2019', description: "The GOSAT-2 Project at the National Institute for Environmental Studies (NIES) announces that NIES has issued a press release." ,id: 3},
    ],
    downLoadLink:{
      'unabridged_ch':'http://www.chinageoss.org/gee/2012/ldzbsczk.pdf'
    },
    themeList:[
      {imgSrc:p1_2,title:'Growth of grain and oil crops'},
      {imgSrc:empty,title:'Large wetlands of international importance'},
      {imgSrc:p1_2,title:'African land cover'},
      {imgSrc:empty,title:'Ecological environment in china-asean region'},
    ],
    subtitle: 'Morrowind',
    content: r2012
  },
  {
    date: '2015',
    title: '2015 Annual Report',
    linkedDataSets:[],
    reportList:[
      {imgSrc: p1_2, title: 'The Air We Breathe', time: 'May. 16, 2019', description: "Air pollution is a global environmental health problem, especially for those living in urban areas. Not only does it negatively impact our ecosystems, it considerably affects our health. According to the World Health Organization (WHO), around 8 million premature deaths per year are linked to air pollution, more than double of previous estimates.", id: 1},
      {imgSrc: empty, title: 'Prof. Li Guoqing Attended the GEO Data Technology Workshop on Behalf of IRCSD', time: 'April. 26, 2019', description: "Prof. Li Guoqing Joined the Group on Earth Observations international data community in Vienna, Austria from 23-25 April 2019 for the GEO Data Technology Workshop.", id: 2},
      {imgSrc: empty, title: 'IBUKI-2 (GOSAT-2) Successful Launch and Completion of Critical Operations Phase', time: 'April. 19, 2019', description: "The GOSAT-2 Project at the National Institute for Environmental Studies (NIES) announces that NIES has issued a press release." ,id: 3},
    ],
    downLoadLink:{
      'unabridged_ch':'http://www.chinageoss.org/gee/2012/ldzbsczk.pdf'
    },
    themeList:[
      {imgSrc:p1_2,title:'陆地植被生长状况'},
      {imgSrc:empty,title:'陆地水域面积分布状况'}
    ],
    subtitle: 'Oblivion',
    content: r2012
  },
  {
    date: '2016',
    title: '2016 Annual Report',
    linkedDataSets:[],
    reportList:[
      {imgSrc: p1_2, title: 'The Air We Breathe', time: 'May. 16, 2019', description: "Air pollution is a global environmental health problem, especially for those living in urban areas. Not only does it negatively impact our ecosystems, it considerably affects our health. According to the World Health Organization (WHO), around 8 million premature deaths per year are linked to air pollution, more than double of previous estimates.", id: 1},
      {imgSrc: empty, title: 'Prof. Li Guoqing Attended the GEO Data Technology Workshop on Behalf of IRCSD', time: 'April. 26, 2019', description: "Prof. Li Guoqing Joined the Group on Earth Observations international data community in Vienna, Austria from 23-25 April 2019 for the GEO Data Technology Workshop.", id: 2},
      {imgSrc: empty, title: 'IBUKI-2 (GOSAT-2) Successful Launch and Completion of Critical Operations Phase', time: 'April. 19, 2019', description: "The GOSAT-2 Project at the National Institute for Environmental Studies (NIES) announces that NIES has issued a press release." ,id: 3},
    ],
    downLoadLink:{
      'unabridged_ch':'http://www.chinageoss.org/gee/2012/ldzbsczk.pdf'
    },
    themeList:[
      {imgSrc:p1_2,title:'陆地植被生长状况'},
      {imgSrc:empty,title:'陆地水域面积分布状况'}
    ],
    subtitle: 'Skyrim',
    content: r2012
  },
  {
    date: '2017',
    title: '2017 Annual Report',
    linkedDataSets:[],
    reportList:[
      {imgSrc: p1_2, title: 'The Air We Breathe', time: 'May. 16, 2019', description: "Air pollution is a global environmental health problem, especially for those living in urban areas. Not only does it negatively impact our ecosystems, it considerably affects our health. According to the World Health Organization (WHO), around 8 million premature deaths per year are linked to air pollution, more than double of previous estimates.", id: 1},
      {imgSrc: empty, title: 'Prof. Li Guoqing Attended the GEO Data Technology Workshop on Behalf of IRCSD', time: 'April. 26, 2019', description: "Prof. Li Guoqing Joined the Group on Earth Observations international data community in Vienna, Austria from 23-25 April 2019 for the GEO Data Technology Workshop.", id: 2},
      {imgSrc: empty, title: 'IBUKI-2 (GOSAT-2) Successful Launch and Completion of Critical Operations Phase', time: 'April. 19, 2019', description: "The GOSAT-2 Project at the National Institute for Environmental Studies (NIES) announces that NIES has issued a press release." ,id: 3},
    ],
    themeList:[
      {imgSrc:p1_2,title:'陆地植被生长状况'},
      {imgSrc:empty,title:'陆地水域面积分布状况'}
    ],
    subtitle: 'Skyrim',
    content: r2012
  },
  {
    date: '2018',
    title: '2018 Annual Report',
    linkedDataSets:[],
    reportList:[
      {imgSrc: p1_2, title: 'The Air We Breathe', time: 'May. 16, 2019', description: "Air pollution is a global environmental health problem, especially for those living in urban areas. Not only does it negatively impact our ecosystems, it considerably affects our health. According to the World Health Organization (WHO), around 8 million premature deaths per year are linked to air pollution, more than double of previous estimates.", id: 1},
      {imgSrc: empty, title: 'Prof. Li Guoqing Attended the GEO Data Technology Workshop on Behalf of IRCSD', time: 'April. 26, 2019', description: "Prof. Li Guoqing Joined the Group on Earth Observations international data community in Vienna, Austria from 23-25 April 2019 for the GEO Data Technology Workshop.", id: 2},
      {imgSrc: empty, title: 'IBUKI-2 (GOSAT-2) Successful Launch and Completion of Critical Operations Phase', time: 'April. 19, 2019', description: "The GOSAT-2 Project at the National Institute for Environmental Studies (NIES) announces that NIES has issued a press release." ,id: 3},
    ],
    themeList:[
      {imgSrc:p1_2,title:'陆地植被生长状况'},
      {imgSrc:empty,title:'陆地水域面积分布状况'}
    ],
    subtitle: 'Skyrim',
    content: r2012
  },
  {
    date: '2019',
    title: '2019 Annual Report',
    linkedDataSets:[],
    reportList:[
      {imgSrc: p1_2, title: 'The Air We Breathe', time: 'May. 16, 2019', description: "Air pollution is a global environmental health problem, especially for those living in urban areas. Not only does it negatively impact our ecosystems, it considerably affects our health. According to the World Health Organization (WHO), around 8 million premature deaths per year are linked to air pollution, more than double of previous estimates.", id: 1},
      {imgSrc: empty, title: 'Prof. Li Guoqing Attended the GEO Data Technology Workshop on Behalf of IRCSD', time: 'April. 26, 2019', description: "Prof. Li Guoqing Joined the Group on Earth Observations international data community in Vienna, Austria from 23-25 April 2019 for the GEO Data Technology Workshop.", id: 2},
      {imgSrc: empty, title: 'IBUKI-2 (GOSAT-2) Successful Launch and Completion of Critical Operations Phase', time: 'April. 19, 2019', description: "The GOSAT-2 Project at the National Institute for Environmental Studies (NIES) announces that NIES has issued a press release." ,id: 3},
    ],
    themeList:[
      {imgSrc:p1_2,title:'陆地植被生长状况'},
      {imgSrc:empty,title:'陆地水域面积分布状况'}
    ],
    subtitle: 'Skyrim',
    content: r2012
  },
];

export default reportDataSource;
