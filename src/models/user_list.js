/**
 * 用户列表的状态管理
 */

import { queryAllChannel, queryUserInfoList, queryUserInfoDetail } from '../services/usermanage';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'userlist',
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
      let result = yield call(queryAllChannel);
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
    *userDetailfetch({payload},{call,put}){
      const userdata= yield call(queryUserInfoDetail, payload);
      if(userdata.resultCode === 1000) {
        yield put({
          type: 'getUserdata',
          payload: userdata.resultData,
        })
      }
    }
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
    getUserdata(state, action) {
      return {
        ...state,
        userinfo: action.payload,
      };
    },
  },
};
