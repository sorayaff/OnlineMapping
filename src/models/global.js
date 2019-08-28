import {getUserInfo} from "@/services/user";
import {getCountryByIP,getUserIP} from "@/services/api";
import {reloadAuthorized} from "@/utils/Authorized";
import {getPageQuery, setLoalData, isSetLoacl} from "@/utils/common";
import {routerRedux} from 'dva/router';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    pageTitle: [],
    currentUser: undefined,
    userPosition:{},
  },

  effects: {
    * fetchCurrentUser({payload}, {call, put}) {
      if (localStorage.hasOwnProperty("rzpj")) {
        const response = yield call(getUserInfo);
        if (response.success) {
          yield put({type: 'saveCurretUser', payload: response.data});
        }
      } else {
        yield put({type: 'saveCurretUser', payload: undefined});
      }
    },
    * fetchUserAddress({payload}, {call, put}) {
      let ip=returnCitySN.cip || null; // eslint-disable-line
      const countryResponse = yield call(getCountryByIP,{ip:ip});
      if(countryResponse.success){
        yield put({type: 'saveUserPosition', payload: countryResponse.data.data});
      }
    },
  },

  reducers: {
    savePageTitle(state, {payload}) {
      return {
        ...state,
        pageTitle: payload,
      }
    },
    saveCurretUser(state, {payload}) {
      return {
        ...state,
        currentUser: payload,
      }
    },
    saveUserPosition(state, {payload}) {
      return {
        ...state,
        userPosition:payload
      }
    }
  },

  subscriptions: {
    setup({history}) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({pathname, search}) => {
        // if (typeof window.ga !== 'undefined') {
        //   window.ga('send', 'pageview', pathname + search);
        // }
      });
    },
  },
};
