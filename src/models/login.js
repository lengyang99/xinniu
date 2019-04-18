import { routerRedux } from 'dva/router';
import { setLoginIn , setLoginOut} from '../services/login';

export default {
  namespace: 'login',

  state: {
    status: false,
    tipMessage:''
  },

  effects: {
    *accountSubmit({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(setLoginIn, payload);
      yield put({
        type: 'changeLoginStatus',
        payload:{
          status: response.resultCode == 1000?true:false,
          ...response
        }
      });
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
      if(response.resultCode == 1000){
    	  window.location.href = '/';
      }else{
       if(callback) callback();
      }
    },
    *logout(_, { call, put }) {
      yield call(setLoginOut);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: true,
        },
      });
      yield put(routerRedux.push('/user/login'));
      window.location.reload()
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        tipMessage:payload.resultData || ''
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
  },
};
