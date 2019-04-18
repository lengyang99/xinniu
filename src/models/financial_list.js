/**
 * 用户列表的状态管理
 */

import { queryExport, queryUserInfoList } from '../services/repayRecordmanage';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'userlists',
  state: {
    channellist:[],
    data: {
      list: [],
      pagination: {},
     
    },
    loading: true,
    modal: false,
    record: {},
    userinfo: {},
  },
  effects: {
    *channelNav({},{ call, put }){
      let result = yield call(queryUserInfoList);
      yield put({
        type:'getChannelList',
        payload:result
      })
    },
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryUserInfoList, payload);
      if(response.resultCode === 800){
        yield put(routerRedux.push('/user/login'));
        window.location.reload();
        return false
      }
      yield put({
        type: 'getListdata',
        payload: {
          list: response.resultData,
          pagination: response.page
        },
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

  },
  reducers: {
    getChannelList(state, action){
      return {
        ...state,
        channellist:action.payload.resultData
      }
    },
    getListdata(state, action) {
      return {
        ...state,
        data:action.payload
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },

  },
};
