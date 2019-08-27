import { routerRedux } from 'dva/router';
import {stringify} from 'qs';
import {loginUser, logoutUser} from '@/services/user';
import {setAuthority} from '@/utils/authority';
import {getPageQuery, setLoalData,delLoalData} from '@/utils/common';
import {reloadAuthorized} from '@/utils/Authorized';

export default {
  namespace: 'login',
  state: {
    status: undefined,
    userInfo: '',
  },

  effects: {
    * login({payload}, {call, put}) {
      console.log(payload)
      const response = yield call(loginUser,payload);
      if (response.success) {
        yield put({
            type: 'changeLoginStatus',
            payload: {
              ...response.data,
            },
          }
        );
        reloadAuthorized();
        setLoalData({dataName: 'rzpj', dataList: response.data.tgt});
        setLoalData({dataName: 'userId', dataList: response.data.userInfo.id});
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let {redirect} = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            redirect = null;
          }
        }

        yield put(routerRedux.replace(redirect || '/'));
      }
    },
    // * getCaptcha({payload}, {call}) {
    //   yield call(getFakeCaptcha, payload);
    // },
    * logout(_, {call, put}) {
      //todo:登出的后台实现
      // yield call(logoutUser);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          userInfo: {status: 'guest'}
        },
      });
      reloadAuthorized();
      const {redirect} = getPageQuery();
      delLoalData(['rzpj']);
      // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
  },

  reducers: {
    changeLoginStatus(state, {payload}) {
      setAuthority(payload.userInfo.status);
      return {
        ...state,
        userInfo: payload.userInfo,
        status: payload.status,
      };
    },
  },
};
