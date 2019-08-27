
export default {
  namespace: 'userInfo',
  state: {
    newsDataSource: []
  },
  reducers: {
    // 更改日志显示
    setNews(state, {payload}) {
      return {...state, newsDataSource: payload};
    },
  },
  effects: {
    //注册用户
    * registerUser({payload = {}}, {put, call}) {
      console.log(payload)
      // yield put({type: 'setNews', payload: newsDataSource});
    },
  },
  subscriptions: {
    // setup({dispatch, history}) {
    //   history.listen(({pathname, query}) => {
    //     if (pathname === '/') {
    //       dispatch({type: 'getNews'});
    //     }
    //   });
    // },
  },
};
