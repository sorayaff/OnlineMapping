import { getDataset, getLayer, getTagGroups, getTags, getDatasetByTags, getColormapById,getColormapList } from '../service';

export default {
  namespace: 'mapView',
  state: {
    dataSetList: undefined,            //数据列表，
    layerList: undefined,              //图层列表，
    defaultColobar: [],         //系统自带色带
    tagList: undefined,                  //数据标签
    urlQuery: undefined,
    layerPlayerVisible: false,
    layersForPlay: [],
    colormapList:[],
    currentColormap: undefined,
  },
  reducers: {
    setDataset(state, { payload = {} }) {
      return {
        ...state,
        dataSetList: payload,
      };
    },
    addLayer(state, { payload = {} }) {
      return { ...state, layerList: payload };
    },
    setCurrentColormap(state,{payload={}}){
      return {...state,currentColormap:payload}
    },
    setColormapList(state,{payload={}}){
      return {...state,colormapList:payload}
    },
    addDefaultColorbar(state, { payload = {} }) {
      return { ...state, layerList: payload };
    },
    setTags(state, { payload = [] }) {
      return { ...state, tagList: payload };
    },
    saveQuery(state, { payload = {} }) {
      return { ...state, urlQuery: payload };
    },
    closeLayerPlayer(state, { payload }) {
      return { ...state, layerPlayerVisible: false };
    },
    showLayerPlayer(state, { payload }) {
      return { ...state, layerPlayerVisible: true };
    },
  },
  effects: {
    //根据选中的数据集加载图层
    * fetchLayer({ payload }, { put, call }) {
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
    * fetchColormapList({ payload }, { put, call }) {
      const response = yield call(getColormapList, payload);
      if (response.success) {
        yield put({ type: 'setColormapList', payload: response.data });
      }
    },
    * fetchColormapById({ payload }, { put, call }) {
      const response = yield call(getColormapById, payload);
      if (response.success) {
        yield put({ type: 'setCurrentColormap', payload: response.data });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }, done) {
      history.listen(({ pathname, query }) => {
        if (pathname === '/mapView') {
          dispatch({
            type: 'saveQuery',
            payload: query,
          });
        }
      });
    },
  },
};
