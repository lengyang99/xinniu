/**
 * Created by Administrator on 2017/12/16 0016.
 */
/**
 * 机型的状态管理
 */

import { queryRoleAllList, queryUserList, addUserList, findPhoneModel, updatePhone, queryAllNav,deletePhoneModel } from '../services/management';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'management',
  state: {
    loading:false,
    menulist:[],
    navlist:[],
    data:{
      list:[],
      pagination:{}
    },
    modal:false,
    singleData:{},
  },
  effects: {
    //获取所有的厂商
    *menufetch( { },{ call , put}){
       let result = yield call(queryRoleAllList);
       yield put({
         type:'getMenuDataList',
         payload: result
       })
    },
    //获取所有的系统目录
    *systemnav({ },{ call, put }){
      let result = yield call(queryAllNav);
      yield put({
        type:'getNavDataList',
        payload: result
      })
    },
    //获取所有的列表
    *fetch({ payload }, { call, put }){
      yield put({
        type:'changeLoading',
        payload:true,
      })
      let response = yield call(queryUserList,payload);
      if(response.resultCode === 800){
        yield put(routerRedux.push('/user/login'));
        window.location.reload();
        return false
      }
      yield put({
        type:'getDataList',
        payload: response
      })
     yield put({
       type:'changeLoading',
       payload:false
     })
    },
    //获取单个的信息
    *singlefetch({ payload }, { call, put }){
      yield put({
        type:'changeModal',
        payload:true
      })
      let result = yield call(findPhoneModel,payload);
      yield put({
        type: 'getSingleData',
        payload: result
      })
    },
    //新增
    *addUserInfo({ payload, callback}, { call, put }){
      let result = yield call(addUserList,payload)
      yield put({
        type:'changeModal',
        payload: false,
      })
      if(callback) callback(result);
    },
    //修改
    *updateUserInfo({ payload, callback }, { call, put }){
      yield put({
        type:'changeLoading',
        payload: true
      })
      let result = yield call(updatePhone, payload);
      yield put({
        type:'changeLoading',
        payload: false
      })
      yield put({
        type:'changeModal',
        payload: false,
      })
      if(callback) callback(result);
    },
    // 删除
    *deleteparent({ payload, callback }, { call, put }) {
      const result = yield call(deletePhoneModel, payload);
      if (callback) callback(result);
    },
  },
  reducers: {
     changeModal(state, action) {
        return {
          ...state,
          modal:action.payload
        }
     },
    getDataList(state, action){
       return {
         ...state,
         data:{
           list: action.payload.resultData,
           pagination: action.payload.page
         }
       }
    },
    getMenuDataList(state, action){
      return {
        ...state,
        menulist:action.payload.resultData,
      }
    },
    getNavDataList(state, action){
      return {
        ...state,
        navlist: action.payload.resultData,
      }
    },
    changeLoading(state , action){
      return {
        ...state,
        loading:action.payload
      }
    },
    getSingleData(state, action) {
      return {
        ...state,
        singleData:action.payload.resultData
      }
    }
  }
};
