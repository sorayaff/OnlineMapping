import {setAuthority} from '@/utils/authority';
import {reloadAuthorized} from '@/utils/Authorized';
import {registerUser} from '@/services/user';

export default {
  namespace: 'register',

  state: {
    status: '',
  },

  effects: {
    * submit({payload}, {call, put}) {
      const response = yield call(registerUser, payload);
      if (response.success) {
        yield put({
          type: 'registerHandle',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    registerHandle(state, {payload}) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        status: 'ok',
      };
    },
    clearStatus(state) {
      return {...state, status: '',};
    },
  },
};
