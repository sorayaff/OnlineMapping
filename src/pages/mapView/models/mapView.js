import { getDataset, getLayer, getTagGroups, getTags, getDatasetByTags } from '../service';

export default {
  namespace: 'mapView',
  state: {
    dataSetList: undefined,            //数据列表，
    layerList: undefined,              //图层列表，
    defaultColobar: [],         //系统自带色带
    tagList: undefined,                  //数据标签
  },
  reducers: {
    setDataset(state, { payload = {} }) {
      return {
        ...state,
        dataSetList: {
          ...payload, datasets: payload.datasets.map((item, index) => {
            item.key = index;
            return item;
          }),
        },
      };
    },
    addLayer(state, { payload = {} }) {
      return { ...state, layerList: payload };
    },
    addDefaultColorbar(state, { payload = {} }) {
      return { ...state, layerList: payload };
    },
    setTags(state, { payload = [] }) {
      return { ...state, tagList: payload };
    },
  },
  effects: {
    //根据选中的数据集加载图层
    * fetchLayer({payload}, { put, call }) {
      const response = yield call(getLayer, payload);
      if (response.success) {
        yield put({ type: 'addLayer', payload: response.data });
      }
    },
    //获取标签列表
    * fetchTags({ payload }, { put, call }) {
      const tagGroupsResponse = yield call(getTagGroups);
      let ecologyGroup = tagGroupsResponse.data.list.find((item) => item.groupName.toLowerCase() === 'ecology');
      let groupId = ecologyGroup.groupId;
      const tagsResponse = yield call(getTags, groupId);
      if (tagsResponse.success) {
        yield put({ type: 'setTags', payload: tagsResponse.data.list });
      }
    },
    * fetchDatasetByTags({ payload }, { put, call }) {
      const response = yield call(getDatasetByTags, payload);
      if (response.success) {
        yield put({ type: 'setDataset', payload: response.data });
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
};
