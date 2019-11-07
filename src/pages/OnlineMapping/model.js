

export default {
  namespace: 'onlineMapping',
  state: {
    mapSaverModalVisible:false,
  },
  reducers: {
    setMapSaverModalVisible(state, { payload = {} }) {
      return {
        ...state,
        mapSaverModalVisible: payload,
      };
    },
  },
  effects: {
    //根据选中的数据集加载图层
    * saveMap2Local({ payload }, { put, call }) {
      // const response = yield call(getLayer, payload);
      // if (response.success) {
      //   yield put({ type: 'addLayer', payload: response.data });
      // }
    },
  },
  subscriptions: {
    setup({ dispatch, history }, done) {
      history.listen(({ pathname, query }) => {
        if (pathname === '/OnlineMapping') {
        }
      });
    },
  },
};
