import {getDataset, getLayer} from '../service';

export default {
  namespace: 'mapView',
  state: {
    dataSetList: [],            //数据列表，
    layerList: [],              //图层列表，
    defaultColobar :[],         //系统自带色带
  },
  reducers: {
    addDataSet(state, { payload = {} }) {
      return { ...state, dataSetList: payload };
    },
    addLayer(state, { payload = {} }) {
      return { ...state, layerList: payload };
    },
    addDefaultColorbar(state, {payload = {}}){
      return {...state, layerList:payload};
    }
  },
  effects: {
    // 加载数据集
    * fetchDataset({ payload }, { put, call }) {
      const response = yield call(getDataset, payload);
      if (response.success) {
        yield put({ type: 'addDataSet', payload: response.data });
      }
    },
    //根据选中的数据集加载图层
    * fetchLayer({ payload }, { put, call }) {
      const response = yield call(getLayer, payload);
      if (response.success) {
        yield put({ type: 'addLayer', payload: response.data });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }, done) {
      history.listen(({ pathname, query }) => {
        if (pathname === '/mapView') {
        }
      });
    },
  },
}
