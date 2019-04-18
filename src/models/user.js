/*
*   modal: user
*   功能：请求当前用户的身份
*   [一旦请求结果为session失效，置为登陆页面]
*
*/

import { routerRedux } from 'dva/router';
import { queryCurrent, queryCurrentUserNav } from '../services/user';

export default {
  namespace: 'user',
  state: {
    list: [],
    loading: false,
    currentUser: {},
    currentNav: [],
  },
  effects: {
    *fetchCurrent({callback}, { call, put }) {
      yield put({
        type:'changeLoading',
        payload:true,
      });
      const response = yield call(queryCurrent);
      if (response.resultCode === 1000 ) {
          yield put({
            type: 'changeLoading',
            payload: false,
          });
          yield put({
            type: 'saveCurrentUser',
            payload: response.resultData,
          });
        let result = yield call(queryCurrentUserNav);
        yield put({
          type:'saveCurrentUserNavList',
          payload: result.resultData,
        })
      }else{
         yield put(routerRedux.push('/user/login'));
      }
    },
    *fetchNavList({_},{ call, put }){
       let result = yield call(queryCurrentUserNav);
      if (response.resultCode === 1000 ) {
        yield put({
          type:'saveCurrentUserNavList',
          payload: result.resultData,
        })
      }else{
        yield put(routerRedux.push('/user/login'));
      }
    }
  },
  reducers: {
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    saveCurrentUserNavList(state, action){
      return {
        ...state,
        currentNav: action.payload,
      }
    }
  },
};
